import React from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { CheckCircle, XCircle, Clock, DollarSign, Package, Calendar } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductType } from '@/context/GameContext';

const CommercialDepartment: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleAcceptOrder = (orderId: string) => {
    dispatch({ type: 'ACCEPT_ORDER', orderId });
    toast.success('Pedido aceito com sucesso!');
  };

  const handleRejectOrder = (orderId: string) => {
    dispatch({ type: 'REJECT_ORDER', orderId });
    toast.info('Pedido rejeitado');
  };

  const getProductIcon = (type: ProductType) => {
    const product = state.products.find(p => p.type === type);
    return product?.icon || '📦';
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl pixel-font text-game-primary">Departamento Comercial</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <PixelCard className="bg-emerald-100 border-2 border-emerald-300">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <h3 className="pixel-text font-bold text-emerald-800">Pedidos Aceitos</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-emerald-900">{state.orders.length}</span>
            <p className="text-xs pixel-text mt-1 text-emerald-700">Em andamento</p>
          </div>
        </PixelCard>

        <PixelCard className="bg-amber-100 border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <h3 className="pixel-text font-bold text-amber-800">Pedidos Disponíveis</h3>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-amber-900">{state.availableOrders.length}</span>
            <p className="text-xs pixel-text mt-1 text-amber-700">Aguardando decisão</p>
          </div>
        </PixelCard>

        <PixelCard className="bg-blue-100 border-2 border-blue-300">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h3 className="pixel-text font-bold text-blue-800">Receita Potencial</h3>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold text-blue-900">
              {formatMoney(state.availableOrders.reduce((sum, order) => sum + order.reward, 0))}
            </span>
            <p className="text-xs pixel-text mt-1 text-blue-700">Em pedidos disponíveis</p>
          </div>
        </PixelCard>
      </div>

      <h3 className="pixel-text text-lg mb-3 text-blue-300">Pedidos Disponíveis</h3>
      <div className="space-y-3">
        {state.availableOrders.length > 0 ? (
          state.availableOrders.map(order => (
            <PixelCard key={order.id} className="bg-gray-900">
              <div className="flex justify-between items-center mb-2">
                <h4 className="pixel-text text-white flex items-center gap-2">
                  <span>{getProductIcon(order.product)}</span>
                  {order.product.charAt(0).toUpperCase() + order.product.slice(1)}
                </h4>
                <span className="pixel-text text-green-400">{formatMoney(order.reward)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-400" />
                  <span className="pixel-text text-sm text-blue-300">
                    Quantidade: {order.quantity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="pixel-text text-sm text-purple-300">
                    Prazo: {order.deadline - state.day} dias
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <PixelButton
                  variant="success"
                  size="sm"
                  onClick={() => handleAcceptOrder(order.id)}
                  className="flex-1"
                  icon={<CheckCircle className="h-4 w-4" />}
                  disabled={order.deadline - state.day <= 0}
                >
                  {order.deadline - state.day <= 0 ? 'Prazo Expirado' : 'Aceitar'}
                </PixelButton>
                <PixelButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleRejectOrder(order.id)}
                  className="flex-1"
                  icon={<XCircle className="h-4 w-4" />}
                >
                  Rejeitar
                </PixelButton>
              </div>
            </PixelCard>
          ))
        ) : (
          <PixelCard variant="glass">
            <p className="text-center pixel-text text-gray-400">
              Não há pedidos disponíveis no momento.
              <br />
              Novos pedidos chegam com o passar dos dias.
            </p>
          </PixelCard>
        )}
      </div>
    </div>
  );
};

export default CommercialDepartment;
