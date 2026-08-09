using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;
using shared_notes_software_server.Extensions;
using System.Text.Json;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/ip-whitelist")]
    public class IpWhiteListController : ControllerBase
    {
        private readonly DbHelper _db;

        public IpWhiteListController(DbHelper db)
        {
            _db = db;
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
                    current_ip_address AS "CurrentIpAddress",
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
                    current_ip_address AS "CurrentIpAddress",
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

        [HttpDelete("delete-project-by-id/{id:long}")]
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


        // ============================================================
        // WHITELIST CURRENT IP
        // ============================================================
        //
        // SSH/UFW implementation will be added here.
        //
        // POST:
        // /api/v1/ip-whitelist/{id}/whitelist
        //
        // ============================================================

        [HttpPost("whitelist-project-ip-by-id/{id:long}")]
        public async Task<IActionResult> WhitelistIp(long id)
        {
            if (id <= 0)
                return BadRequest("Invalid project id.");

            var project =
                await _db.ExecuteQuerySingleAsync<IpWhitelistModel>(
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
                        current_ip_address AS "CurrentIpAddress"
                    FROM utbl_ip_whitelist
                    WHERE ip_whitelist_id = @id
                      AND is_active = TRUE
                    """,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("id", id);
                    }
                );

            if (project == null)
                return NotFound("Active project not found.");


            // TODO:
            // 1. Get current public IP
            // 2. Compare with project.CurrentIpAddress
            // 3. SSH into server
            // 4. Remove old UFW rule
            // 5. Add new UFW rule
            // 6. Update current_ip_address
            // 7. Insert whitelist log


            return Ok(new
            {
                success = true,
                message = "Whitelist process will be implemented here.",
                project = project.ProjectName
            });
        }


        // ============================================================
        // WHITELIST ALL ACTIVE PROJECTS
        // ============================================================

        [HttpPost("whitelist-all")]
        public async Task<IActionResult> WhitelistAll()
        {
            var projects =
                await _db.ExecuteQueryListAsync<IpWhitelistModel>(
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
                        current_ip_address AS "CurrentIpAddress"
                    FROM utbl_ip_whitelist
                    WHERE is_active = TRUE
                    ORDER BY project_name
                    """
                );


            if (projects.Count == 0)
            {
                return NotFound("No active projects found.");
            }


            // TODO:
            //
            // foreach (var project in projects)
            // {
            //     Get current IP
            //     SSH
            //     UFW
            //     Update database
            //     Insert log
            // }


            return Ok(new
            {
                success = true,
                total_projects = projects.Count,
                message = "Whitelist-all process will be implemented here."
            });
        }
    }
}