"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { CheckCircle, Mail, ArrowLeft, Clock } from "lucide-react";

function ThanksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");

  useEffect(() => {
    // Recuperar dados da query string
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (name) setCandidateName(decodeURIComponent(name));
    if (email) setCandidateEmail(decodeURIComponent(email));

    // Se não houver dados essenciais, redirecionar para o formulário após um delay
    if (!name || !email) {
      const timer = setTimeout(() => {
        router.push("/form");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const handleBackToForm = () => {
    router.push("/form");
  };

  if (!candidateName || !candidateEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecionando para o formulário...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Avaliação Enviada com Sucesso!
            </CardTitle>

            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Obrigado por participar da nossa avaliação FitScore
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Dados da submissão */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Resumo dos seus dados:
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Nome:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {candidateName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Email:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {candidateEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Informações sobre o email */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Resultado por Email
                  </h4>

                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    Enviamos um email detalhado com seus resultados para{" "}
                    <strong>{candidateEmail}</strong>. O email contém sua
                    pontuação completa e uma análise detalhada do seu fit
                    cultural.
                  </p>
                </div>
              </div>
            </div>

            {/* Tempo estimado */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Próximos Passos
                  </h4>

                  <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                    Nossa equipe analisará seu perfil e entrará em contato em
                    breve. Verifique sua caixa de entrada e também a pasta de
                    spam para não perder nenhuma comunicação.
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagem de agradecimento */}
            <div className="text-center py-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Agradecemos seu interesse em fazer parte da equipe{" "}
                <strong>LEGAL</strong>. Sua participação é muito importante para
                nós e esperamos que esta seja apenas o início de uma parceria de
                sucesso!
              </p>
            </div>

            {/* Botão de ação */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleBackToForm}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Fazer Nova Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 LEGAL - Sistema de Avaliação FitScore
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      }
    >
      <ThanksContent />
    </Suspense>
  );
}
