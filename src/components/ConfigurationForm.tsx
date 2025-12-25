import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ChevronRight, Lightbulb, GraduationCap, BookOpen, Target, Hash, Award } from "lucide-react";
import {
  WorksheetConfig,
  GRADES,
  SUBJECTS,
  BOARDS,
  DIFFICULTY_LEVELS,
  TOPICS_BY_SUBJECT,
} from "@/types/worksheet";

interface ConfigurationFormProps {
  onGenerate: (config: WorksheetConfig) => void;
  isGenerating: boolean;
}

export function ConfigurationForm({ onGenerate, isGenerating }: ConfigurationFormProps) {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<WorksheetConfig['difficulty']>("medium");
  const [totalMarks, setTotalMarks] = useState(50);
  const [numQuestions, setNumQuestions] = useState(10);
  const [board, setBoard] = useState("Not Specified");

  const availableTopics = subject && grade ? TOPICS_BY_SUBJECT[subject]?.[grade] || [] : [];

  useEffect(() => {
    setTopics([]);
  }, [grade, subject]);

  const handleTopicToggle = (topic: string) => {
    setTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const getSuggestedQuestions = () => {
    if (totalMarks <= 20) return "4-6";
    if (totalMarks <= 50) return "8-12";
    if (totalMarks <= 80) return "15-20";
    return "20-25";
  };

  const handleSubmit = () => {
    if (!grade || !subject || topics.length === 0) return;

    onGenerate({
      grade,
      subject,
      topics,
      difficulty,
      totalMarks,
      numQuestions,
      board: board === "Not Specified" ? undefined : board,
    });
  };

  const isValid = grade && subject && topics.length > 0 && totalMarks > 0 && numQuestions > 0;

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Configure Your Worksheet
          </h2>
          <p className="text-muted-foreground">
            Fill in the details below to generate your custom worksheet
          </p>
        </div>

        <div className="space-y-8">
          {/* Grade & Subject */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade / Class</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger id="grade" className="h-12">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {GRADES.map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject" className="h-12">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {SUBJECTS.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Topics */}
          {availableTopics.length > 0 && (
            <Card className="border-border/50 shadow-md animate-scale-in">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Topics
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (Select at least one)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTopics.map(topic => (
                    <label
                      key={topic}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        topics.includes(topic)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <Checkbox
                        checked={topics.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                      />
                      <span className="text-sm font-medium">{topic}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Difficulty */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Difficulty Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as WorksheetConfig['difficulty'])}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <label
                    key={level.value}
                    className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      difficulty === level.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <span className="font-semibold">{level.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{level.description}</span>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Marks & Questions */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="w-5 h-5 text-primary" />
                Questions & Marks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    min={10}
                    max={200}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numQuestions">Number of Questions</Label>
                  <Input
                    id="numQuestions"
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Lightbulb className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">
                  For {totalMarks} marks, we recommend <strong>{getSuggestedQuestions()} questions</strong> for optimal coverage.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Board (Optional) */}
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-primary" />
                Board / Curriculum
                <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={board} onValueChange={setBoard}>
                <SelectTrigger className="h-12 max-w-md">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {BOARDS.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="hero"
              size="xl"
              onClick={handleSubmit}
              disabled={!isValid || isGenerating}
              className="w-full max-w-md"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Worksheet
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
