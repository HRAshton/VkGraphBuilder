using Microsoft.EntityFrameworkCore;

namespace Dal;

public class CacheContext : DbContext
{
    public CacheContext(DbContextOptions<CacheContext> options) : base(options)
    {
    }

    public DbSet<CommunityEntity> GroupEntities { get; set; }

    public DbSet<GroupUserRelations> GroupUserRelations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GroupUserRelations>()
            .HasKey(gur => new {gur.GroupId, gur.UserId});
        
        modelBuilder.Entity<CommunityEntity>()
            .HasKey(ce => ce.Id);
    }
}