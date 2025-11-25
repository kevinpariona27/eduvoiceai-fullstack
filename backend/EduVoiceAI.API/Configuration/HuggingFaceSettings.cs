namespace EduVoiceAI.API.Configuration;

/// <summary>
/// Configuración para la integración con Hugging Face
/// </summary>
public record HuggingFaceSettings
{
    /// <summary>
    /// URL base del servicio Hugging Face
    /// </summary>
    public string BaseUrl { get; init; } = string.Empty;

    /// <summary>
    /// Clave de API para autenticación con Hugging Face
    /// </summary>
    public string ApiKey { get; init; } = string.Empty;
}
