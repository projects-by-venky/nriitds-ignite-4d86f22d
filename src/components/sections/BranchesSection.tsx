import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const branches = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    short: "CSE",
    icon: "💻",
    description: "Software & Technology"
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    short: "ECE",
    icon: "📡",
    description: "Communication Tech"
  },
  {
    id: "eee",
    name: "Electrical & Electronics",
    short: "EEE",
    icon: "⚡",
    description: "Power & Energy"
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    short: "MECH",
    icon: "⚙️",
    description: "Design & Manufacturing"
  },
  {
    id: "civil",
    name: "Civil Engineering",
    short: "CIVIL",
    icon: "🏗️",
    description: "Infrastructure & Construction"
  },
  {
    id: "aids",
    name: "AI & Data Science",
    short: "AI & DS",
    icon: "🤖",
    description: "Intelligent Systems"
  },
  {
    id: "mba",
    name: "Business Administration",
    short: "MBA",
    icon: "💼",
    description: "Management & Leadership"
  },
  {
    id: "mca",
    name: "Computer Applications",
    short: "MCA",
    icon: "🖥️",
    description: "Advanced Computing"
  }
];

const BranchesSection = () => {
  return (
    <section id="branches" className="py-32 bg-gradient-to-b from-background via-background/98 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Explore Our Departments
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Choose your department to access dedicated portals for students and faculty
          </p>
        </motion.div>

        {/* Branch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {branches.map((branch, index) => (
            <Link key={branch.id} to={`/department/${branch.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group cursor-pointer h-full"
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-primary"
                />
                
                {/* Card */}
                <div className="relative bg-card/50 backdrop-blur-sm border-2 border-border/50 group-hover:border-primary rounded-2xl p-6 transition-all duration-300 h-full flex flex-col overflow-hidden">
                  {/* Sliding border accent */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  
                  {/* Department name */}
                  <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {branch.short}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-4 flex-grow">
                    {branch.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="inline-flex items-center gap-2 text-sm font-semibold mt-auto text-primary">
                    Explore →
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesSection;
