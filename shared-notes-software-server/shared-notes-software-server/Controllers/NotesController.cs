using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;
using System.Text.Json;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/notes")]
    public class NotesController : ControllerBase
    {
        private readonly DbHelper _db;

        public NotesController(DbHelper db)
        {
            _db = db;
        }

        [HttpPost("notes-details")]
public async Task<IActionResult> GetNotes([FromBody] GetNotesModelDTO request)
{
    if (request.NoteId == 0)
        return BadRequest("NoteId is required");

    var jsonResult = await _db.ExecuteScalarAsync<string>(
        "SELECT public.get_notes_by_id(@notes_id_i, @note_id_i);",
        cmd =>
        {
            cmd.Parameters.AddWithValue("notes_id_i", request.NotesId ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("note_id_i", request.NoteId);
        }
    );

    if (string.IsNullOrEmpty(jsonResult))
        return NotFound("No data returned from function");

    return Content(jsonResult, "application/json");
}




        [HttpPost("add-update")]
        public async Task<IActionResult> AddNote([FromBody] AddUpdateNotesModelRequest request)
        {
            var jsonResult = await _db.ExecuteScalarAsync<string>(
             "SELECT public.add_update_notes_details(@notes_details_i, @note_id_i, @notes_id_i)",
             cmd =>
             {
                 cmd.Parameters.AddWithValue("notes_details_i", request.NotesDetails ?? (object)DBNull.Value);
                 cmd.Parameters.AddWithValue("note_id_i", request.NoteId);
                 cmd.Parameters.AddWithValue("notes_id_i", request.NotesId ?? (object)DBNull.Value);
             });


            if (string.IsNullOrEmpty(jsonResult))
                return BadRequest("Function returned null");

            var result = JsonSerializer.Deserialize<object>(jsonResult);

            return Ok(result);
        }
    }
}
