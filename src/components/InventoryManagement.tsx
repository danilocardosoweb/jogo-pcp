
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { formatMoney } from '@/lib/utils';

const InventoryManagement: React.FC = () => {
  const { state, dispatch } = useGame();
  const [sellAmount, setSellAmount] = useState<{ [key: string]: number }>({});
  
  const handleSellAmountChange = (productType: string, value: number) => {
    setSellAmount(prev => ({
      ...prev,
      [productType]: value
    }));
  };
  
  const handleSellProduct = (productType: any, amount: number) => {
    if (amount > 0) {
      dispatch({ type: 'SELL_PRODUCT', productType, amount });
      setSellAmount(prev => ({
        ...prev,
        [productType]: 0
      }));
    }
  };
  
  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl pixel-font text-game-primary mb-4">Controle de Estoque</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.products.map(product => (
          <PixelCard key={product.type} className="inventory-item">
            <div className="flex justify-between items-center mb-2">
              <h3 className="pixel-text font-bold flex items-center gap-1">
                <span>{product.icon}</span> {product.name}
              </h3>
              <span className="pixel-text">{formatMoney(product.price)}/unidade</span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="pixel-text">Em estoque:</span>
                <span className="pixel-text font-bold">{state.inventory[product.type]} unidades</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar bg-game-success"
                  style={{ width: `${Math.min((state.inventory[product.type] / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="number" 
                className="pixel-input w-full"
                min="1"
                max={state.inventory[product.type]}
                value={sellAmount[product.type] || 0}
                onChange={(e) => handleSellAmountChange(product.type, parseInt(e.target.value) || 0)}
                disabled={state.inventory[product.type] <= 0}
              />
              <PixelButton 
                variant="primary" 
                size="sm"
                onClick={() => handleSellProduct(product.type, sellAmount[product.type] || 0)}
                disabled={(sellAmount[product.type] || 0) <= 0 || state.inventory[product.type] <= 0}
              >
                Vender
              </PixelButton>
            </div>
            <div className="text-right mt-1">
              <span className="pixel-text text-xs">
                Receita: {formatMoney((sellAmount[product.type] || 0) * product.price)}
              </span>
            </div>
          </PixelCard>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
