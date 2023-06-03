namespace Core.Models
{
    public class ProblemDetails
    {
        public string? Title { get; set; }
        public int StatusCode { get; set; }
        public string? Message { get; set; }
        public string? StackTrace { get; set; }
    }
}
