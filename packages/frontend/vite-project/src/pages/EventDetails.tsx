import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent } from "../api/events";
import { registerForEvent } from "../api/registrations";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (id) getEvent(id).then(setEvent);
  }, [id]);

  async function handleRegister() {
    try {
      await registerForEvent(id!);
      setMsg("Successfully registered!");
    } catch (err: any) {
      setMsg(err.message);
    }
  }

  if (!event) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">{event.name}</h1>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Capacity: {event.capacity}</p>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>
      {msg && <p className="text-blue-600">{msg}</p>}
    </div>
  );
}
