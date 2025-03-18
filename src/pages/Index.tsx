import React from 'react';
import GameHeader from '@/components/GameHeader';
import GameStarter from '@/components/GameStarter';
import { GameProvider } from '@/context/GameContext';
import { InterviewProvider } from '@/context/InterviewContext';
import { Toaster } from 'sonner';
import ClockInAnimation from '@/components/ClockInAnimation';

const Index = () => {
  return (
    <GameProvider>
      <InterviewProvider>
        <div className="min-h-screen flex flex-col bg-game-bg overflow-hidden">
          {/* O GameHeader já verifica internamente se o jogador passou na entrevista */}
          <GameHeader />
          
          <main className="flex-1 px-4 py-6 overflow-y-auto scrollbar-pixel">
            <GameStarter />
            
            <footer className="text-center mt-8 py-4 border-t border-game-secondary">
              <p className="pixel-text text-xs text-game-secondary">
                Simulador PCP v1.0 - Jogo de Planejamento e Controle da Produção
              </p>
            </footer>
          </main>
          
          {/* Componente de animação de bater ponto */}
          <ClockInAnimation />
          
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: "pixel-text bg-game-bg border-2 border-game-secondary text-white",
              duration: 3000
            }} 
          />
        </div>
      </InterviewProvider>
    </GameProvider>
  );
};

export default Index;
