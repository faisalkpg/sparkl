import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorksheetRequest {
  grade: string;
  subject: string;
  topics: string[];
  difficulty: string;
  totalMarks: number;
  numQuestions: number;
  board?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("API key not configured");
    }

    const body: WorksheetRequest = await req.json();
    const { grade, subject, topics, difficulty, totalMarks, numQuestions, board } = body;

    console.log("Generating worksheet:", { grade, subject, topics, difficulty, totalMarks, numQuestions, board });

    const systemPrompt = `You are an expert educational content creator specializing in ${board || 'general'} curriculum worksheets and question papers. You create high-quality, curriculum-aligned questions for ${grade} students studying ${subject}.

Your questions must:
1. Be age-appropriate and aligned with the specified grade level
2. Cover the specified topics comprehensively
3. Match the difficulty level specified (${difficulty})
4. Include clear, unambiguous wording
5. Have accurate, complete answers and solutions
6. Distribute marks appropriately based on question complexity

For Mathematics and Science, include step-by-step solutions.
For languages (English, Arabic, Hindi, Urdu), ensure proper grammar and cultural relevance.
For Social Studies and Business Studies, include relevant examples and real-world connections.`;

    const userPrompt = `Generate a worksheet with exactly ${numQuestions} questions totaling ${totalMarks} marks.

Subject: ${subject}
Grade: ${grade}
Topics to cover: ${topics.join(", ")}
Difficulty: ${difficulty}
${board ? `Board/Curriculum: ${board}` : ""}

Requirements:
- Short answer questions (1-3 marks): Direct, factual questions
- Medium questions (4-5 marks): Require explanation or multiple steps
- Long answer questions (6+ marks): Require detailed analysis, diagrams, or comprehensive answers

Distribute marks realistically based on question complexity. Ensure variety in question types and coverage of all specified topics.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_worksheet",
              description: "Generate a structured worksheet with questions and answers",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        questionNumber: { type: "number", description: "Sequential question number starting from 1" },
                        questionText: { type: "string", description: "The full question text" },
                        marks: { type: "number", description: "Marks allocated for this question" },
                        type: { type: "string", enum: ["short", "long"], description: "Question type based on marks (short: 1-3, long: 4+)" },
                        answer: { type: "string", description: "The complete answer to the question" },
                        solution: { type: "string", description: "Step-by-step solution for Math/Science questions (optional)" }
                      },
                      required: ["questionNumber", "questionText", "marks", "type", "answer"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["questions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_worksheet" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the function call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_worksheet") {
      console.error("Unexpected response format:", JSON.stringify(data));
      throw new Error("Invalid response format from AI");
    }

    const worksheetData = JSON.parse(toolCall.function.arguments);
    
    // Add unique IDs to questions
    const questionsWithIds = worksheetData.questions.map((q: any, index: number) => ({
      ...q,
      id: `q-${index + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    console.log(`Generated ${questionsWithIds.length} questions successfully`);

    return new Response(JSON.stringify({ questions: questionsWithIds }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-worksheet:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate worksheet" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
