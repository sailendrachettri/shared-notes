namespace shared_notes_software_server.Models
{
    public class UpTimeModel
    {
    }
    public class Website
    {
        public long Up_Time_Id { get; set; }
        public string Site_Name { get; set; }
        public string Url { get; set; }
        public bool? Last_Status { get; set; }
        public DateTime? Last_Checked_At { get; set; }
        public int? Response_Time_Ms { get; set; }
    }
}
