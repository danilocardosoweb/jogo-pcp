import React, { useState } from 'react';
import { PixelButton } from './ui/PixelButton';
import { PixelCard } from './ui/PixelCard';
import { CheckCircle } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Input } from './ui/input';
import { PlayerCharacterType } from '@/types/game';

interface CharacterSelectionProps {
  onSelect: () => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<PlayerCharacterType | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useGame();

  const handleSelect = (character: PlayerCharacterType) => {
    setSelectedCharacter(character);
    setError('');
  };

  const handleConfirm = () => {
    if (!selectedCharacter) {
      setError('Por favor, selecione um personagem');
      return;
    }

    if (!playerName.trim()) {
      setError('Por favor, digite seu nome');
      return;
    }

    dispatch({ 
      type: 'SET_CHARACTER',
      character: {
        type: selectedCharacter,
        name: playerName,
        image: selectedCharacter === 'male' ? '/characters/Masculino.png' : '/characters/Feminino.png'
      }
    });
    onSelect();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <PixelCard className="max-w-2xl mx-auto p-6 text-center space-y-6 animate-fade-in">
        <h1 className="text-3xl pixel-font text-game-primary">
          Escolha seu Personagem
        </h1>
        
        <div className="mb-6">
          <label className="block pixel-text text-game-accent text-left mb-2">Nome do Jogador</label>
          <Input
            type="text"
            placeholder="Digite seu nome"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            className="w-full bg-gray-800 text-white placeholder:text-gray-400"
          />
        </div>
        
        <p className="text-xl pixel-text text-game-accent mb-4">
          Selecione o personagem que representará você no jogo:
        </p>
        
        <div className="flex justify-center gap-8 my-8">
          <div 
            className={`p-6 cursor-pointer border-4 rounded-sm transition-all ${
              selectedCharacter === 'male' 
                ? 'border-game-primary bg-game-primary/10' 
                : 'border-game-secondary hover:border-game-primary'
            }`}
            onClick={() => handleSelect('male')}
          >
            <div className="relative">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-48 w-48 bg-game-secondary/30 rounded-lg overflow-hidden">
                  <img
                    src="/characters/Masculino.png"
                    alt="Personagem Masculino"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="pixel-text text-lg">Masculino</p>
              </div>
              {selectedCharacter === 'male' && (
                <CheckCircle className="absolute top-0 right-0 text-green-500" size={24} />
              )}
            </div>
          </div>
          
          <div 
            className={`p-6 cursor-pointer border-4 rounded-sm transition-all ${
              selectedCharacter === 'female' 
                ? 'border-game-primary bg-game-primary/10' 
                : 'border-game-secondary hover:border-game-primary'
            }`}
            onClick={() => handleSelect('female')}
          >
            <div className="relative">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-48 w-48 bg-game-secondary/30 rounded-lg overflow-hidden">
                  <img
                    src="/characters/Feminino.png"
                    alt="Personagem Feminino"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="pixel-text text-lg">Feminino</p>
              </div>
              {selectedCharacter === 'female' && (
                <CheckCircle className="absolute top-0 right-0 text-green-500" size={24} />
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-400 pixel-text">{error}</p>
        )}
        
        <div className="pt-4">
          <PixelButton 
            variant="primary" 
            size="lg" 
            onClick={handleConfirm}
            disabled={!selectedCharacter || !playerName.trim()}
          >
            Confirmar
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default CharacterSelection;
