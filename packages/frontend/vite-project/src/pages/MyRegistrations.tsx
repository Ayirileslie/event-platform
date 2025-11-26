import { useEffect, useState } from "react";
import { listMyRegistrations, cancelRegistration } from "../api/registrations";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    listMyRegistrations().then(setRegistrations);
  }, []);

  async function handleCancel(eventId: string) {
    await cancelRegistration(eventId);
    setMsg("Cancelled registration");
    setRegistrations(await listMyRegistrations());
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-4">My Registrations</h1>
      {msg && <p className="text-green-500">{msg}</p>}
      {registrations.map((r) => (
        <div key={r.event._id} className="border p-4 rounded">
          <h2 className="text-xl font-semibold">{r.event.name}</h2>
          <p>{r.event.date}</p>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded mt-2"
            onClick={() => handleCancel(r.event._id)}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
