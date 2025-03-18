import React, { useState } from 'react';
import { useInterview } from '@/context/InterviewContext';
import { PixelButton } from './ui/PixelButton';
import { PixelCard } from './ui/PixelCard';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { User, UserCircle2 } from 'lucide-react';
import ClockInAnimation from './ClockInAnimation';

const JobInterview: React.FC = () => {
  const { state, dispatch } = useInterview();
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const handleSelectOption = (optionId: number) => {
    setSelectedOption(optionId);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      toast.error("Por favor, selecione uma resposta");
      return;
    }
    
    dispatch({ type: 'ANSWER_QUESTION', optionId: selectedOption });
    
    const isLastQuestion = state.currentQuestionIndex === state.totalQuestions - 1;
    
    if (!isLastQuestion) {
      dispatch({ type: 'NEXT_QUESTION' });
      setSelectedOption(null);
    }
  };
  
  const currentQuestion = state.questions[state.currentQuestionIndex];
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl pixel-font text-game-primary mb-2">
          Entrevista de Emprego: Analista de PCP
        </h2>
        <p className="pixel-text text-game-secondary">
          Responda corretamente as perguntas para conseguir a vaga
        </p>
      </div>
      
      {!state.isCompleted ? (
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-8 mb-6 items-start">
            {/* Recrutador */}
            <div className="flex-shrink-0">
              <PixelCard variant="outline" className="p-4 text-center">
                <div className="relative w-24 h-24 mb-2 mx-auto overflow-hidden rounded-full">
                  <img
                    src="/characters/Recrutador.png"
                    alt="Recrutador"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="pixel-text text-game-primary font-bold">Recrutador</p>
                <p className="pixel-text text-xs text-game-secondary">Departamento de RH</p>
              </PixelCard>
            </div>
            
            {/* Candidato (Jogador) */}
            <div className="flex-shrink-0">
              <PixelCard variant="outline" className="p-4 text-center">
                <div className="relative w-24 h-24 mb-2 mx-auto overflow-hidden rounded-full bg-game-secondary">
                  {gameState.character ? (
                    <img
                      src={gameState.character.image}
                      alt={gameState.character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-white" />
                  )}
                </div>
                <p className="pixel-text text-game-primary font-bold">
                  {gameState.character?.name || 'Você'}
                </p>
                <p className="pixel-text text-xs text-game-secondary">Candidato</p>
              </PixelCard>
            </div>
            
            {/* Pergunta */}
            <PixelCard className="flex-grow">
              <div className="flex justify-between mb-4">
                <span className="pixel-text text-game-secondary">
                  Pergunta {state.currentQuestionIndex + 1} de {state.totalQuestions}
                </span>
                <span className="pixel-text text-game-primary">
                  Pontuação: {state.score}/50
                </span>
              </div>
              
              <h3 className="text-xl pixel-font text-game-accent mb-4">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 cursor-pointer border-2 rounded-sm hover:bg-game-secondary/10 transition-colors ${
                      selectedOption === option.id
                        ? 'border-game-primary bg-game-primary/10'
                        : 'border-game-secondary'
                    }`}
                    onClick={() => handleSelectOption(option.id)}
                  >
                    <p className="pixel-text">{option.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <PixelButton 
                  variant="primary" 
                  onClick={handleSubmitAnswer}
                >
                  {state.currentQuestionIndex === state.totalQuestions - 1 
                    ? "Finalizar Entrevista" 
                    : "Próxima Pergunta"}
                </PixelButton>
              </div>
            </PixelCard>
          </div>
          
          <div className="px-4 py-3 bg-game-bg border-2 border-game-secondary rounded-sm">
            <p className="pixel-text text-sm text-game-secondary italic">
              Dica: Responda com base em seus conhecimentos de Planejamento e Controle da Produção (PCP).
            </p>
          </div>
        </div>
      ) : (
        <InterviewResults />
      )}
      
      {/* Componente de animação de bater ponto */}
      <ClockInAnimation />
    </div>
  );
};

// Componente para exibir os resultados da entrevista
const InterviewResults: React.FC = () => {
  const { state, dispatch } = useInterview();
  const { dispatch: gameDispatch } = useGame();
  
  const handleReset = () => {
    dispatch({ type: 'RESET_INTERVIEW' });
  };
  
  const handleStartWork = () => {
    // Disparar a ação de bater o ponto em vez de iniciar a simulação diretamente
    dispatch({ type: 'CLOCK_IN' });
    
    // A simulação será iniciada pelo componente ClockInAnimation após a animação
    toast('Parabéns pela contratação! Vamos registrar seu ponto.', {
      duration: 5000,
      className: 'pixel-text bg-game-bg border-2 border-game-primary text-white',
    });
  };
  
  return (
    <PixelCard className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-20 h-20 overflow-hidden rounded-full">
          <img
            src="/characters/Recrutador.png"
            alt="Recrutador"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <h3 className="text-xl pixel-font text-game-primary mb-4">
        {state.isPassed ? "Você foi aprovado!" : "Você não foi aprovado"}
      </h3>
      
      <div className="mb-6">
        <p className="text-2xl pixel-font text-game-primary">
          {state.score} / 50
        </p>
        <p className="pixel-text text-game-secondary mt-4">
          {state.isPassed 
            ? "Você demonstrou conhecimento suficiente para começar a trabalhar como Analista de PCP." 
            : "Você precisa aprimorar seus conhecimentos em Planejamento e Controle da Produção."}
        </p>
      </div>
      
      {state.isPassed && (
        <div className="mt-8">
          <PixelButton
            variant="primary"
            size="lg"
            onClick={handleStartWork}
          >
            Começar a Trabalhar
          </PixelButton>
        </div>
      )}
      
      {!state.isPassed && (
        <div className="mt-8">
          <PixelButton
            variant="secondary"
            size="lg"
            onClick={handleReset}
          >
            Tentar Novamente
          </PixelButton>
        </div>
      )}
    </PixelCard>
  );
};

export default JobInterview;
