namespace shared_notes_software_server.Models
{
    public class AddUpdateNotesModelRequest
    {
        public string? NotesDetails { get; set; }
        public long NoteId { get; set; }
        public long? NotesId { get; set; }
    }

    public class GetNotesModelDTO
    {
        public long? NotesId { get; set; }
        public long NoteId { get; set; }
    }
}
