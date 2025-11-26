import { useState } from "react";
import { createEvent } from "../api/events";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    capacity: 10,
  });
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();
    await createEvent(form);
    navigate("/my-events");
  }

  return (
    <div className="p-8 max-w-lg mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          name="date"
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          name="location"
          placeholder="Location"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          name="capacity"
          type="number"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Create
        </button>
      </form>
    </div>
  );
}

