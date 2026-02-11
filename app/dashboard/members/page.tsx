import { getCurrentUser } from "@/features/auth/getCurrentUser";
import MembersClient from "./members-client";

export default async function MembersPage() {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  if (user.role !== "admin") {
    return <div>Forbidden</div>;
  }

  return <MembersClient />;
}
