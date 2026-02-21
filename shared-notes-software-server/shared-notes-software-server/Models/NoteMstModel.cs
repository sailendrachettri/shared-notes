namespace shared_notes_software_server.Models
{
    public class AddNoteRequest
    {
        public Guid? UserId { get; set; }
        public string NoteTitle { get; set; }
    }

    public class GetNoteRequest
    {
        public string? SearchText { get; set; }
        public string? SortBy { get; set; }
        public string? SortDirection { get; set; }
        public Guid? UserId { get; set; }
    }

    public class DeleteNoteRequest
    {
        public string NoteType { get; set; }
        public long NoteOrSubPageId { get; set; }
    }
    public class RenameNoteRequest
    {
        public long NoteId { get; set; }
        public string NoteTitle { get; set; }
        public string NotesType { get; set; }
    }
    public class MakeNotePublicRequest
    {
        public long NoteId { get; set; }
    }
    public class ChangeCoverImageRequest
    {
        public long NoteId { get; set; }
        public string CoverImage { get; set; }
    }
    public class ChangeCoverIconRequest
    {
        public long NoteId { get; set; }
        public string CoverIcon { get; set; }
    }

    public class RemoveCoverIconRequest
    {
        public long NoteId { get; set; }
    }
    public class RemoveCoverImageRequest
    {
        public long NoteId { get; set; }
    }
}
