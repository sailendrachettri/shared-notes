using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;
using System.Text.Json;

namespace shared_notes_software_server.Controllers
{

    [ApiController]
    [Route("api/v1/sub-page")]
    public class NoteMstSubPageController : ControllerBase
    {
        private readonly DbHelper _db;

        public NoteMstSubPageController(DbHelper db)
        {
            _db = db;
        }

        [HttpPost("rename")]
        public async Task<IActionResult> RenameNote([FromBody] RenameSupPageModel request)
        {
            if (request.SubPageId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_sub_pages
                   SET sub_page_title = @subpage_title,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE sub_page_id = @sub_page_id
          RETURNING json_build_object(
              'success', true,
              'sub_page_id', sub_page_id,
              'status', 'UPDATED',
              'message', 'Note title updated successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("subpage_title", request.SupPageTitle);
                    cmd.Parameters.AddWithValue("sub_page_id", request.SubPageId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }


        [HttpPost("change-cover-image")]
        public async Task<IActionResult> ChangeCoverImage([FromBody] ChangeCoverImageSubPageModel request)
        {
            if (request.SubPageId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_sub_pages
                   SET cover_image = @cover_image,
                        remove_cover = false,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE sub_page_id = @sub_page_id
          RETURNING json_build_object(
              'success', true,
              'sub_page_id', sub_page_id,
              'status', 'UPDATED',
              'message', 'Cover image updated successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("cover_image", request.CoverImage);
                    cmd.Parameters.AddWithValue("sub_page_id", request.SubPageId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }


        [HttpPost("change-cover-icon")]
        public async Task<IActionResult> ChangeCoverIcon([FromBody] ChangeCoverIconSubPageModel request)
        {
            if (request.SubPageId <= 0)
                return BadRequest("Invalid NoteId");

            var jsonResult = await _db.ExecuteScalarAsync<string>(
                @"UPDATE public.utbl_mst_sub_pages
                   SET cover_icon = @cover_icon,
                        remove_icon = false,
              updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'
          WHERE sub_page_id = @sub_page_id
          RETURNING json_build_object(
              'success', true,
              'sub_page_id', sub_page_id,
              'status', 'UPDATED',
              'message', 'Cover icon updated successfully'
          );",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("cover_icon", request.CoverIcon);
                    cmd.Parameters.AddWithValue("sub_page_id", request.SubPageId);
                }
            );

            if (string.IsNullOrEmpty(jsonResult))
                return NotFound("Note not found or already deleted");

            return Content(jsonResult, "application/json");
        }

        [HttpPost("add-sub-page")]
        public async Task<IActionResult> AddNote([FromBody] AddNoteMstSubPageModel request)
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
             "SELECT public.add_sub_page_item(@sub_page_title_i, @note_id_i)",
             cmd =>
             {
                 cmd.Parameters.AddWithValue("sub_page_title_i", request.SubPageTitle);
                 cmd.Parameters.AddWithValue("note_id_i", request.NoteId);
             });


            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("Function returned null");

            var result = JsonSerializer.Deserialize<object>(jsonResult);

            return Ok(result);
        }

    }
}
