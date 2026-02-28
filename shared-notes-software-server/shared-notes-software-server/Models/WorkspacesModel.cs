using System.Text.Json.Serialization;

namespace shared_notes_software_server.Models
{
    public class RenameWorkspaceRequest
    {
        public long WorkspaceId { get; set; }
        public string WorkspaceName { get; set; }
    }
    public class DeleteWorkspaceRequest
    {
        public long WorkspaceId { get; set; }
    }
    public class DeleteWorkspaceTaskRequest
    {
        public long WorkspaceTaskId { get; set; }
    }
    public class MoveWorkspaceToPublicRequest
    {
        public long WorkspaceId { get; set; }
    }
    public class UpdateWorkspaceTaskPositionRequest
    {
        public List<WorkspaceTaskPositionUpdate> Updates { get; set; } = new();
    }

    public class WorkspaceTaskPositionUpdate
    {
        public long WorkspaceTaskId { get; set; }
        public long WorkspaceColumnId { get; set; }
        public decimal TaskPosition { get; set; }
        // Note: decimal is IMPORTANT because your frontend may send fractional positions
    }
    public class AddWorkspaceTaskRequest
    {
       public long WorkspaceId { get; set; }
       public long WorkspaceColumnId { get; set; }
       public string Title { get; set; }
       public long PriorityId { get; set; }
       public List<Guid>? AssignToUsers { get; set; }
    }
    public class GetWorkspaceDetailsRequest
    {
        public long WorkspaceId { get; set; }
    }
    public class WorkspaceDetailsResponseDto
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; }

        [JsonPropertyName("data")]
        public WorkspaceDetailsDataDto? Data { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }
    }

    public class WorkspaceDetailsDataDto
    {
        [JsonPropertyName("workspace")]
        public WorkspaceDto? Workspace { get; set; }

        [JsonPropertyName("columns")]
        public List<WorkspaceColumnDto>? Columns { get; set; }
    }

    public class WorkspaceDto
    {
        [JsonPropertyName("workspace_id")]
        public long WorkspaceId { get; set; }

        [JsonPropertyName("user_id")]
        public Guid? UserId { get; set; }

        [JsonPropertyName("workspace_name")]
        public string? WorkspaceName { get; set; }

        [JsonPropertyName("is_private")]
        public bool IsPrivate { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }

    public class WorkspaceColumnDto
    {
        [JsonPropertyName("workspace_column_id")]
        public long WorkspaceColumnId { get; set; }

        [JsonPropertyName("workspace_id")]
        public long WorkspaceId { get; set; }

        [JsonPropertyName("column_name")]
        public string? ColumnName { get; set; }

        [JsonPropertyName("column_position")]
        public decimal ColumnPosition { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("tasks")]
        public List<WorkspaceTaskDto>? Tasks { get; set; }
    }

    public class WorkspaceTaskDto
    {
        [JsonPropertyName("workspace_task_id")]
        public long WorkspaceTaskId { get; set; }

        [JsonPropertyName("workspace_id")]
        public long WorkspaceId { get; set; }

        [JsonPropertyName("workspace_column_id")]
        public long WorkspaceColumnId { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("priority_id")]
        public int PriorityId { get; set; }

        [JsonPropertyName("task_position")]
        public decimal TaskPosition { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [JsonPropertyName("assigned_users")]
        public List<TaskAssignedUserDto>? AssignedUsers { get; set; }
    }

    public class TaskAssignedUserDto
    {
        [JsonPropertyName("task_mapping_id")]
        public long TaskMappingId { get; set; }

        [JsonPropertyName("user_id")]
        public Guid UserId { get; set; }

        [JsonPropertyName("user_name")]
        public string UserName { get; set; } = null!;

        [JsonPropertyName("profile_url")]
        public string ProfileUrl { get; set; } = null!;

    }
    public class GetWorspacesRequest
    {
        public string? SearchText { get; set; }
        public string? SortBy { get; set; }
        public string? SortDirection { get; set; }
        public Guid? UserId { get; set; }
    }
    public class AddWorkspacesRequest
    {
        public Guid? UserId { get; set; }
        public string WorkspaceName { get; set; }
        public bool IsPrivate { get; set; }
    }
}
