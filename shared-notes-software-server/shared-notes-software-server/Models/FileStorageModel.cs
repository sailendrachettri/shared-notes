namespace shared_notes_software_server.Models
{
    public class GetFolderItemListRequest
    {
        public string? SearchText { get; set; }
        public string? SortBy { get; set; } = "folder_name";
        public string? SortDir { get; set; } = "asc";
        public Guid? UserId { get; set; }
    }
    public class FolderItem
    {
        public long FolderId { get; set; }
        public string FolderName { get; set; }
        public long? ParentFolderId { get; set; }
        public string FolderVisibility { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    public class AddFolderRequest
    {
        public string FolderName { get; set; } = string.Empty;
        public long? ParentFolderId { get; set; }
        public Guid? UserId { get; set; }
        public string? FolderVisibility { get; set; }
    }
}