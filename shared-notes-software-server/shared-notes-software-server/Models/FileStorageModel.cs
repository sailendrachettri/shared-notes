namespace shared_notes_software_server.Models
{
    public class AddFolderRequest
    {
        public string FolderName { get; set; } = string.Empty;
        public long? ParentFolderId { get; set; }
        public Guid? UserId { get; set; }
        public string? FolderVisibility { get; set; }
    }
}