import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventRegistrations } from "../api/events";

export default function EventRegistrations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) loadRegistrations();
  }, [id]);

  async function loadRegistrations() {
    try {
      setLoading(true);
      const result = await getEventRegistrations(id!);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading registrations...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded mt-4"
          onClick={() => navigate("/my-events")}
        >
          Back to My Events
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8">No data found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded"
        onClick={() => navigate("/my-events")}
      >
        ← Back to My Events
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{data.event.name}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">{new Date(data.event.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold">{data.event.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="font-semibold">{data.event.capacity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Registrations</p>
            <p className="font-semibold">{data.totalRegistrations} / {data.event.capacity}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          Registered Attendees ({data.totalRegistrations})
        </h2>

        {data.registrations.length === 0 ? (
          <p className="text-gray-500">No registrations yet.</p>
        ) : (
          <div className="space-y-3">
            {data.registrations.map((reg: any, index: number) => (
              <div key={reg.SK} className="border p-4 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Attendee #{index + 1}</p>
                    <p className="text-sm text-gray-600">{reg.user?.email || "Unknown"}</p>
                    <p className="text-xs text-gray-500">
                      Registered: {new Date(reg.registeredAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}