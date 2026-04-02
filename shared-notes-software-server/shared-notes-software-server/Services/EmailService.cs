using System.Net;
using System.Net.Mail;

public class EmailService
{
    private readonly string _fromEmail = Environment.GetEnvironmentVariable("EMAIL_FROM");
    private readonly string _appPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");

    public async Task SendAlertAsync(string toEmail, string subject, string body)
    {
        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(_fromEmail, _appPassword),
            EnableSsl = true,
        };

        var mail = new MailMessage
        {
            From = new MailAddress(_fromEmail),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mail.To.Add(toEmail);

        await smtpClient.SendMailAsync(mail);
    }
}