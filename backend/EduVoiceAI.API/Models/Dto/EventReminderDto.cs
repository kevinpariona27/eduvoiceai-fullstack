using System.ComponentModel.DataAnnotations;

namespace EduVoiceAI.API.Models.Dto;

public class EventReminderDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El título es obligatorio")]
    [MaxLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "La fecha del evento es obligatoria")]
    public DateTime Date { get; set; }

    [MaxLength(50, ErrorMessage = "El tipo no puede exceder 50 caracteres")]
    public string? Type { get; set; }

    [Required(ErrorMessage = "El ID de usuario es obligatorio")]
    public int UserId { get; set; }
}
