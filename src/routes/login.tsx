import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Welcome back, hero"
      subtitle="Continue your coding quest where you left off."
      footer={<>New here? <Link to="/register" className="text-accent hover:underline">Create an account</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Welcome back!"); navigate({ to: "/dashboard" }); }}>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="hero@codequest.ai" required /></div>
        <div className="space-y-2">
          <div className="flex justify-between"><Label htmlFor="password">Password</Label><Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot?</Link></div>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full gradient-primary-bg border-0 h-11">Enter the Arena</Button>
        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="px-2 bg-background text-xs text-muted-foreground">or</span></div></div>
        <Button type="button" variant="outline" className="w-full h-11 glass"><Github className="mr-2 h-4 w-4" /> Continue with GitHub</Button>
      </form>
    </AuthShell>
  );
}
