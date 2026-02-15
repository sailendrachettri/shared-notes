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
