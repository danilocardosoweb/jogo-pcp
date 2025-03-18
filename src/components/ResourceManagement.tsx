import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import ExternalPurchases from './ExternalPurchases';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package2 } from 'lucide-react';

const ResourceManagement: React.FC = () => {
  const { state, dispatch } = useGame();
  const [purchaseAmount, setPurchaseAmount] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState('resources');
  
  const handlePurchaseChange = (resourceType: string, value: number) => {
    setPurchaseAmount(prev => ({
      ...prev,
      [resourceType]: value
    }));
  };
  
  const handlePurchase = (resourceType: any, amount: number) => {
    if (amount > 0) {
      dispatch({ type: 'BUY_RESOURCE', resourceType, amount });
      setPurchaseAmount(prev => ({
        ...prev,
        [resourceType]: 0
      }));
    }
  };
  
  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl pixel-font text-game-primary mb-4">Gestão de Recursos</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2 bg-transparent">
          <TabsTrigger 
            value="resources" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'resources' 
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package2 className="h-4 w-4" /> Matéria Prima
          </TabsTrigger>
          <TabsTrigger 
            value="purchases" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'purchases' 
                ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShoppingCart className="h-4 w-4" /> Compras Externas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.resources.map(resource => (
              <PixelCard key={resource.type} className="resource">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="pixel-text font-bold flex items-center gap-1">
                    <span>{resource.icon}</span> {resource.name}
                  </h3>
                  <span className="pixel-text">R${resource.cost}/unidade</span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="pixel-text">Estoque:</span>
                    <span className="pixel-text">{resource.quantity} / {resource.max}</span>
                  </div>
                  <div className="progress-container">
                    <div 
                      className="progress-bar"
                      style={{ width: `${(resource.quantity / resource.max) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="pixel-input w-full"
                    min="1"
                    max={resource.max - resource.quantity}
                    value={purchaseAmount[resource.type] || 0}
                    onChange={(e) => handlePurchaseChange(resource.type, parseInt(e.target.value) || 0)}
                  />
                  <PixelButton 
                    variant="primary" 
                    size="sm"
                    onClick={() => handlePurchase(resource.type, purchaseAmount[resource.type] || 0)}
                    disabled={(purchaseAmount[resource.type] || 0) <= 0}
                  >
                    Comprar
                  </PixelButton>
                </div>
                <div className="text-right mt-1">
                  <span className="pixel-text text-xs">
                    Custo: R${((purchaseAmount[resource.type] || 0) * resource.cost).toFixed(0)}
                  </span>
                </div>
              </PixelCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="purchases">
          <ExternalPurchases />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceManagement;
