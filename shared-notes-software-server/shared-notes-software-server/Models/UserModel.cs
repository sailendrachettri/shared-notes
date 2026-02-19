namespace shared_notes_software_server.Models
{
    public class AddUserModel
    {
        public string UserName { get; set; }
        public string UserPassword { get; set; }
    }

    public class PinLoginModel
    {
        public Guid UserId { get; set; }
        public string UserPassword { get; set; }
    }


    public class UserFullDetailsDto
    {
        public Guid user_id { get; set; }
        public string user_name { get; set; } = string.Empty;
        public DateTime created_at { get; set; }
        public DateTime? updated_at { get; set; }
    }


    public class UserDto
    {
        public Guid user_id { get; set; }
        public string user_name { get; set; }
        public string user_password { get; set; }
    }


}
