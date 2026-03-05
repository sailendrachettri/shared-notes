using Microsoft.AspNetCore.Mvc;
using Npgsql;
using shared_notes_software_server.Data;
using shared_notes_software_server.Models;
using System.Text.Json;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/reports")]
    public class DashboardController : ControllerBase
    {
        private readonly DbHelper _db;

        public DashboardController(DbHelper db)
        {
            _db = db;
        }

        [HttpGet("user/dashboard/{userId}")]
        public async Task<ActionResult<DashboardReportModel>> GetDashboardReport(Guid userId)
        {
            try
            {
                var jsonResult = await _db.ExecuteScalarAsync<string>(
                    "SELECT public.get_user_dashboard_report(@user_id_i::uuid)",
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("user_id_i",
                            NpgsqlTypes.NpgsqlDbType.Uuid, userId);
                    }
                );

                if (string.IsNullOrWhiteSpace(jsonResult))
                    return NotFound("Dashboard report not found");

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var report = JsonSerializer.Deserialize<DashboardReportModel>(jsonResult, options);

                // DECRYPT UPCOMING EVENTS TITLES
                if (report?.UpcomingEvents != null)
                {
                    foreach (var ev in report.UpcomingEvents)
                    {
                        if (!string.IsNullOrWhiteSpace(ev.EventName))
                        {
                            ev.EventName = EncryptionHelper.Decrypt(ev.EventName);
                        }
                    }
                }

                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
    
}