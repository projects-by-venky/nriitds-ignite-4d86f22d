import { motion } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UploadButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex justify-center mb-12"
    >
      <Link to="/research/upload">
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_hsl(217_91%_60%_/_0.4)] transition-all duration-300 group"
        >
          <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Upload Research / Project
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
};

export default UploadButton;
