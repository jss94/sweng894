namespace source.Models
{
    public class User
    {
        public int id { get; set; }
        public string userName { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string addressId { get; set; }
        public string role { get; set; }
        public bool active { get; set; }
    }
}