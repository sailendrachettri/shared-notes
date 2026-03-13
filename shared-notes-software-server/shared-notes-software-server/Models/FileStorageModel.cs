namespace shared_notes_software_server.Models
{
    public class DeleteFileRequest
    {
        public int FileId { get; set; }
    }

    public class DeleteFolderRequest
    {
        public int FolderId { get; set; }
    }
    public class FilePathModel
    {
        public int File_Id { get; set; }
        public string File_Path { get; set; }
    }
    public class UploadFileRequest
    {
        public string FileName { get; set; }
        public long? FolderId { get; set; }
        public long FileSize { get; set; }
        public string FileExtension { get; set; }
        public string FileVisibility { get; set; }
        public string FilePath { get; set; }
        public Guid? UserId { get; set; }
    }
    public class GetFolderItemsRequest
    {
        public long? ParentFolderId { get; set; }
        public Guid? UserId { get; set; }
    }

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