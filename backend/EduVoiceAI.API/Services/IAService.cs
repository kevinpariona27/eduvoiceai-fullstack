using EduVoiceAI.API.Configuration;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text;

namespace EduVoiceAI.API.Services;

/// <summary>
/// Implementación del servicio de inteligencia artificial
/// </summary>
public class IAService : IIAService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<IAService> _logger;
    private readonly GeminiAISettings _geminiSettings;
    private readonly HuggingFaceSettings _huggingFaceSettings;

    public IAService(
        HttpClient httpClient,
        ILogger<IAService> logger,
        IOptions<GeminiAISettings> geminiSettings,
        IOptions<HuggingFaceSettings> huggingFaceSettings)
    {
        _httpClient = httpClient;
        _logger = logger;
        _geminiSettings = geminiSettings.Value;
        _huggingFaceSettings = huggingFaceSettings.Value;
        _logger.LogInformation("🔑 Gemini API Key detectada (primeros 10 caracteres): {Key}",
       _geminiSettings.ApiKey?.Substring(0 , Math.Min(10, _geminiSettings.ApiKey.Length)));
    }

    /// <inheritdoc/>
    public async Task<string> AskAsync(string prompt)
    {
        if (string.IsNullOrWhiteSpace(prompt))
        {
            _logger.LogWarning("Se recibió un prompt vacío");
            return "Por favor, proporciona una pregunta válida.";
        }

        _logger.LogInformation("Enviando pregunta a servicios de IA: {Prompt}", prompt);

        // Intentar primero con Gemini AI
        var geminiResponse = await TryGeminiAsync(prompt);
        if (!string.IsNullOrEmpty(geminiResponse))
        {
            return geminiResponse;
        }

        // Si Gemini falla, intentar con Hugging Face
        var huggingFaceResponse = await TryHuggingFaceAsync(prompt);
        if (!string.IsNullOrEmpty(huggingFaceResponse))
        {
            return huggingFaceResponse;
        }

        // Si ambos fallan, retornar respuesta simulada
        return GetFallbackResponse(prompt);
    }

    /// <inheritdoc/>
    public async Task<string> AskWithContextAsync(string prompt, string context)
    {
        if (string.IsNullOrWhiteSpace(prompt))
        {
            _logger.LogWarning("Se recibió un prompt vacío");
            return "Por favor, proporciona una pregunta válida.";
        }

        _logger.LogInformation("Enviando pregunta con contexto a servicios de IA");

        // Combinar el contexto con el prompt
        var fullPrompt = $"Contexto: {context}\n\nPregunta: {prompt}";

        // Intentar primero con Gemini AI
        var geminiResponse = await TryGeminiAsync(fullPrompt);
        if (!string.IsNullOrEmpty(geminiResponse))
        {
            return geminiResponse;
        }

        // Si Gemini falla, intentar con Hugging Face
        var huggingFaceResponse = await TryHuggingFaceAsync(fullPrompt);
        if (!string.IsNullOrEmpty(huggingFaceResponse))
        {
            return huggingFaceResponse;
        }

        // Si ambos fallan, retornar respuesta simulada
        return GetFallbackResponse(prompt);
    }

    /// <inheritdoc/>
    public async Task<string> TranscribeAudioAsync(Stream audioStream, string fileName)
    {
        if (audioStream == null || audioStream.Length == 0)
        {
            _logger.LogWarning("Se recibió un stream de audio vacío");
            return "No se proporcionó ningún archivo de audio.";
        }

        _logger.LogInformation("Iniciando transcripción de audio: {FileName}, Tamaño: {Size} bytes", 
            fileName, audioStream.Length);

        // Verificar formato de audio
        var extension = Path.GetExtension(fileName).ToLower();
        if (extension != ".mp3" && extension != ".wav" && extension != ".m4a" && extension != ".ogg")
        {
            _logger.LogWarning("Formato de audio no soportado: {Extension}", extension);
            return "Formato de audio no soportado. Use MP3, WAV, M4A u OGG.";
        }

        // Intentar primero con Hugging Face Whisper
        var whisperResult = await TryWhisperTranscriptionAsync(audioStream, fileName);
        if (!string.IsNullOrEmpty(whisperResult))
        {
            return whisperResult;
        }

        // Resetear el stream para el siguiente intento
        if (audioStream.CanSeek)
        {
            audioStream.Seek(0, SeekOrigin.Begin);
        }

        // Si Whisper falla, intentar con Gemini (si soporta audio)
        var geminiResult = await TryGeminiAudioAsync(audioStream, fileName);
        if (!string.IsNullOrEmpty(geminiResult))
        {
            return geminiResult;
        }

        // Si ambos fallan, retornar respuesta simulada
        return GetFallbackTranscription(fileName);
    }
    private async Task<string?> TryGeminiAsync(string prompt, int maxRetries = 3)
    {
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                _logger.LogInformation("Intentando con Gemini AI (intento {Attempt}/{MaxRetries})", attempt, maxRetries);

                if (string.IsNullOrEmpty(_geminiSettings.ApiKey) ||
                    _geminiSettings.ApiKey == "your-gemini-api-key-here")
                {
                    _logger.LogWarning("API Key de Gemini no configurada");
                    return null;
                }

                var requestBody = new
                {
                    contents = new[]
                    {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
                };

                var jsonContent = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
                var url = $"{_geminiSettings.BaseUrl}/models/{_geminiSettings.Model}:generateContent?key={_geminiSettings.ApiKey}";

                _logger.LogInformation("Enviando solicitud a Gemini: {Url}", url.Replace(_geminiSettings.ApiKey, "***"));
                var response = await _httpClient.PostAsync(url, content);

                if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable && attempt < maxRetries)
                {
                    var waitTime = TimeSpan.FromSeconds(Math.Pow(2, attempt)); // Espera exponencial: 2s, 4s, 8s
                    _logger.LogWarning("Servicio sobrecargado. Reintentando en {Seconds} segundos...", waitTime.TotalSeconds);
                    await Task.Delay(waitTime);
                    continue; // Reintenta
                }

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Error en Gemini AI: {StatusCode}, Respuesta: {Error}",
                        response.StatusCode, errorContent);
                    return null;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);

                // Extraer el texto de la respuesta de Gemini
                if (jsonResponse.TryGetProperty("candidates", out var candidates) &&
                    candidates.GetArrayLength() > 0)
                {
                    var firstCandidate = candidates[0];
                    if (firstCandidate.TryGetProperty("content", out var contentProp) &&
                        contentProp.TryGetProperty("parts", out var parts) &&
                        parts.GetArrayLength() > 0)
                    {
                        var firstPart = parts[0];
                        if (firstPart.TryGetProperty("text", out var text))
                        {
                            var result = text.GetString();
                            _logger.LogInformation("Respuesta exitosa de Gemini AI en intento {Attempt}", attempt);
                            return result;
                        }
                    }
                }

                _logger.LogWarning("No se pudo extraer la respuesta de Gemini AI");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al comunicarse con Gemini AI en intento {Attempt}", attempt);

                if (attempt < maxRetries)
                {
                    var waitTime = TimeSpan.FromSeconds(Math.Pow(2, attempt));
                    _logger.LogInformation("Reintentando en {Seconds} segundos...", waitTime.TotalSeconds);
                    await Task.Delay(waitTime);
                }
            }
        }

        _logger.LogError("Se agotaron todos los reintentos para Gemini AI");
        return null;
    }
    private async Task<string?> TryHuggingFaceAsync(string prompt)
    {
        try
        {
            _logger.LogInformation("Intentando con Hugging Face");

            if (string.IsNullOrEmpty(_huggingFaceSettings.ApiKey) || 
                _huggingFaceSettings.ApiKey == "your-huggingface-api-key-here")
            {
                _logger.LogWarning("API Key de Hugging Face no configurada");
                return null;
            }

            var requestBody = new
            {
                inputs = prompt,
                parameters = new
                {
                    max_new_tokens = 250,
                    temperature = 0.7,
                    top_p = 0.95,
                    do_sample = true
                }
            };

            var jsonContent = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_huggingFaceSettings.ApiKey}");

            // Usar un modelo de lenguaje de Hugging Face
            var url = $"{_huggingFaceSettings.BaseUrl}/models/mistralai/Mistral-7B-Instruct-v0.2";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Error en Hugging Face: {StatusCode}", response.StatusCode);
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonSerializer.Deserialize<JsonElement[]>(responseContent);

            if (jsonResponse != null && jsonResponse.Length > 0)
            {
                if (jsonResponse[0].TryGetProperty("generated_text", out var generatedText))
                {
                    var result = generatedText.GetString();
                    _logger.LogInformation("Respuesta exitosa de Hugging Face");
                    return result;
                }
            }

            _logger.LogWarning("No se pudo extraer la respuesta de Hugging Face");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al comunicarse con Hugging Face");
            return null;
        }
    }

    private async Task<string?> TryWhisperTranscriptionAsync(Stream audioStream, string fileName)
    {
        try
        {
            _logger.LogInformation("Intentando transcripción con Hugging Face Whisper");

            if (string.IsNullOrEmpty(_huggingFaceSettings.ApiKey) || 
                _huggingFaceSettings.ApiKey == "your-huggingface-api-key-here")
            {
                _logger.LogWarning("API Key de Hugging Face no configurada");
                return null;
            }

            // Crear el contenido multipart/form-data
            using var content = new MultipartFormDataContent();
            
            // Convertir el stream a byte array
            byte[] audioBytes;
            if (audioStream is MemoryStream ms)
            {
                audioBytes = ms.ToArray();
            }
            else
            {
                using var memoryStream = new MemoryStream();
                await audioStream.CopyToAsync(memoryStream);
                audioBytes = memoryStream.ToArray();
            }

            var audioContent = new ByteArrayContent(audioBytes);
            audioContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("audio/mpeg");
            content.Add(audioContent, "file", fileName);

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_huggingFaceSettings.ApiKey}");

            // Usar modelo Whisper de Hugging Face
            var url = $"{_huggingFaceSettings.BaseUrl}/models/openai/whisper-large-v3";
            
            _logger.LogInformation("Enviando audio a Whisper, tamaño: {Size} bytes", audioBytes.Length);
            
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error en Whisper: {StatusCode}, Respuesta: {Error}", 
                    response.StatusCode, errorContent);
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);

            // Extraer el texto transcrito
            if (jsonResponse.TryGetProperty("text", out var text))
            {
                var transcription = text.GetString();
                _logger.LogInformation("Transcripción exitosa con Whisper: {Length} caracteres", 
                    transcription?.Length ?? 0);
                return transcription;
            }

            _logger.LogWarning("No se pudo extraer la transcripción de Whisper");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al transcribir con Whisper");
            return null;
        }
    }

    private async Task<string?> TryGeminiAudioAsync(Stream audioStream, string fileName)
    {
        try
        {
            _logger.LogInformation("Intentando transcripción con Gemini");

            if (string.IsNullOrEmpty(_geminiSettings.ApiKey) || 
                _geminiSettings.ApiKey == "your-gemini-api-key-here")
            {
                _logger.LogWarning("API Key de Gemini no configurada");
                return null;
            }

            // Gemini requiere que el audio esté en base64
            byte[] audioBytes;
            if (audioStream is MemoryStream ms)
            {
                audioBytes = ms.ToArray();
            }
            else
            {
                using var memoryStream = new MemoryStream();
                await audioStream.CopyToAsync(memoryStream);
                audioBytes = memoryStream.ToArray();
            }

            var base64Audio = Convert.ToBase64String(audioBytes);
            
            // Determinar el mime type según la extensión
            var extension = Path.GetExtension(fileName).ToLower();
            var mimeType = extension switch
            {
                ".mp3" => "audio/mpeg",
                ".wav" => "audio/wav",
                ".m4a" => "audio/mp4",
                ".ogg" => "audio/ogg",
                _ => "audio/mpeg"
            };

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new object[]
                        {
                            new { text = "Transcribe este audio a texto:" },
                            new 
                            { 
                                inline_data = new
                                {
                                    mime_type = mimeType,
                                    data = base64Audio
                                }
                            }
                        }
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var url = $"{_geminiSettings.BaseUrl}/models/gemini-1.5-flash:generateContent?key={_geminiSettings.ApiKey}";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error en Gemini Audio: {StatusCode}, Respuesta: {Error}", 
                    response.StatusCode, errorContent);
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);

            // Extraer el texto de la respuesta de Gemini
            if (jsonResponse.TryGetProperty("candidates", out var candidates) &&
                candidates.GetArrayLength() > 0)
            {
                var firstCandidate = candidates[0];
                if (firstCandidate.TryGetProperty("content", out var contentProp) &&
                    contentProp.TryGetProperty("parts", out var parts) &&
                    parts.GetArrayLength() > 0)
                {
                    var firstPart = parts[0];
                    if (firstPart.TryGetProperty("text", out var textProp))
                    {
                        var transcription = textProp.GetString();
                        _logger.LogInformation("Transcripción exitosa con Gemini");
                        return transcription;
                    }
                }
            }

            _logger.LogWarning("No se pudo extraer la transcripción de Gemini");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al transcribir con Gemini");
            return null;
        }
    }

    private string GetFallbackTranscription(string fileName)
    {
        _logger.LogWarning("Usando transcripción simulada (fallback) para: {FileName}", fileName);

        return $"[Transcripción simulada]\n\n" +
               $"El archivo de audio '{fileName}' fue recibido correctamente, pero actualmente " +
               $"los servicios de transcripción no están disponibles.\n\n" +
               $"Para habilitar la transcripción real:\n" +
               $"1. Configure una API Key válida de Hugging Face en appsettings.json\n" +
               $"2. O configure una API Key válida de Gemini AI\n\n" +
               $"Formatos soportados: MP3, WAV, M4A, OGG\n" +
               $"Tamaño máximo recomendado: 10MB\n\n" +
               $"Una vez configurado, podrá transcribir audio en tiempo real.";
    }

    private string GetFallbackResponse(string prompt)
    {
        _logger.LogWarning("Usando respuesta simulada (fallback)");

        var lowerPrompt = prompt.ToLower();

        // Respuestas contextuales según el tipo de pregunta
        if (lowerPrompt.Contains("tarea") || lowerPrompt.Contains("estudiar"))
        {
            return "Para ayudarte mejor con tus tareas, te recomiendo:\n\n" +
                   "1. Divide tu tarea en partes más pequeñas\n" +
                   "2. Establece horarios específicos para cada parte\n" +
                   "3. Toma descansos regulares de 10-15 minutos\n" +
                   "4. Usa técnicas de memorización como mapas mentales\n" +
                   "5. Revisa tus apuntes antes de empezar\n\n" +
                   "¿Hay algo específico con lo que necesites ayuda?";
        }

        if (lowerPrompt.Contains("examen") || lowerPrompt.Contains("prueba"))
        {
            return "Para prepararte para un examen, te sugiero:\n\n" +
                   "1. Comienza a estudiar con al menos una semana de anticipación\n" +
                   "2. Revisa tus apuntes y material del curso\n" +
                   "3. Practica con ejercicios similares\n" +
                   "4. Forma grupos de estudio con compañeros\n" +
                   "5. Descansa bien la noche anterior\n" +
                   "6. Llega temprano el día del examen\n\n" +
                   "¡Mucho éxito en tu examen!";
        }

        if (lowerPrompt.Contains("organizar") || lowerPrompt.Contains("planificar"))
        {
            return "Para organizar mejor tu tiempo de estudio:\n\n" +
                   "1. Usa un calendario o agenda\n" +
                   "2. Prioriza las tareas según su importancia y fecha de entrega\n" +
                   "3. Establece metas diarias alcanzables\n" +
                   "4. Elimina distracciones durante el estudio\n" +
                   "5. Utiliza la técnica Pomodoro (25 minutos de estudio, 5 de descanso)\n\n" +
                   "¿Te gustaría ayuda con algo más específico?";
        }

        if (lowerPrompt.Contains("motivación") || lowerPrompt.Contains("motivado"))
        {
            return "Mantener la motivación es clave para el éxito académico:\n\n" +
                   "1. Establece objetivos claros y realistas\n" +
                   "2. Celebra tus pequeños logros\n" +
                   "3. Recuerda tus metas a largo plazo\n" +
                   "4. Busca un lugar de estudio cómodo y tranquilo\n" +
                   "5. Recompénsate después de completar tareas difíciles\n\n" +
                   "¡Tú puedes lograrlo!";
        }

        // Respuesta genérica
        return "Gracias por tu pregunta. Actualmente estoy experimentando dificultades técnicas " +
               "para conectarme con los servicios de IA.\n\n" +
               "Sin embargo, estoy aquí para ayudarte con:\n" +
               "- Organización de tareas y horarios de estudio\n" +
               "- Recordatorios de eventos importantes\n" +
               "- Consejos generales para mejorar tu rendimiento académico\n\n" +
               "Por favor, intenta reformular tu pregunta o especifica en qué área necesitas ayuda.";
    }
}
