using Microsoft.AspNetCore.Mvc;
using Npgsql;
using shared_notes_software_server.Models;
using shared_notes_software_server.Data;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/file-storage")]
    public class FileStorageController : ControllerBase
    {
        private readonly DbHelper _db;

        public FileStorageController(DbHelper db)
        {
            _db = db;
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
                        @user_id_i
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