using Microsoft.AspNetCore.Mvc;
using NpgsqlTypes;
using OfficeConnectServer.Helpers;
using shared_notes_software_server.Models;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/events")]
    public class EventsController : ControllerBase
    {
        private readonly DbHelper _db;

        public EventsController(DbHelper db)
        {
            _db = db;
        }

        [HttpPost("add-event")]
        public async Task<IActionResult> AddEvent([FromBody] AddEventsRequest request)
        {
            if (request.UserId == Guid.Empty)
                return BadRequest(new { success = false, message = "UserId is required" });

            if (string.IsNullOrWhiteSpace(request.EventTitle))
                return BadRequest(new { success = false, message = "Event title is required" });

            if (request.EventDate == default)
                return BadRequest(new { success = false, message = "Event date is required" });

            // 🔐 Encrypt Title
            string encryptedTitle = EncryptionHelper.Encrypt(request.EventTitle);

            string sql = @"SELECT public.add_events(
                                @user_id_i,
                                @event_title_i,
                                @event_date_i,
                                @event_category_id_i,
                                @event_time_i
                           );";

            string jsonResult = await _db.ExecuteScalarAsync<string>(
                sql,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("user_id_i", request.UserId);
                    cmd.Parameters.AddWithValue("event_title_i", encryptedTitle);
                    cmd.Parameters.AddWithValue(
                        "event_date_i",
                        NpgsqlDbType.Date,
                        request.EventDate.Date   // forces DATE instead of TIMESTAMP
                    );
                    cmd.Parameters.AddWithValue("event_category_id_i", request.EventCategoryId);

                    if (request.EventTime.HasValue)
                    {
                        cmd.Parameters.AddWithValue(
                            "event_time_i",
                            NpgsqlDbType.Time,    // VERY IMPORTANT
                            request.EventTime.Value
                        );
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("event_time_i", DBNull.Value);
                    }
                }
            );

            return Content(jsonResult, "application/json");
        }
    }
}