import { useState, useEffect, useRef } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  color: string;
  reminder?: boolean;
}

type ViewType = 'day' | 'week' | 'month';

export default function EventCalendar() {
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const reminderTimersRef = useRef<Map<string, number>>(new Map());

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    color: '#4e73df',
    reminder: false,
  });

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Schedule reminders whenever events change
  useEffect(() => {
    scheduleReminders(events);
    
    // Cleanup on unmount
    const timers = reminderTimersRef.current;
    return () => {
      timers.forEach((timeoutId) => clearTimeout(timeoutId));
      timers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Save events to localStorage
  const saveEventsToStorage = (eventsToSave: CalendarEvent[]) => {
    localStorage.setItem('calendarEvents', JSON.stringify(eventsToSave));
    setEvents(eventsToSave);
  };

  // Schedule reminders for events (15 minutes before)
  const scheduleReminders = (allEvents: CalendarEvent[]) => {
    // Clear existing timers
    reminderTimersRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    reminderTimersRef.current.clear();

    allEvents.forEach((event) => {
      if (!event.reminder) return;
      
      const start = new Date(event.startTime);
      const reminderTime = new Date(start.getTime() - 15 * 60 * 1000); // 15 minutes before
      const now = new Date();
      const msUntilReminder = reminderTime.getTime() - now.getTime();

      if (msUntilReminder > 0) {
        const timerId = window.setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Recordatorio: ${event.title}`, {
              body: `Tu evento comienza a las ${formatTime(new Date(event.startTime))}`,
              icon: '/favicon.ico',
            });
          } else {
            // Fallback: alert if no notification permission
            alert(`Recordatorio: ${event.title}\nComienza a las ${formatTime(new Date(event.startTime))}`);
          }
        }, msUntilReminder);
        
        reminderTimersRef.current.set(event.id, timerId);
      }
    });
  };

  // Format date for display
  const formatDateDisplay = () => {
    switch (currentView) {
      case 'day':
        return currentDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'week': {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`;
      }
      case 'month':
        return currentDate.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
        });
    }
  };

  // Helper: format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Navigation handlers
  const goToToday = () => setCurrentDate(new Date());

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  // Modal handlers
  const openEventModal = (date?: Date, hour?: number) => {
    const targetDate = date || currentDate;
    setFormData({
      title: '',
      date: targetDate.toISOString().split('T')[0],
      startTime: hour !== undefined ? `${hour.toString().padStart(2, '0')}:00` : '09:00',
      endTime: hour !== undefined ? `${(hour + 1).toString().padStart(2, '0')}:00` : '10:00',
      description: '',
      color: '#4e73df',
      reminder: false,
    });
    setIsEditing(false);
    setShowEventModal(true);
  };

  const closeModals = () => {
    setShowEventModal(false);
    setShowDetailsModal(false);
    setSelectedEventId(null);
    setIsEditing(false);
  };

  // Save event
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    if (isEditing && selectedEventId) {
      // Update existing event
      const updatedEvents = events.map(event =>
        event.id === selectedEventId
          ? {
              ...event,
              title: formData.title,
              startTime: startDateTime.toISOString(),
              endTime: endDateTime.toISOString(),
              description: formData.description,
              color: formData.color,
              reminder: formData.reminder,
            }
          : event
      );
      saveEventsToStorage(updatedEvents);
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: formData.title,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        description: formData.description,
        color: formData.color,
        reminder: formData.reminder,
      };
      saveEventsToStorage([...events, newEvent]);
    }

    closeModals();
  };

  // Show event details
  const showEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowDetailsModal(true);
  };

  // Edit event
  const editEvent = () => {
    const event = events.find(e => e.id === selectedEventId);
    if (!event) return;

    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    setFormData({
      title: event.title,
      date: startDate.toISOString().split('T')[0],
      startTime: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
      description: event.description || '',
      color: event.color,
      reminder: !!event.reminder,
    });
    setIsEditing(true);
    setShowDetailsModal(false);
    setShowEventModal(true);
  };

  // Delete event
  const deleteEvent = () => {
    if (!selectedEventId || !confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    const updatedEvents = events.filter(e => e.id !== selectedEventId);
    saveEventsToStorage(updatedEvents);
    closeModals();
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.startTime).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  // Get events for a specific date and hour
  const getEventsForDateAndHour = (date: Date, hour: number): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDateStr = new Date(event.startTime).toISOString().split('T')[0];
      const eventHour = new Date(event.startTime).getHours();
      return eventDateStr === dateStr && eventHour === hour;
    });
  };

  // Render month view
  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const today = new Date();

    const days = [];

    // Previous month days
    for (let i = 0; i < startingDay; i++) {
      const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0 - (startingDay - i - 1));
      days.push({ date: prevDate, isOtherMonth: true });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isToday = date.toDateString() === today.toDateString();
      days.push({ date, isOtherMonth: false, isToday });
    }

    // Next month days
    const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      days.push({ date: nextDate, isOtherMonth: true });
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-700 py-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          return (
            <div
              key={index}
              onClick={() => {
                if (!day.isOtherMonth) {
                  setCurrentDate(new Date(day.date));
                  setCurrentView('day');
                }
              }}
              className={`
                min-h-24 p-2 border rounded-lg cursor-pointer transition-all hover:bg-gray-50
                ${day.isOtherMonth ? 'bg-gray-100 opacity-50' : 'bg-white'}
                ${day.isToday ? 'border-blue-500 border-2 bg-blue-50' : 'border-gray-200'}
              `}
            >
              <div className={`font-semibold mb-1 ${day.isToday ? 'text-blue-600' : ''}`}>
                {day.date.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      showEventDetails(event.id);
                    }}
                    className="text-xs px-2 py-1 rounded text-white truncate hover:opacity-80"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-600">+{dayEvents.length - 3} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div>
        <div className="text-center mb-4 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>
        
        <div className="grid grid-cols-[80px_1fr] gap-0 border-t border-gray-200">
          {hours.map((hour) => {
            const eventsInHour = getEventsForDateAndHour(currentDate, hour);
            return (
              <div key={hour} className="contents">
                {/* Hour label */}
                <div className="text-right pr-2 py-2 text-sm text-gray-600 border-r border-gray-200">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                
                {/* Hour block */}
                <div 
                  className="border-b border-gray-200 min-h-[60px] relative hover:bg-gray-50 cursor-pointer"
                  onClick={() => openEventModal(currentDate, hour)}
                >
                  {eventsInHour.map((event) => {
                    const start = new Date(event.startTime);
                    const end = new Date(event.endTime);
                    const startMinutes = start.getMinutes();
                    const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
                    
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          showEventDetails(event.id);
                        }}
                        className="absolute left-1 right-1 rounded px-2 py-1 text-white text-sm overflow-hidden hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: event.color,
                          top: `${(startMinutes / 60) * 60}px`,
                          height: `${Math.max((duration / 60) * 60, 30)}px`,
                        }}
                      >
                        <div className="font-semibold">{formatTime(start)} - {event.title}</div>
                        {duration >= 60 && event.description && (
                          <div className="text-xs opacity-90 mt-1">{event.description}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const today = new Date();

    return (
      <div>
        {/* Week header */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 mb-2 sticky top-0 bg-white z-10 border-b-2 border-gray-300">
          <div className="p-2"></div>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today.toDateString();
            return (
              <div 
                key={i} 
                className={`text-center p-2 font-semibold ${isToday ? 'bg-blue-500 text-white rounded-t' : 'text-gray-700'}`}
              >
                <div className="text-sm">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i]}</div>
                <div className={`text-lg ${isToday ? '' : 'text-gray-900'}`}>{day.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 border-t border-gray-200">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              {/* Hour label */}
              <div className="text-right pr-2 py-2 text-sm text-gray-600 border-r border-gray-200">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              
              {/* Day cells */}
              {weekDays.map((day, dayIndex) => {
                const eventsInHour = getEventsForDateAndHour(day, hour);
                return (
                  <div
                    key={dayIndex}
                    className="border-b border-r border-gray-200 min-h-[60px] relative hover:bg-gray-50 cursor-pointer"
                    onClick={() => openEventModal(day, hour)}
                  >
                    {eventsInHour.map((event) => {
                      const start = new Date(event.startTime);
                      const end = new Date(event.endTime);
                      const startMinutes = start.getMinutes();
                      const duration = (end.getTime() - start.getTime()) / (1000 * 60);
                      
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            showEventDetails(event.id);
                          }}
                          className="absolute left-1 right-1 rounded px-1 py-0.5 text-white text-xs overflow-hidden hover:opacity-90 cursor-pointer"
                          style={{
                            backgroundColor: event.color,
                            top: `${(startMinutes / 60) * 60}px`,
                            height: `${Math.max((duration / 60) * 60, 30)}px`,
                          }}
                        >
                          <div className="font-semibold truncate">{event.title}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get upcoming events
  const upcomingEvents = events
    .filter(event => new Date(event.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 10);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendario de Eventos
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Hoy
          </button>

          {/* View options */}
          <div className="flex bg-blue-700 rounded-lg overflow-hidden">
            {(['day', 'week', 'month'] as ViewType[]).map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 transition-colors font-medium ${
                  currentView === view
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-blue-600'
                }`}
              >
                {view === 'day' ? 'Día' : view === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={navigatePrevious}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold min-w-[200px] text-center">
              {formatDateDisplay()}
            </h2>
            <button
              onClick={navigateNext}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar view */}
        <div className="flex-1 p-4 overflow-auto">
          {currentView === 'month' && renderMonthView()}
          {currentView === 'day' && renderDayView()}
          {currentView === 'week' && renderWeekView()}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-gray-200 p-4 flex flex-col bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">Próximos Eventos</h3>
            <button
              onClick={() => openEventModal()}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar
            </button>
          </div>

          <div className="flex-1 overflow-auto space-y-2">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">No hay eventos próximos</p>
                <p className="text-sm mt-1">¡Agrega uno!</p>
              </div>
            ) : (
              upcomingEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => showEventDetails(event.id)}
                  className="p-3 bg-white border-l-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
                  style={{ borderLeftColor: event.color }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.startTime).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        •{' '}
                        {formatTime(new Date(event.startTime))}
                      </div>
                      {event.reminder && (
                        <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          Recordatorio activo
                        </div>
                      )}
                    </div>
                    <span className="text-2xl" style={{ color: event.color }}>●</span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Editar Evento' : 'Nuevo Evento'}
                </h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del evento"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora inicio *
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora fin *
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detalles adicionales (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="#4e73df">🔵 Azul</option>
                    <option value="#1cc88a">🟢 Verde</option>
                    <option value="#f6c23e">🟡 Amarillo</option>
                    <option value="#e74a3b">🔴 Rojo</option>
                    <option value="#858796">⚪ Gris</option>
                    <option value="#5a5c69">⚫ Oscuro</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={formData.reminder}
                    onChange={e => setFormData({ ...formData, reminder: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="reminder" className="text-sm text-gray-700 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Establecer recordatorio (15 min antes)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md"
                >
                  {isEditing ? 'Actualizar Evento' : 'Guardar Evento'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(selectedEvent.startTime).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(new Date(selectedEvent.startTime))} - {formatTime(new Date(selectedEvent.endTime))}
                </div>
                {selectedEvent.description && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <svg className="w-5 h-5 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <p>{selectedEvent.description}</p>
                  </div>
                )}
                {selectedEvent.reminder && (
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="text-sm font-medium">Recordatorio activo</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={editEvent}
                  className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={deleteEvent}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
