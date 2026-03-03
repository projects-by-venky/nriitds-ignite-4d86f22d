import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendClient } from '@/integrations/backend/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Upload, Bell, LogOut, LayoutDashboard, FileText, Loader2, Trash2
} from 'lucide-react';

type Tab = 'overview' | 'notes' | 'announcements';

const FacultyDashboard = () => {
  const { user, userBranch, signOut } = useAuth();
  const { toast } = useToast();
  const supabase = getBackendClient();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [notes, setNotes] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const [notesRes, annRes] = await Promise.all([
        supabase.from('notes').select('*').eq('branch', branch).order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').or(`branch.eq.${branch},branch.eq.all`).order('created_at', { ascending: false }),
      ]);
      setNotes(notesRes.data || []);
      setAnnouncements(annRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (branch) fetchData();
  }, [branch]);

  const handleUploadNote = async () => {
    if (!noteTitle || !noteSubject || !noteSemester || !noteFile) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setIsUploadingNote(true);
    try {
      const fileName = `${branch}/${Date.now()}-${noteFile.name}`;
      const { error: uploadError } = await supabase.storage.from('notes-files').upload(fileName, noteFile);
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

  const handleDeleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) { toast({ title: 'Deleted' }); fetchData(); }
  };

  const sidebarItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'notes' as Tab, label: 'Upload Notes', icon: BookOpen },
    { id: 'announcements' as Tab, label: 'Announcements', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        className="w-64 bg-card border-r border-border flex flex-col fixed h-full z-40"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Faculty Panel</h2>
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

      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Welcome, Faculty</h1>
              <p className="text-muted-foreground">Department: {branch}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Your Notes</p>
                      <p className="text-3xl font-bold text-foreground">{notes.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-primary" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Announcements</p>
                      <p className="text-3xl font-bold text-foreground">{announcements.length}</p>
                    </div>
                    <Bell className="w-8 h-8 text-primary" />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Upload Notes</h1>
                <Button onClick={() => setShowNoteForm(!showNoteForm)}>
                  <Upload className="w-4 h-4 mr-2" /> Upload
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
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                      Upload Note
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
                          <p className="text-sm text-muted-foreground">{n.subject} · Sem {n.semester}</p>
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
                {notes.length === 0 && <p className="text-center text-muted-foreground py-8">No notes uploaded yet</p>}
              </div>
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div key="announcements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
              <div className="space-y-3">
                {announcements.map(a => (
                  <Card key={a.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{a.title}</h3>
                        <Badge variant={a.priority === 'urgent' ? 'destructive' : 'secondary'}>{a.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{a.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
                {announcements.length === 0 && <p className="text-center text-muted-foreground py-8">No announcements</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default FacultyDashboard;
