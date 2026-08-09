namespace shared_notes_software_server.Models
{
    public class IpWhitelistModel
    {
        public long IpWhitelistId { get; set; }

        // Project Information
        public string ProjectName { get; set; } = string.Empty;

        public string EnvType { get; set; } = "Production";

        public string? Description { get; set; }

        // SSH Server Information
        public string ServerHost { get; set; } = string.Empty;

        public string SshUsername { get; set; } = string.Empty;

        public int SshPort { get; set; } = 22;

        // SSH Authentication
        public string PathToPrivateFile { get; set; } = string.Empty;

        public string? KeyPassphrase { get; set; }

        public string? SshPassword { get; set; }

        // PostgreSQL
        public int PostgresPort { get; set; } = 5432;

        // IP Whitelist Information
        public string? CurrentIpAddress { get; set; }

        public DateTimeOffset? LastIpCheckDateTime { get; set; }

        // Status
        public bool IsActive { get; set; } = true;

        // Audit
        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }
    }
    public class IpWhitelistLogModel
    {
        public long IpWhitelistLogId { get; set; }

        public long IpWhitelistId { get; set; }

        public string? OldIpAddress { get; set; }

        public string? NewIpAddress { get; set; }

        public string Action { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public string? Message { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        // Navigation property
        public IpWhitelistModel? IpWhitelist { get; set; }
    }
}