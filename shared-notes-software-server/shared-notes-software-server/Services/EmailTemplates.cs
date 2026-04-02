using shared_notes_software_server.Models;

namespace shared_notes_software_server.Services
{
    public static class EmailTemplates
    {
        public static string BuildDownEmailBody(Website site)
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

        public static string BuildRecoveredEmailBody(Website site)
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

    }
}
