import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
  Text,
  Link,
  Section,
  Row,
  Column,
} from "@react-email/components";
import { ReportData } from "@/src/models/report";

interface HighScoreReportEmailProps {
  evaluatorName: string;
  reportData: ReportData;
}

export default function HighScoreReportEmail({
  evaluatorName,
  reportData,
}: HighScoreReportEmailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10B981"; // green-500
    if (score >= 80) return "#3B82F6"; // blue-500
    return "#6B7280"; // gray-500
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Fit Altíssimo":
        return "#10B981"; // green-500
      case "Fit Aprovado":
        return "#3B82F6"; // blue-500
      case "Fit Questionável":
        return "#F59E0B"; // amber-500
      default:
        return "#EF4444"; // red-500
    }
  };

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="bg-white rounded-t-lg border border-gray-200 p-6">
              <div className="text-center">
                <Heading className="text-2xl font-bold text-gray-900 mb-2">
                  📊 Relatório de Candidatos High Score
                </Heading>
                <Text className="text-gray-600 text-base">
                  Sistema FitScore LEGAL
                </Text>
              </div>
            </Section>

            {/* Greeting */}
            <Section className="bg-white border-l border-r border-gray-200 p-6">
              <Text className="text-gray-900 text-base mb-4">
                Olá, <strong>{evaluatorName}</strong>!
              </Text>
              <Text className="text-gray-700 text-base leading-6">
                Aqui está o relatório automático de candidatos com alta
                pontuação (≥ 80 pontos) nas últimas 12 horas.
              </Text>
            </Section>

            {/* Report Summary */}
            <Section className="bg-blue-50 border-l border-r border-gray-200 p-6">
              <Heading className="text-lg font-semibold text-gray-900 mb-4">
                📈 Resumo do Período
              </Heading>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <Text className="text-2xl font-bold text-blue-600 mb-1">
                    {reportData.totalHighScoreCandidates}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Candidatos High Score
                  </Text>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <Text className="text-2xl font-bold text-green-600 mb-1">
                    {
                      reportData.candidates.filter((c) => c.totalScore >= 90)
                        .length
                    }
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Score ≥ 90 pontos
                  </Text>
                </div>
              </div>

              <Text className="text-sm text-gray-600">
                <strong>Período:</strong> {formatDate(reportData.periodStart)}{" "}
                até {formatDate(reportData.periodEnd)}
              </Text>
              <Text className="text-sm text-gray-600">
                <strong>Relatório gerado:</strong>{" "}
                {formatDate(reportData.reportGeneratedAt)}
              </Text>
            </Section>

            {/* Candidates List */}
            {reportData.totalHighScoreCandidates > 0 ? (
              <Section className="bg-white border-l border-r border-gray-200 p-6">
                <Heading className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 Candidatos Destaque
                </Heading>

                {reportData.candidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                  >
                    <Row>
                      <Column className="w-2/3">
                        <Text className="font-semibold text-gray-900 mb-1">
                          {candidate.candidateName}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2">
                          {candidate.candidateEmail}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Avaliação em: {formatDate(candidate.submissionDate)}
                        </Text>
                      </Column>

                      <Column className="w-1/3 text-right">
                        <div
                          className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-2"
                          style={{
                            backgroundColor: getClassificationColor(
                              candidate.classification
                            ),
                          }}
                        >
                          {candidate.classification}
                        </div>
                        <Text
                          className="text-2xl font-bold mb-1"
                          style={{ color: getScoreColor(candidate.totalScore) }}
                        >
                          {candidate.totalScore}/100
                        </Text>
                        <div className="text-xs text-gray-600">
                          <div>Performance: {candidate.perfScore}/40</div>
                          <div>Energia: {candidate.energyScore}/30</div>
                          <div>Cultura: {candidate.cultureScore}/30</div>
                        </div>
                      </Column>
                    </Row>
                  </div>
                ))}
              </Section>
            ) : (
              <Section className="bg-white border-l border-r border-gray-200 p-6 text-center">
                <Text className="text-gray-600 text-base">
                  🎉 Nenhum candidato com score ≥ 80 nas últimas 12 horas.
                </Text>
                <Text className="text-gray-500 text-sm mt-2">
                  Isso pode indicar um período de menor atividade ou que os
                  candidatos recentes ainda não atingiram a pontuação de
                  destaque.
                </Text>
              </Section>
            )}

            {/* Call to Action */}
            <Section className="bg-white border-l border-r border-gray-200 p-6">
              <Text className="text-gray-700 text-base mb-4">
                Para ver mais detalhes e gerenciar as avaliações, acesse o
                dashboard:
              </Text>

              <div className="text-center">
                <Link
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-semibold no-underline"
                >
                  🚀 Acessar Dashboard
                </Link>
              </div>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 rounded-b-lg border border-gray-200 p-6 text-center">
              <Text className="text-sm text-gray-600 mb-2">
                Este é um relatório automático gerado a cada 12 horas.
              </Text>
              <Text className="text-xs text-gray-500">
                © 2024 LEGAL - Sistema FitScore | Relatórios Automatizados
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
