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
        private readonly EncryptionService _encryption;

        public NotesController(DbHelper db, EncryptionService encryption)
        {
            _db = db;
            _encryption = encryption;
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

            // Deserialize to dynamic object
            var note = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonResult);

            // Decrypt notes_details
            if (note != null && note.ContainsKey("notes_details") && note["notes_details"] != null)
            {
                note["notes_details"] = _encryption.Decrypt(note["notes_details"].ToString());
            }

            return Ok(note);
        }





        [HttpPost("add-update")]
        public async Task<IActionResult> AddNote([FromBody] AddUpdateNotesModelRequest request)
        {
            // Encrypt HTML before saving
            if (!string.IsNullOrEmpty(request.NotesDetails))
            {
                request.NotesDetails = _encryption.Encrypt(request.NotesDetails);
            }

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
