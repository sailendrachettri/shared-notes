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

        [HttpGet("list")]
        public async Task<IActionResult> GetNotes()
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
                "SELECT public.get_notes_item_list();"
            );

            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("No data returned from function");

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
