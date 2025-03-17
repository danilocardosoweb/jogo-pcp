import React, { useState } from 'react';
import { PixelButton } from './ui/PixelButton';
import { PixelCard } from './ui/PixelCard';
import { X } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [cardVisible, setCardVisible] = useState(true);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Capa.png"
          alt="Background"
          className="w-full h-full object-fill"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12">
        {cardVisible ? (
          <PixelCard className="relative max-w-2xl mx-auto p-6 text-center space-y-6 animate-fade-in bg-black/80">
            <button
              onClick={() => setCardVisible(false)}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-game-secondary/20 transition-colors"
            >
              <X className="w-6 h-6 text-game-primary" />
            </button>

            <h1 className="text-4xl pixel-font text-game-primary">
              Simulador PCP
            </h1>
            
            <p className="text-xl pixel-text text-game-accent mb-4">
              Bem-vindo ao Simulador de Planejamento e Controle da Produção!
            </p>
            
            <div className="space-y-4 text-left">
              <p className="pixel-text">
                Você está se candidatando para uma vaga de <strong>Analista de PCP</strong> em uma fábrica de eletrônicos.
              </p>
              <p className="pixel-text">
                Para conseguir o emprego, você precisará passar por uma entrevista técnica, demonstrando seus conhecimentos em Planejamento e Controle da Produção.
              </p>
              <p className="pixel-text">
                Se for aprovado na entrevista, você terá a oportunidade de gerenciar a produção da fábrica, tomando decisões estratégicas para otimizar os recursos e atender aos pedidos dos clientes.
              </p>
            </div>
            
            <div className="pt-4">
              <PixelButton variant="primary" size="lg" onClick={onStart}>
                Iniciar Jogo
              </PixelButton>
            </div>
          </PixelCard>
        ) : (
          <button
            onClick={() => setCardVisible(true)}
            className="pixel-text text-white hover:text-game-primary transition-colors underline text-xl shadow-lg"
          >
            Mostrar Introdução
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
