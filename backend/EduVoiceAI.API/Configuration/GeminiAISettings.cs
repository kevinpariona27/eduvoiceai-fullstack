namespace EduVoiceAI.API.Configuration;

/// <summary>
/// Configuración para la integración con Gemini AI
/// </summary>
public record GeminiAISettings
{
    /// <summary>
    /// URL base del servicio Gemini AI
    /// </summary>
    public string BaseUrl { get; init; } = string.Empty;

    /// <summary>
    /// Modelo de Gemini AI a utilizar
    /// </summary>
    public string Model { get; init; } = string.Empty;  // ← AÑADE ESTA LÍNEA

    /// <summary>
    /// Clave de API para autenticación con Gemini AI
    /// </summary>
    public string ApiKey { get; init; } = string.Empty;
}