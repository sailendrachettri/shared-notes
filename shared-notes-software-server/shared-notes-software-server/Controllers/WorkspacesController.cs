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
