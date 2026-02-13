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
}
