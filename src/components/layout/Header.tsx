import { useState } from "react";
import { Menu, X, GraduationCap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, isHOD, isFaculty, userRole, signOut } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Branches", href: "/branches" },
    { name: "Research", href: "/research" },
    { name: "Events", href: "/events" },
  ];

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isHOD) return '/hod-dashboard';
    if (isFaculty) return '/faculty-dashboard';
    if (user) return '/student-dashboard';
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 md:gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-cyber flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-foreground font-heading leading-tight">NRIIT</span>
            </motion.div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.name} to={link.href}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors group ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 rounded-full ${isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Dashboard link for logged-in users */}
            {dashboardLink && (
              <Link to={dashboardLink}>
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-all"
                >
                  {isAdmin && <Shield className="w-4 h-4 text-destructive" />}
                  Dashboard
                </motion.button>
              </Link>
            )}

            {/* Auth button */}
            {user ? (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={signOut}
                className="hidden lg:block px-4 py-2 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-muted transition-all"
              >
                Sign Out
              </motion.button>
            ) : (
              <Link to="/auth">
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(217 91% 60% / 0.6)" }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden lg:block px-5 py-2 rounded-xl bg-primary text-white font-semibold shadow-[0_0_20px_hsl(217_91%_60%_/_0.4)] hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.6)] transition-all text-sm cursor-pointer"
                >
                  Login
                </motion.button>
              </Link>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2.5 rounded-xl hover:bg-muted transition-colors touch-target">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-card"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.href;
                return (
                  <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}
                    className={`px-4 py-3.5 rounded-xl text-base font-medium transition-colors touch-target justify-start ${isActive ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {dashboardLink && (
                <Link to={dashboardLink} onClick={() => setIsOpen(false)}
                  className="px-4 py-3.5 rounded-xl text-base font-medium text-foreground hover:bg-muted flex items-center gap-2"
                >
                  {isAdmin && <Shield className="w-4 h-4 text-destructive" />}
                  Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { setIsOpen(false); signOut(); }}
                  className="px-4 py-3.5 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 text-left"
                >
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}
                  className="mt-3 px-6 py-3.5 rounded-xl bg-gradient-cyber text-white font-semibold text-base w-full touch-target text-center"
                >
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
