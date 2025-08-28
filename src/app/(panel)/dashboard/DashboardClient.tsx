"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { ScoreBadge } from "@/src/components/ScoreBadge";
import { EmptyState } from "@/src/components/EmptyState";
import { useToast } from "@/src/components/ui/use-toast";
import { useDashboard } from "@/src/hooks/useDashboard";
import { InviteSection } from "@/src/components/InviteSection";
import { UpdateEmailModal } from "@/src/components/UpdateEmailModal";
import { formatDate } from "@/src/lib/utils";
import { Classification } from "@/src/lib/types";
import {
  Search,
  LogOut,
  User,
  TrendingUp,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useAuthContext } from "@/src/contexts/authContext";

export function DashboardClient() {
  const [search, setSearch] = useState("");
  const [selectedClassification, setSelectedClassification] = useState<
    Classification | ""
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);

  const { toast } = useToast();
  const { logout } = useAuth();
  const { user } = useAuthContext();

  // Hook SWR para dados do dashboard
  const {
    submissions,
    stats,
    submissionsLoading,
    statsLoading,
    submissionsError,
    statsError,
    mutateSubmissions,
    mutateStats,
  } = useDashboard({
    search: search || undefined,
    classification: selectedClassification || undefined,
    page: currentPage,
    pageSize: 10,
  });

  const classifications: (Classification | "")[] = [
    "",
    "Fit Altíssimo",
    "Fit Aprovado",
    "Fit Questionável",
    "Fora do Perfil",
  ];

  // Reset da página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClassification]);

  // Tratamento de erros
  useEffect(() => {
    if (submissionsError) {
      toast({
        title: "Erro",
        description: "Erro ao carregar submissões",
        variant: "destructive",
      });
    }
  }, [submissionsError, toast]);

  useEffect(() => {
    if (statsError) {
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas",
        variant: "destructive",
      });
    }
  }, [statsError, toast]);

  const handleLogout = () => {
    logout();
  };

  const totalPages = submissions ? Math.ceil(submissions.total / 10) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard FitScore
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistema de gestão LEGAL
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Convite para Candidatos */}
              <div className="relative">
                <InviteSection />
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />

                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                  onClick={() => setShowUpdateEmailModal(true)}
                  title="Clique para atualizar seu email"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.email || "Usuário"}</span>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Avaliações
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalSubmissions}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fit Altíssimo
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.byClassification["Fit Altíssimo"]}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fit Aprovado
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.byClassification["Fit Aprovado"]}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Últimas 24h
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.recentSubmissions}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>
              Use os filtros abaixo para refinar os resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {classifications.map((classification) => (
                  <Button
                    key={classification || "all"}
                    variant={
                      selectedClassification === classification
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedClassification(classification)}
                  >
                    {classification || "Todos"}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Submissões */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avaliações</CardTitle>
            <CardDescription>
              {submissions
                ? `${submissions.total} avaliações encontradas`
                : "Carregando..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissionsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : !submissions || submissions.data.length === 0 ? (
              <EmptyState
                title="Nenhuma avaliação encontrada"
                description="Não há avaliações que correspondam aos filtros aplicados"
                type="no-results"
              />
            ) : (
              <div className="space-y-4">
                {submissions.data.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {submission.candidateName}
                        </h3>
                        <ScoreBadge
                          classification={
                            submission.classification as Classification
                          }
                          score={submission.totalScore}
                          showScore
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {submission.candidateEmail}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {submission.totalScore}/100
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {submissions && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modal de atualização de email */}
      <UpdateEmailModal
        isOpen={showUpdateEmailModal}
        onClose={() => setShowUpdateEmailModal(false)}
      />
    </div>
  );
}
