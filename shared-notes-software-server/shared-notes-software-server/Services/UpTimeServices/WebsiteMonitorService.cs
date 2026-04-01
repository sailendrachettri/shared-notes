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
            Timeout = TimeSpan.FromSeconds(10)
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

            // ✅ Fetch all alert emails ONCE per cycle
            var alertEmails = await GetAlertEmailsAsync(db);

            foreach (var site in sites)
            {
                await CheckWebsite(site, db, alertEmails, stoppingToken);
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    // ✅ Fetch active emails from the new table
    private async Task<List<string>> GetAlertEmailsAsync(DbHelper db)
    {
        var rows = await db.ExecuteQueryListAsync<AlertEmail>(
            "SELECT email FROM utbl_alert_emails WHERE is_active = TRUE"
        );
        return rows.Select(r => r.Email).ToList();
    }

    private async Task CheckWebsite(Website site, DbHelper db, List<string> alertEmails, CancellationToken token)
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(token);
        cts.CancelAfter(TimeSpan.FromSeconds(15));

        bool isUp = false;
        int responseTime = 0;

        try
        {
            var sw = Stopwatch.StartNew();
            var response = await _httpClient.GetAsync(site.Url, cts.Token);
            sw.Stop();

            isUp = response.IsSuccessStatusCode;
            responseTime = (int)sw.ElapsedMilliseconds;
        }
        catch
        {
            isUp = false;
        }

        await HandleAlert(site, isUp, db, alertEmails);
        await UpdateStatus(db, site.Up_Time_Id, isUp, responseTime);
    }

    private async Task HandleAlert(Website site, bool isUp, DbHelper db, List<string> alertEmails)
    {
        if (alertEmails == null || alertEmails.Count == 0) return;

        var emailService = new EmailService();

        // CASE 1: Site just went DOWN and alert not sent yet
        if (!isUp && site.Last_Status == true && site.Alert_Sent == false)
        {
            var subject = $"🔴 Website DOWN: {site.Site_Name}";
            var body = $"<b>{site.Site_Name}</b> is DOWN.<br/>URL: {site.Url}<br/>Time: {DateTime.UtcNow:u}";

            // ✅ Send to ALL recipients
            foreach (var email in alertEmails)
            {
                await emailService.SendAlertAsync(email, subject, body);
            }

            await UpdateAlertState(db, site.Up_Time_Id, true);
        }

        // CASE 2: Site just RECOVERED
        if (isUp && site.Last_Status == false)
        {
            var subject = $"🟢 Website RECOVERED: {site.Site_Name}";
            var body = $"<b>{site.Site_Name}</b> is back UP.<br/>URL: {site.Url}<br/>Time: {DateTime.UtcNow:u}";

            // ✅ Send to ALL recipients
            foreach (var email in alertEmails)
            {
                await emailService.SendAlertAsync(email, subject, body);
            }

            await UpdateAlertState(db, site.Up_Time_Id, false);
        }
    }

    private async Task UpdateAlertState(DbHelper db, long id, bool alertSent)
    {
        string query = @"
            UPDATE utbl_websites
            SET alert_sent = @alertSent,
                last_alert_sent_at = @time
            WHERE up_time_id = @id";

        await db.ExecuteNonQueryAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("alertSent", alertSent);
            cmd.Parameters.AddWithValue("time", DateTime.UtcNow);
        });
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
            cmd.Parameters.AddWithValue("up_time_id", id);
            cmd.Parameters.AddWithValue("status", status);
            cmd.Parameters.AddWithValue("checkedAt", DateTime.UtcNow);
            cmd.Parameters.AddWithValue("responseTime", responseTime);
        });
    }
}