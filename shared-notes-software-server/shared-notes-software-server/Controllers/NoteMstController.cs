using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;
using System.Text.Json;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/mst-note")]
    public class NoteMstController : ControllerBase
    {
        private readonly DbHelper _db;

        public NoteMstController(DbHelper db)
        {
            _db = db;
        }

        [HttpPost("list")]
        public async Task<IActionResult> GetNotes([FromBody] GetNoteRequest request)
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.get_notes_item_list(@search_text, @sort_by, @sort_dir, @user_id);",
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

        [HttpPost("rename")]
        public async Task<IActionResult> DeleteNote([FromBody] RenameNoteRequest request)
        {
            if (request.NoteId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_notes
          SET note_title = @note_title,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE note_id = @note_id
          RETURNING json_build_object(
              'success', true,
              'note_id', note_id,
              'status', 'UPDATED',
              'message', 'Note title updated successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("note_title", request.NoteTitle);
                    cmd.Parameters.AddWithValue("note_id", request.NoteId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }

        [HttpPost("change-cover-image")]
        public async Task<IActionResult> ChangeCoverImage([FromBody] ChangeCoverImageRequest request)
        {
            if (request.NoteId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_notes
          SET cover_image = @cover_image,
                remove_cover = false,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE note_id = @note_id
          RETURNING json_build_object(
              'success', true,
              'note_id', note_id,
              'status', 'UPDATED',
              'message', 'Cover Image updated successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("cover_image", request.CoverImage);
                    cmd.Parameters.AddWithValue("note_id", request.NoteId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }

        
        [HttpPost("change-cover-icon")]
        public async Task<IActionResult> ChangeCoverIcon([FromBody] ChangeCoverIconRequest request)
        {
            if (request.NoteId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_notes
          SET cover_icon = @cover_icon,
                remove_icon = false,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE note_id = @note_id
          RETURNING json_build_object(
              'success', true,
              'note_id', note_id,
              'status', 'UPDATED',
              'message', 'Cover Icon updated successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("cover_icon", request.CoverIcon);
                    cmd.Parameters.AddWithValue("note_id", request.NoteId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }

        [HttpPost("remove-cover-image")]
        public async Task<IActionResult> RemoveCoverImage([FromBody] RemoveCoverImageRequest request)
        {
            if (request.NoteId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_notes
                SET remove_cover = true,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE note_id = @note_id
          RETURNING json_build_object(
              'success', true,
              'note_id', note_id,
              'status', 'UPDATED',
              'message', 'Cover Image removed successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("note_id", request.NoteId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }
        [HttpPost("remove-cover-icon")]
        public async Task<IActionResult> RemoveCoverIcon([FromBody] RemoveCoverIconRequest request)
        {
            if (request.NoteId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_notes
                SET remove_icon = true,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE note_id = @note_id
          RETURNING json_build_object(
              'success', true,
              'note_id', note_id,
              'status', 'UPDATED',
              'message', 'Cover Icon removed successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("note_id", request.NoteId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }


        [HttpPost("delete")]
        public async Task<IActionResult> DeleteNote([FromBody] DeleteNoteRequest request)
        {
            if (request.NoteOrSubPageId <= 0 || string.IsNullOrWhiteSpace(request.NoteType))
                return BadRequest("Invalid request");

            string sql = string.Empty;
            string paramName = string.Empty;

            if (request.NoteType == "mst-note")
            {
                sql = @"
            UPDATE public.utbl_mst_notes
            SET is_deleted = TRUE,
                updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
            WHERE note_id = @id
            RETURNING json_build_object(
                'success', true,
                'type', 'mst-note',
                'id', note_id,
                'status', 'DELETED',
                'message', 'Note deleted successfully'
            );
        ";

                paramName = "note_id";
            }
            else if (request.NoteType == "sub-page")
            {
                sql = @"
            UPDATE public.utbl_mst_sub_pages
            SET is_deleted = TRUE,
                updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
            WHERE sub_page_id = @id
            RETURNING json_build_object(
                'success', true,
                'type', 'sub-page',
                'id', sub_page_id,
                'status', 'DELETED',
                'message', 'Sub page deleted successfully'
            );
        ";

                paramName = "sub_page_id";
            }
            else
            {
                return BadRequest("Invalid NoteType. Allowed: mst-note, sub-page");
            }

            try
            {
                var jsonResult = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("id", request.NoteOrSubPageId);
                    }
                );

                if (string.IsNullOrEmpty(jsonResult))
                    return NotFound("Item not found or already deleted");

                return Content(jsonResult, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error",
                    error = ex.Message
                });
            }
        }





        [HttpPost("add")]
        public async Task<IActionResult> AddNote([FromBody] AddNoteRequest request)
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.add_note_item(@note_title_i, @user_id_i)",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("note_title_i", request.NoteTitle);
                    cmd.Parameters.AddWithValue("user_id_i", request.UserId ?? (object)DBNull.Value);
                });

            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("Function returned null");

            var result = JsonSerializer.Deserialize<object>(jsonResult);

            return Ok(result);
        }


    }
}
