import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendClient } from '@/integrations/backend/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Users, Shield, BookOpen, Bell, LayoutDashboard, UserPlus, Trash2, Edit,
  LogOut, ChevronRight, GraduationCap, Building2, Megaphone, Search, Loader2
} from 'lucide-react';

type Tab = 'overview' | 'users' | 'announcements';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  department: string | null;
}

interface UserRole {
  user_id: string;
  role: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<(UserProfile & { role?: string })[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);

  // New user form
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('faculty');
  const [newUserBranch, setNewUserBranch] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annBranch, setAnnBranch] = useState('all');
  const [annPriority, setAnnPriority] = useState('normal');
  const [isPostingAnn, setIsPostingAnn] = useState(false);

  // Role update
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState('');

  const supabase = getBackendClient();

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data: profiles, error } = await supabase.from('profiles').select('*');
      if (error) throw error;

      const { data: roles, error: rolesError } = await supabase.from('user_roles').select('*');
      if (rolesError) throw rolesError;

      const roleMap = new Map((roles || []).map((r: UserRole) => [r.user_id, r.role]));
      const merged = (profiles || []).map((p: UserProfile) => ({
        ...p,
        role: roleMap.get(p.user_id) || 'no role',
      }));
      setUsers(merged);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchAnnouncements = async () => {
    setIsLoadingAnnouncements(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAnnouncements();
  }, []);

  const handleAssignRole = async (userId: string, role: string) => {
    try {
      // Delete existing role
      await supabase.from('user_roles').delete().eq('user_id', userId);
      // Insert new role
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: role as any });
      if (error) throw error;
      toast({ title: 'Role updated', description: `User role set to ${role}` });
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handlePostAnnouncement = async () => {
    if (!annTitle || !annContent) return;
    setIsPostingAnn(true);
    try {
      const { error } = await supabase.from('announcements').insert({
        title: annTitle,
        content: annContent,
        branch: annBranch,
        priority: annPriority,
        created_by: user?.id,
      });
      if (error) throw error;
      toast({ title: 'Announcement posted!' });
      setAnnTitle('');
      setAnnContent('');
      setAnnBranch('all');
      setShowAddAnnouncement(false);
      fetchAnnouncements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsPostingAnn(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Announcement deleted' });
      fetchAnnouncements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(u =>
    (u.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (u.department?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const sidebarItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as Tab, label: 'User Management', icon: Users },
    { id: 'announcements' as Tab, label: 'Announcements', icon: Megaphone },
  ];

  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    hods: users.filter(u => u.role === 'hod').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    announcements: announcements.length,
  };

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
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Super Admin</p>
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
              {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
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

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-primary' },
                  { label: 'HODs', value: stats.hods, icon: GraduationCap, color: 'text-orange-500' },
                  { label: 'Faculty', value: stats.faculty, icon: Building2, color: 'text-green-500' },
                  { label: 'Announcements', value: stats.announcements, icon: Bell, color: 'text-purple-500' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                          </div>
                          <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  {announcements.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.branch} · {new Date(a.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={a.priority === 'urgent' ? 'destructive' : a.priority === 'high' ? 'default' : 'secondary'}>
                        {a.priority}
                      </Badge>
                    </div>
                  ))}
                  {announcements.length === 0 && <p className="text-muted-foreground text-sm">No announcements yet</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoadingUsers ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map(u => (
                    <Card key={u.id} className="border-border/50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {(u.full_name || u.email || '?')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{u.full_name || 'No name'}</p>
                            <p className="text-sm text-muted-foreground">{u.email} · {u.department || 'No branch'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={u.role === 'admin' ? 'destructive' : u.role === 'hod' ? 'default' : 'secondary'}>
                            {u.role}
                          </Badge>
                          {editingUserId === u.user_id ? (
                            <div className="flex items-center gap-2">
                              <Select value={editingRole} onValueChange={setEditingRole}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="hod">HOD</SelectItem>
                                  <SelectItem value="faculty">Faculty</SelectItem>
                                  <SelectItem value="student">Student</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" onClick={() => handleAssignRole(u.user_id, editingRole)}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingUserId(null)}>Cancel</Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUserId(u.user_id);
                                setEditingRole(u.role || 'student');
                              }}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Role
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div key="announcements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
                <Button onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}>
                  <Bell className="w-4 h-4 mr-2" />
                  Post Announcement
                </Button>
              </div>

              <AnimatePresence>
                {showAddAnnouncement && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Branch</Label>
                              <Select value={annBranch} onValueChange={setAnnBranch}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Branches</SelectItem>
                                  <SelectItem value="CSE">CSE</SelectItem>
                                  <SelectItem value="IT">IT</SelectItem>
                                  <SelectItem value="DS">DS</SelectItem>
                                </SelectContent>
                              </Select>
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
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea value={annContent} onChange={e => setAnnContent(e.target.value)} placeholder="Announcement content..." rows={4} />
                        </div>
                        <Button onClick={handlePostAnnouncement} disabled={isPostingAnn}>
                          {isPostingAnn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Post
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLoadingAnnouncements ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(a => (
                    <Card key={a.id} className="border-border/50">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{a.title}</h3>
                              <Badge variant={a.priority === 'urgent' ? 'destructive' : a.priority === 'high' ? 'default' : 'secondary'}>
                                {a.priority}
                              </Badge>
                              <Badge variant="outline">{a.branch}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleString()}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteAnnouncement(a.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {announcements.length === 0 && <p className="text-muted-foreground text-center py-8">No announcements yet</p>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
