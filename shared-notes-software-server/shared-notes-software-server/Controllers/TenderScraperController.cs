using Microsoft.AspNetCore.Mvc;
using shared_notes_software_server.Models;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/tenders")]
    public class TenderController : ControllerBase
    {
        private readonly TenderScraperService _scraper;
        private readonly TenderService _service;
        private readonly DbHelper _db;
        private readonly TenderDetailService _detailService; 

        public TenderController(
            TenderScraperService scraper,
            TenderService service,
            DbHelper db,
            TenderDetailService detailService) 
        {
            _scraper = scraper;
            _service = service;
            _db = db;
            _detailService = detailService;
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetDetails(string id)
        {
            var result = await _detailService.GetTenderDetails(id);

            if (result == null)
                return NotFound(new
                {
                    message = $"Tender '{id}' not found.",
                    hint = "The tender may have expired or been withdrawn from the portal."
                });

            Response.Headers["Cache-Control"] = "no-store";
            return Ok(result);
        }

        // Directly view in official portal fron the client
        [HttpGet("redirect/{id}")]
        public async Task<IActionResult> RedirectToOfficial(string id)
        {
            var url = await _detailService.GetLiveSessionUrl(id);

            if (url == null)
                return NotFound(new { message = $"Could not generate session URL for tender '{id}'" });

            // 302 redirect — browser follows immediately while session is still alive
            return Redirect(url);
        }

        // For testing in Swagger — returns the session URL as JSON
        [HttpGet("session-url/{id}")]
        public async Task<IActionResult> GetSessionUrl(string id)
        {
            var url = await _detailService.GetLiveSessionUrl(id);

            if (url == null)
                return NotFound(new { message = $"Could not generate session URL for '{id}'" });

            return Ok(new
            {
                tenderId = id,
                sessionUrl = url,
                note = "Open this URL in your browser immediately — expires in ~20 minutes"
            });
        }


        // 🔄 manual trigger (for testing)
        [HttpPost("sync")]
        public async Task<IActionResult> Sync()
        {
            var tenders = await _scraper.FetchTenders();
            await _service.SaveTenders(tenders);

            return Ok(new { count = tenders.Count });
        }

        // 📥 get latest
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest()
        {
            var query = @"
            SELECT * FROM utbl_tenders
            ORDER BY created_at DESC
            LIMIT 20;
        ";

            var data = await _db.ExecuteQueryListAsync<TenderDto>(query);

            return Ok(data);
        }

        // 🔍 filter by tag
        [HttpGet("by-tag")]
        public async Task<IActionResult> GetByTag([FromQuery] string tag)
        {
            var query = @"
            SELECT * FROM utbl_tenders
            WHERE @tag = ANY(tags)
            ORDER BY created_at DESC;
        ";

            var data = await _db.ExecuteQueryListAsync<TenderDto>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("tag", tag);
            });

            return Ok(data);
        }
    }
}
