using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;
using shared_notes_software_server.Extensions;
using System.Text.Json;
using Renci.SshNet;
using Renci.SshNet.Common;
using SshConnectionInfo = Renci.SshNet.ConnectionInfo;


namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/ip-whitelist")]
    public class IpWhiteListController : ControllerBase
    {
        private readonly DbHelper _db;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IWebHostEnvironment _env;

        private static string EscapeForShellSingleQuotes(string value)
        {
            // Wrap in single quotes, escaping any embedded single quotes
            // e.g.  it's a test  ->  'it'"'"'s a test'
            return "'" + value.Replace("'", "'\"'\"'") + "'";
        }

        private static string BuildSudoCommand(string sudoPassword, string command)
        {
            var escapedPassword = EscapeForShellSingleQuotes(sudoPassword);

            // -S reads the password from stdin instead of a TTY
            // -p '' suppresses sudo's own prompt text so it doesn't pollute the output
            return $"echo {escapedPassword} | sudo -S -p '' {command}";
        }
        public IpWhiteListController(DbHelper db, IHttpClientFactory httpClientFactory, IWebHostEnvironment env)
        {
            _db = db;
            _httpClientFactory = httpClientFactory;
            _env = env;
        }

        private string ResolveKeyFilePath(string storedPath)
        {
            // Already absolute (e.g. entered manually) - use as-is
            if (Path.IsPathRooted(storedPath))
                return storedPath;

            // Otherwise treat it as a filename inside the same uploadedFiles folder
            // used elsewhere in Program.cs
            var uploadPath = Path.Combine(_env.ContentRootPath, "uploadedFiles");
            return Path.Combine(uploadPath, storedPath);
        }

        // ============================================================
        // GET CURRENT PUBLIC IP (of the machine running this API)
        // ============================================================

        private async Task<string> GetPublicIpAsync()
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(10);

            // ipify is reliable and simple - swap if you prefer another provider
            var ip = await client.GetStringAsync("https://api.ipify.org");
            return ip.Trim();
        }

        // ============================================================
        // BUILD SSH CONNECTION (key file or password, both supported)
        // ============================================================

        private SshClient CreateSshClient(IpWhitelistModel project)
        {
            SshConnectionInfo connectionInfo;

            if (!string.IsNullOrWhiteSpace(project.PathToPrivateFile))
            {
                var resolvedPath = ResolveKeyFilePath(project.PathToPrivateFile);

                if (!System.IO.File.Exists(resolvedPath))
                {
                    throw new FileNotFoundException(
                        $"Private key file not found at '{resolvedPath}' " +
                        $"(stored value: '{project.PathToPrivateFile}')."
                    );
                }

                var decryptedPassphrase = string.IsNullOrWhiteSpace(project.KeyPassphrase)
                    ? null
                    : EncryptionHelper.Decrypt(project.KeyPassphrase);

                var keyFile = string.IsNullOrEmpty(decryptedPassphrase)
                    ? new PrivateKeyFile(resolvedPath)
                    : new PrivateKeyFile(resolvedPath, decryptedPassphrase);

                connectionInfo = new SshConnectionInfo(
                    project.ServerHost,
                    project.SshPort,
                    project.SshUsername,
                    new PrivateKeyAuthenticationMethod(project.SshUsername, keyFile)
                );
            }
            else if (!string.IsNullOrWhiteSpace(project.SshPassword))
            {
                var decryptedPassword = EncryptionHelper.Decrypt(project.SshPassword);

                connectionInfo = new SshConnectionInfo(
                    project.ServerHost,
                    project.SshPort,
                    project.SshUsername,
                    new PasswordAuthenticationMethod(project.SshUsername, decryptedPassword)
                );
            }
            else
            {
                throw new InvalidOperationException(
                    "No SSH authentication method configured for this project."
                );
            }

            return new SshClient(connectionInfo);
        }

        // ============================================================
        // RUN THE ACTUAL UFW COMMANDS OVER SSH
        // ============================================================

        private async Task<(bool success, string message)> UpdateFirewallAsync(
    IpWhitelistModel project,
    string newIp)
        {
            return await Task.Run(() =>
            {
                SshClient? client = null;

                try
                {
                    client = CreateSshClient(project);
                    client.Connect();

                    var decryptedSudoPassword = string.IsNullOrWhiteSpace(project.SshPassword)
                        ? throw new InvalidOperationException(
                            "No password stored for this project - cannot auto-answer sudo prompt.")
                        : EncryptionHelper.Decrypt(project.SshPassword);

                    // Remove the previously whitelisted IP, if there is one and it changed
                    if (!string.IsNullOrWhiteSpace(project.CurrentIpAddress) &&
                        project.CurrentIpAddress != newIp)
                    {
                        var deleteCommand = BuildSudoCommand(
                            decryptedSudoPassword,
                            $"ufw delete allow from {project.CurrentIpAddress} to any port {project.PostgresPort} proto tcp"
                        );

                        client.RunCommand(deleteCommand);
                        // Deletion failing (e.g. rule didn't exist) shouldn't block adding the new one
                    }

                    var addCommand = BuildSudoCommand(
                        decryptedSudoPassword,
                        $"ufw allow from {newIp} to any port {project.PostgresPort} proto tcp"
                    );

                    var addCmd = client.RunCommand(addCommand);

                    if (addCmd.ExitStatus != 0)
                    {
                        return (false, $"UFW add command failed: {addCmd.Error}");
                    }

                    return (true, "Firewall rule updated successfully.");
                }
                catch (SshAuthenticationException ex)
                {
                    return (false, $"SSH authentication failed: {ex.Message}");
                }
                catch (Exception ex)
                {
                    return (false, $"SSH/UFW error: {ex.Message}");
                }
                finally
                {
                    if (client is { IsConnected: true })
                        client.Disconnect();

                    client?.Dispose();
                }
            });
        }

        // ============================================================
        // LOG EACH ATTEMPT
        // ============================================================

        private async Task LogWhitelistAttemptAsync(
     long projectId,
     string? oldIp,
     string? newIp,
     string action,      // e.g. "WHITELIST", "CHECK", "WHITELIST_ALL"
     string status,       // "SUCCESS", "FAILED", "PENDING"
     string message)
        {
            await _db.ExecuteNonQueryAsync(
                """
        INSERT INTO utbl_ip_whitelist_log
        (
            ip_whitelist_id,
            old_ip_address,
            new_ip_address,
            action,
            status,
            message,
            created_at
        )
        VALUES
        (
            @project_id,
            @old_ip::inet,
            @new_ip::inet,
            @action,
            @status,
            @message,
            CURRENT_TIMESTAMP
        )
        """,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("project_id", projectId);
                    cmd.Parameters.AddWithValue("old_ip", (object?)oldIp ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("new_ip", (object?)newIp ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("action", action);
                    cmd.Parameters.AddWithValue("status", status);
                    cmd.Parameters.AddWithValue("message", message);
                }
            );
        }

        // ============================================================
        // CORE WORKFLOW - shared by single and bulk whitelist
        // ============================================================

        private async Task<object> WhitelistProjectAsync(IpWhitelistModel project)
        {
            string newIp;

            try
            {
                newIp = await GetPublicIpAsync();
            }
            catch (Exception ex)
            {
                var msg = $"Failed to determine public IP: {ex.Message}";
                await LogWhitelistAttemptAsync(
                    project.IpWhitelistId, project.CurrentIpAddress, null,
                    "WHITELIST", "FAILED", msg);
                return new { project = project.ProjectName, success = false, message = msg };
            }

            // IP hasn't changed - nothing to do on the firewall, just record the check
            if (string.Equals(project.CurrentIpAddress, newIp, StringComparison.OrdinalIgnoreCase))
            {
                await _db.ExecuteNonQueryAsync(
                    """
            UPDATE utbl_ip_whitelist
            SET last_ip_check_date_time = CURRENT_TIMESTAMP
            WHERE ip_whitelist_id = @id
            """,
                    cmd => cmd.Parameters.AddWithValue("id", project.IpWhitelistId)
                );

                await LogWhitelistAttemptAsync(
                    project.IpWhitelistId, project.CurrentIpAddress, newIp,
                    "CHECK", "SUCCESS", "IP unchanged - already whitelisted.");

                return new
                {
                    project = project.ProjectName,
                    success = true,
                    message = "IP unchanged - already whitelisted.",
                    ip = newIp
                };
            }

            var (fwSuccess, fwMessage) = await UpdateFirewallAsync(project, newIp);

            if (!fwSuccess)
            {
                await LogWhitelistAttemptAsync(
                    project.IpWhitelistId, project.CurrentIpAddress, newIp,
                    "WHITELIST", "FAILED", fwMessage);
                return new { project = project.ProjectName, success = false, message = fwMessage };
            }

            await _db.ExecuteNonQueryAsync(
                """
        UPDATE utbl_ip_whitelist
        SET current_ip_address = @ip::inet,
            last_ip_check_date_time = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE ip_whitelist_id = @id
        """,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("ip", newIp);
                    cmd.Parameters.AddWithValue("id", project.IpWhitelistId);
                }
            );

            await LogWhitelistAttemptAsync(
                project.IpWhitelistId, project.CurrentIpAddress, newIp,
                "WHITELIST", "SUCCESS", "Whitelisted successfully.");

            return new
            {
                project = project.ProjectName,
                success = true,
                message = "IP whitelisted successfully.",
                oldIp = project.CurrentIpAddress,
                newIp
            };
        }


        // ============================================================
        // GET ALL PROJECTS
        // ============================================================

        [HttpGet("get-all-projects")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _db.ExecuteQueryListAsync<IpWhitelistModel>(
                """
                SELECT
                    ip_whitelist_id AS "IpWhitelistId",
                    project_name AS "ProjectName",
                    env_type AS "EnvType",
                    description AS "Description",
                    server_host AS "ServerHost",
                    ssh_username AS "SshUsername",
                    ssh_port AS "SshPort",
                    path_to_private_file AS "PathToPrivateFile",
                    postgres_port AS "PostgresPort",
                    current_ip_address::text AS "CurrentIpAddress",
                    last_ip_check_date_time AS "LastIpCheckDateTime",
                    is_active AS "IsActive",
                    created_at AS "CreatedAt",
                    updated_at AS "UpdatedAt"
                FROM utbl_ip_whitelist
                ORDER BY created_at DESC
                """
            );

            return Ok(projects);
        }


        // ============================================================
        // GET PROJECT BY ID
        // ============================================================

        [HttpGet("get-project-by-id/{id:long}")]
        public async Task<IActionResult> GetProject(long id)
        {
            if (id <= 0)
                return BadRequest("Invalid project id.");

            var project = await _db.ExecuteQuerySingleAsync<IpWhitelistModel>(
                """
                SELECT
                    ip_whitelist_id AS "IpWhitelistId",
                    project_name AS "ProjectName",
                    env_type AS "EnvType",
                    description AS "Description",
                    server_host AS "ServerHost",
                    ssh_username AS "SshUsername",
                    ssh_port AS "SshPort",
                    path_to_private_file AS "PathToPrivateFile",
                    postgres_port AS "PostgresPort",
                    current_ip_address::text AS "CurrentIpAddress",
                    last_ip_check_date_time AS "LastIpCheckDateTime",
                    is_active AS "IsActive",
                    created_at AS "CreatedAt",
                    updated_at AS "UpdatedAt"
                FROM utbl_ip_whitelist
                WHERE ip_whitelist_id = @id
                """,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("id", id);
                }
            );

            if (project == null)
                return NotFound("Project not found.");

            return Ok(project);
        }


        // ============================================================
        // ADD PROJECT
        // ============================================================

        [HttpPost("add-project")]
        public async Task<IActionResult> AddProject(
            [FromBody] IpWhitelistModel request)
        {
            if (string.IsNullOrWhiteSpace(request.ProjectName))
                return BadRequest("Project name is required.");

            if (string.IsNullOrWhiteSpace(request.ServerHost))
                return BadRequest("Server host is required.");

            if (string.IsNullOrWhiteSpace(request.SshUsername))
                return BadRequest("SSH username is required.");

            if (string.IsNullOrWhiteSpace(request.PathToPrivateFile))
                return BadRequest("Private key path is required.");


            // --------------------------------------------------------
            // Encrypt sensitive information
            // --------------------------------------------------------

            string? encryptedPassphrase = null;
            string? encryptedPassword = null;

            if (!string.IsNullOrWhiteSpace(request.KeyPassphrase))
            {
                encryptedPassphrase =
                    EncryptionHelper.Encrypt(request.KeyPassphrase);
            }

            if (!string.IsNullOrWhiteSpace(request.SshPassword))
            {
                encryptedPassword =
                    EncryptionHelper.Encrypt(request.SshPassword);
            }


            // --------------------------------------------------------
            // Insert
            // --------------------------------------------------------

            var newId = await _db.ExecuteScalarAsync<long>(
                """
                INSERT INTO utbl_ip_whitelist
                (
                    project_name,
                    env_type,
                    description,
                    server_host,
                    ssh_username,
                    ssh_port,
                    path_to_private_file,
                    key_passphrase,
                    ssh_password,
                    postgres_port,
                    is_active,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    @project_name,
                    @env_type,
                    @description,
                    @server_host,
                    @ssh_username,
                    @ssh_port,
                    @path_to_private_file,
                    @key_passphrase,
                    @ssh_password,
                    @postgres_port,
                    @is_active,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
                RETURNING ip_whitelist_id;
                """,
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "project_name",
                        request.ProjectName
                    );

                    cmd.Parameters.AddWithValue(
                        "env_type",
                        request.EnvType
                    );

                    cmd.Parameters.AddWithValue(
                        "description",
                        request.Description ?? (object)DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "server_host",
                        request.ServerHost
                    );

                    cmd.Parameters.AddWithValue(
                        "ssh_username",
                        request.SshUsername
                    );

                    cmd.Parameters.AddWithValue(
                        "ssh_port",
                        request.SshPort
                    );

                    cmd.Parameters.AddWithValue(
                        "path_to_private_file",
                        request.PathToPrivateFile
                    );

                    cmd.Parameters.AddWithValue(
                        "key_passphrase",
                        encryptedPassphrase ?? (object)DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "ssh_password",
                        encryptedPassword ?? (object)DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "postgres_port",
                        request.PostgresPort
                    );

                    cmd.Parameters.AddWithValue(
                        "is_active",
                        request.IsActive
                    );
                }
            );

            return Ok(new
            {
                success = true,
                message = "Project added successfully.",
                ip_whitelist_id = newId
            });
        }


        // ============================================================
        // UPDATE PROJECT
        // ============================================================

        [HttpPut("update-project-by-id/{id:long}")]
        public async Task<IActionResult> UpdateProject(
            long id,
            [FromBody] IpWhitelistModel request)
        {
            if (id <= 0)
                return BadRequest("Invalid project id.");

            var existingProject =
                await _db.ExecuteQuerySingleAsync<IpWhitelistModel>(
                    """
                    SELECT
                        ip_whitelist_id AS "IpWhitelistId",
                        project_name AS "ProjectName",
                        env_type AS "EnvType",
                        description AS "Description",
                        server_host AS "ServerHost",
                        ssh_username AS "SshUsername",
                        ssh_port AS "SshPort",
                        path_to_private_file AS "PathToPrivateFile",
                        postgres_port AS "PostgresPort",
                        is_active AS "IsActive"
                    FROM utbl_ip_whitelist
                    WHERE ip_whitelist_id = @id
                    """,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("id", id);
                    }
                );

            if (existingProject == null)
                return NotFound("Project not found.");


            // Encrypt only if new values were supplied

            string? encryptedPassphrase =
                string.IsNullOrWhiteSpace(request.KeyPassphrase)
                    ? null
                    : EncryptionHelper.Encrypt(request.KeyPassphrase);

            string? encryptedPassword =
                string.IsNullOrWhiteSpace(request.SshPassword)
                    ? null
                    : EncryptionHelper.Encrypt(request.SshPassword);


            var rowsAffected = await _db.ExecuteNonQueryAsync(
                """
                UPDATE utbl_ip_whitelist
                SET
                    project_name = @project_name,
                    env_type = @env_type,
                    description = @description,
                    server_host = @server_host,
                    ssh_username = @ssh_username,
                    ssh_port = @ssh_port,
                    path_to_private_file = @path_to_private_file,
                    postgres_port = @postgres_port,
                    is_active = @is_active,

                    key_passphrase =
                        COALESCE(
                            @key_passphrase,
                            key_passphrase
                        ),

                    ssh_password =
                        COALESCE(
                            @ssh_password,
                            ssh_password
                        ),

                    updated_at = CURRENT_TIMESTAMP

                WHERE ip_whitelist_id = @id
                """,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("id", id);

                    cmd.Parameters.AddWithValue(
                        "project_name",
                        request.ProjectName
                    );

                    cmd.Parameters.AddWithValue(
                        "env_type",
                        request.EnvType
                    );

                    cmd.Parameters.AddWithValue(
                        "description",
                        request.Description ?? (object)DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "server_host",
                        request.ServerHost
                    );

                    cmd.Parameters.AddWithValue(
                        "ssh_username",
                        request.SshUsername
                    );

                    cmd.Parameters.AddWithValue(
                        "ssh_port",
                        request.SshPort
                    );

                    cmd.Parameters.AddWithValue(
                        "path_to_private_file",
                        request.PathToPrivateFile
                    );

                    cmd.Parameters.AddWithValue(
                        "postgres_port",
                        request.PostgresPort
                    );

                    cmd.Parameters.AddWithValue(
                        "is_active",
                        request.IsActive
                    );

                    cmd.Parameters.AddWithValue(
                        "key_passphrase",
                        encryptedPassphrase ?? (object)DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "ssh_password",
                        encryptedPassword ?? (object)DBNull.Value
                    );
                }
            );

            if (rowsAffected == 0)
                return NotFound("Project not found.");

            return Ok(new
            {
                success = true,
                message = "Project updated successfully."
            });
        }


        // ============================================================
        // DELETE PROJECT
        // ============================================================

        [HttpPost("delete-project-by-id/{id:long}")]
        public async Task<IActionResult> DeleteProject(long id)
        {
            if (id <= 0)
                return BadRequest("Invalid project id.");

            var rowsAffected = await _db.ExecuteNonQueryAsync(
                """
                DELETE FROM utbl_ip_whitelist
                WHERE ip_whitelist_id = @id
                """,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("id", id);
                }
            );

            if (rowsAffected == 0)
                return NotFound("Project not found.");

            return Ok(new
            {
                success = true,
                message = "Project deleted successfully."
            });
        }


        // ============================================================
        // ENABLE / DISABLE PROJECT
        // ============================================================

        [HttpPatch("update-status-by-id/{id:long}")]
        public async Task<IActionResult> UpdateProjectStatus(
            long id,
            [FromBody] bool isActive)
        {
            if (id <= 0)
                return BadRequest("Invalid project id.");

            var rowsAffected = await _db.ExecuteNonQueryAsync(
                """
                UPDATE utbl_ip_whitelist
                SET
                    is_active = @is_active,
                    updated_at = CURRENT_TIMESTAMP
                WHERE ip_whitelist_id = @id
                """,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("id", id);
                    cmd.Parameters.AddWithValue("is_active", isActive);
                }
            );

            if (rowsAffected == 0)
                return NotFound("Project not found.");

            return Ok(new
            {
                success = true,
                message = isActive
                    ? "Project enabled."
                    : "Project disabled."
            });
        }


        [HttpPost("whitelist-ip-by-id/{id:long}")]
        public async Task<IActionResult> WhitelistIp(long id)
        {
            if (id <= 0)
                return BadRequest("Invalid project id.");

            var project = await _db.ExecuteQuerySingleAsync<IpWhitelistModel>(
                """
            SELECT
                ip_whitelist_id AS "IpWhitelistId",
                project_name AS "ProjectName",
                server_host AS "ServerHost",
                ssh_username AS "SshUsername",
                ssh_port AS "SshPort",
                path_to_private_file AS "PathToPrivateFile",
                key_passphrase AS "KeyPassphrase",
                ssh_password AS "SshPassword",
                postgres_port AS "PostgresPort",
                current_ip_address::text AS "CurrentIpAddress"
            FROM utbl_ip_whitelist
            WHERE ip_whitelist_id = @id
              AND is_active = TRUE
            """,
                cmd => cmd.Parameters.AddWithValue("id", id)
            );

            if (project == null)
                return NotFound("Active project not found.");

            var result = await WhitelistProjectAsync(project);
            return Ok(result);
        }

        // ============================================================
        // WHITELIST ALL ACTIVE PROJECTS
        // ============================================================

        [HttpPost("whitelist-all")]
        public async Task<IActionResult> WhitelistAll()
        {
            var projects = await _db.ExecuteQueryListAsync<IpWhitelistModel>(
                """
        SELECT
            ip_whitelist_id AS "IpWhitelistId",
            project_name AS "ProjectName",
            server_host AS "ServerHost",
            ssh_username AS "SshUsername",
            ssh_port AS "SshPort",
            path_to_private_file AS "PathToPrivateFile",
            key_passphrase AS "KeyPassphrase",
            ssh_password AS "SshPassword",
            postgres_port AS "PostgresPort",
            current_ip_address::text AS "CurrentIpAddress"
        FROM utbl_ip_whitelist
        WHERE is_active = TRUE
        ORDER BY project_name
        """
            );

            if (projects.Count == 0)
                return NotFound("No active projects found.");

            var results = new List<object>();

            foreach (var project in projects)
            {
                results.Add(await WhitelistProjectAsync(project));
            }

            return Ok(new
            {
                success = true,
                total_projects = projects.Count,
                results
            });
        }
    }
}