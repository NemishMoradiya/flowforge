import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/features/projects/actions";

const useProjectClient = (role: string) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = role === "admin";

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setLoading(true);
    try {
      await createProject(name.trim());
      toast.success("Project created successfully");
      setName("");
      setCreateDialogOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }

    try {
      await updateProject(id, editName.trim());
      toast.success("Project updated");
      setEditingId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update project");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
  }
  return {
    name,
    setName,
    loading,
    setLoading,
    editingId,
    setEditingId,
    editName,
    setEditName,
    createDialogOpen,
    setCreateDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deletingId,
    setDeletingId,
    isAdmin,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

export default useProjectClient;
