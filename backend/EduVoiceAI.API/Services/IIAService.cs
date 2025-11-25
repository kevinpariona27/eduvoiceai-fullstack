namespace EduVoiceAI.API.Services;

/// <summary>
/// Interfaz para el servicio de inteligencia artificial
/// </summary>
public interface IIAService
{
    /// <summary>
    /// Envía una pregunta al servicio de IA
    /// </summary>
    /// <param name="prompt">Pregunta o prompt para la IA</param>
    /// <returns>Respuesta de la IA</returns>
    Task<string> AskAsync(string prompt);

    /// <summary>
    /// Envía una pregunta con contexto adicional al servicio de IA
    /// </summary>
    /// <param name="prompt">Pregunta o prompt para la IA</param>
    /// <param name="context">Contexto adicional para la pregunta</param>
    /// <returns>Respuesta de la IA</returns>
    Task<string> AskWithContextAsync(string prompt, string context);

    /// <summary>
    /// Transcribe un archivo de audio a texto
    /// </summary>
    /// <param name="audioStream">Stream del archivo de audio</param>
    /// <param name="fileName">Nombre del archivo de audio</param>
    /// <returns>Texto transcrito del audio</returns>
    Task<string> TranscribeAudioAsync(Stream audioStream, string fileName);
}
