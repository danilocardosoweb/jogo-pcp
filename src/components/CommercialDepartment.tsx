import React from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { toast } from 'sonner';
import { TrendingUp, ShoppingBag, Target } from 'lucide-react';

const CommercialDepartment: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleMarketResearch = () => {
    // Implement market research logic
    toast('Análise de mercado em andamento...', {
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market Analysis */}
        <PixelCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <h3 className="pixel-text text-lg text-game-primary">Análise de Mercado</h3>
          </div>
          <p className="pixel-text text-sm text-game-secondary mb-4">
            Analise tendências e oportunidades de mercado para tomar melhores decisões.
          </p>
          <PixelButton
            variant="primary"
            size="sm"
            onClick={handleMarketResearch}
            className="w-full"
          >
            Realizar Análise
          </PixelButton>
        </PixelCard>

        {/* Marketing Campaigns */}
        <PixelCard>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-green-400" />
            <h3 className="pixel-text text-lg text-game-primary">Campanhas</h3>
          </div>
          <p className="pixel-text text-sm text-game-secondary mb-4">
            Gerencie campanhas de marketing para atrair mais clientes.
          </p>
          <PixelButton
            variant="primary"
            size="sm"
            disabled
            className="w-full"
          >
            Em breve
          </PixelButton>
        </PixelCard>

        {/* Sales Reports */}
        <PixelCard>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-purple-400" />
            <h3 className="pixel-text text-lg text-game-primary">Relatório de Vendas</h3>
          </div>
          <p className="pixel-text text-sm text-game-secondary mb-4">
            Acompanhe o desempenho das vendas e métricas comerciais.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between pixel-text text-sm">
              <span>Pedidos Totais:</span>
              <span className="text-game-primary">{state.completedOrders.length}</span>
            </div>
            <div className="flex justify-between pixel-text text-sm">
              <span>Taxa de Entrega:</span>
              <span className="text-green-400">98%</span>
            </div>
            <div className="flex justify-between pixel-text text-sm">
              <span>Satisfação:</span>
              <span className="text-yellow-400">★★★★☆</span>
            </div>
          </div>
        </PixelCard>
      </div>

      {/* Customer Orders Section */}
      <PixelCard>
        <h3 className="pixel-text text-lg text-game-primary mb-4">Pedidos dos Clientes</h3>
        <div className="space-y-3">
          {state.availableOrders.map((order) => {
            // Find the product details from state.products
            const productDetails = state.products.find(p => p.type === order.product);
            
            return (
              <div
                key={order.id}
                className="p-3 border-2 border-game-secondary rounded-sm hover:border-game-primary transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="pixel-text font-bold text-game-accent">
                    Pedido #{order.id}
                  </span>
                  <span className="pixel-text text-green-400">
                    R$ {order.reward.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="pixel-text text-sm text-game-secondary">
                    Produto: {productDetails?.name || 'Produto'}
                  </p>
                  <p className="pixel-text text-sm text-game-secondary">
                    Quantidade: {order.quantity}
                  </p>
                  <p className="pixel-text text-sm text-game-secondary">
                    Prazo: {order.deadline} dias
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
};

export default CommercialDepartment;
