using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduVoiceAI.Domain.Entities
{
    public class Event
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime Date { get; set; }

        public string? Type { get; set; } // Ejemplo: "Cumpleaños", "Clase", "Examen"

        // Relación con usuario
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
