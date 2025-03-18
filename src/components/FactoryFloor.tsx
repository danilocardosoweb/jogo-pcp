import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { Building, Plus, Trash, RefreshCw, PackageCheck, AlertTriangle, ShieldCheck, Zap, Clock, Wrench, Users } from 'lucide-react';
import BuyMachineModal from './BuyMachineModal';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/utils';

const FactoryFloor: React.FC = () => {
  const { state, dispatch } = useGame();
  const [buyMachineOpen, setBuyMachineOpen] = useState(false);
  
  const handleAssignMachine = (machineId: string, productType: any) => {
    dispatch({ type: 'ASSIGN_MACHINE', machineId, productType });
  };
  
  const handleUnassignMachine = (machineId: string) => {
    dispatch({ type: 'UNASSIGN_MACHINE', machineId });
  };
  
  const handleUpgradeMachine = (machineId: string) => {
    dispatch({ type: 'UPGRADE_MACHINE', machineId });
  };
  
  const handleRepairMachine = (machineId: string) => {
    dispatch({ type: 'REPAIR_MACHINE', machineId });
  };

  const handleFixDefect = (machineId: string) => {
    dispatch({ type: 'FIX_DEFECT', machineId });
    toast.success('Retrabalho aplicado ao produto');
  };

  const handleDiscardDefect = (machineId: string) => {
    dispatch({ type: 'DISCARD_DEFECT', machineId });
    toast.success('Produto descartado');
  };
  
  const handleApplyBooster = (machineId: string) => {
    dispatch({ type: 'APPLY_BOOSTER', machineId, duration: 5 });
    toast.success('Booster de manutenção aplicado por 5 dias!');
  };
  
  // Count products by status
  const productionStats = {
    manufacturing: state.machines.filter(m => m.status === 'working' && !m.hasDefect && m.type === 'assembly').length,
    packaging: state.machines.filter(m => m.status === 'working' && !m.hasDefect && m.type === 'packaging').length,
    qualityControl: state.machines.filter(m => m.status === 'working' && !m.hasDefect && m.type === 'quality').length,
    defects: state.machines.filter(m => m.hasDefect).length
  };
  
  return (
    <div className="mb-6 sm:mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl pixel-font text-game-primary mb-2 sm:mb-0">Chão de Fábrica</h2>
        <PixelButton 
          variant="secondary" 
          size="sm"
          onClick={() => setBuyMachineOpen(true)}
          icon={<Building className="h-3 w-3 sm:h-4 sm:w-4" />}
          className="w-full sm:w-auto"
        >
          Comprar Máquina
        </PixelButton>
      </div>

      {/* Production status overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
        <div className="bg-amber-100 p-2 sm:p-3 rounded-md flex items-center justify-between border border-amber-300">
          <div className="flex items-center gap-1 sm:gap-2">
            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            <span className="pixel-text text-xs sm:text-sm font-bold text-amber-800">Fabricando</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-amber-900">{productionStats.manufacturing}</span>
        </div>
        
        <div className="bg-blue-100 p-2 sm:p-3 rounded-md flex items-center justify-between border border-blue-300">
          <div className="flex items-center gap-1 sm:gap-2">
            <PackageCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="pixel-text text-xs sm:text-sm font-bold text-blue-800">Embalando</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-blue-900">{productionStats.packaging}</span>
        </div>
        
        <div className="bg-green-100 p-2 sm:p-3 rounded-md flex items-center justify-between border border-green-300">
          <div className="flex items-center gap-1 sm:gap-2">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="pixel-text text-xs sm:text-sm font-bold text-green-800">Qualidade</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-green-900">{productionStats.qualityControl}</span>
        </div>
        
        <div className="bg-red-100 p-2 sm:p-3 rounded-md flex items-center justify-between border border-red-300">
          <div className="flex items-center gap-1 sm:gap-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <span className="pixel-text text-xs sm:text-sm font-bold text-red-800">Defeitos</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-red-900">{productionStats.defects}</span>
        </div>
      </div>
      
      {/* Maintenance Booster Guide */}
      <div className="bg-blue-100 p-2 sm:p-3 rounded-md mb-4 border-2 border-blue-300">
        <div className="flex items-start gap-2">
          <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="pixel-text text-sm sm:text-base font-bold text-blue-800">Sistema de Manutenção</h3>
            <p className="pixel-text text-xs text-blue-700">
              Aplique boosters de manutenção nas máquinas para aumentar temporariamente a velocidade de produção em 3x por 5 dias.
              O custo varia de acordo com o nível da máquina.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid-pattern relative p-2 sm:p-4 rounded-md min-h-[300px] border-2 border-game-secondary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {state.machines.map(machine => (
            <PixelCard 
              key={machine.id}
              className={`machine ${machine.status === 'working' ? 'working' : ''} ${machine.hasDefect ? 'border-[#ea384c]' : ''} ${machine.boosterActive ? 'border-[#3b82f6]' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="pixel-text text-sm sm:text-base font-bold flex items-center gap-1">
                  <span>{machine.icon}</span> {machine.name}
                  {machine.boosterActive && <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />}
                </h3>
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm text-[10px] sm:text-xs pixel-text ${
                  machine.hasDefect ? 'bg-[#ea384c] text-white' :
                  machine.status === 'working' ? 'bg-game-success text-white' :
                  machine.status === 'maintenance' ? 'bg-game-warning text-white' :
                  'bg-game-secondary text-white'
                }`}>
                  {machine.hasDefect ? 'DEFEITO' :
                   machine.status === 'working' ? 'TRABALHANDO' : 
                   machine.status === 'maintenance' ? 'MANUTENÇÃO' : 
                   'INATIVO'}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                  <span className="pixel-text">Eficiência: {(machine.efficiency * 100).toFixed(0)}%</span>
                  <span className="pixel-text">Nível: {machine.level}</span>
                </div>
                
                {/* Worker assignment section */}
                <div className="flex items-center gap-1 text-[10px] sm:text-xs mb-1">
                  <Users className="h-3 w-3 text-blue-600" />
                  <span className="pixel-text">
                    {machine.assignedWorkers.length > 0 
                      ? `${machine.assignedWorkers.length} funcionário(s) designado(s)` 
                      : 'Sem funcionários designados'}
                  </span>
                </div>

                {machine.assignedWorkers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {machine.assignedWorkers.slice(0, 2).map(worker => (
                      <span key={worker.id} className="inline-flex items-center bg-blue-100 text-blue-800 text-[10px] sm:text-xs rounded px-1 sm:px-1.5 py-0.5">
                        {worker.icon} {worker.name.split(' ')[0]}
                      </span>
                    ))}
                    {machine.assignedWorkers.length > 2 && (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 text-[10px] sm:text-xs rounded px-1 sm:px-1.5 py-0.5">
                        +{machine.assignedWorkers.length - 2}
                      </span>
                    )}
                  </div>
                )}
                
                {machine.boosterActive && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 mb-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="pixel-text">Booster ativo! ({machine.boosterEndDay! - state.day} dias restantes)</span>
                  </div>
                )}
                
                {(machine.status === 'working' || machine.hasDefect) && machine.currentProduct && (
                  <div className="mb-2">
                    <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                      <span className="pixel-text">
                        {machine.hasDefect ? 'Produto com defeito:' : 'Produzindo:'} {state.products.find(p => p.type === machine.currentProduct)?.name}
                      </span>
                      <span className="pixel-text">
                        {Math.floor((machine.progress / machine.maxProgress) * 100)}%
                      </span>
                    </div>
                    
                    {/* Display production stage */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs mb-1">
                      <span className={`inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs ${
                        machine.type === 'assembly' ? 'bg-amber-100 text-amber-800' :
                        machine.type === 'packaging' ? 'bg-blue-100 text-blue-800' :
                        machine.type === 'quality' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {machine.type === 'assembly' ? '🔧 Montagem' :
                         machine.type === 'packaging' ? '📦 Embalagem' :
                         machine.type === 'quality' ? '✓ Qualidade' :
                         'Indefinido'}
                      </span>
                    </div>
                    
                    <Progress 
                      value={(machine.progress / machine.maxProgress) * 100} 
                      className="h-1.5 sm:h-2"
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {machine.hasDefect ? (
                    <>
                      <PixelButton
                        variant="warning"
                        size="sm"
                        onClick={() => handleFixDefect(machine.id)}
                        className="text-[10px] sm:text-xs py-0.5 flex-1"
                      >
                        Retrabalhar
                      </PixelButton>
                      <PixelButton
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDiscardDefect(machine.id)}
                        className="text-[10px] sm:text-xs py-0.5 flex-1"
                      >
                        Descartar
                      </PixelButton>
                    </>
                  ) : (
                    <>
                      <PixelButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRepairMachine(machine.id)}
                        disabled={machine.status === 'maintenance'}
                        className="text-[10px] sm:text-xs py-0.5 flex-1"
                      >
                        Manutenção
                      </PixelButton>
                      <PixelButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpgradeMachine(machine.id)}
                        disabled={machine.status === 'maintenance'}
                        className="text-[10px] sm:text-xs py-0.5 flex-1"
                      >
                        Upgrade
                      </PixelButton>
                      <PixelButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleApplyBooster(machine.id)}
                        disabled={machine.boosterActive || machine.status === 'maintenance'}
                        className="text-[10px] sm:text-xs py-0.5 flex-1"
                      >
                        Booster
                      </PixelButton>
                    </>
                  )}
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
      
      <BuyMachineModal open={buyMachineOpen} onOpenChange={setBuyMachineOpen} />
    </div>
  );
};

export default FactoryFloor;
