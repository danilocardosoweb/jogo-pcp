import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelButton } from './ui/PixelButton';
import { formatMoney } from '@/lib/utils';
import { Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';

const GameHeader: React.FC = () => {
  const { state, dispatch } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Automatically start simulation when component mounts
  useEffect(() => {
    if (!state.simulationStarted) {
      dispatch({ type: 'START_SIMULATION' });
    }
  }, []);
  
  return (
    <header className="w-full bg-game-bg border-b-2 border-game-secondary px-4 py-3 flex justify-between items-center animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl pixel-font text-game-accent">Simulador PCP</h1>
        <span className="bg-game-primary text-white px-2 py-1 rounded-sm text-xs pixel-text">v1.0</span>
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
              {state.simulationStarted ? `Dia ${state.day}` : 'Iniciando...'}
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
