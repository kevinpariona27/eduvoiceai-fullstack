using System.ComponentModel.DataAnnotations;

namespace EduVoiceAI.API.Models.Dto;

public class TaskPlanDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "El título es obligatorio")]
    [MaxLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción es obligatoria")]
    [MaxLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de vencimiento es obligatoria")]
    public DateTime DueDate { get; set; }

    public bool IsCompleted { get; set; }

    [Required(ErrorMessage = "El ID de usuario es obligatorio")]
    public int UserId { get; set; }
}
