import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendClient } from '@/integrations/backend/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users, Bell, LayoutDashboard, Upload, BookOpen, LogOut,
  ChevronRight, Megaphone, FileText, Loader2, Trash2, Search
} from 'lucide-react';

type Tab = 'overview' | 'announcements' | 'notes' | 'faculty';

const HODDashboard = () => {
  const { user, userBranch, signOut } = useAuth();
  const { toast } = useToast();
  const supabase = getBackendClient();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState('normal');
  const [isPostingAnn, setIsPostingAnn] = useState(false);
  const [showAnnForm, setShowAnnForm] = useState(false);

  // Notes form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [noteSemester, setNoteSemester] = useState('');
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [isUploadingNote, setIsUploadingNote] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const branch = userBranch || '';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [annRes, notesRes, facRes] = await Promise.all([
        supabase.from('announcements').select('*').eq('branch', branch).order('created_at', { ascending: false }),
        supabase.from('notes').select('*').eq('branch', branch).order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('department', branch),
      ]);
      setAnnouncements(annRes.data || []);
      setNotes(notesRes.data || []);
      setFacultyList(facRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (branch) fetchData();
  }, [branch]);

  const handlePostAnnouncement = async () => {
    if (!annTitle || !annContent) return;
    setIsPostingAnn(true);
    try {
      const { error } = await supabase.from('announcements').insert({
        title: annTitle,
        content: annContent,
        branch,
        priority: annPriority,
        created_by: user?.id,
      });
      if (error) throw error;
      toast({ title: 'Announcement posted!' });
      setAnnTitle(''); setAnnContent(''); setShowAnnForm(false);
      fetchData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsPostingAnn(false);
    }
  };

  const handleUploadNote = async () => {
    if (!noteTitle || !noteSubject || !noteSemester || !noteFile) {
      toast({ title: 'Please fill all fields and select a file', variant: 'destructive' });
      return;
    }
    setIsUploadingNote(true);
    try {
      const fileName = `${branch}/${Date.now()}-${noteFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(fileName, noteFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('notes-files').getPublicUrl(fileName);

      const { error } = await supabase.from('notes').insert({
        title: noteTitle,
        description: noteDesc,
        branch,
        subject: noteSubject,
        semester: noteSemester,
        file_url: urlData.publicUrl,
        file_name: noteFile.name,
        file_size: noteFile.size,
        uploaded_by: user?.id,
        uploaded_by_name: user?.user_metadata?.full_name || user?.email,
      });
      if (error) throw error;
      toast({ title: 'Note uploaded!' });
      setNoteTitle(''); setNoteDesc(''); setNoteSubject(''); setNoteSemester('');
      setNoteFile(null); setShowNoteForm(false);
      fetchData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploadingNote(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) { toast({ title: 'Deleted' }); fetchData(); }
  };

  const handleDeleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) { toast({ title: 'Deleted' }); fetchData(); }
  };

  const sidebarItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'announcements' as Tab, label: 'Announcements', icon: Megaphone },
    { id: 'notes' as Tab, label: 'Notes & Materials', icon: BookOpen },
    { id: 'faculty' as Tab, label: 'Faculty List', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        className="w-64 bg-card border-r border-border flex flex-col fixed h-full z-40"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">HOD Panel</h2>
              <p className="text-xs text-muted-foreground">{branch} Department</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={signOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">HOD Dashboard — {branch}</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Announcements', value: announcements.length, icon: Bell },
                  { label: 'Notes Uploaded', value: notes.length, icon: FileText },
                  { label: 'Faculty Members', value: facultyList.length, icon: Users },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card>
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <stat.icon className="w-8 h-8 text-primary opacity-80" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div key="announcements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
                <Button onClick={() => setShowAnnForm(!showAnnForm)}>
                  <Megaphone className="w-4 h-4 mr-2" /> Post
                </Button>
              </div>

              {showAnnForm && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={annTitle} onChange={e => setAnnTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea value={annContent} onChange={e => setAnnContent(e.target.value)} rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={annPriority} onValueChange={setAnnPriority}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handlePostAnnouncement} disabled={isPostingAnn}>
                      {isPostingAnn && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Post Announcement
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {announcements.map(a => (
                  <Card key={a.id}>
                    <CardContent className="p-4 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{a.title}</h3>
                          <Badge variant={a.priority === 'urgent' ? 'destructive' : 'secondary'}>{a.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleString()}</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteAnnouncement(a.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {announcements.length === 0 && <p className="text-center text-muted-foreground py-8">No announcements</p>}
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Notes & Materials</h1>
                <Button onClick={() => setShowNoteForm(!showNoteForm)}>
                  <Upload className="w-4 h-4 mr-2" /> Upload Note
                </Button>
              </div>

              {showNoteForm && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input value={noteSubject} onChange={e => setNoteSubject(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Semester</Label>
                        <Select value={noteSemester} onValueChange={setNoteSemester}>
                          <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                          <SelectContent>
                            {['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2'].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>File</Label>
                        <Input type="file" onChange={e => setNoteFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <Textarea value={noteDesc} onChange={e => setNoteDesc(e.target.value)} rows={2} />
                    </div>
                    <Button onClick={handleUploadNote} disabled={isUploadingNote}>
                      {isUploadingNote && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Upload
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {notes.map(n => (
                  <Card key={n.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{n.title}</p>
                          <p className="text-sm text-muted-foreground">{n.subject} · Sem {n.semester} · {n.file_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={n.file_url} target="_blank" rel="noopener noreferrer">Download</a>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteNote(n.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {notes.length === 0 && <p className="text-center text-muted-foreground py-8">No notes uploaded</p>}
              </div>
            </motion.div>
          )}

          {activeTab === 'faculty' && (
            <motion.div key="faculty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Faculty — {branch}</h1>
              <div className="space-y-2">
                {facultyList.map(f => (
                  <Card key={f.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {(f.full_name || f.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{f.full_name || 'No name'}</p>
                        <p className="text-sm text-muted-foreground">{f.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {facultyList.length === 0 && <p className="text-center text-muted-foreground py-8">No faculty members found</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HODDashboard;
