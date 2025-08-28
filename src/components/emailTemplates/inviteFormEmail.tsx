import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
  Text,
  Section,
  Button,
  Link,
} from "@react-email/components";
import * as React from "react";

export interface InviteFormEmailProps {
  recipientEmail: string;
}

export const inviteFormEmail = ({ recipientEmail }: InviteFormEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const formUrl = `${baseUrl}/form`;

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
                Convite para Avaliação FitScore
              </Text>
            </Section>

            {/* Greeting */}
            <Text className="text-gray-800 text-base leading-6">Olá!</Text>

            <Text className="text-gray-800 text-base leading-6">
              Você foi convidado(a) para participar da nossa avaliação de fit
              cultural. Esta é uma oportunidade para conhecermos melhor seu
              perfil e alinhamento com nossos valores organizacionais.
            </Text>

            {/* What is FitScore Section */}
            <Section className="my-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <Heading className="text-xl font-semibold text-gray-900 mb-4 mt-0">
                O que é o FitScore?
              </Heading>

              <Text className="text-gray-700 text-base leading-6 mb-4">
                O FitScore é nossa ferramenta de avaliação que mede seu
                alinhamento com nossa cultura organizacional através de três
                dimensões principais:
              </Text>

              <Text className="text-gray-700 text-base leading-6 mb-2">
                <strong>🎯 Performance:</strong> Suas competências técnicas e
                profissionais
              </Text>
              <Text className="text-gray-700 text-base leading-6 mb-2">
                <strong>⚡ Energia:</strong> Sua disponibilidade e capacidade de
                trabalho
              </Text>
              <Text className="text-gray-700 text-base leading-6 mb-4">
                <strong>🤝 Cultura:</strong> Seu alinhamento com os valores da
                LEGAL
              </Text>

              <Text className="text-gray-700 text-base leading-6">
                A avaliação leva aproximadamente <strong>5-10 minutos</strong>{" "}
                para ser concluída e você receberá seu resultado por email assim
                que finalizar.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center my-8">
              <Button
                href={formUrl}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-block no-underline"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "16px 32px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "18px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Iniciar Avaliação FitScore
              </Button>
            </Section>

            {/* Alternative Link */}
            <Text className="text-gray-600 text-sm text-center leading-6">
              Caso o botão não funcione, acesse diretamente:
              <br />
              <Link href={formUrl} className="text-blue-600 underline">
                {formUrl}
              </Link>
            </Text>

            {/* Instructions */}
            <Section className="my-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="text-gray-700 text-sm leading-6 mb-2">
                <strong>Instruções importantes:</strong>
              </Text>
              <Text className="text-gray-700 text-sm leading-6 mb-1">
                • Responda com sinceridade para obter um resultado preciso
              </Text>
              <Text className="text-gray-700 text-sm leading-6 mb-1">
                • Não há respostas certas ou erradas
              </Text>
              <Text className="text-gray-700 text-sm leading-6 mb-1">
                • Você pode pausar e retomar a avaliação a qualquer momento
              </Text>
              <Text className="text-gray-700 text-sm leading-6">
                • Seu resultado será enviado para este email automaticamente
              </Text>
            </Section>

            {/* Footer Message */}
            <Text className="text-gray-700 text-base leading-6">
              Agradecemos seu interesse em fazer parte da nossa equipe e
              esperamos conhecer melhor seu perfil através desta avaliação.
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

export default inviteFormEmail;
