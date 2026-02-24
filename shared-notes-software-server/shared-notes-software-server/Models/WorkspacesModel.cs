namespace shared_notes_software_server.Models
{
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
