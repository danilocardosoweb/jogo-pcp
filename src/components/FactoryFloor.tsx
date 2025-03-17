
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
    manufacturing: state.machines.filter(m => m.status === 'working' && !m.hasDefect).length,
    packaging: state.machines.filter(m => m.status === 'packaging').length,
    qualityControl: state.machines.filter(m => m.status === 'quality').length,
    defects: state.machines.filter(m => m.hasDefect).length
  };
  
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl pixel-font text-game-primary">Chão de Fábrica</h2>
        <PixelButton 
          variant="secondary" 
          size="sm"
          onClick={() => setBuyMachineOpen(true)}
          icon={<Building className="h-4 w-4" />}
        >
          Comprar Máquina
        </PixelButton>
      </div>

      {/* Production status overview - Improve contrast here */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-amber-100 p-3 rounded-md flex items-center justify-between border border-amber-300">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-amber-600" />
            <span className="pixel-text font-bold text-amber-800">Fabricando</span>
          </div>
          <span className="text-lg font-bold text-amber-900">{productionStats.manufacturing}</span>
        </div>
        
        <div className="bg-blue-100 p-3 rounded-md flex items-center justify-between border border-blue-300">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-blue-600" />
            <span className="pixel-text font-bold text-blue-800">Embalando</span>
          </div>
          <span className="text-lg font-bold text-blue-900">{productionStats.packaging}</span>
        </div>
        
        <div className="bg-green-100 p-3 rounded-md flex items-center justify-between border border-green-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="pixel-text font-bold text-green-800">Qualidade</span>
          </div>
          <span className="text-lg font-bold text-green-900">{productionStats.qualityControl}</span>
        </div>
        
        <div className="bg-red-100 p-3 rounded-md flex items-center justify-between border border-red-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="pixel-text font-bold text-red-800">Defeitos</span>
          </div>
          <span className="text-lg font-bold text-red-900">{productionStats.defects}</span>
        </div>
      </div>
      
      {/* Maintenance Booster Guide - Improve contrast here */}
      <div className="bg-blue-100 p-3 rounded-md mb-4 border-2 border-blue-300">
        <div className="flex items-start gap-2">
          <Wrench className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="pixel-text font-bold text-blue-800">Sistema de Manutenção</h3>
            <p className="pixel-text text-xs text-blue-700">
              Aplique boosters de manutenção nas máquinas para aumentar temporariamente a velocidade de produção em 3x por 5 dias.
              O custo varia de acordo com o nível da máquina.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid-pattern relative p-4 rounded-md min-h-[300px] border-2 border-game-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.machines.map(machine => (
            <PixelCard 
              key={machine.id}
              className={`machine ${machine.status === 'working' ? 'working' : ''} ${machine.hasDefect ? 'border-[#ea384c]' : ''} ${machine.boosterActive ? 'border-[#3b82f6]' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="pixel-text font-bold flex items-center gap-1">
                  <span>{machine.icon}</span> {machine.name}
                  {machine.boosterActive && <Zap className="h-4 w-4 text-yellow-500" />}
                </h3>
                <span className={`px-2 py-1 rounded-sm text-xs pixel-text ${
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
                <div className="flex justify-between text-xs mb-1">
                  <span className="pixel-text">Eficiência: {(machine.efficiency * 100).toFixed(0)}%</span>
                  <span className="pixel-text">Nível: {machine.level}</span>
                </div>
                
                {/* Worker assignment section */}
                <div className="flex items-center gap-1 text-xs mb-1">
                  <Users className="h-3 w-3 text-blue-600" />
                  <span className="pixel-text">
                    {machine.assignedWorkers.length > 0 
                      ? `${machine.assignedWorkers.length} funcionário(s) designado(s)` 
                      : 'Sem funcionários designados'}
                  </span>
                </div>

                {machine.assignedWorkers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {machine.assignedWorkers.slice(0, 3).map(worker => (
                      <span key={worker.id} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs rounded px-1.5 py-0.5">
                        {worker.icon} {worker.name.split(' ')[0]}
                      </span>
                    ))}
                    {machine.assignedWorkers.length > 3 && (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs rounded px-1.5 py-0.5">
                        +{machine.assignedWorkers.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {machine.boosterActive && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 mb-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="pixel-text">Booster ativo! ({machine.boosterEndDay! - state.day} dias restantes)</span>
                  </div>
                )}
                
                {(machine.status === 'working' || machine.hasDefect) && machine.currentProduct && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="pixel-text">
                        {machine.hasDefect ? 'Produto com defeito:' : 'Produzindo:'} {state.products.find(p => p.type === machine.currentProduct)?.name}
                      </span>
                      <span className="pixel-text">
                        {Math.floor((machine.progress / machine.maxProgress) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.floor((machine.progress / machine.maxProgress) * 100)} 
                      className={`h-2 ${
                        machine.hasDefect ? 'bg-[#ea384c]/20' : 
                        machine.boosterActive ? 'bg-blue-200' : 
                        'bg-game-secondary/20'
                      }`}
                    />
                  </div>
                )}
              </div>
              
              {machine.hasDefect ? (
                <div className="flex gap-2 flex-wrap">
                  <PixelButton 
                    variant="warning" 
                    size="sm"
                    onClick={() => handleFixDefect(machine.id)}
                    className="flex-1"
                    icon={<RefreshCw className="w-4 h-4" />}
                  >
                    Retrabalho (R${machine.level * 100})
                  </PixelButton>
                  <PixelButton 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDiscardDefect(machine.id)}
                    className="flex-1"
                    icon={<Trash className="w-4 h-4" />}
                  >
                    Descartar
                  </PixelButton>
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {machine.status === 'idle' ? (
                    <>
                      <div className="w-full">
                        <select 
                          className="pixel-input w-full mb-2"
                          onChange={(e) => handleAssignMachine(machine.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Atribuir Produto</option>
                          {state.products.map(product => {
                            // Check if we have resources for this product
                            const canProduce = Object.entries(product.requires).every(([resourceType, amount]) => {
                              const resource = state.resources.find((r) => r.type === resourceType as any);
                              return resource && resource.quantity >= (amount as number);
                            });
                            
                            return (
                              <option 
                                key={product.type} 
                                value={product.type}
                                disabled={!canProduce}
                              >
                                {product.icon} {product.name}
                                {!canProduce ? ' (Faltam recursos)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <PixelButton 
                        variant="success" 
                        size="sm"
                        onClick={() => handleUpgradeMachine(machine.id)}
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Melhorar (R${machine.level * 1000})
                      </PixelButton>
                    </>
                  ) : machine.status === 'working' ? (
                    <div className="w-full flex gap-2">
                      <PixelButton 
                        variant="warning" 
                        size="sm"
                        onClick={() => handleUnassignMachine(machine.id)}
                      >
                        Parar
                      </PixelButton>
                      
                      {!machine.boosterActive && (
                        <PixelButton 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleApplyBooster(machine.id)}
                          icon={<Zap className="w-4 h-4" />}
                          className="flex-1"
                        >
                          Manutenção (R${machine.level * 150})
                        </PixelButton>
                      )}
                    </div>
                  ) : (
                    <PixelButton 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRepairMachine(machine.id)}
                      icon={<Wrench className="w-4 h-4" />}
                    >
                      Reparar (R${machine.level * 200})
                    </PixelButton>
                  )}
                </div>
              )}
            </PixelCard>
          ))}
        </div>
      </div>
      
      <BuyMachineModal open={buyMachineOpen} onOpenChange={setBuyMachineOpen} />
    </div>
  );
};

export default FactoryFloor;
