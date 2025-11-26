import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent } from "../api/events";
import { registerForEvent } from "../api/registrations";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      setLoading(true);
      const data = await getEvent(id!);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      setRegistering(true);
      setMsg("");
      setError("");
      await registerForEvent(id!);
      setMsg("Successfully registered!");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return <p className="p-8">Loading event details...</p>;
  }

  if (error && !event) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded mt-4"
          onClick={() => navigate("/events")}
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return <p className="p-8">Event not found</p>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate("/events")}
      >
        ← Back to Events
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Date</h3>
            <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Location</h3>
            <p className="text-gray-600">{event.location}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Capacity</h3>
            <p className="text-gray-600">{event.capacity} attendees</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded w-full hover:bg-green-700 disabled:bg-gray-400"
            onClick={handleRegister}
            disabled={registering}
          >
            {registering ? "Registering..." : "Register for Event"}
          </button>
        </div>

        {msg && <p className="text-green-600 mt-4 text-center font-semibold">{msg}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}