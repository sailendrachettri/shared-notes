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

        [HttpPost("delete-event")]
        public async Task<IActionResult> DeleteEvent(
    [FromBody] DeleteEventRequest request)
        {
            if (request == null || request.EventId <= 0)
                return BadRequest("Invalid event id.");

            try
            {
                var sql = @"
            UPDATE public.utbl_events
            SET 
                is_deleted = TRUE,
                updated_at = NOW()
            WHERE event_id = @event_id
            AND user_id = @user_id
            ";

                var rowsAffected = await _db.ExecuteNonQueryAsync(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("@event_id", request.EventId);
                        cmd.Parameters.AddWithValue("@user_id", request.UserId);
                    });

                if (rowsAffected == 0)
                    return NotFound("Event not found.");

                return Ok(new
                {
                    message = "Workspace deleted successfully.",
                    workspaceId = request.EventId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Something went wrong.",
                    error = ex.Message
                });
            }
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
                e.event_id              AS ""EventId"",
                e.event_category_id     AS ""EventCategoryId"",
                c.event_category_name   AS ""EventCategoryName"",
                e.event_title           AS ""EventTitle"",
                e.user_id               AS ""UserId"",
                e.event_time            AS ""EventTime"",
                e.event_date            AS ""EventDate"",
                e.is_deleted            AS ""IsDeleted"",
                e.created_at            AS ""CreatedAt"",
                e.updated_at            AS ""UpdatedAt""
            FROM public.utbl_events e
            LEFT JOIN public.utbl_mst_events_category c
                ON e.event_category_id = c.event_category_id
            WHERE e.user_id = @user_id_i
            AND e.is_deleted = false
            AND e.event_date >= CURRENT_DATE - INTERVAL '15 days'
            AND (
                  @event_category_id_i  = 9999
                  OR e.event_category_id = @event_category_id_i
                )
            ORDER BY e.event_date, e.event_time;
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