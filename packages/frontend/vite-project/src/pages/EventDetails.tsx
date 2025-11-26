import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent } from "../api/events";
import { registerForEvent } from "../api/registrations";
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

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  async function loadEvent() {
    try {
      setLoading(true);
      const data = await getEvent(id!);
      setEvent(data);
    } catch (err: any) {
      setMsg(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      setRegistering(true);
      await registerForEvent(id!);
      setMsg("Successfully registered!");
    } catch (err: any) {
      setMsg(err.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  }

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (!event) return <p className="p-8 text-center text-red-600">{msg || "Event not found"}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => navigate("/events")}
              className="text-lg font-medium text-gray-900 hover:text-blue-600"
            >
              ‚Üê Back to Events
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
          <p className="text-gray-700 text-lg mb-6">{event.description}</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <span className="font-semibold mr-2">Ì≥Ö Date:</span>
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-semibold mr-2">Ì≥ç Location:</span>
              {event.location}
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-semibold mr-2">Ì±• Capacity:</span>
              {event.capacity} people
            </div>
          </div>

          <button
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleRegister}
            disabled={registering}
          >
            {registering ? "Registering..." : "Register for Event"}
          </button>

          {msg && (
            <div className={`mt-4 p-3 rounded ${msg.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
