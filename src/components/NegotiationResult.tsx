import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface NegotiationResultProps {
  isOpen: boolean;
  isAccepted: boolean;
  onClose: () => void;
}

const NegotiationResult: React.FC<NegotiationResultProps> = ({
  isOpen,
  isAccepted,
  onClose
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: [0, isAccepted ? 360 : -10, isAccepted ? 360 : 10, isAccepted ? 360 : -10, 0]
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ 
            duration: 0.5,
            rotate: { duration: 0.5, ease: "easeInOut" }
          }}
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}
        >
          <motion.div
            className={`p-8 rounded-lg shadow-xl ${
              isAccepted 
                ? 'bg-green-100 border-4 border-green-500' 
                : 'bg-red-100 border-4 border-red-500'
            } pixel-text flex flex-col items-center gap-4`}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {isAccepted ? (
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600" />
              )}
            </motion.div>
            <motion.p
              className={`text-xl font-bold ${
                isAccepted ? 'text-green-700' : 'text-red-700'
              }`}
              animate={{
                opacity: [0, 1],
                y: [20, 0]
              }}
              transition={{ delay: 0.2 }}
            >
              {isAccepted
                ? 'Proposta Aceita!'
                : 'Proposta Recusada'}
            </motion.p>
            <motion.p
              className="text-sm"
              animate={{
                opacity: [0, 1],
                y: [20, 0]
              }}
              transition={{ delay: 0.4 }}
            >
              {isAccepted
                ? 'O produto será entregue em breve'
                : 'Tente outros valores'}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NegotiationResult;
