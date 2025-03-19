import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  DollarSign, 
  Clock 
} from 'lucide-react';

const Indicators: React.FC = () => {
  const { state } = useGame();

  // Dados fictícios para demonstração (substituir com dados reais do contexto do jogo)
  const productionData = [
    { name: 'Dia 1', Produção: 50, Meta: 60 },
    { name: 'Dia 2', Produção: 55, Meta: 60 },
    { name: 'Dia 3', Produção: 65, Meta: 60 },
    { name: 'Dia 4', Produção: 58, Meta: 60 },
    { name: 'Dia 5', Produção: 70, Meta: 60 },
  ];

  const calculatePerformanceIndicators = () => {
    return {
      productionEfficiency: Math.round((state.producedItems / state.plannedItems) * 100),
      employeeSatisfaction: Math.round(Math.random() * 100), // Placeholder
      profitMargin: Math.round((state.money / state.totalRevenue) * 100),
      averageProductionTime: Math.round(state.averageProductionTime)
    };
  };

  const indicators = calculatePerformanceIndicators();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Indicador de Eficiência de Produção */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium pixel-text">Eficiência de Produção</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold pixel-text">{indicators.productionEfficiency}%</div>
          <p className="text-xs text-muted-foreground pixel-text">
            {indicators.productionEfficiency >= 80 ? 'Excelente' : 'Precisa Melhorar'}
          </p>
        </CardContent>
      </Card>

      {/* Indicador de Satisfação dos Funcionários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium pixel-text">Satisfação dos Funcionários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold pixel-text">{indicators.employeeSatisfaction}%</div>
          <p className="text-xs text-muted-foreground pixel-text">
            {indicators.employeeSatisfaction >= 70 ? 'Motivados' : 'Baixa Motivação'}
          </p>
        </CardContent>
      </Card>

      {/* Indicador de Margem de Lucro */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium pixel-text">Margem de Lucro</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold pixel-text">{indicators.profitMargin}%</div>
          <p className="text-xs text-muted-foreground pixel-text">
            {indicators.profitMargin >= 30 ? 'Saudável' : 'Baixa Rentabilidade'}
          </p>
        </CardContent>
      </Card>

      {/* Indicador de Tempo Médio de Produção */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium pixel-text">Tempo Médio de Produção</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold pixel-text">{indicators.averageProductionTime} min</div>
          <p className="text-xs text-muted-foreground pixel-text">
            {indicators.averageProductionTime <= 45 ? 'Eficiente' : 'Lento'}
          </p>
        </CardContent>
      </Card>

      {/* Gráfico de Produção */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="pixel-text">Histórico de Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Produção" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Meta" 
                stroke="#82ca9d" 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Indicators;
