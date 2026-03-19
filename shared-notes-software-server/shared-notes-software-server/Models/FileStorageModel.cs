namespace shared_notes_software_server.Models
{
    public class AddCollaboratorsRequest
    {
        public long FolderId { get; set; }
        public List<Guid> UserIds { get; set; }
        public string AccessRole { get; set; } // viewer / editor
        public Guid? InvitedBy { get; set; }
    }
    public class RenameFileAndFolderRequest
    {
        public long FolderOrFileId { get; set; }
        public string Title { get; set; }
        public string FileOrFolderType {get; set;}
        
    }
    public class MakeFolderPublicRequest
    {
        public int FolderId { get; set; }
    }
    public class FileStorageCategory
    {
        public int File_Storage_Category_Id { get; set; }
        public string File_Storage_Category_Name { get; set; }
        public DateTime Created_At { get; set; }
    }

    public class FileModel
    {
        public long file_id { get; set; }
        public string file_name { get; set; }
        public long? folder_id { get; set; }
        public long file_size { get; set; }
        public string file_extension { get; set; }
        public string file_visibility { get; set; }
        public bool is_deleted { get; set; }
        public DateTime? deleted_at { get; set; }
        public DateTime created_at { get; set; }
        public Guid? user_id { get; set; }
        public string file_path { get; set; }
    }
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
        public string? ThumbPath { get; set; }
    }
    public class GetFolderItemsRequest
    {
        public long? ParentFolderId { get; set; }
        public Guid? UserId { get; set; }
        public string? SearchText { get; set; }
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