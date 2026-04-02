using Microsoft.Extensions.Hosting;
using Npgsql;
using shared_notes_software_server.Models;
using shared_notes_software_server.Services;
using System.Diagnostics;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

public class WebsiteMonitorService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly HttpClient _httpClient;

    public WebsiteMonitorService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(30)
        };
    }

    private async Task<(bool isHttps, bool sslValid, DateTime? expiresAt)> CheckSslAsync(string url)
    {
        if (!url.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            return (false, false, null);

        try
        {
            var handler = new HttpClientHandler();
            X509Certificate2? cert = null;
            SslPolicyErrors sslErrors = SslPolicyErrors.None;

            handler.ServerCertificateCustomValidationCallback = (req, certificate, chain, errors) =>
            {
                cert = certificate as X509Certificate2;
                sslErrors = errors;
                return true; // allow request
            };

            using var client = new HttpClient(handler);
            client.Timeout = TimeSpan.FromSeconds(30);

            await client.GetAsync(url);

            var expiresAt = cert?.NotAfter.ToUniversalTime();

            bool sslValid = cert != null &&
                            expiresAt > DateTime.UtcNow &&
                            sslErrors == SslPolicyErrors.None;

            return (true, sslValid, expiresAt);
        }
        catch
        {
            return (true, false, null);
        }
    }

    private async Task<(bool isUp, int responseTime)> CheckWithRetry(string url, CancellationToken token)
    {
        int retries = 3;
        int delayMs = 2000;

        for (int attempt = 1; attempt <= retries; attempt++)
        {
            try
            {
                var sw = Stopwatch.StartNew();

                var response = await _httpClient.GetAsync(url, token);

                sw.Stop();

                if (response.IsSuccessStatusCode)
                {
                    return (true, (int)sw.ElapsedMilliseconds);
                }
            }
            catch (TaskCanceledException)
            {
                Debug.WriteLine($"Timeout on {url}, attempt {attempt}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error on {url}, attempt {attempt}: {ex.Message}");
            }

            if (attempt < retries)
                await Task.Delay(delayMs, token);
        }

        return (false, 0); // only after retries fail
    }

    private async Task UpdateStatus(DbHelper db, long id, bool status, int responseTime, bool sslValid, DateTime? sslExpiresAt)
    {
        string query = @"
            UPDATE utbl_websites
            SET last_status      = @status,
                last_checked_at  = @checkedAt,
                response_time_ms = @responseTime,
                ssl_valid        = @sslValid,
                ssl_expires_at   = @sslExpiresAt
            WHERE up_time_id = @up_time_id";

        await db.ExecuteNonQueryAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("up_time_id", id);
            cmd.Parameters.AddWithValue("status", status);
            cmd.Parameters.AddWithValue("checkedAt", DateTime.UtcNow);
            cmd.Parameters.AddWithValue("responseTime", responseTime);
            cmd.Parameters.AddWithValue("sslValid", (object?)sslValid ?? DBNull.Value);
            cmd.Parameters.AddWithValue("sslExpiresAt", (object?)sslExpiresAt ?? DBNull.Value);
        });
    }


    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Wait for network to be ready on boot
        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<DbHelper>();

                var sites = await db.ExecuteQueryListAsync<Website>("SELECT * FROM utbl_websites");
                var alertEmails = await GetAlertEmailsAsync(db);

                foreach (var site in sites)
                {
                    try
                    {
                        await CheckWebsite(site, db, alertEmails, stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"CheckWebsite failed for {site.Url}: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Monitor cycle failed: {ex.Message}");
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



    private async Task HandleAlert(Website site, bool isUp, DbHelper db, List<string> alertEmails)
    {
        if (alertEmails == null || alertEmails.Count == 0) return;

        var emailService = new EmailService();

        if (!isUp && site.Last_Status == true && site.Alert_Sent == false)
        {
            var subject = $"[{site.Site_Name}] Outage Detected — Shared Notes UpTime Monitor";
            var body = EmailTemplates.BuildDownEmailBody(site);

            foreach (var email in alertEmails)
            {
                try { await emailService.SendAlertAsync(email, subject, body); }
                catch (Exception ex) { Debug.WriteLine($"Email failed for {email}: {ex.Message}"); }
            }

            await UpdateAlertState(db, site.Up_Time_Id, true);
        }

        if (isUp && site.Last_Status == false)
        {
            var subject = $"[{site.Site_Name}] Site Recovered — Shared Notes UpTime Monitor";
            var body = EmailTemplates.BuildRecoveredEmailBody(site);

            foreach (var email in alertEmails)
            {
                try { await emailService.SendAlertAsync(email, subject, body); }
                catch (Exception ex) { Debug.WriteLine($"Email failed for {email}: {ex.Message}"); }
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

    private async Task CheckWebsite(Website site, DbHelper db, List<string> alertEmails, CancellationToken token)
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(token);
        cts.CancelAfter(TimeSpan.FromSeconds(30)); // increased timeout

        var sslTask = CheckSslAsync(site.Url);

        var (isUp, responseTime) = await CheckWithRetry(site.Url, cts.Token);

        var (isHttps, sslValid, sslExpiresAt) = await sslTask;

        await HandleAlert(site, isUp, db, alertEmails);

        await UpdateStatus(db, site.Up_Time_Id, isUp, responseTime, sslValid, sslExpiresAt);
    }

    
}