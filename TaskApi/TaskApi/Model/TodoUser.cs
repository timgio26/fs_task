using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace TaskApi.Model
{
    public class TodoUser
    {
        [Key]
        public Guid UserId { set; get; }
        public required string Username { set; get; }
        public required string Password { get; set; }
        public string? Name { set; get; }
        public ICollection<TodoTask>? UserTasks { set; get; } = new List<TodoTask>();
    }
}
