using System.Security.Claims;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Dtos;
using TaskApi.Model;
using TaskApi.Services;

namespace TaskApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController(TaskDbContext context, MyJwtService myJwtService) : ControllerBase
    {
        private readonly TaskDbContext _context = context;
        private readonly MyJwtService _myJwtService = myJwtService;

        //TaskController(TaskDbContext context)
        //{
        //    _context = context;
        //}

        [EndpointSummary("Signup")]
        [EndpointDescription("Add new user")]
        [HttpPost("signup")]
        public async Task<ActionResult> SignUp(UserDto userDto)
        {
            try
            {
                TodoUser todoUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);
                if (todoUser != null) { throw new Exception("username already used"); }
                if(userDto.Password.Length<5) { throw new Exception("password min length 5 characters"); }
                TodoUser newUser = new()
                {
                    UserId = Guid.NewGuid(),
                    Username = userDto.Username,
                    Name = userDto.Name,
                    Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
                };
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();
                return Ok("user created");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }


        [EndpointSummary("Signin")]
        [HttpPost("signin")]
        public async Task<ActionResult> SignIn(SignInDto signInDto)
        {
            try
            {
                TodoUser? todoUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == signInDto.Username);
                if (BCrypt.Net.BCrypt.Verify(signInDto.Password, todoUser.Password))
                {
                    var token = _myJwtService.GenerateToken(todoUser);
                    return Ok(new{ token});
                }
                else
                {
                    throw new Exception("cant login");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [EndpointSummary("Get all task")]
        [EndpointDescription("Returns a list of all task items.")]
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<TodoTask>>> GetAllTask()
        {
            //User otomatis ada
            var user = User.FindFirst(ClaimTypes.NameIdentifier);
            if (user is null) { return NotFound("error user not found"); }
            var allTask = await _context.Tasks.Where(i => i.UserId == Guid.Parse(user.Value)).ToListAsync();
            return Ok(allTask);
        }

        [EndpointSummary("Get single task by id")]
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Task>> GetTask(Guid id)
        {
            //var task = await _context.Tasks.FindAsync(id);
            var task = await _context.Tasks.Include(i => i.User).FirstOrDefaultAsync(i => i.Id == id);
            if (task is null) { return NotFound($"Task with ID {id} not found."); }
            TaskResponseDto taskResponseDto = new()
            {
                Id = task.Id,
                TaskName = task.TaskName,
                Importance = task.Importance,
                DeadLine = task.DeadLine,
                UserId = task.UserId,
                Name = task.User.Name
            };
            return Ok(taskResponseDto);
        }

        [EndpointSummary("Add new task")]
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddTask(TaskDto task)
        {
            var user = User.FindFirst(ClaimTypes.NameIdentifier);
            if (user is null) { return NotFound("error user not found"); }
            TodoTask todoTask = new()
            {
                Id = Guid.NewGuid(),
                TaskName = task.TaskName,
                Importance = task.Importance,
                DeadLine = task.DeadLine,
                UserId = Guid.Parse(user.Value),
                Active = true
            };
            await _context.Tasks.AddAsync(todoTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = todoTask.Id }, task);
        }

        [EndpointSummary("Delete Task")]
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleletTask(Guid id)
        {
            TodoTask? todoTask = await _context.Tasks.FirstOrDefaultAsync(i => i.Id == id);
            if(todoTask is null) {
                return NotFound($"Task with ID {id} not found.");
            }
            _context.Tasks.Remove(todoTask);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [EndpointSummary("Update task")]
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateTask(Guid id, TaskDto taskDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task is null) { return NotFound($"Task with ID {id} not found."); }
            task.TaskName = taskDto.TaskName;
            task.Importance = taskDto.Importance;
            task.DeadLine = taskDto.DeadLine;
            task.Active = taskDto.Active;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
