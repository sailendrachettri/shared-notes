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
                "SELECT public.get_notes_item_list(@search_text);",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("search_text",
                        request.SearchText ?? (object)DBNull.Value);
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

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteNote([FromBody] DeleteNoteRequest request)
        {
            if (request.NoteId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_notes
          SET is_deleted = TRUE,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE note_id = @note_id
          RETURNING json_build_object(
              'success', true,
              'note_id', note_id,
              'status', 'DELETED',
              'message', 'Note deleted successfully'
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




        [HttpPost("add")]
        public async Task<IActionResult> AddNote([FromBody] AddNoteRequest request)
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.add_note_item(@note_title_i)",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("note_title_i", request.NoteTitle);
                });

            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("Function returned null");

            var result = JsonSerializer.Deserialize<object>(jsonResult);

            return Ok(result);
        }


    }
}
