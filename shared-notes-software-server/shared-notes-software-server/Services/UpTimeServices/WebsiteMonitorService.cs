using Microsoft.Extensions.Hosting;
using Npgsql;
using shared_notes_software_server.Models;
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
            return (false, false, null); // HTTP site — no SSL at all

        try
        {
            var uri = new Uri(url);

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));
            using var tcpClient = new System.Net.Sockets.TcpClient();

            await tcpClient.ConnectAsync(uri.Host, 443, cts.Token);

            using var sslStream = new SslStream(tcpClient.GetStream(), false,
                (sender, cert, chain, errors) => true); // Accept any cert to inspect it

            await sslStream.AuthenticateAsClientAsync(uri.Host);

            var cert = sslStream.RemoteCertificate as X509Certificate2
                       ?? new X509Certificate2(sslStream.RemoteCertificate!);

            var expiresAt = cert.NotAfter.ToUniversalTime();
            bool sslValid = expiresAt > DateTime.UtcNow && sslStream.IsAuthenticated;

            return (true, sslValid, expiresAt);
        }
        catch
        {
            // HTTPS but SSL handshake failed
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

    private static string BuildDownEmailBody(Website site)
    {
        return $@"
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
  <title>Website Down Alert</title>
</head>
<body style='margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;'>

  <!-- Wrapper -->
  <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f6f9;padding:40px 0;'>
    <tr>
      <td align='center'>
        <table width='600' cellpadding='0' cellspacing='0' style='background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>

          <!-- Header -->
          <tr>
            <td style='background-color:#dc2626;padding:32px 40px;text-align:center;'>
              <p style='margin:0;font-size:13px;color:#fecaca;letter-spacing:2px;text-transform:uppercase;font-weight:600;'>Shared Notes</p>
              <h1 style='margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:700;letter-spacing:0.5px;'>UpTime Monitor</h1>
            </td>
          </tr>

          <!-- Alert Badge -->
          <tr>
            <td style='padding:36px 40px 0;text-align:center;'>
              <div style='display:inline-block;background-color:#fef2f2;border:2px solid #fca5a5;border-radius:50px;padding:10px 28px;'>
                <span style='color:#dc2626;font-weight:700;font-size:15px;'>🔴 &nbsp;OUTAGE DETECTED</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style='padding:28px 40px 0;'>
              <p style='margin:0 0 6px;font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:600;'>Affected Site</p>
              <h2 style='margin:0 0 24px;font-size:26px;font-weight:700;color:#111827;'>{site.Site_Name}</h2>
            </td>
          </tr>

          <!-- Detail Cards -->
          <tr>
            <td style='padding:0 40px;'>
              <table width='100%' cellpadding='0' cellspacing='0'>

                <tr>
                  <td style='background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:12px;'>
                    <p style='margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;'>URL</p>
                    <p style='margin:0;font-size:14px;color:#2563eb;font-weight:500;'>{site.Url}</p>
                  </td>
                </tr>

                <tr><td style='height:10px;'></td></tr>

                <tr>
                  <td style='background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;'>
                    <p style='margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;'>Detected At</p>
                    <p style='margin:0;font-size:14px;color:#111827;font-weight:500;'>{DateTime.UtcNow:dddd, MMMM dd yyyy — HH:mm:ss} UTC</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Status Bar -->
          <tr>
            <td style='padding:28px 40px 0;'>
              <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#fef2f2;border-left:4px solid #dc2626;border-radius:6px;'>
                <tr>
                  <td style='padding:14px 18px;'>
                    <p style='margin:0;font-size:13px;color:#b91c1c;'>
                      Our monitoring system detected that <strong>{site.Site_Name}</strong> is currently <strong>unreachable</strong>. 
                      We'll notify you immediately once the site is back online.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style='padding:32px 40px 0;'>
              <hr style='border:none;border-top:1px solid #e5e7eb;margin:0;'/>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style='padding:24px 40px 36px;text-align:center;'>
              <p style='margin:0 0 4px;font-size:12px;color:#9ca3af;'>This is an automated alert from</p>
              <p style='margin:0;font-size:13px;color:#6b7280;font-weight:600;'>Shared Notes — UpTime Monitor</p>
              <p style='margin:12px 0 0;font-size:11px;color:#d1d5db;'>You're receiving this because you're registered as an alert contact.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>";
    }

    private static string BuildRecoveredEmailBody(Website site)
    {
        return $@"
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
  <title>Website Recovered</title>
</head>
<body style='margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;'>

  <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f6f9;padding:40px 0;'>
    <tr>
      <td align='center'>
        <table width='600' cellpadding='0' cellspacing='0' style='background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>

          <!-- Header -->
          <tr>
            <td style='background-color:#16a34a;padding:32px 40px;text-align:center;'>
              <p style='margin:0;font-size:13px;color:#bbf7d0;letter-spacing:2px;text-transform:uppercase;font-weight:600;'>Shared Notes</p>
              <h1 style='margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:700;letter-spacing:0.5px;'>UpTime Monitor</h1>
            </td>
          </tr>

          <!-- Alert Badge -->
          <tr>
            <td style='padding:36px 40px 0;text-align:center;'>
              <div style='display:inline-block;background-color:#f0fdf4;border:2px solid #86efac;border-radius:50px;padding:10px 28px;'>
                <span style='color:#16a34a;font-weight:700;font-size:15px;'>🟢 &nbsp;SITE RECOVERED</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style='padding:28px 40px 0;'>
              <p style='margin:0 0 6px;font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:600;'>Recovered Site</p>
              <h2 style='margin:0 0 24px;font-size:26px;font-weight:700;color:#111827;'>{site.Site_Name}</h2>
            </td>
          </tr>

          <!-- Detail Cards -->
          <tr>
            <td style='padding:0 40px;'>
              <table width='100%' cellpadding='0' cellspacing='0'>

                <tr>
                  <td style='background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;'>
                    <p style='margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;'>URL</p>
                    <p style='margin:0;font-size:14px;color:#2563eb;font-weight:500;'>{site.Url}</p>
                  </td>
                </tr>

                <tr><td style='height:10px;'></td></tr>

                <tr>
                  <td style='background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;'>
                    <p style='margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;'>Recovered At</p>
                    <p style='margin:0;font-size:14px;color:#111827;font-weight:500;'>{DateTime.UtcNow:dddd, MMMM dd yyyy — HH:mm:ss} UTC</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Status Bar -->
          <tr>
            <td style='padding:28px 40px 0;'>
              <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f0fdf4;border-left:4px solid #16a34a;border-radius:6px;'>
                <tr>
                  <td style='padding:14px 18px;'>
                    <p style='margin:0;font-size:13px;color:#15803d;'>
                      <strong>{site.Site_Name}</strong> has fully recovered and is now <strong>responding normally</strong>. 
                      No further action is required.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style='padding:32px 40px 0;'>
              <hr style='border:none;border-top:1px solid #e5e7eb;margin:0;'/>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style='padding:24px 40px 36px;text-align:center;'>
              <p style='margin:0 0 4px;font-size:12px;color:#9ca3af;'>This is an automated alert from</p>
              <p style='margin:0;font-size:13px;color:#6b7280;font-weight:600;'>Shared Notes — UpTime Monitor</p>
              <p style='margin:12px 0 0;font-size:11px;color:#d1d5db;'>You're receiving this because you're registered as an alert contact.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>";
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

    

    private async Task HandleAlert(Website site, bool isUp, DbHelper db, List<string> alertEmails)
    {
        if (alertEmails == null || alertEmails.Count == 0) return;

        var emailService = new EmailService();

        // CASE 1: DOWN
        if (!isUp && site.Last_Status == true && site.Alert_Sent == false)
        {
            var subject = $"🔴 [{site.Site_Name}] Outage Detected — Shared Notes UpTime Monitor";
            var body = BuildDownEmailBody(site);

            foreach (var email in alertEmails)
                await emailService.SendAlertAsync(email, subject, body);

            await UpdateAlertState(db, site.Up_Time_Id, true);
        }

        // CASE 2: RECOVERED
        if (isUp && site.Last_Status == false)
        {
            var subject = $"🟢 [{site.Site_Name}] Site Recovered — Shared Notes UpTime Monitor";
            var body = BuildRecoveredEmailBody(site);

            foreach (var email in alertEmails)
                await emailService.SendAlertAsync(email, subject, body);

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
        cts.CancelAfter(TimeSpan.FromSeconds(20)); // increased timeout

        var sslTask = CheckSslAsync(site.Url);

        var (isUp, responseTime) = await CheckWithRetry(site.Url, cts.Token);

        var (isHttps, sslValid, sslExpiresAt) = await sslTask;

        await HandleAlert(site, isUp, db, alertEmails);

        await UpdateStatus(db, site.Up_Time_Id, isUp, responseTime, sslValid, sslExpiresAt);
    }

    
}