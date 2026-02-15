namespace shared_notes_software_server.Models
{

    public class RenameSupPageModel
    {
        public string SupPageTitle { get; set; }
        public long SubPageId { get; set; }
    }
    public class AddNoteMstSubPageModel
    {
        public string SubPageTitle { get; set; }
        public long NoteId { get; set; }
    }
    public class ChangeCoverImageSubPageModel
    {
        public string CoverImage { get; set; }
        public long SubPageId { get; set; }
    }
    public class ChangeCoverIconSubPageModel
    {
        public string CoverIcon { get; set; }
        public long SubPageId { get; set; }
    }
    public class RemoveCoverIconSubPageModel
    {
        public long SubPageId { get; set; }
    }
    public class RemoveCoverImageSubPageModel
    {
        public long SubPageId { get; set; }
    }
}
