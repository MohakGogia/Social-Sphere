namespace DataContract
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTimeOffset DateOfBirth { get; set; }
        public int Age { get { return (DateTime.Today - DateOfBirth).Days / 365; } }
        public char Gender { get; set; }
        public bool IsInactive { get; set; }
        public DateTimeOffset CreatedAt { get; set; }

    }
}
