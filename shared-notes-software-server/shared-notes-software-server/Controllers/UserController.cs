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

        [HttpGet("get-all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _db.ExecuteQueryListAsync<UserFullDetailsDto>(
                    @"SELECT 
                    user_id,
                    user_name,
                    created_at,
                    updated_at,
                    profile_url
                  FROM public.utbl_users
                  ORDER BY user_name"
                );

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching users: {ex.Message}");
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] AddUserModel request)
        {
            if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.UserPassword))
                return BadRequest(new { success = false, message = "Username and password are required" });

            // 1. Hash the password
            string hashedPassword = PasswordHelper.HashPassword(request.UserPassword);

            // 2. Call PostgreSQL function (returns JSON)
            string sql = "SELECT public.add_user(@user_name_i, @user_password_i, @profile_url);";

            string jsonResult = await _db.ExecuteScalarAsync<string>(
                sql,
                cmd =>
                {
                    cmd.Parameters.AddWithValue("user_name_i", request.UserName);
                    cmd.Parameters.AddWithValue("user_password_i", hashedPassword);
                    cmd.Parameters.AddWithValue("profile_url", request.ProfileUrl);
                }
            );

            // 3. Return the JSON string as proper JSON content
            return Content(jsonResult, "application/json");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] PinLoginModel request)
        {
            if (request.UserId == Guid.Empty || string.IsNullOrWhiteSpace(request.UserPassword))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "UserId and PIN are required"
                });
            }

            try
            {
                string sql = @"
            SELECT user_id, user_password, user_name, created_at, updated_at, profile_url
            FROM public.utbl_users
            WHERE user_id = @user_id;
        ";

                var user = await _db.ExecuteQuerySingleAsync<UserDto>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("user_id", request.UserId);
                    }
                );

                if (user == null)
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid user"
                    });
                }

                bool isValid = PasswordHelper.VerifyPassword(
                    request.UserPassword,
                    user.user_password
                );

                if (!isValid)
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid PIN"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Login successful",
                    user_id = user.user_id,
                    user_name = user.user_name,
                    created_at = user?.created_at,
                    updated_at = user?.updated_at,
                    profile_url = user?.profile_url
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Server error",
                    error = ex.Message
                });
            }
        }







    }
}
