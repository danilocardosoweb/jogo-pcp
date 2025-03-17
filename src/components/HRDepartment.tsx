import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { 
  Heart, UserPlus, Briefcase, Award, 
  UserCheck, Brain, PenTool, AlertTriangle, 
  User, Zap, Users, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Progress } from './ui/progress';
import { formatMoney } from '@/lib/utils';
import { toast } from 'sonner';

const HRDepartment: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showAvailableWorkers, setShowAvailableWorkers] = useState(false);
  
  const handleHireWorker = (workerId: string) => {
    dispatch({ type: 'HIRE_WORKER', workerId });
    toast.success('Novo funcionário contratado!');
  };
  
  const handleMotivateWorker = (workerId: string) => {
    dispatch({ type: 'MOTIVATE_WORKER', workerId, amount: 1 });
    toast.success('Incentivo aplicado com sucesso!');
  };
  
  const handleTrainWorker = (workerId: string) => {
    dispatch({ type: 'TRAIN_WORKER', workerId });
    toast.success('Treinamento concluído com sucesso!');
  };
  
  const handleAssignWorker = (workerId: string, machineId: string) => {
    dispatch({ type: 'ASSIGN_WORKER', workerId, machineId });
    toast.success('Funcionário designado para a máquina!');
  };
  
  const handleUnassignWorker = (workerId: string) => {
    dispatch({ type: 'UNASSIGN_WORKER', workerId });
    toast.success('Funcionário retirado da máquina!');
  };
  
  const workersByMachine: { [key: string]: typeof state.workers } = {};
  const unassignedWorkers = state.workers.filter(worker => !worker.machineId);
  
  state.machines.forEach(machine => {
    workersByMachine[machine.id] = state.workers.filter(worker => worker.machineId === machine.id);
  });
  
  const hrStats = {
    totalWorkers: state.workers.length,
    motivatedWorkers: state.workers.filter(w => w.motivation > 70).length,
    unmotivatedWorkers: state.workers.filter(w => w.motivation < 30).length,
    totalSalaries: state.workers.reduce((sum, worker) => sum + worker.salary, 0),
    averageMotivation: state.workers.length 
      ? Number((state.workers.reduce((sum, worker) => sum + worker.motivation, 0) / state.workers.length).toFixed(2))
      : 0,
  };
  
  const getWorkerStatusColor = (motivation: number) => {
    if (motivation > 70) return 'text-green-600';
    if (motivation > 40) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getWorkerStatusIcon = (motivation: number) => {
    if (motivation > 70) return <ThumbsUp className="h-4 w-4 text-green-600" />;
    if (motivation > 40) return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    return <ThumbsDown className="h-4 w-4 text-red-600" />;
  };
  
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl pixel-font text-game-primary">Departamento de RH</h2>
        <PixelButton 
          variant="primary"
          size="sm"
          onClick={() => setShowAvailableWorkers(!showAvailableWorkers)}
          icon={<UserPlus className="h-4 w-4" />}
        >
          {showAvailableWorkers ? 'Voltar' : 'Contratar Funcionários'}
        </PixelButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <PixelCard className="bg-indigo-100 border-2 border-indigo-300">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h3 className="pixel-text font-bold text-indigo-800">Total de Funcionários</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-indigo-900">{hrStats.totalWorkers}</span>
            <p className="text-xs pixel-text mt-1 text-indigo-700">Salários: {formatMoney(hrStats.totalSalaries)}/dia</p>
          </div>
        </PixelCard>
        
        <PixelCard className="bg-red-100 border-2 border-red-300">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-red-600" />
            <h3 className="pixel-text font-bold text-red-800">Moral da Empresa</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-red-900">{Number(state.morale).toFixed(2)}%</span>
            <Progress 
              value={state.morale} 
              className="h-2 mt-2 bg-red-200" 
              indicatorClassName={`${
                state.morale > 70 ? 'bg-green-600' :
                state.morale > 40 ? 'bg-amber-600' :
                'bg-red-600'
              }`}
            />
          </div>
        </PixelCard>
        
        <PixelCard className="bg-blue-100 border-2 border-blue-300">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-blue-600" />
            <h3 className="pixel-text font-bold text-blue-800">Motivação Média</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-900">{hrStats.averageMotivation.toFixed(2)}%</span>
            <div className="flex justify-between text-xs mt-2">
              <span className="pixel-text text-green-600 font-medium">{hrStats.motivatedWorkers} motivados</span>
              <span className="pixel-text text-red-600 font-medium">{hrStats.unmotivatedWorkers} desmotivados</span>
            </div>
          </div>
        </PixelCard>
        
        <PixelCard className="bg-purple-100 border-2 border-purple-300">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="pixel-text font-bold text-purple-800">Treinamento</h3>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-purple-900">Nível de habilidade médio</span>
            <p className="text-xs pixel-text mt-1 text-purple-700">Treine seus funcionários para aumentar a produtividade</p>
          </div>
        </PixelCard>
      </div>
      
      {showAvailableWorkers ? (
        <>
          <h3 className="text-xl pixel-font text-game-primary mb-3">
            Candidatos Disponíveis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {state.availableWorkers.length > 0 ? (
              state.availableWorkers.map(worker => (
                <PixelCard key={worker.id} variant="glass">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{worker.icon}</span>
                    <div>
                      <h4 className="pixel-text font-bold">{worker.name}</h4>
                      <p className="text-xs pixel-text">
                        Especialidade: {worker.skill === 'assembly' ? 'Montagem' : 
                                       worker.skill === 'packaging' ? 'Embalagem' : 'Controle de Qualidade'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3 space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="pixel-text">Habilidade</span>
                        <span className="pixel-text">Nível {worker.skillLevel}</span>
                      </div>
                      <Progress value={worker.skillLevel * 20} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="pixel-text">Motivação</span>
                        <span className="pixel-text">{Number(worker.motivation).toFixed(2)}%</span>
                      </div>
                      <Progress 
                        value={worker.motivation} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="pixel-text">Salário: {formatMoney(worker.salary)}/dia</span>
                      <span className="pixel-text">Custo de contratação: {formatMoney(worker.salary * 5)}</span>
                    </div>
                  </div>
                  
                  <PixelButton 
                    variant="success" 
                    size="sm"
                    onClick={() => handleHireWorker(worker.id)}
                    className="w-full"
                    icon={<UserCheck className="h-4 w-4" />}
                  >
                    Contratar
                  </PixelButton>
                </PixelCard>
              ))
            ) : (
              <PixelCard variant="glass" className="col-span-full">
                <p className="pixel-text text-center py-4">
                  Não há candidatos disponíveis no momento. Verifique novamente mais tarde.
                </p>
              </PixelCard>
            )}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl pixel-font text-game-primary mb-3">
            Seus Funcionários
          </h3>
          {state.workers.length > 0 ? (
            <div className="space-y-6">
              {unassignedWorkers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="pixel-text font-bold flex items-center gap-2">
                    <User className="h-4 w-4" /> Funcionários não designados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unassignedWorkers.map(worker => (
                      <PixelCard key={worker.id} className="border-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{worker.icon}</span>
                          <div className="flex-1">
                            <h4 className="pixel-text font-bold flex items-center gap-1">
                              {worker.name}
                              {getWorkerStatusIcon(worker.motivation)}
                            </h4>
                            <p className="text-xs pixel-text">
                              Especialidade: {worker.skill === 'assembly' ? 'Montagem' : 
                                             worker.skill === 'packaging' ? 'Embalagem' : 'Controle de Qualidade'}
                            </p>
                          </div>
                          <span className="text-xs font-bold bg-amber-100 px-2 py-1 rounded-sm">
                            Não designado
                          </span>
                        </div>
                        
                        <div className="mb-3 space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="pixel-text">Habilidade</span>
                              <span className="pixel-text">Nível {worker.skillLevel}</span>
                            </div>
                            <Progress value={worker.skillLevel * 20} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="pixel-text">Motivação</span>
                              <span className={`pixel-text ${getWorkerStatusColor(worker.motivation)}`}>
                                {Number(worker.motivation).toFixed(2)}%
                              </span>
                            </div>
                            <Progress 
                              value={worker.motivation} 
                              className="h-2"
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span className="pixel-text">Salário: {formatMoney(worker.salary)}/dia</span>
                            <span className="pixel-text">Contratado: Dia {worker.hireDay}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <select 
                            className="pixel-input w-full"
                            onChange={(e) => handleAssignWorker(worker.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Designar para máquina</option>
                            {state.machines.map(machine => (
                              <option key={machine.id} value={machine.id}>
                                {machine.icon} {machine.name}
                              </option>
                            ))}
                          </select>
                          
                          <div className="flex gap-2">
                            <PixelButton 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleMotivateWorker(worker.id)}
                              className="flex-1"
                              icon={<Heart className="h-4 w-4" />}
                              disabled={worker.motivation >= 100}
                            >
                              Motivar ({formatMoney(50)})
                            </PixelButton>
                            
                            <PixelButton 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleTrainWorker(worker.id)}
                              className="flex-1"
                              icon={<Brain className="h-4 w-4" />}
                            >
                              Treinar ({formatMoney(200 * worker.skillLevel)})
                            </PixelButton>
                          </div>
                        </div>
                      </PixelCard>
                    ))}
                  </div>
                </div>
              )}
              
              {Object.entries(workersByMachine).map(([machineId, workers]) => {
                if (workers.length === 0) return null;
                
                const machine = state.machines.find(m => m.id === machineId);
                if (!machine) return null;
                
                return (
                  <div key={machineId} className="space-y-3">
                    <h4 className="pixel-text font-bold flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> {machine.icon} {machine.name} ({workers.length} funcionários)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {workers.map(worker => (
                        <PixelCard 
                          key={worker.id}
                          className={`border-2 ${
                            worker.skill === 'assembly' && machine.type === 'assembly' ? 'border-blue-300' :
                            worker.skill === 'packaging' && machine.type === 'packaging' ? 'border-blue-300' :
                            worker.skill === 'quality' && machine.type === 'quality' ? 'border-blue-300' :
                            'border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{worker.icon}</span>
                            <div className="flex-1">
                              <h4 className="pixel-text font-bold flex items-center gap-1">
                                {worker.name}
                                {getWorkerStatusIcon(worker.motivation)}
                              </h4>
                              <p className="text-xs pixel-text">
                                Especialidade: {worker.skill === 'assembly' ? 'Montagem' : 
                                               worker.skill === 'packaging' ? 'Embalagem' : 'Controle de Qualidade'}
                              </p>
                            </div>
                            {worker.skill === machine.type && (
                              <span className="text-xs font-bold bg-blue-100 px-2 py-1 rounded-sm text-blue-700">
                                Especialista
                              </span>
                            )}
                          </div>
                          
                          <div className="mb-3 space-y-2">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="pixel-text">Habilidade</span>
                                <span className="pixel-text">Nível {worker.skillLevel}</span>
                              </div>
                              <Progress value={worker.skillLevel * 20} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="pixel-text">Motivação</span>
                                <span className={`pixel-text ${getWorkerStatusColor(worker.motivation)}`}>
                                  {Number(worker.motivation).toFixed(2)}%
                                </span>
                              </div>
                              <Progress 
                                value={worker.motivation} 
                                className="h-2"
                              />
                            </div>
                            
                            <div className="flex justify-between text-xs">
                              <span className="pixel-text">Salário: {formatMoney(worker.salary)}/dia</span>
                              <span className="pixel-text">Contratado: Dia {worker.hireDay}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <PixelButton 
                              variant="warning" 
                              size="sm"
                              onClick={() => handleUnassignWorker(worker.id)}
                              className="flex-1"
                              icon={<User className="h-4 w-4" />}
                            >
                              Remover
                            </PixelButton>
                            
                            <PixelButton 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleMotivateWorker(worker.id)}
                              className="flex-1"
                              icon={<Heart className="h-4 w-4" />}
                              disabled={worker.motivation >= 100}
                            >
                              Motivar
                            </PixelButton>
                            
                            <PixelButton 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleTrainWorker(worker.id)}
                              className="flex-1"
                              icon={<Brain className="h-4 w-4" />}
                            >
                              Treinar
                            </PixelButton>
                          </div>
                        </PixelCard>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <PixelCard className="text-center py-8">
              <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="pixel-text font-bold text-xl mb-2">Nenhum funcionário contratado ainda</h3>
              <p className="pixel-text mb-4">
                Clique em "Contratar Funcionários" para ver os candidatos disponíveis.
              </p>
              <PixelButton 
                variant="primary"
                onClick={() => setShowAvailableWorkers(true)}
                icon={<UserPlus className="h-4 w-4" />}
              >
                Contratar Funcionários
              </PixelButton>
            </PixelCard>
          )}
        </>
      )}
    </div>
  );
};

export default HRDepartment;
