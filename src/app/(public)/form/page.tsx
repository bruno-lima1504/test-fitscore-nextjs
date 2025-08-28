"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Slider } from "@/src/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useToast } from "@/src/components/ui/use-toast";
import { SectionCard } from "@/src/components/SectionCard";
import { formSchema, FormInput } from "@/src/lib/zod";
import { QUESTIONS } from "@/src/lib/types";
import { useFormSubmission } from "@/src/hooks/useFormSubmission";
import { Loader2, Send } from "lucide-react";

export default function FitScoreForm() {
  const [currentTab, setCurrentTab] = useState("info");
  const { toast } = useToast();
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      answers: {},
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  // Agrupar perguntas por categoria
  const performanceQuestions = QUESTIONS.filter(
    (q) => q.category === "performance"
  );
  const energyQuestions = QUESTIONS.filter((q) => q.category === "energy");
  const cultureQuestions = QUESTIONS.filter((q) => q.category === "culture");

  // Verificar se seção está completa
  const isInfoComplete = Boolean(watch("name") && watch("email"));
  const isPerformanceComplete = performanceQuestions.every(
    (q) => watch("answers")?.[q.id.toString()] !== undefined
  );
  const isEnergyComplete = energyQuestions.every(
    (q) => watch("answers")?.[q.id.toString()] !== undefined
  );
  const isCultureComplete = cultureQuestions.every(
    (q) => watch("answers")?.[q.id.toString()] !== undefined
  );

  const isFormComplete =
    isInfoComplete &&
    isPerformanceComplete &&
    isEnergyComplete &&
    isCultureComplete;

  const onSubmit = async (data: FormInput) => {
    const result = await submitForm(data);

    if (result.success) {
      // Preparar dados para a página de agradecimento
      const queryParams = new URLSearchParams({
        name: data.name,
        email: data.email,
      });

      // Adicionar dados do resultado se disponíveis
      if (result.data?.scores?.totalScore) {
        queryParams.append("score", result.data.scores.totalScore.toString());
      }

      if (result.data?.classification) {
        queryParams.append("classification", result.data.classification);
      }

      // Redirecionar para página de agradecimento
      router.push(`/thanks?${queryParams.toString()}`);
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const renderQuestionSlider = (question: (typeof QUESTIONS)[0]) => (
    <div key={question.id} className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{question.text}</Label>
        <span className="text-sm font-bold bg-primary text-primary-foreground px-2 py-1 rounded">
          {watch("answers")?.[question.id.toString()] || 0}
        </span>
      </div>
      <Slider
        value={[watch("answers")?.[question.id.toString()] || 0]}
        onValueChange={(value) => setValue(`answers.${question.id}`, value[0])}
        max={10}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 - Muito baixo</span>
        <span>10 - Excelente</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            FitScore
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Avaliação de Fit Cultural - LEGAL
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isInfoComplete ? "bg-green-500" : "bg-gray-300"}`}
                />
                Info
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="flex items-center gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${isPerformanceComplete ? "bg-green-500" : "bg-gray-300"}`}
                />
                Performance
              </TabsTrigger>
              <TabsTrigger value="energy" className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isEnergyComplete ? "bg-green-500" : "bg-gray-300"}`}
                />
                Energia
              </TabsTrigger>
              <TabsTrigger value="culture" className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isCultureComplete ? "bg-green-500" : "bg-gray-300"}`}
                />
                Cultura
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <SectionCard
                title="Informações Pessoais"
                description="Preencha seus dados básicos para começar a avaliação"
                completed={isInfoComplete}
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      {...form.register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...form.register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="performance">
              <SectionCard
                title="Performance"
                description="Avalie suas competências técnicas e profissionais"
                completed={isPerformanceComplete}
              >
                <div className="space-y-6">
                  {performanceQuestions.map(renderQuestionSlider)}
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="energy">
              <SectionCard
                title="Energia"
                description="Avalie sua disponibilidade e capacidade de trabalho"
                completed={isEnergyComplete}
              >
                <div className="space-y-6">
                  {energyQuestions.map(renderQuestionSlider)}
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="culture">
              <SectionCard
                title="Cultura"
                description="Avalie seu alinhamento com os valores da LEGAL"
                completed={isCultureComplete}
              >
                <div className="space-y-6">
                  {cultureQuestions.map(renderQuestionSlider)}
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>

          {/* Botão de Envio */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!isFormComplete || isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Enviar Avaliação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
