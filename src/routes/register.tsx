import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Begin your quest"
      subtitle="Create your hero and earn 500 XP for signing up."
      footer={<>Already a hero? <Link to="/login" className="text-accent hover:underline">Log in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Quest started! +500 XP"); navigate({ to: "/dashboard" }); }}>
        <div className="space-y-2"><Label htmlFor="name">Hero Name</Label><Input id="name" placeholder="CodeKnight" required /></div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="hero@codequest.ai" required /></div>
        <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="At least 8 characters" required /></div>
        <Button type="submit" className="w-full gradient-primary-bg border-0 h-11">Forge My Hero</Button>
        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="px-2 bg-background text-xs text-muted-foreground">or</span></div></div>
        <Button type="button" variant="outline" className="w-full h-11 glass"><Github className="mr-2 h-4 w-4" /> Sign up with GitHub</Button>
        <p className="text-xs text-muted-foreground text-center">By signing up you agree to our Terms and Privacy Policy.</p>
      </form>
    </AuthShell>
  );
}
