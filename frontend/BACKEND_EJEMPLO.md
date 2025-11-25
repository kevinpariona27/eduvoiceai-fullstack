# Ejemplo de Backend .NET para EduVoice AI

Este documento contiene ejemplos de código para implementar el backend en .NET que el frontend React espera.

## 1. Modelo DTOs

### IARequestDto.cs
```csharp
namespace EduVoiceAI.DTOs
{
    public class IARequestDto
    {
        public string Prompt { get; set; } = string.Empty;
        public string? Context { get; set; }
    }
}
```

### IAResponseDto.cs
```csharp
namespace EduVoiceAI.DTOs
{
    public class IAResponseDto
    {
        public string Response { get; set; } = string.Empty;
    }
}
```

## 2. Interfaz del Servicio

### IIAService.cs
```csharp
namespace EduVoiceAI.Services
{
    public interface IIAService
    {
        Task<string> ProcessPromptAsync(string prompt, string? context = null);
    }
}
```

## 3. Controlador

### IAController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using EduVoiceAI.DTOs;
using EduVoiceAI.Services;

namespace EduVoiceAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IAController : ControllerBase
    {
        private readonly IIAService _iaService;
        private readonly ILogger<IAController> _logger;

        public IAController(IIAService iaService, ILogger<IAController> logger)
        {
            _iaService = iaService;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint para procesar preguntas del usuario con IA
        /// </summary>
        /// <param name="request">Objeto con el prompt y contexto opcional</param>
        /// <returns>Respuesta generada por la IA</returns>
        [HttpPost("ask")]
        [ProducesResponseType(typeof(IAResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IAResponseDto>> Ask([FromBody] IARequestDto request)
        {
            try
            {
                // Validar que el prompt no esté vacío
                if (string.IsNullOrWhiteSpace(request.Prompt))
                {
                    _logger.LogWarning("Se recibió una solicitud con prompt vacío");
                    return BadRequest(new ProblemDetails
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Prompt inválido",
                        Detail = "El prompt no puede estar vacío. Por favor, proporciona una pregunta o mensaje válido."
                    });
                }

                _logger.LogInformation("Procesando prompt: {Prompt}", request.Prompt);

                // Procesar el prompt usando el servicio de IA
                var response = await _iaService.ProcessPromptAsync(
                    request.Prompt, 
                    request.Context
                );

                if (string.IsNullOrEmpty(response))
                {
                    _logger.LogWarning("El servicio de IA devolvió una respuesta vacía");
                    response = "Lo siento, no pude generar una respuesta. Por favor, intenta reformular tu pregunta.";
                }

                _logger.LogInformation("Respuesta generada exitosamente");

                return Ok(new IAResponseDto
                {
                    Response = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar el prompt: {Prompt}", request.Prompt);
                
                return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Error al procesar la solicitud",
                    Detail = "Ocurrió un error interno al procesar tu pregunta. Por favor, intenta de nuevo más tarde."
                });
            }
        }
    }
}
```

## 4. Configuración de CORS (Program.cs)

```csharp
var builder = WebApplication.CreateBuilder(args);

// Agregar servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS para permitir peticiones desde React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Puerto de Vite
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Registrar el servicio de IA
builder.Services.AddScoped<IIAService, IAService>(); // Implementa tu servicio aquí

var app = builder.Build();

// Configurar el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// IMPORTANTE: UseCors debe estar antes de UseAuthorization
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();
```

## 5. Ejemplo de Implementación del Servicio

### IAService.cs (Ejemplo básico)
```csharp
using System.Net.Http.Json;

namespace EduVoiceAI.Services
{
    public class IAService : IIAService
    {
        private readonly ILogger<IAService> _logger;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public IAService(
            ILogger<IAService> logger, 
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<string> ProcessPromptAsync(string prompt, string? context = null)
        {
            try
            {
                // Aquí implementas la lógica de tu IA
                // Puede ser OpenAI, Azure OpenAI, o tu propia implementación
                
                _logger.LogInformation("Procesando prompt con IA");

                // Ejemplo: llamada a OpenAI o tu servicio de IA
                var fullPrompt = context != null 
                    ? $"Contexto: {context}\n\nPregunta: {prompt}"
                    : prompt;

                // TODO: Implementar la llamada real a tu servicio de IA
                // Por ahora, retornamos una respuesta de ejemplo
                var response = await SimulateAIResponse(fullPrompt);

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar el prompt con la IA");
                throw;
            }
        }

        private async Task<string> SimulateAIResponse(string prompt)
        {
            // Simulación - reemplaza esto con tu implementación real
            await Task.Delay(1000); // Simular tiempo de procesamiento
            
            return $"Esta es una respuesta de ejemplo a tu pregunta: '{prompt}'. " +
                   $"Implementa aquí la integración con tu servicio de IA preferido.";
        }
    }
}
```

## 6. Registro del HttpClient (Program.cs)

```csharp
// En Program.cs, agregar:
builder.Services.AddHttpClient();
```

## Endpoints del Backend

### POST /api/ia/ask
**URL:** `http://localhost:5187/api/ia/ask`

**Request Body:**
```json
{
  "prompt": "Explícame cómo organizar mis tareas semanales",
  "context": "Soy estudiante universitario"
}
```

**Response Success (200):**
```json
{
  "response": "Para organizar tus tareas semanales como estudiante universitario..."
}
```

**Response Error (400):**
```json
{
  "status": 400,
  "title": "Prompt inválido",
  "detail": "El prompt no puede estar vacío. Por favor, proporciona una pregunta o mensaje válido."
}
```

**Response Error (500):**
```json
{
  "status": 500,
  "title": "Error al procesar la solicitud",
  "detail": "Ocurrió un error interno al procesar tu pregunta. Por favor, intenta de nuevo más tarde."
}
```

## Notas Importantes

1. **Puerto del Backend:** Asegúrate de que el backend esté corriendo en el puerto `5187`
2. **CORS:** La configuración de CORS debe permitir peticiones desde `http://localhost:5173` (puerto de Vite)
3. **Validación:** El controlador valida que el prompt no esté vacío antes de procesarlo
4. **Logging:** Se incluye logging para facilitar el debugging
5. **Manejo de Errores:** Se manejan errores con respuestas apropiadas y descriptivas

## Prueba con cURL

```bash
curl -X POST http://localhost:5187/api/ia/ask \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"¿Cómo puedo mejorar mi productividad?\"}"
```

## Prueba con PowerShell

```powershell
$body = @{
    prompt = "¿Cómo puedo mejorar mi productividad?"
    context = "Soy estudiante"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5187/api/ia/ask" -Method Post -Body $body -ContentType "application/json"
```
