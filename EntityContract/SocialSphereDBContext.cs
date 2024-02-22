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
        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Method intentionally left empty.
        }

        public override int SaveChanges()
        {
            AddAuditInfo();
            return base.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            AddAuditInfo();
            return await base.SaveChangesAsync();
        }

        public async Task<int> SaveChangesAsyncWithPreInitializedAuditInfo()
        {
            return await base.SaveChangesAsync();
        }

        private void AddAuditInfo()
        {
            var entries = ChangeTracker.Entries().Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    ((BaseEntity)entry.Entity).CreatedOn = DateTimeOffset.UtcNow;
                }
                else if (entry.State == EntityState.Modified && entry.CurrentValues.Properties.Any(x => x.Name == "CreatedOn"))
                {
                    Entry((BaseEntity)entry.Entity).Property(x => x.CreatedOn).IsModified = false;
                }

                ((BaseEntity)entry.Entity).ModifiedOn = DateTimeOffset.UtcNow;
            }
        }
    }
}
