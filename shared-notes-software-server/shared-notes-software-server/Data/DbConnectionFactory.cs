using Npgsql;
using Microsoft.Extensions.Configuration;

namespace shared_notes_software_server.Data
{
    public class DbConnectionFactory
    {
        private readonly IConfiguration _configuration;

        public DbConnectionFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public NpgsqlConnection CreateConnection()
        {
            return new NpgsqlConnection(
                _configuration.GetConnectionString("PostgresDb")
            );
        }
    }
}
