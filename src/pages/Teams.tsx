import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, Plus, Users, UserPlus, Settings, Trash2, 
  Crown, Mail, Copy 
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  member_count?: number;
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: {
    full_name: string | null;
  };
}

export default function Teams() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  const loadTeams = async () => {
    try {
      // Get teams where user is creator or member
      const { data: memberTeams, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      const teamIds = memberTeams?.map(m => m.team_id) || [];

      const { data: createdTeams, error: createdError } = await supabase
        .from('teams')
        .select('*')
        .eq('created_by', user?.id);

      if (createdError) throw createdError;

      // Combine and deduplicate
      const allTeamIds = [...new Set([...teamIds, ...(createdTeams?.map(t => t.id) || [])])];
      
      if (allTeamIds.length === 0) {
        setTeams([]);
        setIsLoading(false);
        return;
      }

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', allTeamIds)
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);
    } catch (error) {
      console.error('Error loading teams:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teams',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: newTeamName.trim(),
          description: newTeamDescription.trim() || null,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as team member
      await supabase.from('team_members').insert({
        team_id: data.id,
        user_id: user?.id,
        role: 'admin',
      });

      setTeams(prev => [data, ...prev]);
      setCreateDialogOpen(false);
      setNewTeamName('');
      setNewTeamDescription('');

      toast({
        title: 'Team created',
        description: `${data.name} has been created successfully`,
      });
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: 'Error',
        description: 'Failed to create team',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      setTeams(prev => prev.filter(t => t.id !== teamId));
      setSelectedTeam(null);

      toast({
        title: 'Team deleted',
        description: 'Team has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete team',
        variant: 'destructive',
      });
    }
  };

  const loadTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          joined_at
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleSelectTeam = async (team: Team) => {
    setSelectedTeam(team);
    await loadTeamMembers(team.id);
  };

  const copyInviteLink = () => {
    if (!selectedTeam) return;
    const link = `${window.location.origin}/teams/join/${selectedTeam.id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copied',
      description: 'Invite link copied to clipboard',
    });
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Teams</h1>
            <p className="text-muted-foreground">
              Collaborate with other teachers and share question banks
            </p>
          </div>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new team</DialogTitle>
                <DialogDescription>
                  Teams let you share worksheets and question banks with colleagues
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    placeholder="e.g., Math Department"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamDescription">Description (optional)</Label>
                  <Input
                    id="teamDescription"
                    placeholder="What is this team for?"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="hero" 
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim() || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Team'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams List */}
          <div className="lg:col-span-1 space-y-4">
            {teams.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No teams yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create a team to start collaborating
                  </p>
                </CardContent>
              </Card>
            ) : (
              teams.map((team) => (
                <Card 
                  key={team.id}
                  className={`cursor-pointer transition-all ${
                    selectedTeam?.id === team.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleSelectTeam(team)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {team.name}
                          {team.created_by === user?.id && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </h3>
                        {team.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {team.description}
                          </p>
                        )}
                      </div>
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Team Details */}
          <div className="lg:col-span-2">
            {selectedTeam ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedTeam.name}
                        {selectedTeam.created_by === user?.id && (
                          <Crown className="w-5 h-5 text-amber-500" />
                        )}
                      </CardTitle>
                      {selectedTeam.description && (
                        <CardDescription>{selectedTeam.description}</CardDescription>
                      )}
                    </div>
                    {selectedTeam.created_by === user?.id && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTeam(selectedTeam.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invite Section */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Invite Members
                    </h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </div>
                    <div className="mt-3">
                      <Button variant="ghost" size="sm" onClick={copyInviteLink}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy invite link
                      </Button>
                    </div>
                  </div>

                  {/* Members List */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Members ({teamMembers.length})
                    </h4>
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div 
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {member.user_id === user?.id ? 'You' : 'Team Member'}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {member.role}
                              </p>
                            </div>
                          </div>
                          {member.role === 'admin' && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Select a team
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a team from the list to view details and manage members
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
