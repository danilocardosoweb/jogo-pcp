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
          <div className="space-y-6">
            <h3 className="text-xl pixel-font text-blue-400">Bem-vindo ao Simulador PCP</h3>
            
            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Sobre o Jogo</h4>
              <p className="pixel-text text-white">
                Neste jogo, você irá simular o trabalho de um Analista de PCP (Planejamento e Controle da Produção) em uma fábrica de eletrônicos.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Como Começar</h4>
              <p className="pixel-text text-white">
                Para iniciar sua jornada, clique no botão "Iniciar" na tela inicial.
              </p>
              <div className="pl-4">
                <h5 className="pixel-font text-amber-400 mb-2">Etapas do Jogo:</h5>
                <ol className="list-decimal list-inside space-y-2 pixel-text text-white">
                  <li>Seleção de personagem - Escolha seu avatar para o jogo</li>
                  <li>Entrevista de emprego - Responda perguntas técnicas</li>
                  <li>Gestão da fábrica - Se for aprovado na entrevista</li>
                </ol>
              </div>
            </section>
          </div>
        );
      
      case GamePhase.CHARACTER_SELECTION:
        return (
          <div className="space-y-6">
            <h3 className="text-xl pixel-font text-blue-400">Seleção de Personagem</h3>
            
            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Como Selecionar</h4>
              <p className="pixel-text text-white">
                Escolha entre um personagem masculino ou feminino para representá-lo no jogo.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Importante Saber</h4>
              <ul className="list-disc list-inside space-y-2 pixel-text text-white">
                <li>A escolha é apenas visual</li>
                <li>Não afeta a jogabilidade</li>
                <li>Não altera a dificuldade do jogo</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Próximos Passos</h4>
              <p className="pixel-text text-white">
                1. Clique em um dos personagens para selecioná-lo
                2. Confirme sua escolha no botão "Confirmar"
              </p>
            </section>
          </div>
        );
      
      case GamePhase.INTERVIEW:
        return (
          <div className="space-y-6">
            <h3 className="text-xl pixel-font text-blue-400">Entrevista de Emprego</h3>
            
            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Objetivo</h4>
              <p className="pixel-text text-white">
                Você está participando de uma entrevista para a vaga de Analista de PCP.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Regras da Entrevista</h4>
              <ul className="list-disc list-inside space-y-2 pixel-text text-white">
                <li>Pontuação mínima: 30 pontos</li>
                <li>Pontuação máxima: 50 pontos</li>
                <li>Cada resposta correta: 10 pontos</li>
                <li>Pode tentar novamente em caso de reprovação</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="pixel-font text-amber-400">Dica Importante</h4>
              <p className="pixel-text text-white">
                As perguntas são baseadas em conceitos básicos de Planejamento e Controle da Produção.
              </p>
            </section>
          </div>
        );
      
      case GamePhase.FACTORY:
        return (
          <div className="space-y-6">
            <h3 className="text-xl pixel-font text-blue-400">Gestão da Fábrica</h3>
            
            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Departamentos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="pixel-font text-amber-400">Comercial</h5>
                  <ul className="list-disc list-inside pixel-text text-white">
                    <li>Visualização de pedidos</li>
                    <li>Aceitar/rejeitar pedidos</li>
                    <li>Análise de demanda</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="pixel-font text-amber-400">Planejamento</h5>
                  <ul className="list-disc list-inside pixel-text text-white">
                    <li>Controle de produção</li>
                    <li>Gestão de prazos</li>
                    <li>Eficiência produtiva</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="pixel-font text-amber-400">Recursos</h5>
                  <ul className="list-disc list-inside pixel-text text-white">
                    <li>Compra de materiais</li>
                    <li>Gestão de estoque</li>
                    <li>Controle de custos</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="pixel-font text-amber-400">Fábrica</h5>
                  <ul className="list-disc list-inside pixel-text text-white">
                    <li>Gestão de máquinas</li>
                    <li>Manutenção</li>
                    <li>Melhorias e upgrades</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="pixel-font text-amber-400">RH</h5>
                  <ul className="list-disc list-inside pixel-text text-white">
                    <li>Contratação</li>
                    <li>Treinamento</li>
                    <li>Motivação da equipe</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="pixel-font text-amber-400">Finanças</h5>
                  <ul className="list-disc list-inside pixel-text text-white">
                    <li>Controle financeiro</li>
                    <li>Empréstimos</li>
                    <li>Relatórios</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Dicas de Gestão</h4>
              <ul className="list-disc list-inside space-y-2 pixel-text text-white">
                <li>Mantenha um estoque mínimo de recursos</li>
                <li>Equilibre os pedidos com sua capacidade</li>
                <li>Invista em melhorias de máquinas</li>
                <li>Mantenha sua equipe motivada</li>
                <li>Monitore os prazos de entrega</li>
              </ul>
            </section>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <h3 className="text-xl pixel-font text-blue-400">Ajuda Geral</h3>
            
            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Sobre o Simulador</h4>
              <p className="pixel-text text-white">
                Este é um simulador de Planejamento e Controle da Produção (PCP). 
                Seu objetivo é gerenciar eficientemente uma fábrica, atendendo aos 
                pedidos dos clientes dentro dos prazos estabelecidos.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="pixel-font text-green-400">Ajuda Contextual</h4>
              <p className="pixel-text text-white">
                Use o botão de ajuda a qualquer momento para obter informações 
                específicas sobre a fase atual do jogo.
              </p>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <PixelCard className="max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-gray-900 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl pixel-font text-blue-400">Manual do Jogo</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar manual"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="border-b-2 border-gray-700 mb-4" />
        
        {getHelpContent()}
        
        <div className="mt-6 border-t-2 border-gray-700 pt-4 flex justify-end">
          <PixelButton variant="secondary" onClick={onClose}>
            Fechar
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default GameHelp;
