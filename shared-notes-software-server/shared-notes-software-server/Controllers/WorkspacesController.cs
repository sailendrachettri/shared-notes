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

        [HttpPost("rename-workspace")]
        public async Task<IActionResult> RenameWorkspace(
    [FromBody] RenameWorkspaceRequest request)
        {
            if (request == null || request.WorkspaceId <= 0)
                return BadRequest("Invalid workspace id.");

            try
            {
                var sql = @"
            UPDATE public.utbl_workspaces
            SET 
                workspace_name = @workspaceName,
                updated_at = NOW()
            WHERE workspace_id = @workspaceId;";

                var rowsAffected = await _db.ExecuteNonQueryAsync(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("@workspaceId", request.WorkspaceId);
                        cmd.Parameters.AddWithValue("@workspaceName", request.WorkspaceName);
                    });

                if (rowsAffected == 0)
                    return NotFound("Workspace not found.");

                return Ok(new
                {
                    message = "Workspace name updated successfully.",
                    workspaceId = request.WorkspaceId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Something went wrong.",
                    error = ex.Message
                });
            }
        }

        [HttpPost("delete-workspace-task")]
        public async Task<IActionResult> DeleteWorkspaceTask(
    [FromBody] DeleteWorkspaceTaskRequest request)
        {
            if (request == null || request.WorkspaceTaskId <= 0)
                return BadRequest("Invalid workspace id.");

            try
            {
                var sql = @"
            DELETE FROM public.utbl_workspace_tasks
            WHERE workspace_task_id = @workspaceTaskId;";

                var rowsAffected = await _db.ExecuteNonQueryAsync(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("@workspaceTaskId", request.WorkspaceTaskId);
                    });

                if (rowsAffected == 0)
                    return NotFound("Workspace task not found.");

                return Ok(new
                {
                    status = "DELETED",
                    success = true,
                    message = "Workspace task deleted successfully.",
                    WorkspaceTaskId = request.WorkspaceTaskId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Something went wrong.",
                    error = ex.Message
                });
            }
        }
        [HttpPost("delete-workspace")]
        public async Task<IActionResult> DeleteWorkspace(
    [FromBody] DeleteWorkspaceRequest request)
        {
            if (request == null || request.WorkspaceId <= 0)
                return BadRequest("Invalid workspace id.");

            try
            {
                var sql = @"
            UPDATE public.utbl_workspaces
            SET 
                is_deleted = TRUE,
                updated_at = NOW()
            WHERE workspace_id = @workspaceId;";

                var rowsAffected = await _db.ExecuteNonQueryAsync(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("@workspaceId", request.WorkspaceId);
                    });

                if (rowsAffected == 0)
                    return NotFound("Workspace not found.");

                return Ok(new
                {
                    message = "Workspace deleted successfully.",
                    workspaceId = request.WorkspaceId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Something went wrong.",
                    error = ex.Message
                });
            }
        }



        [HttpPut("update-workspace-task-position")]
        public async Task<IActionResult> UpdateWorkspaceTaskPosition(
    [FromBody] UpdateWorkspaceTaskPositionRequest request)
        {
            if (request?.Updates == null || !request.Updates.Any())
                return BadRequest(new
                {
                    success = false,
                    message = "No updates provided"
                });

            try
            {
                var sql = @"
            UPDATE public.utbl_workspace_tasks t
            SET
                workspace_column_id = v.workspace_column_id,
                task_position = v.task_position,
                updated_at = NOW()
            FROM (
                VALUES ";

                var parameters = new List<string>();
                int index = 0;

                foreach (var u in request.Updates)
                {
                    parameters.Add(
                        $"(@taskId{index}, @colId{index}, @pos{index})"
                    );
                    index++;
                }

                sql += string.Join(",", parameters);

                sql += @"
            ) AS v(workspace_task_id, workspace_column_id, task_position)
            WHERE t.workspace_task_id = v.workspace_task_id;
        ";

                await _db.ExecuteNonQueryAsync(sql, cmd =>
                {
                    for (int i = 0; i < request.Updates.Count; i++)
                    {
                        var u = request.Updates[i];

                        cmd.Parameters.AddWithValue($"taskId{i}", u.WorkspaceTaskId);
                        cmd.Parameters.AddWithValue($"colId{i}", u.WorkspaceColumnId);
                        cmd.Parameters.AddWithValue($"pos{i}", u.TaskPosition);
                    }
                });

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("add-workspace-task")]
        public async Task<IActionResult> AddNote([FromBody] AddWorkspaceTaskRequest request)
        {

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.add_workspace_task(@workspace_id, @workspace_column_id, @title, @priority_id)",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("workspace_id", request.WorkspaceId);
                    cmd.Parameters.AddWithValue("workspace_column_id", request.WorkspaceColumnId);
                    cmd.Parameters.AddWithValue("title", request.Title);
                    cmd.Parameters.AddWithValue("priority_id", request.PriorityId);
                });

            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("Function returned null");

            var result = JsonSerializer.Deserialize<object>(jsonResult);

            return Ok(result);
        }

        [HttpPost("get-workspace-details")]
        public async Task<IActionResult> GetWorkspaceDetails(
            [FromBody] GetWorkspaceDetailsRequest request)
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.get_workspace_details_by_id(@workspace_id);",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("workspace_id", request.WorkspaceId);
                });

            return Content(jsonResult, "application/json");
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
