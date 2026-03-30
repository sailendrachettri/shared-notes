using Microsoft.AspNetCore.Mvc;
using Npgsql;
using shared_notes_software_server.Models;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/uptime")]
    public class UpTimeController : ControllerBase
    {
        private readonly DbHelper _db;

        public UpTimeController(DbHelper db)
        {
            _db = db;
        }

        // ✅ GET ALL WEBSITES
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            string query = "SELECT * FROM utbl_websites ORDER BY site_name";

            var sites = await _db.ExecuteQueryListAsync<Website>(query);

            return Ok(sites);
        }

        // ✅ UPDATE STATUS (used by your background service)
        [HttpPost("update-status")]
        public async Task<IActionResult> UpdateStatus(
            long id,
            bool status,
            int responseTime
        )
        {
            string query = @"
                UPDATE utbl_websites
                SET last_status = @status,
                    last_checked_at = @checkedAt,
                    response_time_ms = @responseTime
                WHERE id = @id";

            await _db.ExecuteNonQueryAsync(query, cmd =>
            {
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("status", status);
                cmd.Parameters.AddWithValue("checkedAt", DateTime.UtcNow);
                cmd.Parameters.AddWithValue("responseTime", responseTime);
            });

            return Ok();
        }
    }
}