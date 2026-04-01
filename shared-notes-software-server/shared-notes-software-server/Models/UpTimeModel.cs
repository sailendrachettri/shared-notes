namespace shared_notes_software_server.Models
{
    public class UpTimeModel
    {
    }
    public class WebsiteSearchRequest
    {
        public string? SearchText { get; set; }
        public int PageNo { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
    public class Website
    {
        public long Up_Time_Id { get; set; }
        public string Site_Name { get; set; }
        public string Url { get; set; }
        public bool? Last_Status { get; set; }
        public DateTime? Last_Checked_At { get; set; }
        public int? Response_Time_Ms { get; set; }
        public bool? Alert_Sent { get; set; }
        public bool? Ssl_Valid { get; set; }
        public DateTime? Ssl_Expires_At { get; set; }
    }
    public class AlertEmail
    {
        public string Email { get; set; } = "";
    }
}
