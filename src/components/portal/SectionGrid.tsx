import { PortalButton } from "./PortalButton";

interface GridItem {
  label: string;
  onClick?: () => void;
  href?: string;
  to?: string;
  variant?: "primary" | "secondary";
  download?: boolean;
}

interface SectionGridProps {
  items: GridItem[];
  columns?: 2 | 3 | 4;
}

export const SectionGrid = ({ items, columns = 3 }: SectionGridProps) => {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-2`}>
      {items.map((item, idx) => (
        <PortalButton 
          key={idx} 
          label={item.label} 
          onClick={item.onClick}
          href={item.href}
          to={item.to}
          variant={item.variant || "secondary"}
          download={item.download}
        />
      ))}
    </div>
  );
};
