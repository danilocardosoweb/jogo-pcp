import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PlayerCharacterType } from '@/types/game';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { Input } from './ui/input';
import Image from 'next/image';

const CharacterSelect: React.FC = () => {
  const { dispatch } = useGame();
  const [selectedCharacter, setSelectedCharacter] = useState<PlayerCharacterType | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleCharacterSelect = (character: PlayerCharacterType) => {
    setSelectedCharacter(character);
    setError('');
  };

  const handleStartGame = () => {
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
        image: selectedCharacter === 'male' ? '/Image/Masculino.png' : '/Image/Feminino.png'
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <PixelCard variant="glass" className="w-full max-w-2xl bg-gray-800 p-8">
        <h1 className="text-3xl pixel-font text-blue-400 text-center mb-8">Selecione seu Personagem</h1>
        
        <div className="mb-6">
          <label className="block pixel-text text-blue-300 mb-2">Nome do Jogador</label>
          <Input
            type="text"
            placeholder="Digite seu nome"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-gray-700 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PixelCard
            variant="outline"
            className={`cursor-pointer transition-all ${
              selectedCharacter === 'male'
                ? 'bg-blue-900/50 border-blue-400'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
            onClick={() => handleCharacterSelect('male')}
          >
            <div className="flex flex-col items-center p-4">
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src="/Image/Masculino.png"
                  alt="Personagem Masculino"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="pixel-text text-xl text-blue-300">Masculino</h3>
            </div>
          </PixelCard>

          <PixelCard
            variant="outline"
            className={`cursor-pointer transition-all ${
              selectedCharacter === 'female'
                ? 'bg-blue-900/50 border-blue-400'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
            onClick={() => handleCharacterSelect('female')}
          >
            <div className="flex flex-col items-center p-4">
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src="/Image/Feminino.png"
                  alt="Personagem Feminino"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="pixel-text text-xl text-blue-300">Feminino</h3>
            </div>
          </PixelCard>
        </div>

        {error && (
          <p className="text-red-400 pixel-text text-center mb-4">{error}</p>
        )}

        <div className="flex justify-center">
          <PixelButton
            variant="success"
            size="lg"
            onClick={handleStartGame}
            className="w-full md:w-auto"
          >
            Iniciar Jogo
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default CharacterSelect;
