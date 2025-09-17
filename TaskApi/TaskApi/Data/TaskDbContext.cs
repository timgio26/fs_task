using Microsoft.EntityFrameworkCore;
using TaskApi.Model;

namespace TaskApi.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options) { }
        public DbSet<TodoTask> Tasks { get; set; }
        public DbSet<TodoUser> Users { get; set; }
    }
}
