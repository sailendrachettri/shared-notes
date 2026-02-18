using Microsoft.AspNetCore.Mvc;
using OfficeConnectServer.Helpers;
using shared_notes_software_server.Models;

namespace shared_notes_software_server.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        private readonly DbHelper _db;
        public UserController(DbHelper db)
        {
            _db = db;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] AddUserModel request)
        {
            if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.UserPassword))
                return BadRequest(new { success = false, message = "Username and password are required" });

            // 1. Hash the password
            string hashedPassword = PasswordHelper.HashPassword(request.UserPassword);

            // 2. Call PostgreSQL function (returns JSON)
            string sql = "SELECT public.add_user(@user_name_i, @user_password_i);";

            string jsonResult = await _db.ExecuteScalarAsync<string>(
                sql,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("user_name_i", request.UserName);
                    cmd.Parameters.AddWithValue("user_password_i", hashedPassword);
                }
            );

            // 3. Return the JSON string as proper JSON content
            return Content(jsonResult, "application/json");
        }



    }
}
