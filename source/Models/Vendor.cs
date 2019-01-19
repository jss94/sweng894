
using System.Data;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using source.Database;

namespace source.Models
{
    public class User : IUser
    {
        public string id { get; set; }

        public string name { get; set; }

        public string role { get; set; }

        [JsonIgnore]
        public IAppDatabase _database { get; set; }

        public User(IAppDatabase db = null)
        {
            _database = db;
        }

        public async Task InsertAsync()
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"INSERT INTO sweng894.users (id, name, role) VALUES (@id, @name, @role);";
                BindParams(cmd);
                await cmd.ExecuteNonQueryAsync();
            }

        }

        public async Task UpdateAsync()
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"UPDATE sweng894.users SET name = @name, role = @role WHERE id = @id;";
                BindParams(cmd);
                BindId(cmd);
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task DeleteAsync()
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"DELETE FROM sweng894.users WHERE id = @id;";
                BindId(cmd);
                await cmd.ExecuteNonQueryAsync();
            }
        }

        private void BindId(MySqlCommand cmd)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@id",
                DbType = DbType.String,
                Value = id,
            });
        }

        private void BindParams(MySqlCommand cmd)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@name",
                DbType = DbType.String,
                Value = name,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@role",
                DbType = DbType.String,
                Value = role,
            });
        }

    }
}