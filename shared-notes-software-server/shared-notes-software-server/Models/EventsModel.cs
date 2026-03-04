namespace shared_notes_software_server.Models
{
    public class EventsModel
    {
    }

    public class AddEventsRequest
    {
        public Guid UserId { get; set; }
        public string EventTitle { get; set; }
        public DateTime EventDate { get; set; }
        public long EventCategoryId { get; set; }
        public TimeSpan? EventTime { get; set; }
    }
}
