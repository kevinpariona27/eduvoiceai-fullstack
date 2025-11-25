using AutoMapper;
using EduVoiceAI.API.Models.Dto;
using EduVoiceAI.Domain.Contracts;
using EduVoiceAI.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduVoiceAI.API.Controllers;

/// <summary>
/// Controlador para gestionar recordatorios de eventos
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Gestión de Eventos")]
public class EventRemindersController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public EventRemindersController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Obtiene todos los eventos
    /// </summary>
    /// <returns>Lista de eventos</returns>
    /// <response code="200">Retorna la lista de eventos exitosamente</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EventReminderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EventReminderDto>>> GetAllEvents()
    {
        var events = await _unitOfWork.Events.GetAllAsync();
        var eventDtos = _mapper.Map<IEnumerable<EventReminderDto>>(events);
        return Ok(eventDtos);
    }

    /// <summary>
    /// Obtiene un evento por ID
    /// </summary>
    /// <param name="id">ID del evento</param>
    /// <returns>Evento encontrado</returns>
    /// <response code="200">Retorna el evento encontrado</response>
    /// <response code="404">Evento no encontrado</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(EventReminderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EventReminderDto>> GetEventById(int id)
    {
        var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
        
        if (eventItem == null)
        {
            return NotFound(new { message = $"Evento con ID {id} no encontrado" });
        }

        var eventDto = _mapper.Map<EventReminderDto>(eventItem);
        return Ok(eventDto);
    }

    /// <summary>
    /// Obtiene todos los eventos de un usuario específico
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Lista de eventos del usuario</returns>
    /// <response code="200">Retorna los eventos del usuario</response>
    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(IEnumerable<EventReminderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EventReminderDto>>> GetEventsByUserId(int userId)
    {
        var events = await _unitOfWork.Events.FindAsync(e => e.UserId == userId);
        
        var eventDtos = _mapper.Map<IEnumerable<EventReminderDto>>(events);
        return Ok(eventDtos);
    }

    /// <summary>
    /// Obtiene eventos por tipo
    /// </summary>
    /// <param name="type">Tipo de evento (ej: Cumpleaños, Clase, Examen)</param>
    /// <returns>Lista de eventos del tipo especificado</returns>
    /// <response code="200">Retorna los eventos del tipo especificado</response>
    /// <remarks>
    /// Tipos de eventos comunes:
    /// - Cumpleaños
    /// - Clase
    /// - Examen
    /// - Reunión
    /// - Tarea
    /// - Proyecto
    /// </remarks>
    [HttpGet("type/{type}")]
    [ProducesResponseType(typeof(IEnumerable<EventReminderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EventReminderDto>>> GetEventsByType(string type)
    {
        var events = await _unitOfWork.Events.FindAsync(e => e.Type == type);
        
        var eventDtos = _mapper.Map<IEnumerable<EventReminderDto>>(events);
        return Ok(eventDtos);
    }

    /// <summary>
    /// Obtiene eventos próximos (en los próximos N días)
    /// </summary>
    /// <param name="days">Número de días hacia adelante (por defecto: 7)</param>
    /// <returns>Lista de eventos próximos ordenados por fecha</returns>
    /// <response code="200">Retorna los eventos próximos ordenados</response>
    /// <remarks>
    /// Este endpoint es útil para mostrar un calendario de eventos cercanos.
    /// Los eventos se devuelven ordenados por fecha ascendente.
    /// </remarks>
    [HttpGet("upcoming/{days}")]
    [ProducesResponseType(typeof(IEnumerable<EventReminderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EventReminderDto>>> GetUpcomingEvents(int days = 7)
    {
        var currentDate = DateTime.UtcNow;
        var futureDate = currentDate.AddDays(days);
        
        var events = await _unitOfWork.Events.FindAsync(e => e.Date >= currentDate && e.Date <= futureDate);
        
        var eventDtos = _mapper.Map<IEnumerable<EventReminderDto>>(events);
        return Ok(eventDtos.OrderBy(e => e.Date));
    }

    /// <summary>
    /// Crea un nuevo evento
    /// </summary>
    /// <param name="eventDto">Datos del evento a crear</param>
    /// <returns>Evento creado</returns>
    /// <response code="201">Evento creado exitosamente</response>
    /// <response code="400">Datos de entrada inválidos o usuario no existe</response>
    /// <remarks>
    /// Ejemplo de solicitud:
    /// 
    ///     POST /api/EventReminders
    ///     {
    ///         "title": "Examen Final de Matemáticas",
    ///         "description": "Examen final del curso de Cálculo I",
    ///         "date": "2024-12-20T10:00:00",
    ///         "type": "Examen",
    ///         "userId": 1
    ///     }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(EventReminderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<EventReminderDto>> CreateEvent([FromBody] EventReminderDto eventDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verificar que el usuario existe
        var userExists = await _unitOfWork.Users.GetByIdAsync(eventDto.UserId);
        if (userExists == null)
        {
            return BadRequest(new { message = $"Usuario con ID {eventDto.UserId} no existe" });
        }

        var eventItem = _mapper.Map<Event>(eventDto);
        
        await _unitOfWork.Events.AddAsync(eventItem);
        await _unitOfWork.CommitAsync();

        var createdEventDto = _mapper.Map<EventReminderDto>(eventItem);
        return CreatedAtAction(nameof(GetEventById), new { id = eventItem.Id }, createdEventDto);
    }

    /// <summary>
    /// Actualiza un evento existente
    /// </summary>
    /// <param name="id">ID del evento a actualizar</param>
    /// <param name="eventDto">Datos actualizados del evento</param>
    /// <returns>Sin contenido si la actualización es exitosa</returns>
    /// <response code="204">Evento actualizado exitosamente</response>
    /// <response code="400">Datos de entrada inválidos o ID no coincide</response>
    /// <response code="404">Evento no encontrado</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateEvent(int id, [FromBody] EventReminderDto eventDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != eventDto.Id)
        {
            return BadRequest(new { message = "El ID de la URL no coincide con el ID del evento" });
        }

        var existingEvent = await _unitOfWork.Events.GetByIdAsync(id);
        
        if (existingEvent == null)
        {
            return NotFound(new { message = $"Evento con ID {id} no encontrado" });
        }

        _mapper.Map(eventDto, existingEvent);
        
        _unitOfWork.Events.Update(existingEvent);
        await _unitOfWork.CommitAsync();

        return NoContent();
    }

    /// <summary>
    /// Elimina un evento
    /// </summary>
    /// <param name="id">ID del evento a eliminar</param>
    /// <returns>Sin contenido si la eliminación es exitosa</returns>
    /// <response code="204">Evento eliminado exitosamente</response>
    /// <response code="404">Evento no encontrado</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var eventItem = await _unitOfWork.Events.GetByIdAsync(id);
        
        if (eventItem == null)
        {
            return NotFound(new { message = $"Evento con ID {id} no encontrado" });
        }

        _unitOfWork.Events.Delete(eventItem);
        await _unitOfWork.CommitAsync();

        return NoContent();
    }
}
