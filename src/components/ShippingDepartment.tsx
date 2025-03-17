import React from 'react';
import { useGame } from '../context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { Package, TruckIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';

export const ShippingDepartment: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleShipOrder = (orderId: string) => {
    dispatch({ type: 'COMPLETE_ORDER', orderId });
  };

  // Calculate order statistics
  const totalOrders = state.availableOrders.length + state.completedOrders.length;
  const pendingOrders = state.availableOrders.filter(order => order.status === 'pending').length;
  const completedOrders = state.completedOrders.length;
  const lateOrders = state.stats.ordersLate;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <TruckIcon className="h-6 w-6 text-game-accent" />
        <h2 className="pixel-text text-2xl text-game-accent">Departamento de Envios</h2>
      </div>
      
      {/* Order Statistics */}
      <PixelCard>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-game-bg/50 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-game-accent" />
              <p className="pixel-text text-sm text-game-secondary">Total de Pedidos</p>
            </div>
            <p className="pixel-text text-xl text-game-accent">{totalOrders}</p>
          </div>
          
          <div className="p-4 bg-game-bg/50 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="h-4 w-4 text-yellow-500" />
              <p className="pixel-text text-sm text-game-secondary">Pedidos Pendentes</p>
            </div>
            <p className="pixel-text text-xl text-yellow-500">{pendingOrders}</p>
          </div>
          
          <div className="p-4 bg-game-bg/50 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              <p className="pixel-text text-sm text-game-secondary">Pedidos Completados</p>
            </div>
            <p className="pixel-text text-xl text-green-500">{completedOrders}</p>
          </div>
          
          <div className="p-4 bg-game-bg/50 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-red-500" />
              <p className="pixel-text text-sm text-game-secondary">Pedidos Atrasados</p>
            </div>
            <p className="pixel-text text-xl text-red-500">{lateOrders}</p>
          </div>
        </div>
      </PixelCard>

      {/* Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PixelCard>
          <h3 className="pixel-text text-lg text-game-primary mb-4 flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            Pedidos em Andamento
          </h3>
          <div className="space-y-3">
            {state.availableOrders.map((order) => {
              const product = state.products.find(p => p.type === order.product);
              const progress = (order.completed / order.quantity) * 100;
              
              return (
                <div
                  key={order.id}
                  className="p-4 border-2 border-game-secondary rounded-sm hover:border-game-primary transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{product?.icon}</span>
                      <span className="pixel-text font-bold text-game-accent">
                        {product?.name || order.product}
                      </span>
                    </div>
                    <span className="pixel-text text-green-400">
                      R$ {order.reward.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="pixel-text text-game-secondary">Progresso:</span>
                      <span className="pixel-text text-game-accent">{order.completed}/{order.quantity}</span>
                    </div>
                    
                    <div className="w-full h-2 bg-game-bg rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-game-accent transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="pixel-text text-game-secondary">Prazo:</span>
                      <span className="pixel-text text-game-accent">Dia {order.deadline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {state.availableOrders.length === 0 && (
              <div className="text-center py-4">
                <p className="pixel-text text-game-secondary">Nenhum pedido em andamento</p>
              </div>
            )}
          </div>
        </PixelCard>

        {/* Completed Orders */}
        <PixelCard>
          <h3 className="pixel-text text-lg text-game-primary mb-4 flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5" />
            Pedidos Completados
          </h3>
          <div className="space-y-3">
            {state.completedOrders.map((order) => {
              const product = state.products.find(p => p.type === order.product);
              
              return (
                <div
                  key={order.id}
                  className="p-4 border-2 border-green-500 rounded-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{product?.icon}</span>
                      <span className="pixel-text font-bold text-game-accent">
                        {product?.name || order.product}
                      </span>
                    </div>
                    <span className="pixel-text text-green-400">
                      R$ {order.reward.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="pixel-text text-game-secondary">Quantidade:</span>
                      <span className="pixel-text text-game-accent">{order.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="pixel-text text-game-secondary">Status:</span>
                      <span className="pixel-text text-green-500">Completado</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {state.completedOrders.length === 0 && (
              <div className="text-center py-4">
                <p className="pixel-text text-game-secondary">Nenhum pedido completado</p>
              </div>
            )}
          </div>
        </PixelCard>
      </div>
    </div>
  );
};
