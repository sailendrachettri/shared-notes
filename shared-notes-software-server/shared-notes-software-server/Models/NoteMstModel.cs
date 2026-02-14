namespace shared_notes_software_server.Models
{
    public class AddNoteRequest
    {
        public string NoteTitle { get; set; }
    }

    public class GetNoteRequest
    {
        public string? SearchText { get; set; }
    }

    public class DeleteNoteRequest
    {
        public long NoteId { get; set; }
    }
    public class RenameNoteRequest
    {
        public long NoteId { get; set; }
        public string NoteTitle { get; set; }
    }
}
