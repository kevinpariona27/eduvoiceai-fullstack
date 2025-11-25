import EventCalendar from '../components/EventCalendar';

export default function Events() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventCalendar />
      </div>
    </div>
  );
}
