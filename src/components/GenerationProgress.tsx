import { useEffect, useState } from "react";
import { Sparkles, FileText, Brain, CheckCircle } from "lucide-react";

interface GenerationProgressProps {
  subject: string;
  numQuestions: number;
}

const steps = [
  { icon: Brain, label: "Analyzing curriculum requirements" },
  { icon: FileText, label: "Generating questions" },
  { icon: Sparkles, label: "Creating answer key" },
  { icon: CheckCircle, label: "Finalizing worksheet" },
];

export function GenerationProgress({ subject, numQuestions }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 4000; // 4 seconds per step (16s total simulation)
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 160);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 max-w-2xl">
        <div className="text-center mb-12">
          {/* Animated icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 gradient-primary rounded-full opacity-20 animate-ping" />
            <div className="absolute inset-2 gradient-primary rounded-full opacity-40 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary animate-spin-slow" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Creating Your Worksheet
          </h2>
          <p className="text-muted-foreground">
            Generating {numQuestions} {subject} questions tailored to your specifications
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {progress}% complete
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-primary/10 border-2 border-primary shadow-md"
                    : isComplete
                    ? "bg-success/10 border-2 border-success/30"
                    : "bg-muted/50 border-2 border-transparent"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "gradient-primary text-primary-foreground"
                      : isComplete
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isActive
                      ? "text-foreground"
                      : isComplete
                      ? "text-success"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          This usually takes 15-30 seconds. Please don't refresh the page.
        </p>
      </div>
    </section>
  );
}
