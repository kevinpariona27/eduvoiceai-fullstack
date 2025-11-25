import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Interfaces para la Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
}

// Declaración global para TypeScript
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente educativo. ¿En qué puedo ayudarte hoy?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      
      // Configuración para captura continua
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'es-ES';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        // Obtener toda la transcripción acumulada
        let fullTranscript = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            fullTranscript += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }

        console.log('Transcripción final:', fullTranscript);
        console.log('Transcripción temporal:', currentInterim);

        // Actualizar el input con el texto final
        if (fullTranscript) {
          setInputMessage((prev) => {
            const newValue = prev + fullTranscript;
            console.log('Nuevo valor del input:', newValue);
            return newValue;
          });
        }
        
        // Mostrar la transcripción temporal
        setInterimTranscript(currentInterim);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('❌ Error de reconocimiento de voz:', event.error);
        
        // No detener por falta de voz, solo por errores graves
        if (event.error === 'aborted' || event.error === 'not-allowed') {
          setIsRecording(false);
          setInterimTranscript('');
          alert(`Error de micrófono: ${event.error}. Verifica los permisos del navegador.`);
        }
      };

      recognitionInstance.onstart = () => {
        console.log('✅ Reconocimiento de voz iniciado');
      };

      recognitionInstance.onend = () => {
        console.log('⏹️ Reconocimiento de voz finalizado');
        setIsRecording(false);
        setInterimTranscript('');
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('⚠️ Web Speech API no disponible en este navegador');
    }
  }, []);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Llamada al backend usando la variable de entorno
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5187';
      const response = await axios.post(`${apiUrl}/api/ia/ask`, {
        prompt: currentMessage,
      });

      // Agregar respuesta de la IA
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: response.data.response || 'Lo siento, no pude procesar tu mensaje.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al comunicarse con la IA:', error);

      let errorText = 'Lo siento, hubo un error al conectar con el asistente.';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          errorText = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else if (error.response?.status === 400) {
          errorText = error.response.data?.detail || 'Solicitud inválida.';
        }
      }

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.');
      return;
    }

    if (isRecording) {
      // Detener grabación
      recognition.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      // Iniciar grabación
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error al iniciar reconocimiento:', error);
        setIsRecording(false);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Asistente IA</h2>
            <p className="text-sm text-slate-300">En línea</p>
          </div>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="text-sm font-medium">Grabando</span>
          </div>
        )}
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                message.sender === 'assistant' 
                  ? 'bg-slate-900' 
                  : 'bg-slate-700'
              }`}>
                <span className="text-sm sm:text-base">
                  {message.sender === 'assistant' ? '🤖' : '👤'}
                </span>
              </div>

              {/* Burbuja de mensaje */}
              <div>
                <div className={`rounded-2xl px-4 py-2.5 sm:py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                </div>
                <p className={`text-xs text-slate-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex gap-3 max-w-[70%]">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-sm sm:text-base">🤖</span>
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-slate-200">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada */}
      <div className="bg-white border-t border-slate-200 p-3 sm:p-4">
        <div className="flex gap-2 items-end">
          {/* Botón de micrófono */}
          <button
            onClick={toggleRecording}
            disabled={isLoading}
            className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isRecording ? 'Detener grabación' : 'Grabar mensaje de voz'}
          >
            {isRecording ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          {/* Campo de texto */}
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              placeholder={
                isRecording 
                  ? "🎤 Hablando..." 
                  : "Escribe tu mensaje..."
              }
              rows={1}
              className="w-full resize-none border border-slate-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            {/* Mostrar transcripción temporal */}
            {isRecording && interimTranscript && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-900 text-white rounded-xl px-3 py-2 shadow-lg">
                <p className="text-sm italic">"{interimTranscript}"</p>
              </div>
            )}
          </div>

          {/* Botón de enviar */}
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="flex-shrink-0 bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>

        {/* Advertencia de compatibilidad */}
        {!recognition && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="hidden sm:inline">Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.</span>
            <span className="sm:hidden">Usa Chrome/Edge/Safari para voz.</span>
          </p>
        )}
      </div>
    </div>
  );
}
