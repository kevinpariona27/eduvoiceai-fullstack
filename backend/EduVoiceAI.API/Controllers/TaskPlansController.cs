using AutoMapper;
using EduVoiceAI.API.Models.Dto;
using EduVoiceAI.Domain.Contracts;
using EduVoiceAI.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduVoiceAI.API.Controllers;

/// <summary>
/// Controlador para gestionar planes de tareas
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Gestión de Tareas")]
public class TaskPlansController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TaskPlansController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Obtiene todas las tareas
    /// </summary>
    /// <returns>Lista de tareas</returns>
    /// <response code="200">Retorna la lista de tareas exitosamente</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskPlanDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<TaskPlanDto>>> GetAllTasks()
    {
        var tasks = await _unitOfWork.Tasks.GetAllAsync();
        var taskDtos = _mapper.Map<IEnumerable<TaskPlanDto>>(tasks);
        return Ok(taskDtos);
    }

    /// <summary>
    /// Obtiene una tarea por ID
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <returns>Tarea encontrada</returns>
    /// <response code="200">Retorna la tarea encontrada</response>
    /// <response code="404">Tarea no encontrada</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TaskPlanDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskPlanDto>> GetTaskById(int id)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(id);
        
        if (task == null)
        {
            return NotFound(new { message = $"Tarea con ID {id} no encontrada" });
        }

        var taskDto = _mapper.Map<TaskPlanDto>(task);
        return Ok(taskDto);
    }

    /// <summary>
    /// Obtiene todas las tareas de un usuario específico
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Lista de tareas del usuario</returns>
    /// <response code="200">Retorna las tareas del usuario</response>
    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(IEnumerable<TaskPlanDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<TaskPlanDto>>> GetTasksByUserId(int userId)
    {
        var tasks = await _unitOfWork.Tasks.FindAsync(t => t.UserId == userId);
        
        var taskDtos = _mapper.Map<IEnumerable<TaskPlanDto>>(tasks);
        return Ok(taskDtos);
    }

    /// <summary>
    /// Crea una nueva tarea
    /// </summary>
    /// <param name="taskDto">Datos de la tarea a crear</param>
    /// <returns>Tarea creada</returns>
    /// <response code="201">Tarea creada exitosamente</response>
    /// <response code="400">Datos de entrada inválidos o usuario no existe</response>
    /// <remarks>
    /// Ejemplo de solicitud:
    /// 
    ///     POST /api/TaskPlans
    ///     {
    ///         "title": "Estudiar matemáticas",
    ///         "description": "Repasar capítulos 1-5 del libro de álgebra",
    ///         "dueDate": "2024-12-31T23:59:59",
    ///         "isCompleted": false,
    ///         "userId": 1
    ///     }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(TaskPlanDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TaskPlanDto>> CreateTask([FromBody] TaskPlanDto taskDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verificar que el usuario existe
        var userExists = await _unitOfWork.Users.GetByIdAsync(taskDto.UserId);
        if (userExists == null)
        {
            return BadRequest(new { message = $"Usuario con ID {taskDto.UserId} no existe" });
        }

        var task = _mapper.Map<TaskItem>(taskDto);
        
        await _unitOfWork.Tasks.AddAsync(task);
        await _unitOfWork.CommitAsync();

        var createdTaskDto = _mapper.Map<TaskPlanDto>(task);
        return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, createdTaskDto);
    }

    /// <summary>
    /// Actualiza una tarea existente
    /// </summary>
    /// <param name="id">ID de la tarea a actualizar</param>
    /// <param name="taskDto">Datos actualizados de la tarea</param>
    /// <returns>Sin contenido si la actualización es exitosa</returns>
    /// <response code="204">Tarea actualizada exitosamente</response>
    /// <response code="400">Datos de entrada inválidos o ID no coincide</response>
    /// <response code="404">Tarea no encontrada</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskPlanDto taskDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != taskDto.Id)
        {
            return BadRequest(new { message = "El ID de la URL no coincide con el ID de la tarea" });
        }

        var existingTask = await _unitOfWork.Tasks.GetByIdAsync(id);
        
        if (existingTask == null)
        {
            return NotFound(new { message = $"Tarea con ID {id} no encontrada" });
        }

        _mapper.Map(taskDto, existingTask);
        
        _unitOfWork.Tasks.Update(existingTask);
        await _unitOfWork.CommitAsync();

        return NoContent();
    }

    /// <summary>
    /// Marca una tarea como completada o no completada
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <param name="isCompleted">Estado de completitud (true = completada, false = pendiente)</param>
    /// <returns>Sin contenido si la actualización es exitosa</returns>
    /// <response code="204">Estado actualizado exitosamente</response>
    /// <response code="404">Tarea no encontrada</response>
    /// <remarks>
    /// Este endpoint permite cambiar rápidamente el estado de una tarea sin necesidad de enviar todos los datos.
    /// </remarks>
    [HttpPatch("{id}/complete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleTaskCompletion(int id, [FromBody] bool isCompleted)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(id);
        
        if (task == null)
        {
            return NotFound(new { message = $"Tarea con ID {id} no encontrada" });
        }

        task.IsCompleted = isCompleted;
        
        _unitOfWork.Tasks.Update(task);
        await _unitOfWork.CommitAsync();

        return NoContent();
    }

    /// <summary>
    /// Elimina una tarea
    /// </summary>
    /// <param name="id">ID de la tarea a eliminar</param>
    /// <returns>Sin contenido si la eliminación es exitosa</returns>
    /// <response code="204">Tarea eliminada exitosamente</response>
    /// <response code="404">Tarea no encontrada</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(id);
        
        if (task == null)
        {
            return NotFound(new { message = $"Tarea con ID {id} no encontrada" });
        }

        _unitOfWork.Tasks.Delete(task);
        await _unitOfWork.CommitAsync();

        return NoContent();
    }
}
