using EduVoiceAI.Domain.Entities;
using EduVoiceAI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EduVoiceAI.Infrastructure.Seed;

/// <summary>
/// Clase para sembrar datos iniciales en la base de datos
/// </summary>
public static class DbSeeder
{
    /// <summary>
    /// Inserta datos de ejemplo si la base de datos está vacía
    /// </summary>
    /// <param name="context">Contexto de la base de datos</param>
    public static async Task SeedAsync(EduVoiceDbContext context)
    {
        // Asegurar que la base de datos está creada
        await context.Database.EnsureCreatedAsync();

        // Verificar si ya hay datos
        if (await context.Users.AnyAsync())
        {
            return; // La base de datos ya tiene datos
        }

        // Crear usuarios de ejemplo
        var users = new List<User>
        {
            new User
            {
                Name = "Juan Pérez",
                Email = "juan.perez@eduvoice.com",
                PasswordHash = "hashed_password_123", // En producción usar un hash real
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new User
            {
                Name = "María García",
                Email = "maria.garcia@eduvoice.com",
                PasswordHash = "hashed_password_456",
                CreatedAt = DateTime.UtcNow.AddMonths(-4)
            },
            new User
            {
                Name = "Carlos López",
                Email = "carlos.lopez@eduvoice.com",
                PasswordHash = "hashed_password_789",
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            },
            new User
            {
                Name = "Ana Martínez",
                Email = "ana.martinez@eduvoice.com",
                PasswordHash = "hashed_password_abc",
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        // Crear tareas de ejemplo
        var tasks = new List<TaskItem>
        {
            new TaskItem
            {
                Title = "Estudiar Matemáticas",
                Description = "Repasar capítulos 1-5 de cálculo diferencial",
                DueDate = DateTime.UtcNow.AddDays(7),
                IsCompleted = false,
                UserId = users[0].Id
            },
            new TaskItem
            {
                Title = "Proyecto de Física",
                Description = "Completar el proyecto sobre mecánica cuántica",
                DueDate = DateTime.UtcNow.AddDays(14),
                IsCompleted = false,
                UserId = users[0].Id
            },
            new TaskItem
            {
                Title = "Leer capítulo de Historia",
                Description = "Leer y resumir el capítulo sobre la Revolución Industrial",
                DueDate = DateTime.UtcNow.AddDays(3),
                IsCompleted = true,
                UserId = users[0].Id
            },
            new TaskItem
            {
                Title = "Ensayo de Literatura",
                Description = "Escribir ensayo sobre Don Quijote de la Mancha",
                DueDate = DateTime.UtcNow.AddDays(10),
                IsCompleted = false,
                UserId = users[1].Id
            },
            new TaskItem
            {
                Title = "Práctica de Programación",
                Description = "Completar ejercicios de algoritmos y estructuras de datos",
                DueDate = DateTime.UtcNow.AddDays(5),
                IsCompleted = false,
                UserId = users[1].Id
            },
            new TaskItem
            {
                Title = "Presentación de Química",
                Description = "Preparar presentación sobre tabla periódica",
                DueDate = DateTime.UtcNow.AddDays(2),
                IsCompleted = true,
                UserId = users[2].Id
            },
            new TaskItem
            {
                Title = "Ejercicios de Inglés",
                Description = "Completar ejercicios de gramática avanzada",
                DueDate = DateTime.UtcNow.AddDays(4),
                IsCompleted = false,
                UserId = users[2].Id
            },
            new TaskItem
            {
                Title = "Investigación de Biología",
                Description = "Investigar sobre ecosistemas marinos",
                DueDate = DateTime.UtcNow.AddDays(12),
                IsCompleted = false,
                UserId = users[3].Id
            }
        };

        await context.Tasks.AddRangeAsync(tasks);
        await context.SaveChangesAsync();

        // Crear eventos de ejemplo
        var events = new List<Event>
        {
            new Event
            {
                Title = "Examen Final de Matemáticas",
                Description = "Examen final de cálculo diferencial e integral",
                Date = DateTime.UtcNow.AddDays(15),
                Type = "Examen",
                UserId = users[0].Id
            },
            new Event
            {
                Title = "Entrega de Proyecto de Física",
                Description = "Fecha límite para entregar el proyecto final",
                Date = DateTime.UtcNow.AddDays(14),
                Type = "Proyecto",
                UserId = users[0].Id
            },
            new Event
            {
                Title = "Clase de Tutoría",
                Description = "Tutoría de matemáticas avanzadas",
                Date = DateTime.UtcNow.AddDays(2),
                Type = "Clase",
                UserId = users[0].Id
            },
            new Event
            {
                Title = "Cumpleaños de María",
                Description = "Celebración de cumpleaños",
                Date = DateTime.UtcNow.AddDays(20),
                Type = "Cumpleaños",
                UserId = users[1].Id
            },
            new Event
            {
                Title = "Examen de Literatura",
                Description = "Examen sobre literatura española del Siglo de Oro",
                Date = DateTime.UtcNow.AddDays(8),
                Type = "Examen",
                UserId = users[1].Id
            },
            new Event
            {
                Title = "Reunión de Grupo",
                Description = "Reunión para coordinar el proyecto grupal",
                Date = DateTime.UtcNow.AddDays(3),
                Type = "Reunión",
                UserId = users[1].Id
            },
            new Event
            {
                Title = "Laboratorio de Química",
                Description = "Práctica de laboratorio sobre reacciones químicas",
                Date = DateTime.UtcNow.AddDays(5),
                Type = "Clase",
                UserId = users[2].Id
            },
            new Event
            {
                Title = "Presentación Oral",
                Description = "Presentación del proyecto de investigación",
                Date = DateTime.UtcNow.AddDays(9),
                Type = "Presentación",
                UserId = users[2].Id
            },
            new Event
            {
                Title = "Examen de Inglés",
                Description = "Examen de certificación de nivel avanzado",
                Date = DateTime.UtcNow.AddDays(18),
                Type = "Examen",
                UserId = users[2].Id
            },
            new Event
            {
                Title = "Seminario de Biología",
                Description = "Seminario sobre biodiversidad marina",
                Date = DateTime.UtcNow.AddDays(6),
                Type = "Clase",
                UserId = users[3].Id
            },
            new Event
            {
                Title = "Excursión Académica",
                Description = "Visita al museo de ciencias naturales",
                Date = DateTime.UtcNow.AddDays(11),
                Type = "Excursión",
                UserId = users[3].Id
            },
            new Event
            {
                Title = "Entrega de Ensayo",
                Description = "Fecha límite para entregar el ensayo final",
                Date = DateTime.UtcNow.AddDays(7),
                Type = "Proyecto",
                UserId = users[3].Id
            }
        };

        await context.Events.AddRangeAsync(events);
        await context.SaveChangesAsync();
    }
}
