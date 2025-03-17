
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useGame } from '@/context/GameContext';
import { PixelButton } from './ui/PixelButton';
import { Settings } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { state, dispatch } = useGame();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-game-bg border-2 border-game-secondary max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl pixel-font text-game-primary">
            <Settings className="h-5 w-5" />
            Configurações
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <h3 className="pixel-text font-bold">Velocidade do Jogo</h3>
            <div className="flex gap-2">
              <PixelButton 
                variant="secondary" 
                size="sm"
                className="flex-1"
              >
                Lento
              </PixelButton>
              <PixelButton 
                variant="primary" 
                size="sm"
                className="flex-1"
              >
                Normal
              </PixelButton>
              <PixelButton 
                variant="secondary" 
                size="sm"
                className="flex-1"
              >
                Rápido
              </PixelButton>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="pixel-text font-bold">Som</h3>
            <div className="flex gap-2">
              <PixelButton 
                variant="primary" 
                size="sm"
                className="flex-1"
              >
                Ligado
              </PixelButton>
              <PixelButton 
                variant="secondary" 
                size="sm"
                className="flex-1"
              >
                Desligado
              </PixelButton>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="pixel-text font-bold">Dificuldade</h3>
            <div className="flex gap-2">
              <PixelButton 
                variant="secondary" 
                size="sm"
                className="flex-1"
              >
                Fácil
              </PixelButton>
              <PixelButton 
                variant="primary" 
                size="sm"
                className="flex-1"
              >
                Normal
              </PixelButton>
              <PixelButton 
                variant="secondary" 
                size="sm"
                className="flex-1"
              >
                Difícil
              </PixelButton>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <PixelButton 
            variant="danger" 
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </PixelButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
