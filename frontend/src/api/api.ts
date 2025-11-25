import axios from "axios";

// Obtener la URL de la API desde las variables de entorno
// Vite expone las variables que empiezan con VITE_ en import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5187";

console.log("🔗 API Base URL:", API_BASE_URL);

export const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Manejo global de errores
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error en API:", error);
    return Promise.reject(error);
  }
);

// Tipos para las peticiones y respuestas de IA
export interface IARequest {
  prompt: string;
  context?: string;
}

export interface IAResponse {
  response: string;
}

/**
 * Envía un mensaje al asistente de IA
 * @param prompt - El mensaje o pregunta del usuario
 * @param context - Contexto opcional adicional
 * @returns La respuesta del asistente
 */
export const askIA = async (prompt: string, context?: string): Promise<string> => {
  try {
    if (!prompt || prompt.trim() === "") {
      throw new Error("El prompt no puede estar vacío");
    }

    const requestBody: IARequest = {
      prompt: prompt.trim(),
    };

    if (context && context.trim() !== "") {
      requestBody.context = context.trim();
    }

    console.log("📤 Enviando mensaje a IA:", requestBody);

    const response = await API.post<IAResponse>("/ia/ask", requestBody);

    console.log("📥 Respuesta recibida de IA:", response.data);

    return response.data.response || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error de Axios:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Manejar errores específicos del servidor
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.message || "Solicitud inválida. Verifica los datos enviados."
        );
      }

      if (error.response?.status === 500) {
        throw new Error("Error en el servidor. Por favor, intenta de nuevo más tarde.");
      }

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5187"
        );
      }
    }

    console.error("❌ Error inesperado al comunicarse con la IA:", error);
    throw error;
  }
};

export default API;
