using Microsoft.Extensions.Hosting;
using Npgsql;
using shared_notes_software_server.Models;
using System.Diagnostics;

public class WebsiteMonitorService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly HttpClient _httpClient;

    public WebsiteMonitorService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;

        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(10) // ✅ important
        };
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DbHelper>();

            var sites = await db.ExecuteQueryListAsync<Website>(
                "SELECT * FROM utbl_websites"
            );

            foreach (var site in sites)
            {
                await CheckWebsite(site, db, stoppingToken);
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task CheckWebsite(Website site, DbHelper db, CancellationToken token)
    {
        try
        {
            var sw = Stopwatch.StartNew();

            var response = await _httpClient.GetAsync(site.Url, token);

            sw.Stop();

            var isUp = response.IsSuccessStatusCode;

            await UpdateStatus(db, site.Up_Time_Id, isUp, (int)sw.ElapsedMilliseconds);
        }
        catch
        {
            await UpdateStatus(db, site.Up_Time_Id, false, 0);
        }
    }

    private async Task UpdateStatus(DbHelper db, long id, bool status, int responseTime)
    {
        string query = @"
            UPDATE utbl_websites
            SET last_status = @status,
                last_checked_at = @checkedAt,
                response_time_ms = @responseTime
            WHERE up_time_id = @up_time_id";

        await db.ExecuteNonQueryAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("status", status);
            cmd.Parameters.AddWithValue("checkedAt", DateTime.UtcNow);
            cmd.Parameters.AddWithValue("responseTime", responseTime);
        });
    }
}