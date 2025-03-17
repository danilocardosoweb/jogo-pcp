import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { GamePhase } from '@/types/game';
import WelcomeScreen from './WelcomeScreen';
import CharacterSelection from './CharacterSelection';
import JobInterview from './JobInterview';
import Dashboard from './Dashboard';
import GameHelp from './GameHelp';
import { useInterview } from '@/context/InterviewContext';

const GameStarter: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WELCOME);
  const [helpOpen, setHelpOpen] = useState(false);
  const { state: interviewState } = useInterview();
  const { state: gameState } = useGame();
  
  useEffect(() => {
    if (gamePhase === GamePhase.INTERVIEW && interviewState.isPassed) {
      setGamePhase(GamePhase.FACTORY);
    }
  }, [interviewState.isPassed, gamePhase]);
  
  const handleStartGame = () => {
    setGamePhase(GamePhase.CHARACTER_SELECTION);
  };
  
  const handleCharacterSelect = () => {
    setGamePhase(GamePhase.INTERVIEW);
  };
  
  if (gamePhase === GamePhase.WELCOME) {
    return <WelcomeScreen onStart={handleStartGame} />;
  }
  
  if (gamePhase === GamePhase.CHARACTER_SELECTION) {
    return <CharacterSelection onSelect={handleCharacterSelect} />;
  }
  
  if (gamePhase === GamePhase.INTERVIEW) {
    return <JobInterview />;
  }
  
  // Factory Simulation
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setHelpOpen(true)}
          className="pixel-text text-game-primary hover:text-game-secondary underline text-sm"
        >
          Precisa de ajuda?
        </button>
      </div>
      
      <Dashboard />
      
      {helpOpen && <GameHelp currentPhase={gamePhase} onClose={() => setHelpOpen(false)} />}
    </div>
  );
};

export default GameStarter;
