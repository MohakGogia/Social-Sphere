namespace DataContract.Models;

public class UserFilterParams
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public string SearchQuery { get; set; } = "";
    public string OrderBy { get; set; } = "lastActive";
}
