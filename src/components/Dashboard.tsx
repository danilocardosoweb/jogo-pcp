import React, { useState } from 'react';
import ResourceManagement from './ResourceManagement';
import ProductionPlanner from './ProductionPlanner';
import FactoryFloor from './FactoryFloor';
import InventoryManagement from './InventoryManagement';
import { ShippingDepartment } from './ShippingDepartment';
import HRDepartment from './HRDepartment';
import FinanceDepartment from './FinanceDepartment';
import CommercialDepartment from './CommercialDepartment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Factory, 
  Package, 
  TruckIcon, 
  Users, 
  Warehouse,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { PixelButton } from './ui/PixelButton';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const { state, dispatch } = useGame();
  
  const handleEndDay = () => {
    dispatch({ type: 'TICK' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold pixel-font text-game-primary">Fábrica Tech</h1>
          <p className="pixel-text">Dia: {state.day} | Saldo: ${state.money.toLocaleString('pt-BR')}</p>
        </div>
        <PixelButton onClick={handleEndDay} variant="warning">
          Avançar um Dia
        </PixelButton>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 grid grid-cols-1 md:grid-cols-8 gap-2 bg-transparent">
          <TabsTrigger 
            value="resources" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'resources' 
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Database className="h-4 w-4" /> Recursos
          </TabsTrigger>
          <TabsTrigger 
            value="commercial" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'commercial' 
                ? 'bg-orange-100 text-orange-800 border-2 border-orange-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Comercial
          </TabsTrigger>
          <TabsTrigger 
            value="production" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'production' 
                ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Factory className="h-4 w-4" /> Planejamento
          </TabsTrigger>
          <TabsTrigger 
            value="factory" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'factory' 
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Warehouse className="h-4 w-4" /> Fábrica
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'inventory' 
                ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="h-4 w-4" /> Inventário
          </TabsTrigger>
          <TabsTrigger 
            value="shipping" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'shipping' 
                ? 'bg-purple-100 text-purple-800 border-2 border-purple-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TruckIcon className="h-4 w-4" /> Envios
          </TabsTrigger>
          <TabsTrigger 
            value="hr" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'hr' 
                ? 'bg-pink-100 text-pink-800 border-2 border-pink-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="h-4 w-4" /> RH
          </TabsTrigger>
          <TabsTrigger 
            value="finance" 
            className={`flex items-center gap-2 pixel-text font-medium ${
              activeTab === 'finance' 
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="h-4 w-4" /> Finanças
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <ResourceManagement />
        </TabsContent>
        
        <TabsContent value="commercial">
          <CommercialDepartment />
        </TabsContent>
        
        <TabsContent value="production">
          <ProductionPlanner />
        </TabsContent>
        
        <TabsContent value="factory">
          <FactoryFloor />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>
        
        <TabsContent value="shipping">
          <ShippingDepartment />
        </TabsContent>
        
        <TabsContent value="hr">
          <HRDepartment />
        </TabsContent>
        
        <TabsContent value="finance">
          <FinanceDepartment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
