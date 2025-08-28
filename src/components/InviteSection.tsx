"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { InviteCandidate } from "@/src/components/InviteCandidate";
import { UserPlus } from "lucide-react";

export function InviteSection() {
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <>
      {/* Versão Desktop */}
      <div className="hidden md:block">
        <div className="text-right mb-2 flex flex-row justify-between items-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Enviar convite para avaliação
          </p>
          <InviteCandidate />
        </div>
      </div>

      {/* Versão Mobile - Botão */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        onClick={() => setShowInviteForm(!showInviteForm)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Convidar
      </Button>

      {/* Versão Mobile - Formulário */}
      {showInviteForm && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border shadow-lg md:hidden z-10 flex flex-row justify-between">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enviar convite para avaliação
            </p>
          </div>
          <InviteCandidate />
        </div>
      )}
    </>
  );
}
