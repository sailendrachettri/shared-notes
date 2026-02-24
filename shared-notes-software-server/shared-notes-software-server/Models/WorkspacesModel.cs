namespace shared_notes_software_server.Models
{
    public class AddWorkspacesRequest
    {
        public Guid? UserId { get; set; }
        public string WorkspaceName { get; set; }
        public bool IsPrivate { get; set; }
    }
}
