import { useState } from "react";
import { useAuth } from "@/context/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const { login, register, loginAs } = useAuth();
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = false;
    if (mode==='login') ok = await login(email.trim(), password);
    else ok = await register(name.trim(), email.trim(), password, 'staff');
    if (!ok) return setError(mode==='login'?"Invalid credentials":"Email already exists");
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Frontend-only demo auth. Use sample accounts or email/password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <Button variant="outline" onClick={() => loginAs("owner")}>
              Login as Owner
            </Button>
            <Button variant="outline" onClick={() => loginAs("manager")}>
              Manager
            </Button>
            <Button variant="outline" onClick={() => loginAs("staff")}>
              Staff
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Samples: owner@example.com/owner123, manager@example.com/manager123,
            staff@example.com/staff123
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
