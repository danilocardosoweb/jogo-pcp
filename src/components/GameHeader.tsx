import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelButton } from './ui/PixelButton';
import { formatMoney } from '@/lib/utils';
import { Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { useInterview } from '@/context/InterviewContext';

const GameHeader: React.FC = () => {
  const { state, dispatch } = useGame();
  const { state: interviewState } = useInterview();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentHour, setCurrentHour] = useState(8); // Começa às 8h da manhã
  const lastDayRef = useRef(state.day);
  
  // Atualizar o contador de horas com base no dia atual do jogo
  useEffect(() => {
    if (state.simulationStarted && interviewState.isPassed) {
      // Verificar se o dia mudou
      if (state.day !== lastDayRef.current) {
        // Resetar para 8h quando um novo dia começa
        setCurrentHour(8);
        lastDayRef.current = state.day;
      } else {
        // Criar um intervalo para simular a passagem de horas durante o dia
        const hourInterval = setInterval(() => {
          setCurrentHour(prev => {
            // Avançar a hora, mas não passar das 16h (fim do expediente)
            const newHour = prev + 0.25;
            return newHour >= 16 ? 16 : newHour;
          });
        }, 3000); // Atualiza a cada 3 segundos para dar tempo de ver a mudança
        
        return () => clearInterval(hourInterval);
      }
    }
  }, [state.day, state.simulationStarted, interviewState.isPassed]);
  
  // Não renderizar o cabeçalho se o jogador não passou na entrevista
  if (!interviewState.isPassed) {
    return null;
  }
  
  // Formatar a hora para exibição (ex: 8:00, 8:15, 8:30, 8:45)
  const formatHour = (hour: number) => {
    const wholeHour = Math.floor(hour);
    const minutes = Math.round((hour - wholeHour) * 60);
    return `${wholeHour}:${minutes === 0 ? '00' : minutes}`;
  };
  
  return (
    <header className="w-full bg-game-bg border-b-2 border-game-secondary px-4 py-3 flex justify-between items-center animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl pixel-font text-game-accent">Simulador PCP</h1>
        <span className="bg-game-primary text-white px-2 py-1 rounded-sm text-xs pixel-text">v1.005 - 19/03/2025</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="resource-indicator">
            <span className="indicator-icon">💰</span>
            <span className="pixel-text font-bold text-white">{formatMoney(state.money)}</span>
          </div>
          
          <div className="resource-indicator">
            <span className="indicator-icon">📅</span>
            <span className="pixel-text font-bold text-white">
              {`Dia ${Math.floor(state.day)}`}
            </span>
          </div>
          
          <div className="resource-indicator">
            <span className="indicator-icon">⏰</span>
            <span className="pixel-text font-bold text-white">
              {formatHour(currentHour)}
            </span>
          </div>
        </div>
        
        <PixelButton 
          variant="primary" 
          size="sm"
          onClick={() => setSettingsOpen(true)}
          icon={<Settings className="h-4 w-4" />}
        >
          Configurações
        </PixelButton>
      </div>
      
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};

export default GameHeader;
