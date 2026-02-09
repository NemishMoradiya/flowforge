"use client";

import { useState } from "react";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/features/projects/actions";

export default function ProjectsClient({ projects }: { projects: any[] }) {
  const [name, setName] = useState("");

  async function handleCreate() {
    if (!name) return;

    await createProject(name);
    location.reload();
  }

  async function handleUpdate(id: string, name: string) {
    await updateProject(id, name);
    location.reload();
  }

  async function handleDelete(id: string) {
    await deleteProject(id);
    location.reload();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Projects</h2>

      <div className="flex gap-2">
        <input
          className="border px-2 py-1"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleCreate} className="bg-black text-white px-3">
          Add
        </button>
      </div>

      {projects.map((p) => (
        <div key={p.id} className="flex gap-2 items-center">
          <input
            defaultValue={p.name}
            onBlur={(e) => handleUpdate(p.id, e.target.value)}
            className="border px-2 py-1"
          />

          <button onClick={() => handleDelete(p.id)} className="text-red-500">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
