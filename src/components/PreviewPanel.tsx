import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  FileText,
  Key,
  RefreshCw,
  Edit3,
  Save,
  X,
  GripVertical,
  RotateCcw,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { GeneratedWorksheet, Question } from "@/types/worksheet";

interface PreviewPanelProps {
  worksheet: GeneratedWorksheet;
  onRegenerate: () => void;
  onDownload: (type: 'questions' | 'answers' | 'both') => void;
  onUpdateQuestions: (questions: Question[]) => void;
}

export function PreviewPanel({
  worksheet,
  onRegenerate,
  onDownload,
  onUpdateQuestions,
}: PreviewPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { config, questions } = worksheet;

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditedQuestion({ ...question });
  };

  const handleSave = () => {
    if (editedQuestion) {
      const updated = questions.map(q =>
        q.id === editedQuestion.id ? editedQuestion : q
      );
      onUpdateQuestions(updated);
      setEditingId(null);
      setEditedQuestion(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedQuestion(null);
  };

  const handleDownloadBoth = () => {
    onDownload('both');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 max-w-6xl">
        {/* Success message */}
        {downloadSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-slide-up">
            <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-success text-success-foreground shadow-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Files downloaded! Check your downloads folder.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-lg overflow-hidden">
              <CardHeader className="bg-muted/50 border-b border-border/50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Preview
                  </div>
                  <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                    {config.subject} • {config.grade} • {config.totalMarks} Marks
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="questions"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Question Paper
                    </TabsTrigger>
                    <TabsTrigger
                      value="answers"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Answer Key
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="questions" className="p-6 m-0">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="text-center border-b border-border/50 pb-6">
                        <div className="text-sm text-muted-foreground mb-2">
                          [School Name]
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {config.subject} Worksheet
                        </h3>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                          <span>{config.grade}</span>
                          <span>•</span>
                          <span>Max Marks: {config.totalMarks}</span>
                          <span>•</span>
                          <span>Time: {Math.ceil(config.totalMarks * 1.5)} mins</span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                        <strong>Instructions:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Read all questions carefully before answering.</li>
                          <li>Write your answers in the space provided.</li>
                          <li>Marks for each question are indicated on the right.</li>
                        </ul>
                      </div>

                      {/* Questions */}
                      <div className="space-y-4">
                        {questions.map((question) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            isEditing={editingId === question.id}
                            editedQuestion={editingId === question.id ? editedQuestion : null}
                            onEdit={() => handleEdit(question)}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onUpdate={setEditedQuestion}
                            showAnswer={false}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="answers" className="p-6 m-0">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="text-center border-b border-border/50 pb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-success/10 text-success text-sm font-medium">
                          <Key className="w-4 h-4" />
                          ANSWER KEY
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {config.subject} Worksheet
                        </h3>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                          <span>{config.grade}</span>
                          <span>•</span>
                          <span>Max Marks: {config.totalMarks}</span>
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="space-y-4">
                        {questions.map((question) => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            isEditing={false}
                            editedQuestion={null}
                            onEdit={() => {}}
                            onSave={() => {}}
                            onCancel={() => {}}
                            onUpdate={() => {}}
                            showAnswer={true}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-md sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleDownloadBoth}
                >
                  <Download className="w-5 h-5" />
                  Download Both PDFs
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onDownload('questions')}
                    className="flex-col h-auto py-4"
                  >
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-xs">Questions</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onDownload('answers')}
                    className="flex-col h-auto py-4"
                  >
                    <Key className="w-5 h-5 mb-1" />
                    <span className="text-xs">Answers</span>
                  </Button>
                </div>

                <div className="border-t border-border/50 pt-4 space-y-3">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onRegenerate}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="border-border/50 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Worksheet Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="font-medium">{config.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade</span>
                  <span className="font-medium">{config.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Marks</span>
                  <span className="font-medium">{config.totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium capitalize">{config.difficulty}</span>
                </div>
                {config.board && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Board</span>
                    <span className="font-medium">{config.board}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Worksheet Button */}
        <div className="text-center mt-12">
          <Button variant="hero-outline" size="lg" onClick={onRegenerate}>
            <Sparkles className="w-5 h-5" />
            Create Another Worksheet
          </Button>
        </div>
      </div>
    </section>
  );
}

interface QuestionCardProps {
  question: Question;
  isEditing: boolean;
  editedQuestion: Question | null;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (q: Question) => void;
  showAnswer: boolean;
}

function QuestionCard({
  question,
  isEditing,
  editedQuestion,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  showAnswer,
}: QuestionCardProps) {
  if (isEditing && editedQuestion) {
    return (
      <div className="p-4 rounded-lg border-2 border-primary bg-primary/5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Q{question.questionNumber}.</span>
          <Input
            value={editedQuestion.marks}
            onChange={(e) => onUpdate({ ...editedQuestion, marks: Number(e.target.value) })}
            type="number"
            className="w-20 h-8"
            min={1}
          />
          <span className="text-sm text-muted-foreground">marks</span>
        </div>
        <Textarea
          value={editedQuestion.questionText}
          onChange={(e) => onUpdate({ ...editedQuestion, questionText: e.target.value })}
          rows={3}
          className="resize-none"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Answer</label>
          <Textarea
            value={editedQuestion.answer}
            onChange={(e) => onUpdate({ ...editedQuestion, answer: e.target.value })}
            rows={2}
            className="resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={onSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
      <div className="flex items-start gap-3">
        {!showAnswer && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <p className="text-foreground">
              <span className="font-bold">Q{question.questionNumber}.</span>{" "}
              {question.questionText}
            </p>
            <span className="shrink-0 text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
              [{question.marks} marks]
            </span>
          </div>

          {showAnswer && (
            <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm">
                <span className="font-semibold text-success">Answer: </span>
                <span className="text-foreground">{question.answer}</span>
              </p>
              {question.solution && (
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium">Solution: </span>
                  {question.solution}
                </p>
              )}
            </div>
          )}
        </div>

        {!showAnswer && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onEdit}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
