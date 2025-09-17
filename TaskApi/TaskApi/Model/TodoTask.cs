using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TaskApi.Model
{
    public class TodoTask
    {
        [Key]
        public Guid Id { set; get; } 
        public string TaskName { set; get; }
        public int Importance { set; get; }
        public DateOnly DeadLine { set; get; }
        public Guid UserId { get; set; } 
        public TodoUser User { get; set; }
        public bool Active { get; set; }
    }
}
