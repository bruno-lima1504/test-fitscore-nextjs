"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/services/api";
import { Mail, Send, Loader2 } from "lucide-react";

export function InviteCandidate() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/send-invite", {
        email: email.trim(),
      });

      if (response.data.success) {
        toast({
          title: "Sucesso!",
          description: `Convite enviado para ${email}`,
        });
        setEmail(""); // Limpar campo após sucesso
      } else {
        toast({
          title: "Erro",
          description: response.data.error || "Erro ao enviar convite",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao enviar convite:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro inesperado ao enviar convite";

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" size="sm" disabled={isLoading || !email.trim()}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Enviar Convite
      </Button>
    </form>
  );
}
