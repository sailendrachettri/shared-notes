using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace shared_notes_software_server.Models
{
    public class DashboardReportModel
    {
        [JsonPropertyName("workspace_progress")]
        public List<WorkspaceProgress>? WorkspaceProgress { get; set; }

        [JsonPropertyName("dashboard_counts")]
        public DashboardCounts? DashboardCounts { get; set; }

        [JsonPropertyName("upcoming_events")]
        public List<UpcomingEvent>? UpcomingEvents { get; set; }

        [JsonPropertyName("overall_completion_percentage")]
        public decimal OverallCompletionPercentage { get; set; }
    }

    public class UpcomingEvent
    {
        [JsonPropertyName("event_id")]
        public long EventId { get; set; }

        [JsonPropertyName("event_title")]
        public string? EventName { get; set; }

        [JsonPropertyName("event_date")]
        public DateTime EventDate { get; set; }

        [JsonPropertyName("event_time")]
        public string? EventTime { get; set; }

        [JsonPropertyName("event_category_name")]
        public string? EventCategoryName { get; set; }
    }

    public class WorkspaceProgress
    {
        [JsonPropertyName("workspace_id")]
        public long WorkspaceId { get; set; }

        [JsonPropertyName("workspace_name")]
        public string? WorkspaceName { get; set; }

        [JsonPropertyName("members")]
        public List<WorkspaceMember>? Members { get; set; }

        [JsonPropertyName("columns")]
        public List<WorkspaceColumn>? Columns { get; set; }
    }

    public class WorkspaceColumn
    {
        [JsonPropertyName("column_id")]
        public long ColumnId { get; set; }

        [JsonPropertyName("column_name")]
        public string? ColumnName { get; set; }

        [JsonPropertyName("task_count")]
        public int TaskCount { get; set; }

        [JsonPropertyName("percentage")]
        public decimal Percentage { get; set; }
    }

    public class DashboardCounts
    {
        [JsonPropertyName("total_workspaces")]
        public int TotalWorkspaces { get; set; }

        [JsonPropertyName("total_assigned_tasks")]
        public int TotalAssignedTasks { get; set; }

        [JsonPropertyName("total_active_projects")]
        public int TotalActiveProjects { get; set; }

        [JsonPropertyName("total_private_notes")]
        public int TotalPrivateNotes { get; set; }

        [JsonPropertyName("total_public_notes")]
        public int TotalPublicNotes { get; set; }

        [JsonPropertyName("total_pending_tasks")]
        public int TotalPendingTasks { get; set; }

        [JsonPropertyName("total_inprogress_tasks")]
        public int TotalInProgressTasks { get; set; }
    }

    public class WorkspaceMember
    {
        [JsonPropertyName("user_id")]
        public Guid UserId { get; set; }

        [JsonPropertyName("user_name")]
        public string? UserName { get; set; }

        [JsonPropertyName("profile_url")]
        public string? ProfileUrl { get; set; }
    }


}