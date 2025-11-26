import { useEffect, useState } from "react";
import { listMyRegistrations, cancelRegistration } from "../api/registrations";
import { useNavigate } from "react-router-dom";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function loadRegistrations() {
    try {
      setLoading(true);
      const data = await listMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(eventId: string) {
    if (!confirm("Are you sure you want to cancel this registration?")) {
      return;
    }

    try {
      await cancelRegistration(eventId);
      setMsg("Registration cancelled successfully");
      await loadRegistrations();
      setTimeout(() => setMsg(""), 3000);
    } catch (err: any) {
      setMsg(err.message || "Failed to cancel registration");
    }
  }

  if (loading) {
    return <div className="p-8">Loading your registrations...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Registrations</h1>
        <div className="space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/events")}
          >
            Browse Events
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => navigate("/")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded ${msg.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {msg}
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/events")}
          >
            Browse Available Events
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.PK} className="border p-4 rounded bg-white shadow">
              {reg.event ? (
                <>
                  <h2 className="text-xl font-semibold">{reg.event.name}</h2>
                  <p className="text-gray-600">{reg.event.description}</p>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p><strong>Date:</strong> {new Date(reg.event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {reg.event.location}</p>
                    <p><strong>Registered:</strong> {new Date(reg.registeredAt).toLocaleString()}</p>
                  </div>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
                    onClick={() => handleCancel(reg.eventId)}
                  >
                    Cancel Registration
                  </button>
                </>
              ) : (
                <p className="text-gray-500">Event details unavailable</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}