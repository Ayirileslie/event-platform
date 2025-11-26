import { useEffect, useState } from "react";
import { listAllEvents } from "../api/events";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Event {
  PK: string;
  SK: string;
  name: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await listAllEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading events...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => navigate("/")}
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              ‚Üê Back to Dashboard
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">All Events</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <p className="text-gray-600">No events available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.PK}
                className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-700 mb-3 line-clamp-2">{event.description}</p>
                <p className="text-sm text-gray-600 mb-1">
                  Ì≥ç {event.location}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Ì≥Ö {new Date(event.date).toLocaleDateString()}
                </p>
                <button
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => navigate(`/events/${event.PK.replace('EVENT#', '')}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
