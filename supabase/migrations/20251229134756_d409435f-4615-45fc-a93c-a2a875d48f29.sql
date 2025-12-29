-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'viewer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'teacher',
  UNIQUE (user_id, role)
);

-- Create teams/workspaces table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team memberships table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'teacher',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- Create question bank table
CREATE TABLE public.question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  answer TEXT NOT NULL,
  solution TEXT,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 5,
  question_type TEXT NOT NULL DEFAULT 'descriptive',
  is_shared BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved worksheets table
CREATE TABLE public.saved_worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  config JSONB NOT NULL,
  questions JSONB NOT NULL,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_worksheets ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE user_id = _user_id
      AND team_id = _team_id
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies (only admins can manage)
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Teams policies
CREATE POLICY "Team members can view their teams" ON public.teams
  FOR SELECT USING (public.is_team_member(auth.uid(), id) OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team creators can update their teams" ON public.teams
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Team creators can delete their teams" ON public.teams
  FOR DELETE USING (created_by = auth.uid());

-- Team members policies
CREATE POLICY "Team members can view memberships" ON public.team_members
  FOR SELECT USING (public.is_team_member(auth.uid(), team_id) OR user_id = auth.uid());

CREATE POLICY "Team creators can add members" ON public.team_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND created_by = auth.uid())
  );

CREATE POLICY "Team creators can remove members" ON public.team_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND created_by = auth.uid())
    OR user_id = auth.uid()
  );

-- Question bank policies
CREATE POLICY "Users can view their own questions" ON public.question_bank
  FOR SELECT USING (
    user_id = auth.uid() 
    OR (is_shared = true AND team_id IS NOT NULL AND public.is_team_member(auth.uid(), team_id))
  );

CREATE POLICY "Users can create questions" ON public.question_bank
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions" ON public.question_bank
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions" ON public.question_bank
  FOR DELETE USING (auth.uid() = user_id);

-- Saved worksheets policies
CREATE POLICY "Users can view their own worksheets" ON public.saved_worksheets
  FOR SELECT USING (
    user_id = auth.uid() 
    OR (is_shared = true AND team_id IS NOT NULL AND public.is_team_member(auth.uid(), team_id))
  );

CREATE POLICY "Users can create worksheets" ON public.saved_worksheets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own worksheets" ON public.saved_worksheets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own worksheets" ON public.saved_worksheets
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'teacher');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_question_bank_updated_at
  BEFORE UPDATE ON public.question_bank
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_worksheets_updated_at
  BEFORE UPDATE ON public.saved_worksheets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();