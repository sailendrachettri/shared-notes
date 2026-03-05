namespace shared_notes_software_server.Models
{
    public class EventsModel
    {
    }

    public class DeleteEventRequest
    {
        public Guid UserId { get; set; }
        public long EventId { get; set; }
    }

    public class AddEventsRequest
    {
        public Guid UserId { get; set; }
        public string EventTitle { get; set; }
        public DateTime EventDate { get; set; }
        public long EventCategoryId { get; set; }
        public TimeSpan? EventTime { get; set; }
    }

    public class EventResponseDTO
    {
        public long EventId { get; set; }
        public long EventCategoryId { get; set; }
        public string EventTitle { get; set; }
        public Guid UserId { get; set; }
        public TimeSpan? EventTime { get; set; }
        public DateTime EventDate { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string EventCategoryName { get; set; }
    }
}
