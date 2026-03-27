namespace shared_notes_software_server.Models
{
    public class TenderDto
    {
        public int Tender_Id { get; set; }

        public string Title { get; set; } = "";

        public string RefNo { get; set; } = string.Empty; 

        public string TenderUniqueId { get; set; } = string.Empty; 

        public DateTime? Published_Date { get; set; }
        public DateTime? Last_Date { get; set; }

        public string[] Tags { get; set; } = Array.Empty<string>();

        public string Source { get; set; } = "sikkim_eproc";
    }
}
