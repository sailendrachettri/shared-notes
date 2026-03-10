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
                    cmd.Parameters.AddWithValue("user_id_i", model.UserId);
                    cmd.Parameters.AddWithValue("folder_visibility_i", model.FolderVisibility);
                }
            );

            return Content(result, "application/json");
        }
    }
}