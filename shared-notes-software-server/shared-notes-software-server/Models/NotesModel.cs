namespace shared_notes_software_server.Models
{


    public class NotesDetailsDTO
    {
        public long? notes_id { get; set; }
        public long? note_or_sub_page_id { get; set; }
        public string? notes_details { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }

        public string? note_title { get; set; }
        public string? mst_note_cover_icon { get; set; }
        public string? mst_note_cover_image { get; set; }
        public bool? mst_note_remove_icon { get; set; }
        public bool? mst_note_remove_cover { get; set; }

        public string? sub_page_title { get; set; }
        public string? sub_page_cover_icon { get; set; }
        public string? sub_page_cover_image { get; set; }
        public bool? sub_page_remove_icon { get; set; }
        public bool? sub_page_remove_cover { get; set; }
    }

    public class NotesResponseDTO
    {
        public bool success { get; set; }
        public string? status { get; set; }
        public string? message { get; set; }
        public NotesDetailsDTO? data { get; set; }
    }

    public class AddUpdateNotesModelRequest
    {
        public string? NotesDetails { get; set; }
        public long? NotesId { get; set; }
    }

    public class GetNotesModelRequest
    {
        public string NotesType { get; set; }
        public long NotesId { get; set; }
    }
}
