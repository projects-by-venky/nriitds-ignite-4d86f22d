import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendClient } from '@/integrations/backend/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell, BookOpen, FileText, LogOut, LayoutDashboard, Users, Download
} from 'lucide-react';

type Tab = 'announcements' | 'notes' | 'faculty';

const StudentDashboard = () => {
  const { user, userBranch, signOut } = useAuth();
  const supabase = getBackendClient();
  const [activeTab, setActiveTab] = useState<Tab>('announcements');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState('all');

  const branch = userBranch || '';

  useEffect(() => {
    if (!branch) return;
    setIsLoading(true);
    const fetchAll = async () => {
      const [annRes, notesRes, facRes] = await Promise.all([
        supabase.from('announcements').select('*').or(`branch.eq.${branch},branch.eq.all`).eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('notes').select('*').eq('branch', branch).eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('department', branch),
      ]);
      setAnnouncements(annRes.data || []);
      setNotes(notesRes.data || []);
      setFacultyList(facRes.data || []);
      setIsLoading(false);
    };
    fetchAll();
  }, [branch]);

  const filteredNotes = semesterFilter === 'all' ? notes : notes.filter(n => n.semester === semesterFilter);

  const sidebarItems = [
    { id: 'announcements' as Tab, label: 'Announcements', icon: Bell },
    { id: 'notes' as Tab, label: 'Notes & Materials', icon: BookOpen },
    { id: 'faculty' as Tab, label: 'Faculty List', icon: Users },
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
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Student Portal</h2>
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
          {activeTab === 'announcements' && (
            <motion.div key="announcements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
              {isLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(a => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{a.title}</h3>
                            <Badge variant={a.priority === 'urgent' ? 'destructive' : a.priority === 'high' ? 'default' : 'secondary'}>
                              {a.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{a.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {announcements.length === 0 && <p className="text-center text-muted-foreground py-8">No announcements</p>}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Notes & Materials</h1>
                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2'].map(s => (
                      <SelectItem key={s} value={s}>Sem {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                {filteredNotes.map(n => (
                  <Card key={n.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{n.title}</p>
                          <p className="text-sm text-muted-foreground">{n.subject} · Sem {n.semester}</p>
                          {n.description && <p className="text-xs text-muted-foreground mt-1">{n.description}</p>}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={n.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-3 h-3 mr-1" /> Download
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {filteredNotes.length === 0 && <p className="text-center text-muted-foreground py-8">No notes available</p>}
              </div>
            </motion.div>
          )}

          {activeTab === 'faculty' && (
            <motion.div key="faculty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Faculty — {branch}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {facultyList.map(f => (
                  <Card key={f.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {(f.full_name || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{f.full_name || 'Faculty'}</p>
                        <p className="text-sm text-muted-foreground">{f.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {facultyList.length === 0 && <p className="text-center text-muted-foreground py-8">No faculty listed</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StudentDashboard;
