import { supabase } from "@/integrations/supabase/client";
import { WorksheetConfig, Question, GeneratedWorksheet } from "@/types/worksheet";

export async function generateWorksheet(config: WorksheetConfig): Promise<GeneratedWorksheet> {
  const { data, error } = await supabase.functions.invoke('generate-worksheet', {
    body: {
      grade: config.grade,
      subject: config.subject,
      topics: config.topics,
      difficulty: config.difficulty,
      totalMarks: config.totalMarks,
      numQuestions: config.numQuestions,
      board: config.board,
    }
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "Failed to generate worksheet");
  }

  if (data.error) {
    console.error("Generation error:", data.error);
    throw new Error(data.error);
  }

  const questions: Question[] = data.questions;

  return {
    config,
    questions,
    generatedAt: new Date(),
  };
}
