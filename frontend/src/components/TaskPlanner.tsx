import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Interfaces para las tareas
interface Task {
  id?: number;
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: 'Baja' | 'Media' | 'Alta';
  isCompleted?: boolean;
  userId?: number;
  // Campos para compatibilidad UI
  nombre?: string;
  fecha?: string;
  prioridad?: 'Baja' | 'Media' | 'Alta';
  completada?: boolean;
}

interface WeekSchedule {
  semana: number;
  fechaInicio: string;
  fechaFin: string;
  tareas: Task[];
}

export default function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Estado del formulario
  const [newTask, setNewTask] = useState<Task>({
    nombre: '',
    fecha: '',
    prioridad: 'Media',
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5187';

  // Cargar todas las tareas
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/taskplans`);
      // Transformar datos del backend a formato UI
      const transformedTasks = response.data.map((task: unknown) => {
        const t = task as { id?: number; title?: string; dueDate?: string; priority?: string; isCompleted?: boolean };
        return {
          id: t.id,
          nombre: t.title || '',
          fecha: t.dueDate ? t.dueDate.split('T')[0] : '',
          prioridad: (t.priority as 'Baja' | 'Media' | 'Alta') || 'Media',
          completada: t.isCompleted || false,
        };
      });
      setTasks(transformedTasks);
      console.log('✅ Tareas cargadas:', transformedTasks);
    } catch (error) {
      console.error('❌ Error al cargar tareas:', error);
      if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
        alert('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener número de semana del año
  const getWeekNumber = useCallback((date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }, []);

  // Obtener lunes de la semana
  const getMonday = useCallback((date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }, []);

  // Obtener domingo de la semana
  const getSunday = useCallback((date: Date): Date => {
    const monday = getMonday(date);
    return new Date(monday.setDate(monday.getDate() + 6));
  }, [getMonday]);

  // Generar planificación semanal desde las tareas
  const generateWeeklySchedule = useCallback((tasks: Task[]): WeekSchedule[] => {
    if (tasks.length === 0) return [];

    // Agrupar tareas por semana
    const tasksByWeek = new Map<number, Task[]>();
    
    tasks.forEach(task => {
      if (!task.fecha) return; // Ignorar tareas sin fecha
      const date = new Date(task.fecha);
      const weekNumber = getWeekNumber(date);
      
      if (!tasksByWeek.has(weekNumber)) {
        tasksByWeek.set(weekNumber, []);
      }
      tasksByWeek.get(weekNumber)?.push(task);
    });

    // Convertir a formato WeekSchedule
    const schedule: WeekSchedule[] = [];
    tasksByWeek.forEach((weekTasks, weekNum) => {
      const sortedTasks = weekTasks.sort((a, b) => {
        const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
        return dateA - dateB;
      });
      
      const firstTask = sortedTasks[0];
      const lastTask = sortedTasks[sortedTasks.length - 1];
      
      if (!firstTask.fecha || !lastTask.fecha) return; // Saltar si no hay fechas
      
      schedule.push({
        semana: weekNum,
        fechaInicio: getMonday(new Date(firstTask.fecha)).toISOString().split('T')[0],
        fechaFin: getSunday(new Date(lastTask.fecha)).toISOString().split('T')[0],
        tareas: sortedTasks
      });
    });

    return schedule.sort((a, b) => a.semana - b.semana);
  }, [getMonday, getSunday, getWeekNumber]);

  // Actualizar planificación cuando cambien las tareas
  useEffect(() => {
    setWeekSchedule(generateWeeklySchedule(tasks));
  }, [tasks, generateWeeklySchedule]);

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Agregar nueva tarea
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.nombre?.trim() || !newTask.fecha) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      // Transformar datos a formato backend
      const backendTask = {
        Title: newTask.nombre,
        Description: newTask.nombre, // Usar el mismo valor si no hay descripción separada
        DueDate: `${newTask.fecha}T09:00:00`, // Agregar hora por defecto
        Priority: newTask.prioridad,
        IsCompleted: false,
        UserId: 1, // Por ahora usamos un UserId fijo
      };
      const response = await axios.post(`${apiUrl}/api/taskplans`, backendTask);
      console.log('✅ Tarea creada:', response.data);
      
      // Recargar tareas
      await loadTasks();
      
      // Limpiar formulario
      setNewTask({
        nombre: '',
        fecha: '',
        prioridad: 'Media',
      });
      setShowForm(false);
      
      alert('¡Tarea agregada exitosamente!');
    } catch (error) {
      console.error('❌ Error al crear tarea:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Marcar tarea como completada
  const toggleTaskComplete = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      await axios.patch(`${apiUrl}/api/taskplans/${taskId}`, {
        IsCompleted: !task.completada,
      });
      
      await loadTasks();
    } catch (error) {
      console.error('❌ Error al actualizar tarea:', error);
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    try {
      await axios.delete(`${apiUrl}/api/taskplans/${taskId}`);
      await loadTasks();
      alert('Tarea eliminada');
    } catch (error) {
      console.error('❌ Error al eliminar tarea:', error);
    }
  };

  // Obtener color según prioridad
  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Baja':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planificador de Tareas</h1>
          <p className="text-gray-600 mt-1">Organiza y programa tus tareas semanales</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Cancelar' : 'Nueva Tarea'}
        </button>
      </div>

      {/* Formulario de nueva tarea */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Agregar Nueva Tarea</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nombre de la tarea */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la tarea *
                </label>
                <input
                  type="text"
                  value={newTask.nombre}
                  onChange={(e) => setNewTask({ ...newTask, nombre: e.target.value })}
                  placeholder="Ej: Estudiar para el examen de matemáticas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={newTask.fecha}
                  onChange={(e) => setNewTask({ ...newTask, fecha: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <div className="flex gap-3">
                {(['Baja', 'Media', 'Alta'] as const).map((priority) => (
                  <label
                    key={priority}
                    className={`flex-1 cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                      newTask.prioridad === priority
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="prioridad"
                      value={priority}
                      checked={newTask.prioridad === priority}
                      onChange={(e) => setNewTask({ ...newTask, prioridad: e.target.value as Task['prioridad'] })}
                      className="sr-only"
                    />
                    <span className={`font-medium ${newTask.prioridad === priority ? 'text-slate-900' : 'text-slate-700'}`}>
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Agregar Tarea'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de todas las tareas */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Todas las Tareas</h2>
          <button
            onClick={loadTasks}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Recargar
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full"></div>
            <p className="text-gray-600 mt-4">Cargando tareas...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 text-lg">No hay tareas registradas</p>
            <p className="text-gray-500 text-sm mt-1">Agrega tu primera tarea usando el botón de arriba</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  task.completada
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completada || false}
                  onChange={() => task.id && toggleTaskComplete(task.id)}
                  className="w-5 h-5 text-slate-900 rounded focus:ring-2 focus:ring-slate-500 cursor-pointer"
                />

                {/* Contenido */}
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completada ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.nombre}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📅 {task.fecha ? formatDate(task.fecha) : 'Sin fecha'}
                  </p>
                </div>

                {/* Prioridad */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.prioridad || 'Media')}`}>
                  {task.prioridad || 'Media'}
                </span>

                {/* Botón eliminar */}
                <button
                  onClick={() => task.id && deleteTask(task.id)}
                  className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar tarea"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Planificación Semanal */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Planificación Semanal</h2>
          <span className="text-sm text-gray-600">Generada automáticamente</span>
        </div>

        {weekSchedule.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-lg">No hay planificación semanal disponible</p>
            <p className="text-gray-500 text-sm mt-1">Agrega tareas para generar la planificación</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {weekSchedule.map((week) => (
              <div key={week.semana} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Header de la semana */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                  <h3 className="text-lg font-semibold">Semana {week.semana}</h3>
                  <p className="text-sm text-blue-100 mt-1">
                    {formatDate(week.fechaInicio)} - {formatDate(week.fechaFin)}
                  </p>
                </div>

                {/* Tareas de la semana */}
                <div className="p-4 space-y-2">
                  {week.tareas.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Sin tareas esta semana</p>
                  ) : (
                    week.tareas.map((task, index) => (
                      <div
                        key={task.id || index}
                        className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 text-sm">{task.nombre}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              📅 {task.fecha ? new Date(task.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Sin fecha'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.prioridad || 'Media')}`}>
                            {task.prioridad || 'Media'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer con contador */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{week.tareas.length}</span> tarea{week.tareas.length !== 1 ? 's' : ''} programada{week.tareas.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
