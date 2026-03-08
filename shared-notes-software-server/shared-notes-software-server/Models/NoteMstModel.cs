namespace shared_notes_software_server.Models
{
    public class AcceptRejectNoteInvitationRequest
    {
        public Guid UserId { get; set; }

        public long NoteId { get; set; }

        public string InviteStatus { get; set; } = string.Empty;
        // accepted | rejected
    }
    public class AddNoteInvitationRequest
    {
        public long NoteId { get; set; }
        public Guid UserId { get; set; }        // invited user
        public Guid InvitedBy { get; set; }     // who invited
    }
    public class NoteInvitationNotification
    {
        public int Notes_Access_Id { get; set; }

        public long Note_Id { get; set; }

        public string Note_Title { get; set; }

        public Guid User_Id { get; set; }

        public string Invite_Status { get; set; }

        public Guid Invited_By { get; set; }

        public string Invited_By_Name { get; set; }

        public string Profile_Url { get; set; }

        public DateTime Created_At { get; set; }
    }
    public class GetNoteInvitationNotificationRequest
    {
        public Guid UserId { get; set; } 
    }
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
