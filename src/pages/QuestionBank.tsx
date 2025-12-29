import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, Plus, Search, Filter, Trash2, Edit2, Share2, 
  BookOpen, CheckCircle 
} from 'lucide-react';
import { SUBJECTS, GRADES, DIFFICULTY_LEVELS } from '@/utils/mockGeneration';

interface QuestionBankItem {
  id: string;
  question_text: string;
  answer: string;
  solution: string | null;
  grade: string;
  subject: string;
  topic: string;
  difficulty: string;
  marks: number;
  is_shared: boolean;
  team_id: string | null;
  created_at: string;
}

export default function QuestionBank() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
  }, [user]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load questions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => q.id !== id));
      setSelectedQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      toast({
        title: 'Deleted',
        description: 'Question removed from your bank',
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        variant: 'destructive',
      });
    }
  };

  const handleToggleShare = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('question_bank')
        .update({ is_shared: !currentState })
        .eq('id', id);

      if (error) throw error;

      setQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, is_shared: !currentState } : q)
      );

      toast({
        title: currentState ? 'Unshared' : 'Shared',
        description: currentState 
          ? 'Question is now private' 
          : 'Question is now shared with your team',
      });
    } catch (error) {
      console.error('Error updating share status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update share status',
        variant: 'destructive',
      });
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
    const matchesGrade = filterGrade === 'all' || q.grade === filterGrade;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'hard': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Question Bank</h1>
            <p className="text-muted-foreground">
              {questions.length} questions saved • {selectedQuestions.size} selected
            </p>
          </div>
          {selectedQuestions.size > 0 && (
            <Button variant="hero" className="mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Worksheet from Selected
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {GRADES.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {DIFFICULTY_LEVELS.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {questions.length === 0 ? 'No questions yet' : 'No matching questions'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {questions.length === 0 
                  ? 'Save questions from generated worksheets to build your bank'
                  : 'Try adjusting your filters or search query'}
              </p>
              {questions.length === 0 && (
                <Button variant="outline" onClick={() => navigate('/')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate a Worksheet
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card 
                key={question.id}
                className={`transition-all ${
                  selectedQuestions.has(question.id) 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:shadow-md'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleSelection(question.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedQuestions.has(question.id)
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                    >
                      {selectedQuestions.has(question.id) && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="secondary">{question.subject}</Badge>
                        <Badge variant="outline">{question.grade}</Badge>
                        <Badge variant="outline">{question.topic}</Badge>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {question.marks} marks
                        </span>
                      </div>
                      
                      <p className="text-foreground mb-3">{question.question_text}</p>
                      
                      <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <strong>Answer:</strong> {question.answer}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleShare(question.id, question.is_shared)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {question.is_shared ? 'Shared' : 'Share'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
