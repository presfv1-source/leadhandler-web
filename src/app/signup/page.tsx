import { redirect } from "next/navigation";

/** Minimal signup route. Redirects to login (shared flow for trial/signup). */
export default function SignupPage() {
  redirect("/login");
}
