import { GraduationCap, MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const eResources = [
    "NPTEL Videos",
    "National Digital Library",
    "Taylor & Francis Online",
    "Swayam",
    "N-List",
    "J-GATE",
    "ASME",
    "DELNET",
    "IEEE Journals",
    "DOAJ",
    "Indian Academy of Science",
    "NISCAIR Journals",
    "DLINE Journal Portal",
    "SAGE Journals"
  ];

  const quickLinks = [
    "Webmail",
    "Exams Portal",
    "Faculty Login",
    "Student Login",
    "Alumni Login",
    "Contact Us"
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-card to-background text-foreground pt-20 pb-8 overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-5 blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-primary flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
              CONTACT DETAILS
            </h4>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 group hover:text-foreground transition-colors">
                <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p>Visadala, Guntur</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group hover:text-foreground transition-colors">
                <Mail className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:nriit.guntur@gmail.com" className="hover:text-primary transition-colors">
                    nriit.guntur@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 group hover:text-foreground transition-colors">
                <Phone className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a href="tel:08632344300" className="hover:text-primary transition-colors">
                    0863 234 4300
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* E-Resources */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-primary flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
              E-RESOURCES
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground max-h-80 overflow-y-auto custom-scrollbar">
              {eResources.map((resource, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all mr-0 group-hover:mr-2"></span>
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-primary flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
              QUICK LINKS
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground mb-8">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all mr-0 group-hover:mr-2"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <div>
              <h5 className="font-semibold text-sm mb-4 text-foreground uppercase tracking-wider">Social Media</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_0_20px_hsl(217_91%_60%_/_0.5)] group"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <p>© 2025 NRI Institute of Technology | All Rights Reserved</p>
            </div>
            <p className="flex items-center gap-1">
              Designed with <span className="text-red-500">❤️</span> by College Dev Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
