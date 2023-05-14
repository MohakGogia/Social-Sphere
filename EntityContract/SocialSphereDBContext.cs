using Microsoft.EntityFrameworkCore;

namespace EntityContract
{
    public class SocialSphereDBContext : DbContext
    {
        public SocialSphereDBContext(DbContextOptions<SocialSphereDBContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Method intentionally left empty.
        }
    }
}
