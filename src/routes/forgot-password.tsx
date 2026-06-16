import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  return (
    <AuthShell
      title="Forgot your spellbook?"
      subtitle="We'll send a reset link to your email."
      footer={<>Remember it? <Link to="/login" className="text-accent hover:underline">Back to login</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent — check your email"); }}>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="hero@codequest.ai" required /></div>
        <Button type="submit" className="w-full gradient-primary-bg border-0 h-11">Send Reset Link</Button>
      </form>
    </AuthShell>
  );
}
