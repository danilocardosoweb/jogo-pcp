import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { 
  ClipboardList, 
  PlayCircle, 
  PauseCircle,
  Settings,
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
  Boxes,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/utils';
import { unlockableProducts, ProductType } from '@/context/GameContext';

// Função auxiliar para calcular a produção diária com base no tempo de produção
const calculateDailyProduction = (productionTime: number, baseSpeed: number = 1): number => {
  // O productionTime é o tempo para produzir uma unidade (em frações de dia)
  // Por exemplo, 0.2 significa que leva 0.2 dias para produzir uma unidade, ou seja, 5 unidades por dia
  // A velocidade base padrão é 1, mas pode ser ajustada com base na eficiência da máquina
  return Math.round(1 / productionTime * baseSpeed);
};

const ProductionPlanner: React.FC = () => {
  const { state, dispatch } = useGame();
  const [customPrices, setCustomPrices] = useState<{ [key: string]: number }>({});

  // Initialize customPrices with current product prices when component mounts or products change
  React.useEffect(() => {
    const initialPrices: { [key: string]: number } = {};
    state.products.forEach(product => {
      initialPrices[product.type] = product.price;
    });
    setCustomPrices(initialPrices);
  }, [state.products]);

  const handleStartProduction = (orderId: number) => {
    if (!canStartProduction(orderId)) return;
    dispatch({ type: 'START_PRODUCTION', orderId });
    toast.success('Produção iniciada!');
  };

  const handlePauseProduction = (orderId: number) => {
    dispatch({ type: 'PAUSE_PRODUCTION', orderId });
    toast.info('Produção pausada');
  };

  const handleUnlockProduct = (productType: ProductType) => {
    dispatch({ type: 'UNLOCK_PRODUCT', productType });
  };

  const getResourceCost = (product: any) => {
    return Object.entries(product.requires).reduce((total, [resourceType, amount]) => {
      const resource = state.resources.find(r => r.type === resourceType);
      return total + (resource ? resource.cost * (amount as number) : 0);
    }, 0);
  };

  const getUnlockCost = (product: any) => {
    return product.price * 100;
  };

  const handlePriceChange = (productType: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;
    
    setCustomPrices(prev => ({
      ...prev,
      [productType]: numValue
    }));
  };

  const handleUpdatePrice = (productType: string, resourceCost: number) => {
    const newPrice = customPrices[productType];
    if (newPrice === undefined) return;
    
    const maxPrice = resourceCost * 4; // 300% do custo de recursos + o custo base (100%)
    
    if (newPrice > maxPrice) {
      toast.error(`O preço não pode exceder 400% do custo de recursos (${formatMoney(maxPrice)})`);
      return;
    }
    
    dispatch({ type: 'SET_PRODUCT_PRICE', productType: productType as ProductType, price: newPrice });
    toast.success('Preço atualizado com sucesso!');
  };

  const canStartProduction = (orderId: number) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return false;

    // Verificar se há máquinas disponíveis para o produto
    const availableMachines = state.machines.filter(
      m => m.currentProduct === order.product && m.status === 'idle'
    );

    return availableMachines.length > 0;
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl pixel-font text-game-primary">Planejamento da Produção</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <PixelCard className="bg-emerald-100 border-2 border-emerald-300">
          <div className="flex items-center gap-2 mb-2">
            <PlayCircle className="h-5 w-5 text-emerald-600" />
            <h3 className="pixel-text font-bold text-emerald-800">Em Produção</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-emerald-900">
              {state.orders.filter(order => order.status === 'in_production').length}
            </span>
            <p className="text-xs pixel-text mt-1 text-emerald-700">Pedidos ativos</p>
          </div>
        </PixelCard>

        <PixelCard className="bg-amber-100 border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-2">
            <PauseCircle className="h-5 w-5 text-amber-600" />
            <h3 className="pixel-text font-bold text-amber-800">Aguardando</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-amber-900">
              {state.orders.filter(order => order.status === 'pending').length}
            </span>
            <p className="text-xs pixel-text mt-1 text-amber-700">Pedidos pendentes</p>
          </div>
        </PixelCard>

        <PixelCard className="bg-red-100 border-2 border-red-300">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="pixel-text font-bold text-red-800">Atrasados</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-red-900">
              {state.orders.filter(order => order.deadline <= state.day).length}
            </span>
            <p className="text-xs pixel-text mt-1 text-red-700">Pedidos em atraso</p>
          </div>
        </PixelCard>
      </div>

      <h3 className="pixel-text text-lg mb-3 text-blue-300">Produtos Disponíveis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {state.products.map(product => {
          const resourceCost = getResourceCost(product);
          const maxPrice = resourceCost * 4; // 300% do custo de recursos + o custo base (100%)
          
          return (
            <PixelCard key={product.type} className="bg-gray-900 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <h4 className="pixel-text text-white flex items-center gap-2">
                  <span>{product.icon}</span>
                  <span>{product.name}</span>
                </h4>
                <span className="pixel-text text-green-400">{formatMoney(product.price)}</span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="pixel-text text-sm text-blue-300">
                      Produção por Dia:
                    </span>
                  </div>
                  <span className="pixel-text text-sm text-white">{calculateDailyProduction(product.productionTime)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <span className="pixel-text text-sm text-emerald-300">
                      Custo de Recursos:
                    </span>
                  </div>
                  <span className="pixel-text text-sm text-white">{formatMoney(resourceCost)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-purple-400" />
                  <span className="pixel-text text-sm text-purple-300">Recursos Necessários:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.requires).map(([resourceType, amount]) => {
                    const resource = state.resources.find(r => r.type === resourceType);
                    return (
                      <div key={resourceType} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <span className="pixel-text text-xs text-gray-300">{resource?.icon} {resource?.name}</span>
                        <span className="pixel-text text-xs text-white">{amount}x</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Novo campo para definir preço personalizado */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                  <span className="pixel-text text-sm text-yellow-300">Definir Preço:</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="pixel-input w-full"
                    placeholder={`Preço atual: ${formatMoney(product.price)}`}
                    value={customPrices[product.type] !== undefined ? customPrices[product.type] : product.price}
                    onChange={(e) => handlePriceChange(product.type, e.target.value)}
                    min="0"
                    step="1"
                  />
                  <PixelButton
                    variant="success"
                    size="sm"
                    onClick={() => handleUpdatePrice(product.type, resourceCost)}
                    disabled={customPrices[product.type] === undefined || customPrices[product.type] === product.price}
                  >
                    Atualizar
                  </PixelButton>
                </div>
                <div className="text-xs text-gray-400 pixel-text">
                  Máximo: {formatMoney(maxPrice)} (400% do custo)
                </div>
              </div>
            </PixelCard>
          );
        })}
      </div>

      <h3 className="pixel-text text-lg mb-3 text-amber-300">Produtos para Desbloqueio</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {unlockableProducts
          .filter(p => !state.unlockedProducts.includes(p.type))
          .map(product => (
            <PixelCard key={product.type} className="bg-gray-900 hover:bg-gray-800 transition-colors relative">
              <div className="absolute top-2 right-2">
                <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs pixel-text">
                  Novo!
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="pixel-text text-white flex items-center gap-2">
                  <span>{product.icon}</span>
                  <span>{product.name}</span>
                </h4>
                <span className="pixel-text text-amber-400">{formatMoney(product.price)}</span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="pixel-text text-sm text-blue-300">
                      Produção por Dia:
                    </span>
                  </div>
                  <span className="pixel-text text-sm text-white">{calculateDailyProduction(product.productionTime)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <span className="pixel-text text-sm text-emerald-300">
                      Custo de Recursos:
                    </span>
                  </div>
                  <span className="pixel-text text-sm text-white">{formatMoney(getResourceCost(product))}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-400" />
                    <span className="pixel-text text-sm text-amber-300">
                      Custo para Desbloquear:
                    </span>
                  </div>
                  <span className="pixel-text text-sm text-white">{formatMoney(getUnlockCost(product))}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-purple-400" />
                  <span className="pixel-text text-sm text-purple-300">Recursos Necessários:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.requires).map(([resourceType, amount]) => {
                    const resource = state.resources.find(r => r.type === resourceType);
                    return (
                      <div key={resourceType} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <span className="pixel-text text-xs text-gray-300">{resource?.icon} {resource?.name}</span>
                        <span className="pixel-text text-xs text-white">{amount}x</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4">
                <PixelButton
                  variant="warning"
                  size="sm"
                  onClick={() => handleUnlockProduct(product.type)}
                  className="w-full"
                  icon={<Unlock className="h-4 w-4" />}
                >
                  Desbloquear por {formatMoney(getUnlockCost(product))}
                </PixelButton>
              </div>
            </PixelCard>
          ))}
      </div>

      <h3 className="pixel-text text-lg mb-3 text-blue-300">Ordens de Produção</h3>
      <div className="space-y-3">
        {state.orders.length > 0 ? (
          state.orders.map(order => (
            <PixelCard key={order.id} className="bg-gray-900">
              <div className="flex justify-between items-center mb-2">
                <h4 className="pixel-text text-white flex items-center gap-2">
                  <span>{order.product.charAt(0).toUpperCase() + order.product.slice(1)}</span>
                </h4>
                <span className={`pixel-text ${
                  order.status === 'in_production' ? 'text-green-400' :
                  order.status === 'pending' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {order.status === 'in_production' ? 'Em Produção' :
                   order.status === 'pending' ? 'Pendente' :
                   'Atrasado'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-blue-400" />
                  <span className="pixel-text text-sm text-blue-300">
                    Progresso: {Math.round(order.progress)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-400" />
                  <span className="pixel-text text-sm text-purple-300">
                    Eficiência: {Math.round(order.efficiency * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' ? (
                  <PixelButton
                    variant="success"
                    size="sm"
                    onClick={() => handleStartProduction(order.id)}
                    className="flex-1"
                    icon={<PlayCircle className="h-4 w-4" />}
                  >
                    Iniciar Produção
                  </PixelButton>
                ) : (
                  <PixelButton
                    variant="warning"
                    size="sm"
                    onClick={() => handlePauseProduction(order.id)}
                    className="flex-1"
                    icon={<PauseCircle className="h-4 w-4" />}
                  >
                    Pausar Produção
                  </PixelButton>
                )}
              </div>
            </PixelCard>
          ))
        ) : (
          <PixelCard variant="glass">
            <p className="text-center pixel-text text-gray-400">
              Não há ordens de produção no momento.
              <br />
              Aceite pedidos na aba Comercial para começar a produzir.
            </p>
          </PixelCard>
        )}
      </div>
    </div>
  );
};

export default ProductionPlanner;
