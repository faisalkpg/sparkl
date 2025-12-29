import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, FileText, Library, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SavedWorksheet {
  id: string;
  title: string;
  config: Record<string, unknown>;
  created_at: string;
}

interface QuestionCount {
  count: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [worksheets, setWorksheets] = useState<SavedWorksheet[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [worksheetsRes, questionsRes, teamsRes] = await Promise.all([
        supabase
          .from('saved_worksheets')
          .select('id, title, config, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('question_bank')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('team_members')
          .select('id', { count: 'exact', head: true }),
      ]);

      if (worksheetsRes.data) {
        setWorksheets(worksheetsRes.data as SavedWorksheet[]);
      }
      setQuestionCount(questionsRes.count || 0);
      setTeamCount(teamsRes.count || 0);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your workspace.</p>
          </div>
          <Button variant="hero" onClick={() => navigate('/')} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Worksheet
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/question-bank')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Question Bank</CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionCount}</div>
              <p className="text-xs text-muted-foreground">Saved questions</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/teams')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamCount}</div>
              <p className="text-xs text-muted-foreground">Team memberships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Worksheets</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{worksheets.length}</div>
              <p className="text-xs text-muted-foreground">Recently created</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Worksheets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Worksheets</CardTitle>
            <CardDescription>Your most recently created worksheets</CardDescription>
          </CardHeader>
          <CardContent>
            {worksheets.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No worksheets yet</p>
                <Button variant="outline" onClick={() => navigate('/')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first worksheet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {worksheets.map((worksheet) => (
                  <div
                    key={worksheet.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{worksheet.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(worksheet.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
