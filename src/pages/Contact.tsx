import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/sections/ContactSection";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const quickInfo = [
    { icon: MapPin, label: "Campus Location", value: "NRI Institutions, Hyderabad" },
    { icon: Phone, label: "Phone", value: "+91 XXX XXX XXXX" },
    { icon: Mail, label: "Email", value: "info@nri.edu.in" },
    { icon: Clock, label: "Office Hours", value: "Mon - Sat: 9 AM - 5 PM" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Page Hero Header */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative py-24 bg-gradient-hero text-white overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, hsl(217 91% 60% / 0.15) 1px, transparent 1px),
                               linear-gradient(to bottom, hsl(189 94% 43% / 0.15) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          <div className="absolute top-20 left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent"
            >
              Get In Touch
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-center text-white/80 max-w-3xl mx-auto mb-16"
            >
              We're here to help. Reach out to us for admissions, queries, or support
            </motion.p>
            
            {/* Quick Contact Info */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {quickInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300"
                >
                  <info.icon className="w-8 h-8 text-secondary mb-3" />
                  <div className="text-sm text-white/60 mb-1">{info.label}</div>
                  <div className="text-sm font-semibold">{info.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
