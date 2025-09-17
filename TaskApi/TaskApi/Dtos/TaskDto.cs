using System.ComponentModel.DataAnnotations;

namespace TaskApi.Dtos
{
    public class TaskDto
    {
        public string TaskName { set; get; }
        public int Importance { set; get; }
        public DateOnly DeadLine { set; get; }
        //public Guid UserID { get; set; }
        public bool Active { get; set; } = true;
    }

    public class TaskResponseDto
    {
        public Guid Id { get; set; }
        public string TaskName { set; get; }
        public int Importance { set; get; }
        public DateOnly DeadLine { set; get; }
        public Guid UserId { get; set; }
        public string Name { get; set; }
    }

    public class UserDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Password { get; set; }

    }

    public class SignInDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
