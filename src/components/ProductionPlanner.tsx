import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { formatMoney } from '@/lib/utils';
import { Ban, CheckCircle2, Edit, Check } from 'lucide-react';
import { Input } from './ui/input';
import { ProductType, Product } from '@/context/GameContext';

const ProductionPlanner: React.FC = () => {
  const { state, dispatch } = useGame();
  const [editingProductId, setEditingProductId] = useState<ProductType | null>(null);
  const [tempProfit, setTempProfit] = useState<{ [key in ProductType]?: number }>({});

  const calculateProductCosts = (product: Product) => {
    const rawMaterialsCost = Object.entries(product.requires).reduce((total, [resourceType, amount]) => {
      const resource = state.resources.find(r => r.type === resourceType);
      return total + (resource?.cost || 0) * (amount || 0);
    }, 0);

    const currentProfit = product.price - rawMaterialsCost;
    return { rawMaterialsCost, currentProfit };
  };

  const handleProfitChange = (productType: ProductType, profit: number) => {
    setTempProfit(prev => ({ ...prev, [productType]: profit }));
  };

  const confirmProfitChange = (productType: ProductType) => {
    const product = state.products.find(p => p.type === productType);
    if (!product) return;

    const profit = tempProfit[productType] || 0;
    const { rawMaterialsCost } = calculateProductCosts(product);
    const newPrice = rawMaterialsCost + profit;

    dispatch({ 
      type: 'SET_PRODUCT_PRICE', 
      productType,
      price: newPrice 
    });

    setEditingProductId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, productType: ProductType) => {
    if (e.key === 'Enter') {
      confirmProfitChange(productType);
    }
  };

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl pixel-font text-blue-400 mb-4">Planejamento de Produção</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Products */}
        <div>
          <h3 className="pixel-text text-lg mb-3 text-blue-300">Produtos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.products.map(product => {
              const { rawMaterialsCost, currentProfit } = calculateProductCosts(product);
              const isEditing = editingProductId === product.type;
              const displayPrice = isEditing 
                ? rawMaterialsCost + (tempProfit[product.type] || 0)
                : product.price;
              
              return (
                <PixelCard key={product.type} variant="outline" animate className="bg-gray-900">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="pixel-text font-bold flex items-center gap-1 text-blue-300">
                      <span>{product.icon}</span> {product.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="pixel-text text-green-400">{formatMoney(displayPrice)}</span>
                      <PixelButton 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          setEditingProductId(product.type);
                          setTempProfit(prev => ({ ...prev, [product.type]: currentProfit }));
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </PixelButton>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex gap-2 mb-3">
                      <Input 
                        type="number" 
                        placeholder="Lucro desejado" 
                        value={tempProfit[product.type] || 0}
                        onChange={(e) => handleProfitChange(product.type, parseFloat(e.target.value) || 0)}
                        onKeyPress={(e) => handleKeyPress(e, product.type)}
                        className="w-full bg-gray-800 text-white placeholder:text-gray-400"
                      />
                      <PixelButton 
                        variant="success" 
                        size="sm" 
                        onClick={() => confirmProfitChange(product.type)}
                      >
                        <Check className="h-4 w-4" />
                      </PixelButton>
                    </div>
                  ) : null}
                  
                  <div className="space-y-1 mb-3">
                    <p className="pixel-text text-sm text-gray-300">Tempo de Produção: {product.productionTime} dias</p>
                    <p className="pixel-text text-sm text-gray-300">Custo de Matérias-Primas: {formatMoney(rawMaterialsCost)}</p>
                    <p className="pixel-text text-sm text-gray-300">Lucro Atual: {formatMoney(currentProfit)}</p>
                    <p className="pixel-text text-sm text-gray-300">Recursos necessários:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(product.requires).map(([resourceType, amount]) => (
                        <span 
                          key={resourceType}
                          className="pixel-text text-sm bg-gray-800 text-blue-300 px-2 py-1 rounded-sm"
                        >
                          {state.resources.find(r => r.type === resourceType)?.icon} {amount}
                        </span>
                      ))}
                    </div>
                  </div>
                </PixelCard>
              );
            })}
          </div>
        </div>
        
        {/* Available Orders */}
        <div>
          <h3 className="pixel-text text-lg mb-3 text-blue-300">Pedidos Disponíveis</h3>
          {state.availableOrders.length > 0 ? (
            <div className="space-y-3">
              {state.availableOrders.map(order => {
                const product = state.products.find(p => p.type === order.product);
                if (!product) return null;

                return (
                  <PixelCard key={order.id} variant="glass" animate className="bg-gray-900">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="pixel-text font-bold text-blue-300">
                        {product.icon} {product.name}
                      </h4>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-sm text-xs">
                        {order.quantity} unidades
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="pixel-text text-gray-300">Prazo: Dia {order.deadline} (Atual: Dia {state.day})</span>
                        <span className="pixel-text text-green-400">Valor da NF: {formatMoney(order.reward)}</span>
                      </div>
                      <div className="mt-1">
                        <span className="pixel-text font-bold text-blue-300">
                          Prazo de entrega: {order.deadline - state.day} dias
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="pixel-text text-gray-300">Valor de Venda: {formatMoney(product.price * order.quantity)}</span>
                        <span className="pixel-text ml-2 text-gray-300">Imposto: {formatMoney(product.price * order.quantity * 0.2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <PixelButton 
                        variant="destructive" 
                        size="sm"
                        onClick={() => dispatch({ type: 'REJECT_ORDER', orderId: order.id })}
                        icon={<Ban className="h-4 w-4" />}
                      >
                        Negar Pedido
                      </PixelButton>
                      <PixelButton 
                        variant="success" 
                        size="sm"
                        onClick={() => dispatch({ type: 'ACCEPT_ORDER', orderId: order.id })}
                        icon={<CheckCircle2 className="h-4 w-4" />}
                      >
                        Aceitar Pedido
                      </PixelButton>
                    </div>
                  </PixelCard>
                );
              })}
            </div>
          ) : (
            <PixelCard variant="glass" className="bg-gray-900">
              <p className="pixel-text text-center py-8 text-gray-300">Nenhum pedido disponível no momento. Verifique mais tarde!</p>
            </PixelCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionPlanner;
