
import React from 'react';
import { X } from 'lucide-react';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { GamePhase } from '@/types/game';

interface GameHelpProps {
  currentPhase: GamePhase;
  onClose: () => void;
}

const GameHelp: React.FC<GameHelpProps> = ({ currentPhase, onClose }) => {
  const getHelpContent = () => {
    switch (currentPhase) {
      case GamePhase.WELCOME:
        return (
          <div className="space-y-4">
            <h3 className="text-xl pixel-font text-game-accent">Bem-vindo ao Simulador PCP</h3>
            <p className="pixel-text">
              Neste jogo, você irá simular o trabalho de um Analista de PCP (Planejamento e Controle da Produção) em uma fábrica de eletrônicos.
            </p>
            <p className="pixel-text">
              Para começar, clique no botão "Iniciar" na tela inicial. Você passará pelas seguintes etapas:
            </p>
            <ol className="list-decimal list-inside space-y-2 pixel-text">
              <li>Seleção de personagem - Escolha seu avatar para o jogo</li>
              <li>Entrevista de emprego - Responda perguntas técnicas</li>
              <li>Gestão da fábrica - Se for aprovado na entrevista</li>
            </ol>
          </div>
        );
      
      case GamePhase.CHARACTER_SELECTION:
        return (
          <div className="space-y-4">
            <h3 className="text-xl pixel-font text-game-accent">Seleção de Personagem</h3>
            <p className="pixel-text">
              Escolha entre um personagem masculino ou feminino para representá-lo no jogo.
            </p>
            <p className="pixel-text">
              Esta escolha é apenas visual e não afeta a jogabilidade ou dificuldade do jogo.
            </p>
            <p className="pixel-text">
              Clique em um dos personagens para selecioná-lo e depois clique em "Confirmar" para prosseguir.
            </p>
          </div>
        );
      
      case GamePhase.INTERVIEW:
        return (
          <div className="space-y-4">
            <h3 className="text-xl pixel-font text-game-accent">Entrevista de Emprego</h3>
            <p className="pixel-text">
              Você está participando de uma entrevista para a vaga de Analista de PCP.
            </p>
            <p className="pixel-text">
              Responda às perguntas técnicas selecionando a opção que considerar correta. Você precisa obter pelo menos 30 pontos de um total de 50 para ser aprovado.
            </p>
            <p className="pixel-text">
              Cada resposta correta vale 10 pontos. Não se preocupe se errar, você poderá tentar novamente caso não atinja a pontuação mínima.
            </p>
            <p className="pixel-text font-bold">
              Dica: As perguntas são relacionadas aos conceitos básicos de Planejamento e Controle da Produção.
            </p>
          </div>
        );
      
      case GamePhase.FACTORY:
        return (
          <div className="space-y-4">
            <h3 className="text-xl pixel-font text-game-accent">Gestão da Fábrica</h3>
            <p className="pixel-text">
              Parabéns por ter sido contratado! Agora você é responsável pelo Planejamento e Controle da Produção da fábrica.
            </p>
            <p className="pixel-text">
              Sua função inclui:
            </p>
            <ul className="list-disc list-inside space-y-2 pixel-text">
              <li>Gerenciar recursos (matéria-prima, componentes)</li>
              <li>Planejar a produção para atender pedidos</li>
              <li>Controlar as máquinas e equipamentos</li>
              <li>Cumprir prazos de entrega</li>
              <li>Otimizar a produção para maximizar os lucros</li>
            </ul>
            <p className="pixel-text mt-4">
              Use o painel na parte superior para monitorar recursos, dinheiro e pedidos pendentes. A área principal mostra o chão de fábrica com as máquinas disponíveis.
            </p>
            <p className="pixel-text font-bold">
              Dica: Equilibre a compra de novas máquinas com o atendimento de pedidos para otimizar seus recursos.
            </p>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-xl pixel-font text-game-accent">Ajuda Geral</h3>
            <p className="pixel-text">
              Este é um simulador de Planejamento e Controle da Produção (PCP). Seu objetivo é gerenciar eficientemente uma fábrica, atendendo aos pedidos dos clientes dentro dos prazos estabelecidos.
            </p>
            <p className="pixel-text">
              Use o botão de ajuda a qualquer momento para obter informações específicas sobre a fase atual do jogo.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <PixelCard className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl pixel-font text-game-primary">Manual do Jogo</h2>
          <button 
            onClick={onClose}
            className="text-game-secondary hover:text-game-primary transition-colors"
            aria-label="Fechar manual"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="border-b-2 border-game-secondary mb-4" />
        
        {getHelpContent()}
        
        <div className="mt-6 border-t-2 border-game-secondary pt-4 flex justify-end">
          <PixelButton variant="secondary" onClick={onClose}>
            Fechar
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default GameHelp;
