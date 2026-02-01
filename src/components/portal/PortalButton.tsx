import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PortalButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  to?: string;
  variant?: "primary" | "secondary";
  download?: boolean;
  className?: string;
}

export const PortalButton = ({ 
  label, 
  onClick, 
  href,
  to,
  variant = "secondary", 
  download = false,
  className
}: PortalButtonProps) => {
  const baseClasses = cn(
    "w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors",
    "flex items-center justify-center text-center",
    variant === "primary" 
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "bg-muted/50 border border-border text-foreground hover:bg-muted hover:border-primary/30",
    className
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {label}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        target={download ? undefined : "_blank"} 
        rel={download ? undefined : "noopener noreferrer"} 
        download={download}
        className={baseClasses}
      >
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {label}
    </button>
  );
};
