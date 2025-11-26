import { useEffect, useState } from "react";
import { listMyEvents } from "../api/events";
import { useNavigate } from "react-router-dom";

interface Event {
  PK: string;
  name: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await listMyEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading your events...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Events</h1>
        <div className="space-x-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => navigate("/create-event")}
          >
            Create New Event
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => navigate("/")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/create-event")}
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.PK} className="border p-4 rounded bg-white shadow">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p className="text-gray-600">{event.description}</p>
              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Capacity:</strong> {event.capacity}</p>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700"
                onClick={() => navigate(`/events/${event.PK.replace('EVENT#', '')}/registrations`)}
              >
                View Registrations
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
