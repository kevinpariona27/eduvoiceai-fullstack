import AssistantChat from '../components/AssistantChat';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            ¡Hola, {user?.nombre}! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            ¿En qué puedo ayudarte hoy?
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Principal */}
          <div className="lg:col-span-2">
            <AssistantChat />
          </div>

          {/* Sidebar con accesos rápidos */}
          <div className="space-y-6">
            {/* Card de accesos rápidos */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Accesos rápidos
              </h3>
              <div className="space-y-3">
                <a
                  href="/tasks"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      ✓
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Mis Tareas</p>
                    <p className="text-sm text-slate-500">Organiza tu día</p>
                  </div>
                </a>

                <a
                  href="/events"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      📅
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Calendario</p>
                    <p className="text-sm text-slate-500">Ver eventos</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Tips del día */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">💡 Tip del día</h3>
              <p className="text-slate-200 text-sm leading-relaxed">
                Usa el asistente de voz para crear tareas rápidamente. Solo di 
                "Agregar tarea" seguido de la descripción.
              </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Tu progreso
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Tareas completadas</span>
                  <span className="font-bold text-slate-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Eventos próximos</span>
                  <span className="font-bold text-slate-900">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Racha actual</span>
                  <span className="font-bold text-slate-900">7 días 🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
