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

        [HttpGet("get-events")]
        public async Task<IActionResult> GetEvents(
    [FromQuery] Guid userId,
    [FromQuery] long? eventCategoryId)
        {
            if (userId == Guid.Empty)
                return BadRequest(new { success = false, message = "UserId is required" });

            string sql = @"
        SELECT 
            event_id        AS ""EventId"",
            event_category_id AS ""EventCategoryId"",
            event_title     AS ""EventTitle"",
            user_id         AS ""UserId"",
            event_time      AS ""EventTime"",
            event_date      AS ""EventDate"",
            is_deleted      AS ""IsDeleted"",
            created_at      AS ""CreatedAt"",
            updated_at      AS ""UpdatedAt""
        FROM public.utbl_events
        WHERE user_id = @user_id_i
        AND is_deleted = false
        AND (@event_category_id_i IS NULL 
             OR event_category_id = @event_category_id_i)
        ORDER BY event_date, event_time;
    ";

            var events = await _db.ExecuteQueryListAsync<EventResponseDTO>(
                sql,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("user_id_i", NpgsqlDbType.Uuid, userId);

                    if (eventCategoryId.HasValue)
                        cmd.Parameters.AddWithValue(
                            "event_category_id_i",
                            NpgsqlDbType.Bigint,
                            eventCategoryId.Value
                        );
                    else
                        cmd.Parameters.AddWithValue(
                            "event_category_id_i",
                            DBNull.Value
                        );
                }
            );

            // 🔐 Decrypt titles after fetching
            foreach (var ev in events)
            {
                ev.EventTitle = EncryptionHelper.Decrypt(ev.EventTitle);
            }

            return Ok(new
            {
                success = true,
                status = "FETCHED",
                data = events
            });
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