import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
  Text,
  Section,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

export interface CandidateResultEmailProps {
  candidateName: string;
  scores: {
    perfScore: number;
    energyScore: number;
    cultureScore: number;
    totalScore: number;
  };
  classification: string;
}

export const candidateResultEmail = ({
  candidateName,
  scores,
  classification,
}: CandidateResultEmailProps) => {
  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  function getClassificationColor(classification: string) {
    switch (classification) {
      case "Fit Altíssimo":
        return "#10b981"; // green-500
      case "Fit Aprovado":
        return "#3b82f6"; // blue-500
      case "Fit Questionável":
        return "#f59e0b"; // amber-500
      case "Fora do Perfil":
        return "#ef4444"; // red-500
      default:
        return "#6b7280"; // gray-500
    }
  }

  function getClassificationMessage(classification: string) {
    switch (classification) {
      case "Fit Altíssimo":
        return "Parabéns! Você demonstrou excelente alinhamento com nossa cultura e valores.";
      case "Fit Aprovado":
        return "Muito bem! Você apresentou um bom alinhamento com nossos valores e expectativas.";
      case "Fit Questionável":
        return "Obrigado pela participação. Sua avaliação apresentou alguns pontos de atenção.";
      case "Fora do Perfil":
        return "Agradecemos seu interesse. Sua avaliação não atendeu aos critérios esperados no momento.";
      default:
        return "Obrigado por participar da nossa avaliação de fit cultural.";
    }
  }

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-300 rounded-lg my-10 mx-auto p-6 max-w-2xl bg-white">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-gray-900 text-3xl font-bold p-0 my-4 mx-0">
                <strong>LEGAL</strong>
              </Heading>
              <Text className="text-gray-600 text-lg m-0">
                Resultado da Avaliação FitScore
              </Text>
            </Section>

            {/* Greeting */}
            <Text className="text-gray-800 text-base leading-6">
              Olá, <strong>{toTitleCase(candidateName.split(" ")[0])}</strong>!
            </Text>

            <Text className="text-gray-800 text-base leading-6">
              Agradecemos sua participação na nossa avaliação de fit cultural.
              Abaixo você encontra o resultado detalhado da sua avaliação:
            </Text>

            {/* Results Section */}
            <Section className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <Heading className="text-xl font-semibold text-gray-900 mb-4 mt-0">
                Seus Resultados
              </Heading>

              {/* Scores Grid */}
              <Row className="mb-6">
                <Column className="w-1/4 text-center p-2">
                  <Text className="text-2xl font-bold text-blue-600 m-0">
                    {scores.perfScore}
                  </Text>
                  <Text className="text-sm text-gray-600 m-0">Performance</Text>
                  <Text className="text-xs text-gray-500 m-0">/40</Text>
                </Column>
                <Column className="w-1/4 text-center p-2">
                  <Text className="text-2xl font-bold text-green-600 m-0">
                    {scores.energyScore}
                  </Text>
                  <Text className="text-sm text-gray-600 m-0">Energia</Text>
                  <Text className="text-xs text-gray-500 m-0">/30</Text>
                </Column>
                <Column className="w-1/4 text-center p-2">
                  <Text className="text-2xl font-bold text-purple-600 m-0">
                    {scores.cultureScore}
                  </Text>
                  <Text className="text-sm text-gray-600 m-0">Cultura</Text>
                  <Text className="text-xs text-gray-500 m-0">/30</Text>
                </Column>
                <Column className="w-1/4 text-center p-2">
                  <Text className="text-3xl font-bold text-gray-900 m-0">
                    {scores.totalScore}
                  </Text>
                  <Text className="text-sm text-gray-600 m-0">Total</Text>
                  <Text className="text-xs text-gray-500 m-0">/100</Text>
                </Column>
              </Row>

              {/* Classification Badge */}
              <Section className="text-center my-6">
                <Text
                  className="inline-block px-6 py-3 rounded-full text-white font-semibold text-lg m-0"
                  style={{
                    backgroundColor: getClassificationColor(classification),
                  }}
                >
                  {classification}
                </Text>
              </Section>

              {/* Classification Message */}
              <Text className="text-gray-700 text-base leading-6 text-center">
                {getClassificationMessage(classification)}
              </Text>
            </Section>

            {/* Footer Message */}
            <Text className="text-gray-700 text-base leading-6">
              Esta avaliação reflete seu alinhamento com nossa cultura
              organizacional e valores. Agradecemos novamente seu interesse em
              fazer parte da nossa equipe.
            </Text>

            <Text className="text-gray-700 text-base leading-6">
              Atenciosamente,
              <br />
              <strong>Equipe LEGAL</strong>
            </Text>

            {/* Footer */}
            <Section className="mt-8 pt-4 border-t border-gray-200">
              <Text className="text-gray-500 text-sm text-center">
                Este é um e-mail automático, não é necessário responder.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default candidateResultEmail;
