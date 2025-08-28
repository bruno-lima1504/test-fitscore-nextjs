"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useToast } from "@/src/components/ui/use-toast";
import { useUpdateEmail } from "@/src/hooks/useUpdateEmail";
import { Loader2, Mail } from "lucide-react";

interface UpdateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateEmailModal({ isOpen, onClose }: UpdateEmailModalProps) {
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();
  const { updateEmail, isUpdating, currentEmail } = useUpdateEmail();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setNewEmail(email);
    setEmailError("");

    if (email && !validateEmail(email)) {
      setEmailError("Email inválido");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      setEmailError("Email é obrigatório");
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError("Email inválido");
      return;
    }

    if (newEmail === currentEmail) {
      setEmailError("O novo email deve ser diferente do atual");
      return;
    }

    const result = await updateEmail(newEmail);

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      });
      setNewEmail("");
      onClose();
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setNewEmail("");
    setEmailError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Atualizar Email
          </DialogTitle>
          <DialogDescription>
            Altere seu email de acesso ao sistema. Você precisará fazer login
            novamente após a alteração.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Email atual</Label>
            <Input
              id="current-email"
              type="email"
              value={currentEmail || ""}
              disabled
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email">Novo email</Label>
            <Input
              id="new-email"
              type="email"
              placeholder="Digite seu novo email"
              value={newEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={emailError ? "border-red-500" : ""}
              disabled={isUpdating}
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || !!emailError || !newEmail.trim()}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
