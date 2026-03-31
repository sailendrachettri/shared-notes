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
        [HttpPost("get-all")]
        public async Task<IActionResult> Search([FromBody] WebsiteSearchRequest request)
        {
            int offset = (request.PageNo - 1) * request.PageSize;

            string query = @"
        SELECT *
        FROM utbl_websites
        WHERE (
                @search::text IS NULL
                OR site_name ILIKE '%' || @search || '%'
                OR url ILIKE '%' || @search || '%'
            )
        ORDER BY site_name
        LIMIT @limit OFFSET @offset;
    ";

            string countQuery = @"
        SELECT COUNT(*)
        FROM utbl_websites
        WHERE (
                @search::text IS NULL
                OR site_name ILIKE '%' || @search || '%'
                OR url ILIKE '%' || @search || '%'
            );
    ";

            Action<NpgsqlCommand> paramBuilder = cmd =>
            {
                cmd.Parameters.AddWithValue("@search",
                    string.IsNullOrWhiteSpace(request.SearchText)
                        ? (object)DBNull.Value
                        : request.SearchText);

                cmd.Parameters.AddWithValue("@limit", request.PageSize);
                cmd.Parameters.AddWithValue("@offset", offset);
            };

            var sites = await _db.ExecuteQueryListAsync<Website>(query, paramBuilder);
            long totalCount = await _db.ExecuteScalarAsync<long>(countQuery, paramBuilder);

            return Ok(new
            {
                data = sites,
                totalCount = totalCount,
                pageNo = request.PageNo,
                pageSize = request.PageSize
            });
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