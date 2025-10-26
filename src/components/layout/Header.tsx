import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "#courses" },
    { name: "Branches", path: "#branches" },
    { name: "Students", path: "#students" },
    { name: "Faculty", path: "#faculty" },
    { name: "Events", path: "#events" },
    { name: "Research", path: "#research" },
    { name: "Contact", path: "#contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith("#")) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-premium shadow-3d border-b border-primary/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Premium Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-14 h-14 rounded-2xl gradient-3d flex items-center justify-center shadow-neon relative"
            >
              <GraduationCap className="w-7 h-7 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsl(180 100% 50% / 0.5)",
                    "0 0 40px hsl(262 85% 62% / 0.5)",
                    "0 0 20px hsl(180 100% 50% / 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-metallic">NRIITDS</span>
              <span className="text-xs text-primary tracking-widest font-semibold">ELITE ENGINEERING</span>
            </div>
          </Link>

          {/* Desktop Navigation with Magnetic Hover */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.path)}
                className="relative px-5 py-2.5 text-foreground font-semibold text-sm tracking-wide overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Magnetic Glow Effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Underline Animation */}
                <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                  {item.name}
                </span>
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary group-hover:w-full transition-all duration-300"
                  whileHover={{ boxShadow: "0 0 10px hsl(180 100% 50%)" }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Premium Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary font-semibold border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                Login
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 gradient-neon opacity-60 rounded-xl blur group-hover:opacity-100 transition duration-300"></div>
              <Button className="relative gradient-3d text-white font-bold shadow-neon border border-primary/30 hover:shadow-glow transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-foreground hover:text-primary glass-effect rounded-xl border border-primary/20 hover:border-primary/50 transition-all duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Premium Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden glass-premium border-t border-primary/20"
        >
          <div className="container mx-auto px-6 py-8 flex flex-col gap-3">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => scrollToSection(item.path)}
                className="text-foreground hover:text-primary font-semibold text-left py-3 px-4 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/30 transition-all duration-300"
              >
                {item.name}
              </motion.button>
            ))}
            <div className="flex flex-col gap-3 pt-6 border-t border-primary/20 mt-3">
              <Button variant="outline" className="w-full border-primary/30 hover:border-primary/60">
                Login
              </Button>
              <Button className="w-full gradient-3d text-white font-bold shadow-neon">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
