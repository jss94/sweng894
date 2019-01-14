
using System.Data;
using MySql.Data.MySqlClient;

namespace source.Database
{
    public class AppDatabase : IAppDatabase
    {
        MySqlConnection _connection;
        IDbConnection IAppDatabase.Connection 
        {
            get => _connection; 
            set => _connection = value as MySqlConnection; 
        }


        public AppDatabase(string connectionString)
        {
            _connection = new MySqlConnection(connectionString);
        }

        public void Dispose()
        {
            _connection.Close();
        }
    }
}
