import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { CheckCircle, XCircle, Clock, DollarSign, Package, Calendar, AlertTriangle } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductType } from '@/context/GameContext';
import CustomerComplaintModal from './CustomerComplaintModal';

const CommercialDepartment: React.FC = () => {
  const { state, dispatch } = useGame();
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [lateOrderId, setLateOrderId] = useState<number | null>(null);
  const [lateOrderDeadline, setLateOrderDeadline] = useState<number>(0);
  // Rastrear pedidos que já tiveram reclamações exibidas
  const complainedOrdersRef = useRef<Set<number>>(new Set());

  // Verificar pedidos atrasados
  useEffect(() => {
    // Não verificar se o modal já estiver aberto
    if (complaintModalOpen) return;
    
    // Procurar pedidos que estão atrasados (deadline < dia atual)
    const lateOrders = state.orders.filter(order => 
      order.status === 'pending' && 
      order.deadline <= state.day && 
      !order.completed &&
      // Verificar se este pedido já teve uma reclamação exibida
      !complainedOrdersRef.current.has(order.id)
    );

    // Se houver pedidos atrasados, mostrar o modal para o primeiro deles
    if (lateOrders.length > 0) {
      const lateOrder = lateOrders[0];
      setLateOrderId(lateOrder.id);
      setLateOrderDeadline(lateOrder.deadline);
      setComplaintModalOpen(true);
      // Marcar este pedido como já reclamado
      complainedOrdersRef.current.add(lateOrder.id);
    }
  }, [state.day, state.orders, complaintModalOpen]);

  // Função para lidar com o fechamento do modal
  const handleModalClose = (open: boolean) => {
    if (!open && lateOrderId !== null) {
      // Garantir que o pedido seja marcado como reclamado ao fechar o modal
      complainedOrdersRef.current.add(lateOrderId);
    }
    setComplaintModalOpen(open);
  };

  const handleAcceptOrder = (orderId: number) => {
    dispatch({ type: 'ACCEPT_ORDER', orderId });
    toast.success('Pedido aceito com sucesso!');
  };

  const handleRejectOrder = (orderId: number) => {
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

      {/* Seção de pedidos atrasados */}
      {state.orders.some(order => order.deadline < state.day && order.status === 'pending' && !order.completed) && (
        <div className="mb-4">
          <h3 className="pixel-text text-lg mb-3 text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Pedidos Atrasados
          </h3>
          <div className="space-y-3">
            {state.orders
              .filter(order => order.deadline < state.day && order.status === 'pending' && !order.completed)
              .map(order => (
                <PixelCard key={order.id} className="bg-red-900 border-2 border-red-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="pixel-text text-white flex items-center gap-2">
                      <span>{getProductIcon(order.product)}</span>
                      {order.product.charAt(0).toUpperCase() + order.product.slice(1)}
                    </h4>
                    <span className="pixel-text text-red-400">Atrasado: {state.day - order.deadline} dias</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-red-400" />
                      <span className="pixel-text text-sm text-red-300">
                        Quantidade: {order.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-400" />
                      <span className="pixel-text text-sm text-red-300">
                        Prazo expirado
                      </span>
                    </div>
                  </div>
                </PixelCard>
              ))}
          </div>
        </div>
      )}

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

      {/* Modal de reclamação de cliente */}
      {lateOrderId !== null && (
        <CustomerComplaintModal
          open={complaintModalOpen}
          onOpenChange={handleModalClose}
          orderId={lateOrderId}
          deadline={lateOrderDeadline}
        />
      )}
    </div>
  );
};

export default CommercialDepartment;
