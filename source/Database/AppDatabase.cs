using System;
using MySql.Data.MySqlClient;

namespace source.Database
{
    public class AppDatabase: IDisposable
    {
        public MySqlConnection Connection;

        public AppDatabase(string connectionString)
        {
            Connection = new MySqlConnection(connectionString);
        }

        public void Dispose()
        {
            Connection.Close();
        }
    }
}
