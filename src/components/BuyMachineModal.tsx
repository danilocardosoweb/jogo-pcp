
import React, { useState } from 'react';
import { PixelButton } from './ui/PixelButton';
import { ShieldCheck, Building, PackageCheck } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { MachineType, Machine } from '@/context/GameContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface BuyMachineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BuyMachineModal: React.FC<BuyMachineModalProps> = ({ open, onOpenChange }) => {
  const { state, dispatch } = useGame();
  const [selectedType, setSelectedType] = useState<MachineType>('assembly');
  
  const handleBuyMachine = () => {
    const machineId = `m${Date.now()}`;
    const typeLabel = selectedType === 'assembly' ? 'Linha de Montagem' : 
                     selectedType === 'packaging' ? 'Unidade de Embalagem' : 
                     'Controle de Qualidade';
    
    const machineNumber = state.machines.filter(m => m.type === selectedType).length + 1;
    
    const icon = selectedType === 'assembly' ? '🔨' : 
                selectedType === 'packaging' ? '📦' : 
                '🔍';
    
    const newMachine: Machine = {
      id: machineId,
      type: selectedType,
      name: `${typeLabel} ${machineNumber}`,
      status: 'idle',
      efficiency: 1.0,
      level: 1,
      productionSpeed: 1,
      progress: 0,
      maxProgress: 100,
      icon,
      hasDefect: false,
      assignedWorkers: [],
    };
    
    dispatch({ type: 'BUY_MACHINE', machine: newMachine });
    
    toast.success(`Nova máquina adquirida: ${newMachine.name}`);
    onOpenChange(false);
  };
  
  const getMachinePrice = () => {
    switch (selectedType) {
      case 'assembly':
        return 3000;
      case 'packaging':
        return 2500;
      case 'quality':
        return 4000;
      default:
        return 3000;
    }
  };
  
  const price = getMachinePrice();
  const canAfford = state.money >= price;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-4 border-game-primary">
        <DialogHeader>
          <DialogTitle className="text-xl pixel-font text-game-primary">Comprar Nova Máquina</DialogTitle>
          <DialogDescription className="pixel-text">
            Escolha o tipo de máquina que deseja adicionar à sua fábrica.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div
              className={`p-4 rounded-md border-2 ${
                selectedType === 'assembly' ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
              } cursor-pointer`}
              onClick={() => setSelectedType('assembly')}
            >
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-amber-600" />
                <div>
                  <h3 className="font-bold pixel-text">Linha de Montagem</h3>
                  <p className="text-sm pixel-text">Para fabricação básica de produtos.</p>
                </div>
                <div className="ml-auto pixel-text font-bold text-amber-700">R$ 3.000</div>
              </div>
            </div>
            
            <div
              className={`p-4 rounded-md border-2 ${
                selectedType === 'packaging' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
              } cursor-pointer`}
              onClick={() => setSelectedType('packaging')}
            >
              <div className="flex items-center gap-3">
                <PackageCheck className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold pixel-text">Unidade de Embalagem</h3>
                  <p className="text-sm pixel-text">Para embalagem de produtos finalizados.</p>
                </div>
                <div className="ml-auto pixel-text font-bold text-blue-700">R$ 2.500</div>
              </div>
            </div>
            
            <div
              className={`p-4 rounded-md border-2 ${
                selectedType === 'quality' ? 'border-green-400 bg-green-50' : 'border-gray-200'
              } cursor-pointer`}
              onClick={() => setSelectedType('quality')}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold pixel-text">Controle de Qualidade</h3>
                  <p className="text-sm pixel-text">Reduz a chance de defeitos nos produtos.</p>
                </div>
                <div className="ml-auto pixel-text font-bold text-green-700">R$ 4.000</div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <PixelButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </PixelButton>
          <PixelButton 
            variant="primary" 
            onClick={handleBuyMachine}
            disabled={!canAfford}
          >
            {canAfford ? 'Comprar' : 'Fundos insuficientes'}
          </PixelButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyMachineModal;
