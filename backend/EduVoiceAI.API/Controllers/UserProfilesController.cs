using AutoMapper;
using EduVoiceAI.API.Models.Dto;
using EduVoiceAI.Domain.Contracts;
using EduVoiceAI.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduVoiceAI.API.Controllers;

/// <summary>
/// Controlador para gestionar perfiles de usuario
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Gestión de Usuarios")]
public class UserProfilesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserProfilesController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Obtiene todos los perfiles de usuario
    /// </summary>
    /// <returns>Lista de perfiles de usuario</returns>
    /// <response code="200">Retorna la lista de usuarios exitosamente</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UserProfileDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserProfileDto>>> GetAllUsers()
    {
        var users = await _unitOfWork.Users.GetAllAsync();
        var userDtos = _mapper.Map<IEnumerable<UserProfileDto>>(users);
        return Ok(userDtos);
    }

    /// <summary>
    /// Obtiene un perfil de usuario por ID
    /// </summary>
    /// <param name="id">ID del usuario</param>
    /// <returns>Perfil de usuario</returns>
    /// <response code="200">Retorna el usuario encontrado</response>
    /// <response code="404">Usuario no encontrado</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileDto>> GetUserById(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        
        if (user == null)
        {
            return NotFound(new { message = $"Usuario con ID {id} no encontrado" });
        }

        var userDto = _mapper.Map<UserProfileDto>(user);
        return Ok(userDto);
    }

    /// <summary>
    /// Crea un nuevo perfil de usuario
    /// </summary>
    /// <param name="userDto">Datos del usuario a crear</param>
    /// <returns>Usuario creado</returns>
    /// <response code="201">Usuario creado exitosamente</response>
    /// <response code="400">Datos de entrada inválidos</response>
    /// <remarks>
    /// Ejemplo de solicitud:
    /// 
    ///     POST /api/UserProfiles
    ///     {
    ///         "name": "Juan Pérez",
    ///         "email": "juan.perez@ejemplo.com"
    ///     }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserProfileDto>> CreateUser([FromBody] UserProfileDto userDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = _mapper.Map<User>(userDto);
        user.CreatedAt = DateTime.UtcNow;
        
        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.CommitAsync();

        var createdUserDto = _mapper.Map<UserProfileDto>(user);
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, createdUserDto);
    }

    /// <summary>
    /// Actualiza un perfil de usuario existente
    /// </summary>
    /// <param name="id">ID del usuario a actualizar</param>
    /// <param name="userDto">Datos actualizados del usuario</param>
    /// <returns>Sin contenido si la actualización es exitosa</returns>
    /// <response code="204">Usuario actualizado exitosamente</response>
    /// <response code="400">Datos de entrada inválidos o ID no coincide</response>
    /// <response code="404">Usuario no encontrado</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserProfileDto userDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != userDto.Id)
        {
            return BadRequest(new { message = "El ID de la URL no coincide con el ID del usuario" });
        }

        var existingUser = await _unitOfWork.Users.GetByIdAsync(id);
        
        if (existingUser == null)
        {
            return NotFound(new { message = $"Usuario con ID {id} no encontrado" });
        }

        _mapper.Map(userDto, existingUser);
        
        _unitOfWork.Users.Update(existingUser);
        await _unitOfWork.CommitAsync();

        return NoContent();
    }

    /// <summary>
    /// Elimina un perfil de usuario
    /// </summary>
    /// <param name="id">ID del usuario a eliminar</param>
    /// <returns>Sin contenido si la eliminación es exitosa</returns>
    /// <response code="204">Usuario eliminado exitosamente</response>
    /// <response code="404">Usuario no encontrado</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        
        if (user == null)
        {
            return NotFound(new { message = $"Usuario con ID {id} no encontrado" });
        }

        _unitOfWork.Users.Delete(user);
        await _unitOfWork.CommitAsync();

        return NoContent();
    }
}
