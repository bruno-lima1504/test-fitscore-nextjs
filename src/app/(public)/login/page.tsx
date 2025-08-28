"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useAuthContext } from "@/src/contexts/authContext";

export default function LoginPage() {
  const { login } = useAuthContext();
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleLogin(formData);
  };

  async function handleLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email === "" ||
      password === ""
    ) {
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    console.log("result", result);
    setIsLoading(false);

    if (result && "status_code" in result) {
      setStatusCode(result.status_code);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard FitScore
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Acesso restrito para gestores
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Fazer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {statusCode === 401 && (
                <span className="text-red-500">
                  Usuário ou senha invalidados
                </span>
              )}

              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Seu email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="password">Senha</Label>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-t-2 border-white rounded-full"></span>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
