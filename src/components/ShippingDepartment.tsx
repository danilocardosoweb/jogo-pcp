import React from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

const ShippingDepartment: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleShipOrder = (orderId: string) => {
    dispatch({ type: 'SHIP_PRODUCT', orderId });
  };
  
  const completedOrders = state.orders.filter(order => order.status === 'completed');
  const inProgressOrders = state.orders.filter(order => order.status === 'in-progress');
  const failedOrders = state.orders.filter(order => order.status === 'failed');
  
  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl pixel-font text-game-primary mb-4">
        <span className="flex items-center gap-2">
          <Package className="h-6 w-6" /> Setor de Expedição
        </span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Orders */}
        <div>
          <h3 className="pixel-text text-lg mb-3 flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-game-success" /> Pedidos Prontos para Envio
          </h3>
          
          {completedOrders.length > 0 ? (
            <div className="space-y-3">
              {completedOrders.map(order => (
                <PixelCard key={order.id} variant="glass" animate>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="pixel-text font-bold flex items-center gap-1">
                      {state.products.find(p => p.type === order.product)?.icon} 
                      {state.products.find(p => p.type === order.product)?.name}
                    </h4>
                    <span className="bg-game-success text-white px-2 py-1 rounded-sm text-xs">
                      {order.completed}/{order.quantity}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="pixel-text text-xs">Prazo: Dia {order.deadline}</p>
                    <p className="pixel-text text-xs">Valor da NF: {formatMoney(order.reward)}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <PixelButton 
                      variant="success" 
                      size="sm"
                      onClick={() => handleShipOrder(order.id)}
                    >
                      Enviar Pedido
                    </PixelButton>
                  </div>
                </PixelCard>
              ))}
            </div>
          ) : (
            <PixelCard variant="glass">
              <p className="pixel-text text-center py-4">Nenhum pedido pronto para envio.</p>
            </PixelCard>
          )}
        </div>
        
        {/* In Progress and Failed Orders */}
        <div>
          <h3 className="pixel-text text-lg mb-3">Status dos Pedidos</h3>
          
          {inProgressOrders.length > 0 ? (
            <div className="space-y-3 mb-4">
              <h4 className="pixel-text text-sm">Em Andamento</h4>
              {inProgressOrders.map(order => (
                <PixelCard key={order.id} variant="outline" animate>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="pixel-text font-bold flex items-center gap-1">
                      {state.products.find(p => p.type === order.product)?.icon} 
                      {state.products.find(p => p.type === order.product)?.name}
                    </h4>
                    <span className="bg-game-primary text-white px-2 py-1 rounded-sm text-xs">
                      {order.completed}/{order.quantity}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="pixel-text text-xs">Prazo: Dia {order.deadline}</p>
                    <div className="w-full h-2 bg-game-bg mt-1 rounded-sm overflow-hidden">
                      <div 
                        className="h-full bg-game-primary"
                        style={{ width: `${(order.completed / order.quantity) * 100}%` }}
                      />
                    </div>
                  </div>
                </PixelCard>
              ))}
            </div>
          ) : null}
          
          {failedOrders.length > 0 ? (
            <div className="space-y-3">
              <h4 className="pixel-text text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-game-danger" /> Pedidos Não Concluídos
              </h4>
              {failedOrders.map(order => (
                <PixelCard key={order.id} variant="outline" animate>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="pixel-text font-bold flex items-center gap-1">
                      {state.products.find(p => p.type === order.product)?.icon} 
                      {state.products.find(p => p.type === order.product)?.name}
                    </h4>
                    <span className="bg-game-danger text-white px-2 py-1 rounded-sm text-xs">
                      Falhado
                    </span>
                  </div>
                  
                  <div>
                    <p className="pixel-text text-xs">Prazo Expirado: Dia {order.deadline}</p>
                    <p className="pixel-text text-xs">Completado: {order.completed}/{order.quantity}</p>
                  </div>
                </PixelCard>
              ))}
            </div>
          ) : null}
          
          {inProgressOrders.length === 0 && failedOrders.length === 0 && (
            <PixelCard variant="glass">
              <p className="pixel-text text-center py-4">Nenhum pedido em andamento ou falhado.</p>
            </PixelCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingDepartment;
