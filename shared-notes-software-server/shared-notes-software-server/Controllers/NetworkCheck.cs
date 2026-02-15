using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/network")]
    public class NetworkCheck : ControllerBase
    {
        private readonly DbHelper _db;

        public NetworkCheck(DbHelper db)
        {
            _db = db;
        }

        /* This api is to check the whethere the server / database is up or not 
         * If both up then will get the data 
         * this api can be anthing
         */
        [HttpPost("check")]
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
    }
}
