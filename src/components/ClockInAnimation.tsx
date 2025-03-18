import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useInterview } from '@/context/InterviewContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ClockInAnimation: React.FC = () => {
  const { dispatch } = useGame();
  const { state: interviewState } = useInterview();
  const [animationStep, setAnimationStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Mostrar a animação apenas quando o jogador passar na entrevista
    if (interviewState.isPassed && !interviewState.hasClockIn) {
      setShowAnimation(true);
      console.log("Mostrando animação de bater ponto");
      
      // Iniciar a sequência de animação
      const timer = setTimeout(() => {
        setAnimationStep(1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [interviewState.isPassed, interviewState.hasClockIn]);
  
  // Avançar para o próximo passo da animação
  const advanceAnimation = () => {
    setAnimationStep(prev => prev + 1);
    
    // Quando chegar ao passo 4, iniciar a simulação
    if (animationStep === 3) {
      setTimeout(() => {
        dispatch({ type: 'START_SIMULATION' });
        setShowAnimation(false);
      }, 1500);
    }
  };
  
  // Se não estiver mostrando a animação, não renderizar nada
  if (!showAnimation) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-game-bg border-4 border-game-primary p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl pixel-font text-game-accent mb-6 text-center">
          {animationStep === 0 && "Parabéns pela contratação!"}
          {animationStep === 1 && "Primeiro dia de trabalho"}
          {animationStep === 2 && "Hora de bater o ponto"}
          {animationStep === 3 && "Ponto registrado!"}
          {animationStep === 4 && "Iniciando o dia..."}
        </h2>
        
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Animação de bater o ponto */}
          {animationStep === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-64 h-64 bg-gray-800 flex items-center justify-center mb-4">
                <span className="text-white text-4xl">🏢</span>
              </div>
              <p className="pixel-text text-white mb-4">
                Você foi contratado como Analista de PCP! Agora é hora de começar seu primeiro dia.
              </p>
              <button 
                className="pixel-button bg-game-secondary hover:bg-game-accent text-white px-6 py-2 rounded-sm transition-colors"
                onClick={advanceAnimation}
              >
                Continuar
              </button>
            </motion.div>
          )}
          
          {animationStep === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-64 h-64 bg-gray-800 flex items-center justify-center mb-4">
                <span className="text-white text-4xl">🏭</span>
              </div>
              <p className="pixel-text text-white mb-4">
                Bem-vindo à fábrica! Antes de começar, você precisa registrar sua entrada.
              </p>
              <button 
                className="pixel-button bg-game-secondary hover:bg-game-accent text-white px-6 py-2 rounded-sm transition-colors"
                onClick={advanceAnimation}
              >
                Ir para o relógio de ponto
              </button>
            </motion.div>
          )}
          
          {animationStep === 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="relative w-64 h-64 bg-gray-800 flex items-center justify-center mb-4">
                <span className="text-white text-4xl">⏰</span>
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={advanceAnimation}
                >
                  <div className="bg-red-600 hover:bg-red-700 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">PONTO</span>
                  </div>
                </motion.div>
              </div>
              <p className="pixel-text text-white mb-4">
                Clique no botão para registrar sua entrada!
              </p>
            </motion.div>
          )}
          
          {animationStep === 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="relative w-64 h-64 bg-gray-800 flex items-center justify-center mb-4">
                <span className="text-white text-4xl">⏰</span>
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">08:00</span>
                  </div>
                </motion.div>
              </div>
              <motion.p 
                className="pixel-text text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Entrada registrada às 08:00! Seu dia de trabalho começou.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button 
                  className="pixel-button bg-game-accent hover:bg-game-primary text-white px-6 py-2 rounded-sm transition-colors"
                  onClick={advanceAnimation}
                >
                  Começar a trabalhar
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClockInAnimation;
