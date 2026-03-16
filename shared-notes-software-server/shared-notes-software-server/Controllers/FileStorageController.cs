using Microsoft.AspNetCore.Mvc;
using Npgsql;
using shared_notes_software_server.Data;
using shared_notes_software_server.Models;
using System.IO;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/file-storage")]
    public class FileStorageController : ControllerBase
    {
        private readonly DbHelper _db;
        private readonly IWebHostEnvironment _env;


        public FileStorageController(DbHelper db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        [HttpPost("make-folder-public")]
        public async Task<IActionResult> MakeFolderPublic([FromBody] MakeFolderPublicRequest model)
        {
            var query = @"
        WITH RECURSIVE folder_tree AS (
            SELECT folder_id
            FROM public.utbl_folders
            WHERE folder_id = @folder_id_i

            UNION ALL

            SELECT f.folder_id
            FROM public.utbl_folders f
            INNER JOIN folder_tree ft
                ON f.parent_folder_id = ft.folder_id
        ),
        update_folders AS (
            UPDATE public.utbl_folders
            SET folder_visibility = 'public'
            WHERE folder_id IN (SELECT folder_id FROM folder_tree)
        ),
        update_files AS (
            UPDATE public.utbl_files
            SET file_visibility = 'public',
                user_id = NULL
            WHERE folder_id IN (SELECT folder_id FROM folder_tree)
        )
        SELECT 1;
    ";

            await _db.ExecuteNonQueryAsync(
                query,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("folder_id_i", model.FolderId);
                }
            );

            return Ok(new
            {
                success = true,
                status = "UPDATED",
                message = "Folder visibility changed to public"
            });
        }

        [HttpGet("all-file-by-category-id/{categoryId}")]
        public async Task<IActionResult> GetFilesByCategory(int categoryId, [FromQuery] Guid userId)
        {
            string query = @"
        SELECT DISTINCT f.*
        FROM utbl_files f
        LEFT JOIN utbl_mst_file_category_extensions e
            ON LOWER(f.file_extension) = LOWER(e.extension)
        WHERE f.is_deleted = false
        AND (
                f.file_visibility = 'public'
                OR (f.file_visibility IN ('private','shared') AND f.user_id = @userId)
            )
        AND (
                @categoryId = 1
                OR e.file_storage_category_id = @categoryId
            )
        ORDER BY f.created_at DESC;
    ";

            var files = await _db.ExecuteQueryListAsync<FileModel>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@categoryId", categoryId);
                cmd.Parameters.AddWithValue("@userId", userId);
            });

            return Ok(new
            {
                status = "FETCHED",
                success = true,
                data = files
            });
        }

        [HttpGet("get-mst-file-storage-category")]
        public async Task<IActionResult> GetAllCategories()
        {
            string query = @"
            SELECT 
                file_storage_category_id   ,
                file_storage_category_name ,
                created_at                 
            FROM public.utbl_mst_file_storage_category
            ORDER BY file_storage_category_name;
        ";

            var categories = await _db.ExecuteQueryListAsync<FileStorageCategory>(query);

            return Ok(new
            {
                status = "FETCHED",
                success = true,
                data = categories
            });
        }

        [HttpPost("delete-folder")]
        public async Task<IActionResult> DeleteFolder([FromBody] DeleteFolderRequest model)
        {
            // 1️⃣ Get all files inside folder tree
            var getFilesQuery = @"
        WITH RECURSIVE folder_tree AS (
            SELECT folder_id
            FROM public.utbl_folders
            WHERE folder_id = @folder_id_i

            UNION ALL

            SELECT f.folder_id
            FROM public.utbl_folders f
            INNER JOIN folder_tree ft
            ON f.parent_folder_id = ft.folder_id
        )
        SELECT file_id, file_path
        FROM public.utbl_files
        WHERE folder_id IN (SELECT folder_id FROM folder_tree);
    ";

            var files = await _db.ExecuteQueryListAsync<FilePathModel>(
                getFilesQuery,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("folder_id_i", model.FolderId);
                }
            );

            // 2️⃣ Delete physical files from server
            string directoryPath = Path.Combine(_env.ContentRootPath, "uploadedFiles");

            foreach (var file in files)
            {
                if (string.IsNullOrWhiteSpace(file.File_Path))
                    continue;

                string safeFileName = Path.GetFileName(file.File_Path);

                string fullPath = Path.Combine(directoryPath, safeFileName);

                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }

            // 3️⃣ Delete database records (files + folders) in ONE CTE scope
            var deleteQuery = @"
        WITH RECURSIVE folder_tree AS (
            SELECT folder_id
            FROM public.utbl_folders
            WHERE folder_id = @folder_id_i

            UNION ALL

            SELECT f.folder_id
            FROM public.utbl_folders f
            INNER JOIN folder_tree ft
            ON f.parent_folder_id = ft.folder_id
        ),
        deleted_files AS (
            DELETE FROM public.utbl_files
            WHERE folder_id IN (SELECT folder_id FROM folder_tree)
        )
        DELETE FROM public.utbl_folders
        WHERE folder_id IN (SELECT folder_id FROM folder_tree);
    ";

            await _db.ExecuteNonQueryAsync( 
                deleteQuery,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("folder_id_i", model.FolderId);
                }
            );

            return Ok(new
            {
                success = true,
                message = "Folder and all contents deleted successfully"
            });
        }

        [HttpPost("delete-file-from-database")]
        public async Task<IActionResult> DeleteFile([FromBody] DeleteFileRequest model)
        {
            var query = @"DELETE FROM public.utbl_files
                  WHERE file_id = @file_id_i";

            var rowsAffected = await _db.ExecuteNonQueryAsync(
                query,
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "file_id_i",
                        model.FileId
                    );
                }
            );

            if (rowsAffected > 0)
            {
                return Ok(new
                {
                    success = true,
                    status = "DELETED",
                    message = "File deleted successfully"
                });
            }

            return Ok(new
            {
                success = false,
                message = "File not found"
            });
        }

        [HttpPost("upload-file")]
        public async Task<IActionResult> UploadFile([FromBody] UploadFileRequest model)
        {
            var query = @"SELECT public.upload_file(
                        @file_name_i,
                        @folder_id_i,
                        @file_size_i,
                        @file_extension_i,
                        @file_visibility_i,
                        @file_path_i,
                        @user_id_i
                  )";

            var result = await _db.ExecuteScalarAsync<string>(
                query,
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "file_name_i",
                        model.FileName
                    );

                    cmd.Parameters.AddWithValue(
                        "folder_id_i",
                        (object?)model.FolderId ?? DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "file_size_i",
                        model.FileSize
                    );

                    cmd.Parameters.AddWithValue(
                        "file_extension_i",
                        model.FileExtension
                    );

                    cmd.Parameters.AddWithValue(
                        "file_visibility_i",
                        model.FileVisibility
                    );

                    cmd.Parameters.AddWithValue(
                        "file_path_i",
                        model.FilePath
                    );

                    cmd.Parameters.AddWithValue(
                        "user_id_i",
                        (object?)model.UserId ?? DBNull.Value
                    );
                }
            );

            return Content(result, "application/json");
        }

        [HttpPost("get-folder-items")]
        public async Task<IActionResult> GetFolderItems([FromBody] GetFolderItemsRequest model)
        {
            var query = @"SELECT public.get_folder_items(
                        @parent_folder_id_i,
                        @user_id_i,
                        @search_text
                  )";

            var result = await _db.ExecuteScalarAsync<string>(
                query,
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "parent_folder_id_i",
                        (object?)model.ParentFolderId ?? DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "user_id_i",
                        (object?)model.UserId ?? DBNull.Value
                    );
                    cmd.Parameters.AddWithValue(
                        "search_text",
                        (object?)model.SearchText ?? DBNull.Value
                    );
                }
            );

            return Content(result, "application/json");
        }

        [HttpPost("get-folder-list")]
        public async Task<IActionResult> GetFolderList([FromBody] GetFolderItemListRequest model)
        {
            var query = @"SELECT public.get_folder_item_list(
                    @search_text_i,
                    @sort_by_i,
                    @sort_dir_i,
                    @user_id_i
                )";

            var result = await _db.ExecuteScalarAsync<string>(
                query,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("search_text_i",
                        (object?)model.SearchText ?? DBNull.Value);

                    cmd.Parameters.AddWithValue("sort_by_i",
                        model.SortBy ?? "folder_name");

                    cmd.Parameters.AddWithValue("sort_dir_i",
                        model.SortDir ?? "asc");

                    cmd.Parameters.AddWithValue("user_id_i",
                        (object?)model.UserId ?? DBNull.Value);
                }
            );

            return Content(result, "application/json");
        }

        [HttpPost("add-folder")]
        public async Task<IActionResult> AddFolder([FromBody] AddFolderRequest model)
        {

            var query = @"SELECT public.add_folder(
                            @folder_name_i,
                            @parent_folder_id_i,
                            @user_id_i,
                            @folder_visibility_i
                        )";

            var result = await _db.ExecuteScalarAsync<string>(
                query,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("folder_name_i", model.FolderName);
                    cmd.Parameters.AddWithValue("parent_folder_id_i", (object?)model.ParentFolderId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("user_id_i", (object?)model.UserId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("folder_visibility_i", model.FolderVisibility);
                }
            );

            return Content(result, "application/json");
        }
    }
}