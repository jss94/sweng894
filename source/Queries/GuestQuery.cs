using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    public class GuestQuery : IGuestQuery
    {
        public readonly IAppDatabase _database;
        public GuestQuery(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<List<Guest>> GetGuestListByEventId(int eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText
                    = @"SELECT guestId, firstName, lastName, email, isGoing, eventId"
                    + @"FROM occasions.guests WHERE eventId = @eventId;";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@eventId",
                    DbType = DbType.Int64,
                    Value = eventId,
                });
                return await ReadAllAsync(await cmd.ExecuteReaderAsync());
            }
        }

        public async Task InsertGuest(Guest guest)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText
                    = @"INSERT INTO occasions.users (userName, firstName, lastName, email, isGoing, eventId) "
                    + @"VALUES (@guest.firstName, @guest.lastName, @guest.email, @guest.isGoing, @guest.eventId)";
                BindParams(cmd, guest);
                await cmd.ExecuteNonQueryAsync();
            }

        }

        public async Task UpdateGuest(Guest guest)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText
                    = @"UPDATE occasions.guests SET firstName = @guest.firstName, "
                    + @"lastName = @guest.lastName, "
                    + @"email = @guest.email, "
                    + @"isGoing = @guest.isGoing "
                    + @"eventId =  @guest.eventId"
                    + @"WHERE guestId = @guest.guestId;";
                BindParams(cmd, guest);
                await cmd.ExecuteNonQueryAsync();
            }

        }

        public async Task DeleteGuestById(int guestId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText
                    = @"DELETE FROM occasions.guests "
                    + @"WHERE guestId = @guestId";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@guestId",
                    DbType = DbType.Int64,
                    Value = guestId,
                });
                await cmd.ExecuteNonQueryAsync();
            }

        }

        private async Task<List<Guest>> ReadAllAsync(DbDataReader reader)
        {
            var posts = new List<Guest>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new Guest()
                    {
                        guestId = await reader.GetFieldValueAsync<int>(0),
                        firstName = await reader.GetFieldValueAsync<string>(1),
                        lastName = await reader.GetFieldValueAsync<string>(2),
                        email = await reader.GetFieldValueAsync<string>(3),
                        isGoing = await reader.GetFieldValueAsync<bool?>(4),
                        eventId = await reader.GetFieldValueAsync<int>(5)
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }

        private void BindParams(MySqlCommand cmd, Guest guest)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@guestId",
                DbType = DbType.Int64,
                Value = guest.guestId,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@firstName",
                DbType = DbType.String,
                Value = guest.firstName,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@lastName",
                DbType = DbType.String,
                Value = guest.lastName,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@email",
                DbType = DbType.String,
                Value = guest.email,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@isGoing",
                DbType = DbType.Boolean,
                Value = guest.isGoing,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@eventId",
                DbType = DbType.Int64,
                Value = guest.eventId,
            });
        }
    }
}
