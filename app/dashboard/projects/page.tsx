"use client";

import { useState } from "react";
import { useProjects } from "@/features/projects/useProjects";
import { supabase } from "@/lib/supabase";

export default function ProjectsPage() {
  const { data: projects, mutate } = useProjects();
  const [name, setName] = useState("");

  async function createProject() {
    if (!name) return;

    await supabase.from("projects").insert({
      name,
      description: "",
    });

    setName("");
    mutate();
  }

  async function updateProject(id: string, name: string) {
    await supabase.from("projects").update({ name }).eq("id", id);
    mutate();
  }

  async function deleteProject(id: string) {
    await supabase.from("projects").delete().eq("id", id);
    mutate();
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

        <button onClick={createProject} className="bg-black text-white px-3">
          Add
        </button>
      </div>

      {projects?.map((p: any) => (
        <div key={p.id} className="flex gap-2 items-center">
          <input
            defaultValue={p.name}
            onBlur={(e) => updateProject(p.id, e.target.value)}
            className="border px-2 py-1"
          />

          <button onClick={() => deleteProject(p.id)} className="text-red-500">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
