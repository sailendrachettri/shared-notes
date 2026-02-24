using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;
using System.Text.Json;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/workspace")]
    public class WorkspacesController : ControllerBase
    {
        private readonly DbHelper _db;

        public WorkspacesController(DbHelper db)
        {
            _db = db;
        }

        [HttpPost("get-workspaces-list")]
        public async Task<IActionResult> GetNotes([FromBody] GetWorspacesRequest request)
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.get_workspace_item_list(@search_text, @sort_by, @sort_dir, @user_id);",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("search_text",
                        request.SearchText ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("sort_by",
                        request.SortBy ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("sort_dir",
                        request.SortDirection ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("user_id",
                        request.UserId ?? (object)DBNull.Value);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("No data returned from function");

            return Content(jsonResult, "application/json");
        }

        [HttpPost("add-workspace")]
        public async Task<IActionResult> AddNote([FromBody] AddWorkspacesRequest request)
        {

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.add_workspace(@user_id, @workspace_name, @is_private)",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("user_id", request.UserId ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("workspace_name", request.WorkspaceName);
                    cmd.Parameters.AddWithValue("is_private", request.IsPrivate);
                });

            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("Function returned null");

            var result = JsonSerializer.Deserialize<object>(jsonResult);

            return Ok(result);
        }
    }
}
