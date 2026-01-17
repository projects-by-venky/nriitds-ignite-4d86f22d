import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Settings, Plus, Trash2, LogIn, LogOut, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventAccessMenuProps {
  onOpenManage: () => void;
}

const EventAccessMenu = ({ onOpenManage }: EventAccessMenuProps) => {
  const { user, isAdminOrFaculty, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Not logged in - show login button
  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/auth')}
        className="gap-2"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Login</span>
      </Button>
    );
  }

  // Logged in but not admin/faculty - show user info only
  if (!isAdminOrFaculty) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm">
            <p className="font-medium truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole || 'User'}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Admin/Faculty - show full access menu
  const menuContent = (
    <div className="space-y-2">
      <div className="px-2 py-1.5 text-sm border-b border-border pb-3 mb-2">
        <p className="font-medium truncate">{user.email}</p>
        <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
      </div>
      
      <Link to="/events/upload" onClick={() => setIsOpen(false)}>
        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-medium">Add New Event</div>
            <div className="text-xs text-muted-foreground">Create a new event</div>
          </div>
        </Button>
      </Link>
      
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-3 h-12"
        onClick={() => {
          onOpenManage();
          setIsOpen(false);
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
          <Trash2 className="h-4 w-4 text-destructive" />
        </div>
        <div className="text-left">
          <div className="font-medium">Manage Events</div>
          <div className="text-xs text-muted-foreground">Remove or restore events</div>
        </div>
      </Button>

      <div className="pt-2 border-t border-border mt-3">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  // Mobile: Use bottom sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Access
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="text-left mb-4">
            <SheetTitle>Event Management</SheetTitle>
          </SheetHeader>
          {menuContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use dropdown
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Access
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        {menuContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventAccessMenu;
