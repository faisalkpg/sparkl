import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ConfigurationForm } from "@/components/ConfigurationForm";
import { GenerationProgress } from "@/components/GenerationProgress";
import { PreviewPanel } from "@/components/PreviewPanel";
import { WorksheetConfig, GeneratedWorksheet, Question } from "@/types/worksheet";
import { generateWorksheet } from "@/utils/worksheetGeneration";
import { generateQuestionPaperPDF, generateAnswerKeyPDF, downloadBothPDFs } from "@/utils/pdfGenerator";

type AppState = "landing" | "configure" | "generating" | "preview";

const Index = () => {
  const [state, setState] = useState<AppState>("landing");
  const [config, setConfig] = useState<WorksheetConfig | null>(null);
  const [worksheet, setWorksheet] = useState<GeneratedWorksheet | null>(null);

  const handleGetStarted = () => {
    setState("configure");
  };

  const handleGenerate = async (newConfig: WorksheetConfig) => {
    setConfig(newConfig);
    setState("generating");
    
    try {
      const generated = await generateWorksheet(newConfig);
      setWorksheet(generated);
      setState("preview");
    } catch (error) {
      console.error("Generation failed:", error);
      setState("configure");
    }
  };

  const handleRegenerate = () => {
    setWorksheet(null);
    setState("configure");
  };

  const handleDownload = async (type: 'questions' | 'answers' | 'both') => {
    if (!worksheet) return;

    switch (type) {
      case 'questions':
        await generateQuestionPaperPDF(worksheet);
        break;
      case 'answers':
        await generateAnswerKeyPDF(worksheet);
        break;
      case 'both':
        await downloadBothPDFs(worksheet);
        break;
    }
  };

  const handleUpdateQuestions = (questions: Question[]) => {
    if (worksheet) {
      setWorksheet({ ...worksheet, questions });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {state === "landing" && <Hero onGetStarted={handleGetStarted} />}
      
      {state === "configure" && (
        <ConfigurationForm
          onGenerate={handleGenerate}
          isGenerating={false}
        />
      )}
      
      {state === "generating" && config && (
        <GenerationProgress
          subject={config.subject}
          numQuestions={config.numQuestions}
        />
      )}
      
      {state === "preview" && worksheet && (
        <PreviewPanel
          worksheet={worksheet}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onUpdateQuestions={handleUpdateQuestions}
        />
      )}
    </main>
  );
};

export default Index;
