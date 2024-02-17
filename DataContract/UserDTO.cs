namespace DataContract
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset DateOfBirth { get; set; }
        public int Age { get { return (DateTime.Today - DateOfBirth).Days / 365; } }
        public DateTimeOffset LastActive { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public char Gender { get; set; }
        public bool IsInactive { get; set; }
        public string Bio { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
    }
}
