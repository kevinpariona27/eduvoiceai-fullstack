using EduVoiceAI.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace EduVoiceAI.API.Controllers;

/// <summary>
/// Controlador para interactuar con servicios de inteligencia artificial
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Inteligencia Artificial")]
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
    /// Envía una pregunta al servicio de IA
    /// </summary>
    /// <param name="request">Objeto con el prompt de la pregunta y contexto opcional</param>
    /// <returns>Respuesta generada por la IA</returns>
    /// <response code="200">Retorna la respuesta de la IA exitosamente</response>
    /// <response code="400">Prompt inválido o vacío</response>
    /// <remarks>
    /// Ejemplo de solicitud:
    /// 
    ///     POST /api/ia/ask
    ///     {
    ///         "prompt": "¿Cómo puedo organizar mejor mi tiempo de estudio?"
    ///     }
    ///     
    /// Con contexto:
    /// 
    ///     POST /api/ia/ask
    ///     {
    ///         "prompt": "¿Qué temas debo repasar?",
    ///         "context": "Tengo un examen de matemáticas la próxima semana"
    ///     }
    /// </remarks>
    [HttpPost("ask")]
    [ProducesResponseType(typeof(IAResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IAResponseDto>> Ask([FromBody] IARequestDto request)
    {
        // Validar que el request no sea nulo
        if (request == null)
        {
            _logger.LogWarning("Se recibió una petición nula");
            return BadRequest(new { message = "La solicitud no puede estar vacía" });
        }

        // Validar que el prompt no esté vacío
        if (string.IsNullOrWhiteSpace(request.Prompt))
        {
            _logger.LogWarning("Se recibió una petición con prompt vacío");
            return BadRequest(new { message = "El prompt no puede estar vacío" });
        }

        _logger.LogInformation("Procesando pregunta de IA: {Prompt}", request.Prompt);

        try
        {
            string response;

            // Si hay contexto, usar AskWithContextAsync, si no, usar AskAsync
            if (!string.IsNullOrWhiteSpace(request.Context))
            {
                _logger.LogInformation("Procesando con contexto adicional");
                response = await _iaService.AskWithContextAsync(request.Prompt, request.Context);
            }
            else
            {
                response = await _iaService.AskAsync(request.Prompt);
            }
            
            return Ok(new IAResponseDto
            {
                Response = response,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al procesar la pregunta de IA");
            return StatusCode(500, new { message = "Error al procesar la solicitud. Por favor, intente nuevamente." });
        }
    }

    /// <summary>
    /// Transcribe un archivo de audio a texto usando IA
    /// </summary>
    /// <param name="audioFile">Archivo de audio (MP3, WAV, M4A, OGG)</param>
    /// <returns>Texto transcrito del audio</returns>
    /// <response code="200">Retorna el texto transcrito exitosamente</response>
    /// <response code="400">Archivo de audio inválido o formato no soportado</response>
    /// <remarks>
    /// Ejemplo de solicitud usando cURL:
    /// 
    ///     curl -X POST "https://localhost:5001/api/ia/voice" \
    ///       -H "Content-Type: multipart/form-data" \
    ///       -F "audioFile=@/path/to/audio.mp3"
    ///     
    /// Formatos soportados: MP3, WAV, M4A, OGG
    /// Tamaño máximo recomendado: 10MB
    /// </remarks>
    [HttpPost("voice")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(VoiceTranscriptionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [RequestFormLimits(MultipartBodyLengthLimit = 10485760)] // 10MB
    [RequestSizeLimit(10485760)] // 10MB
    public async Task<ActionResult<VoiceTranscriptionResponse>> TranscribeVoice(IFormFile audioFile)
    {
        if (audioFile == null || audioFile.Length == 0)
        {
            _logger.LogWarning("No se recibió ningún archivo de audio");
            return BadRequest(new { message = "Debe proporcionar un archivo de audio" });
        }

        // Validar tamaño del archivo (10MB)
        if (audioFile.Length > 10485760)
        {
            _logger.LogWarning("Archivo de audio demasiado grande: {Size} bytes", audioFile.Length);
            return BadRequest(new { message = "El archivo de audio no debe exceder los 10MB" });
        }

        // Validar formato
        var extension = Path.GetExtension(audioFile.FileName).ToLower();
        if (extension != ".mp3" && extension != ".wav" && extension != ".m4a" && extension != ".ogg")
        {
            _logger.LogWarning("Formato de audio no soportado: {Extension}", extension);
            return BadRequest(new { message = "Formato no soportado. Use MP3, WAV, M4A u OGG" });
        }

        _logger.LogInformation("Procesando archivo de audio: {FileName}, Tamaño: {Size} bytes, Tipo: {ContentType}", 
            audioFile.FileName, audioFile.Length, audioFile.ContentType);

        try
        {
            using var stream = audioFile.OpenReadStream();
            var transcription = await _iaService.TranscribeAudioAsync(stream, audioFile.FileName);

            return Ok(new VoiceTranscriptionResponse
            {
                FileName = audioFile.FileName,
                FileSize = audioFile.Length,
                ContentType = audioFile.ContentType,
                Transcription = transcription,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al transcribir el audio");
            return StatusCode(500, new { message = "Error al procesar el archivo de audio" });
        }
    }
}

/// <summary>
/// Modelo de solicitud para el servicio de IA
/// </summary>
public class IARequestDto
{
    /// <summary>
    /// Pregunta o prompt para la IA (requerido)
    /// </summary>
    [Required(ErrorMessage = "El prompt es obligatorio")]
    [MinLength(1, ErrorMessage = "El prompt no puede estar vacío")]
    public string Prompt { get; set; } = string.Empty;

    /// <summary>
    /// Contexto adicional para la pregunta (opcional)
    /// </summary>
    public string? Context { get; set; }
}

/// <summary>
/// Modelo de respuesta del servicio de IA
/// </summary>
public class IAResponseDto
{
    /// <summary>
    /// Respuesta generada por la IA
    /// </summary>
    public string Response { get; set; } = string.Empty;

    /// <summary>
    /// Fecha y hora de la respuesta
    /// </summary>
    public DateTime Timestamp { get; set; }
}

/// <summary>
/// Modelo de respuesta para la transcripción de voz
/// </summary>
public class VoiceTranscriptionResponse
{
    /// <summary>
    /// Nombre del archivo de audio
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Tamaño del archivo en bytes
    /// </summary>
    public long FileSize { get; set; }

    /// <summary>
    /// Tipo de contenido del archivo
    /// </summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>
    /// Texto transcrito del audio
    /// </summary>
    public string Transcription { get; set; } = string.Empty;

    /// <summary>
    /// Fecha y hora de la transcripción
    /// </summary>
    public DateTime Timestamp { get; set; }
}
