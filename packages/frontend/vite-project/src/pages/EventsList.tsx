import { useEffect, useState } from "react";
import { listAllEvents } from "../api/events";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [startDate, endDate, events]);

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await listAllEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }

  function filterEvents() {
    let filtered = [...events];

    if (startDate) {
      filtered = filtered.filter(event => event.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(event => event.date <= endDate);
    }

    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setFilteredEvents(filtered);
  }

  function clearFilters() {
    setStartDate("");
    setEndDate("");
  }

  if (loading) {
    return <div className="p-8">Loading events...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Events</h1>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4 mb-6">
        <h2 className="text-lg font-semibold">Filter by Date</h2>
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.PK} className="border p-4 rounded bg-white shadow">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Capacity:</strong> {event.capacity}
              </p>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700"
                onClick={() => navigate(`/events/${event.PK.replace('EVENT#', '')}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}