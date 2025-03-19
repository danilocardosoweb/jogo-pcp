import React, { useState } from 'react';
import ResourceManagement from './ResourceManagement';
import ProductionPlanner from './ProductionPlanner';
import FactoryFloor from './FactoryFloor';
import InventoryManagement from './InventoryManagement';
import ShippingDepartment from './ShippingDepartment';
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
  Store,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Info
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { PixelButton } from './ui/PixelButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const { state, dispatch } = useGame();
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpSection, setHelpSection] = useState<string>('geral');
  
  const handleEndDay = () => {
    dispatch({ type: 'TICK' });
  };

  const openHelp = (section: string = 'geral') => {
    setHelpSection(section);
    setHelpOpen(true);
  };
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <div>
          <div className="flex flex-col items-center justify-center mb-4 sm:mb-8">
            <img 
              src="https://i.im.ge/2023/06/20/iZLJXM.logoDanilo.png" 
              alt="Logo Danilo" 
              className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-80 filter brightness-110 contrast-125"
            />
            <h1 className="text-2xl sm:text-3xl font-bold pixel-font text-game-primary">
              Fábrica Tech
            </h1>
          </div>
          <p className="pixel-text text-sm sm:text-base">Dia: {state.day} | Saldo: ${state.money.toLocaleString('pt-BR')}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <PixelButton 
            onClick={() => openHelp('geral')} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            icon={<HelpCircle className="h-4 w-4 text-game-primary" />}
          >
            Ajuda
          </PixelButton>
          <PixelButton onClick={handleEndDay} variant="warning">
            Avançar um Dia
          </PixelButton>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-8">
        <TabsList className="mb-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 sm:gap-2 bg-transparent">
          <TabsTrigger 
            value="resources" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'resources' 
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab('resources');
            }}
          >
            <Database className="h-3 w-3 sm:h-4 sm:w-4" /> Recursos
          </TabsTrigger>
          <TabsTrigger 
            value="commercial" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'commercial' 
                ? 'bg-orange-100 text-orange-800 border-2 border-orange-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Store className="h-3 w-3 sm:h-4 sm:w-4" /> Comercial
          </TabsTrigger>
          <TabsTrigger 
            value="production" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'production' 
                ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Factory className="h-3 w-3 sm:h-4 sm:w-4" /> Planejamento
          </TabsTrigger>
          <TabsTrigger 
            value="factory" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'factory' 
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Warehouse className="h-3 w-3 sm:h-4 sm:w-4" /> Fábrica
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'inventory' 
                ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="h-3 w-3 sm:h-4 sm:w-4" /> Inventário
          </TabsTrigger>
          <TabsTrigger 
            value="shipping" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'shipping' 
                ? 'bg-purple-100 text-purple-800 border-2 border-purple-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TruckIcon className="h-3 w-3 sm:h-4 sm:w-4" /> Envios
          </TabsTrigger>
          <TabsTrigger 
            value="hr" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'hr' 
                ? 'bg-pink-100 text-pink-800 border-2 border-pink-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" /> RH
          </TabsTrigger>
          <TabsTrigger 
            value="finance" 
            className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm font-medium ${
              activeTab === 'finance' 
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" /> Finanças
          </TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end mb-2">
          {activeTab === 'resources' && (
            <PixelButton 
              onClick={() => openHelp('recursos')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: Recursos
            </PixelButton>
          )}
          {activeTab === 'commercial' && (
            <PixelButton 
              onClick={() => openHelp('comercial')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: Comercial
            </PixelButton>
          )}
          {activeTab === 'production' && (
            <PixelButton 
              onClick={() => openHelp('planejamento')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: Planejamento
            </PixelButton>
          )}
          {activeTab === 'factory' && (
            <PixelButton 
              onClick={() => openHelp('fabrica')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: Fábrica
            </PixelButton>
          )}
          {activeTab === 'inventory' && (
            <PixelButton 
              onClick={() => openHelp('inventario')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: Inventário
            </PixelButton>
          )}
          {activeTab === 'shipping' && (
            <PixelButton 
              onClick={() => openHelp('envios')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: Envios
            </PixelButton>
          )}
          {activeTab === 'hr' && (
            <PixelButton 
              onClick={() => openHelp('rh')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: RH
            </PixelButton>
          )}
          {activeTab === 'finance' && (
            <PixelButton 
              onClick={() => openHelp('financas')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              icon={<Lightbulb className="h-3 w-3 text-yellow-500" />}
            >
              Dicas: Finanças
            </PixelButton>
          )}
        </div>
        
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

      {/* Modal de Ajuda e Instruções */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white border-4 border-game-primary max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl pixel-font text-black flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-game-primary" />
              Manual do Jogo: Fábrica Tech
            </DialogTitle>
            <DialogDescription className="pixel-text text-gray-800">
              Instruções e dicas para ajudar você a gerenciar sua fábrica com eficiência.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex space-x-2 mb-4">
              <PixelButton 
                onClick={() => setHelpSection('geral')} 
                variant={helpSection === 'geral' ? 'default' : 'outline'} 
                size="sm"
              >
                Geral
              </PixelButton>
              <PixelButton 
                onClick={() => setHelpSection('recursos')} 
                variant={helpSection === 'recursos' ? 'default' : 'outline'} 
                size="sm"
              >
                Recursos
              </PixelButton>
              <PixelButton 
                onClick={() => setHelpSection('fabrica')} 
                variant={helpSection === 'fabrica' ? 'default' : 'outline'} 
                size="sm"
              >
                Fábrica
              </PixelButton>
              <PixelButton 
                onClick={() => setHelpSection('planejamento')} 
                variant={helpSection === 'planejamento' ? 'default' : 'outline'} 
                size="sm"
              >
                Planejamento
              </PixelButton>
            </div>
            
            {helpSection === 'geral' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="text-lg font-bold pixel-text text-blue-900 mb-2">Bem-vindo à Fábrica Tech!</h3>
                  <p className="pixel-text text-blue-900 mb-2">
                    Neste jogo, você assumirá o papel de um gestor de Planejamento e Controle de Produção (PCP) 
                    em uma fábrica de produtos eletrônicos. Seu objetivo é gerenciar recursos, otimizar a produção 
                    e maximizar os lucros.
                  </p>
                  <p className="pixel-text text-blue-900">
                    A versão atual do jogo é <span className="font-bold">v1.005</span> (19/03/2025).
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Como Jogar</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>1. <span className="font-bold">Compre recursos</span> na aba "Recursos" para abastecer sua fábrica.</p>
                      <p>2. <span className="font-bold">Aceite pedidos</span> na aba "Comercial" para começar a produzir.</p>
                      <p>3. <span className="font-bold">Planeje a produção</span> na aba "Planejamento" para organizar seus pedidos.</p>
                      <p>4. <span className="font-bold">Configure suas máquinas</span> na aba "Fábrica" para iniciar a produção.</p>
                      <p>5. <span className="font-bold">Gerencie seu inventário</span> na aba "Inventário" para acompanhar os produtos finalizados.</p>
                      <p>6. <span className="font-bold">Envie os produtos</span> na aba "Envios" para completar os pedidos e receber pagamento.</p>
                      <p>7. <span className="font-bold">Contrate funcionários</span> na aba "RH" para melhorar a eficiência da produção.</p>
                      <p>8. <span className="font-bold">Gerencie suas finanças</span> na aba "Finanças" para acompanhar receitas e despesas.</p>
                      <p>9. <span className="font-bold">Avance o dia</span> com o botão "Avançar um Dia" para progredir no jogo.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Fluxo de Produção</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>O fluxo de produção segue três etapas principais:</p>
                      <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-2">
                        <p className="font-bold text-amber-900">Assembly Line (Linha de Montagem)</p>
                        <p className="text-amber-900">Primeira etapa onde os componentes são montados.</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-2">
                        <p className="font-bold text-blue-900">Packaging Unit (Unidade de Embalagem)</p>
                        <p className="text-blue-900">Segunda etapa onde os produtos são embalados.</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-md border border-green-200">
                        <p className="font-bold text-green-900">Quality Control (Controle de Qualidade)</p>
                        <p className="text-green-900">Etapa final onde os produtos são inspecionados antes de ir para o inventário.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Dicas Gerais</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>• <span className="font-bold">Equilibre recursos</span>: Não compre recursos em excesso para não imobilizar capital.</p>
                      <p>• <span className="font-bold">Priorize pedidos</span>: Foque em pedidos com maior margem de lucro ou prazos mais curtos.</p>
                      <p>• <span className="font-bold">Mantenha as máquinas</span>: Faça manutenção regular para evitar defeitos.</p>
                      <p>• <span className="font-bold">Contrate estrategicamente</span>: Funcionários aumentam a eficiência, mas também os custos.</p>
                      <p>• <span className="font-bold">Monitore o fluxo de caixa</span>: Mantenha um olho nas suas finanças para evitar problemas.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {helpSection === 'recursos' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="text-lg font-bold pixel-text text-blue-900 mb-2">Gerenciamento de Recursos</h3>
                  <p className="pixel-text text-blue-900">
                    Nesta seção, você gerencia os recursos necessários para fabricar seus produtos.
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Como Funciona</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>• Você pode comprar quatro tipos de recursos: Metal, Plástico, Eletrônicos e Vidro.</p>
                      <p>• Cada produto requer uma combinação específica desses recursos.</p>
                      <p>• Os recursos têm um limite máximo de armazenamento.</p>
                      <p>• Os preços dos recursos podem variar ao longo do tempo.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Dicas de Recursos</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>• <span className="font-bold">Compre com antecedência</span>: Tenha sempre recursos suficientes para seus pedidos planejados.</p>
                      <p>• <span className="font-bold">Evite estoques excessivos</span>: Recursos parados representam capital imobilizado.</p>
                      <p>• <span className="font-bold">Monitore o consumo</span>: Observe quais recursos são mais utilizados para planejar compras futuras.</p>
                      <p>• <span className="font-bold">Compre em lotes</span>: Comprar grandes quantidades pode ser mais econômico a longo prazo.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {helpSection === 'fabrica' && (
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                  <h3 className="text-lg font-bold pixel-text text-amber-900 mb-2">Chão de Fábrica</h3>
                  <p className="pixel-text text-amber-900">
                    O coração da sua operação, onde as máquinas transformam recursos em produtos.
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Fluxo de Produção</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>1. <span className="font-bold">Inicie a produção</span> clicando no botão "Iniciar Produção" em uma máquina de Assembly Line.</p>
                      <p>2. Selecione o produto que deseja fabricar no modal que aparece.</p>
                      <p>3. A produção começará e o produto passará automaticamente para as próximas etapas (Packaging e Quality Control).</p>
                      <p>4. Quando o produto completar todas as etapas, será adicionado ao seu inventário.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Tipos de Máquinas</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <div className="bg-amber-50 p-2 rounded-md border border-amber-200 mb-2">
                        <p className="font-bold text-amber-900">Assembly Line (Linha de Montagem)</p>
                        <p className="text-amber-900">Onde você inicia a produção. Consome recursos para criar o produto base.</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-md border border-blue-200 mb-2">
                        <p className="font-bold text-blue-900">Packaging Unit (Unidade de Embalagem)</p>
                        <p className="text-blue-900">Prepara o produto para distribuição, adicionando embalagem e proteção.</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded-md border border-green-200">
                        <p className="font-bold text-green-900">Quality Control (Controle de Qualidade)</p>
                        <p className="text-green-900">Verifica se o produto atende aos padrões de qualidade antes de ir para o inventário.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Manutenção e Melhorias</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>• <span className="font-bold">Manutenção</span>: Clique no botão "Manutenção" para melhorar a eficiência e reduzir defeitos.</p>
                      <p>• <span className="font-bold">Upgrade</span>: Melhora permanentemente o nível da máquina, aumentando sua velocidade e eficiência.</p>
                      <p>• <span className="font-bold">Booster</span>: Aplica um aumento temporário de velocidade por 5 dias.</p>
                      <p>• <span className="font-bold">Retrabalho/Descartar</span>: Quando ocorrem defeitos, você pode retrabalhar o produto ou descartá-lo.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Dicas para o Chão de Fábrica</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>• <span className="font-bold">Balanceie sua linha</span>: Tenha um número equilibrado de cada tipo de máquina.</p>
                      <p>• <span className="font-bold">Manutenção preventiva</span>: Faça manutenção regular para evitar defeitos que atrasam a produção.</p>
                      <p>• <span className="font-bold">Priorize upgrades</span>: Máquinas de nível mais alto produzem mais rápido e com menos defeitos.</p>
                      <p>• <span className="font-bold">Atribua trabalhadores estrategicamente</span>: Coloque trabalhadores com habilidades específicas nas máquinas correspondentes.</p>
                      <p>• <span className="font-bold">Use boosters em momentos críticos</span>: Aplique boosters quando precisar acelerar para cumprir prazos apertados.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {helpSection === 'planejamento' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <h3 className="text-lg font-bold pixel-text text-green-900 mb-2">Planejamento de Produção</h3>
                  <p className="pixel-text text-green-900">
                    Organize e priorize seus pedidos para maximizar a eficiência da produção.
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Como Planejar a Produção</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>• Analise os pedidos disponíveis e aceitos na aba "Comercial".</p>
                      <p>• Priorize pedidos com base em prazos, penalidades e lucros potenciais.</p>
                      <p>• Verifique a disponibilidade de recursos para cada pedido.</p>
                      <p>• Inicie a produção na aba "Fábrica" de acordo com seu planejamento.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="pixel-text font-bold text-gray-900">Dicas de Planejamento</AccordionTrigger>
                    <AccordionContent className="pixel-text text-gray-900 space-y-2">
                      <p>• <span className="font-bold">Priorize pedidos com prazos curtos</span>: Evite penalidades por atraso.</p>
                      <p>• <span className="font-bold">Considere a capacidade produtiva</span>: Não aceite mais pedidos do que sua fábrica pode processar.</p>
                      <p>• <span className="font-bold">Agrupe produtos similares</span>: Produzir o mesmo tipo de produto em sequência pode ser mais eficiente.</p>
                      <p>• <span className="font-bold">Mantenha um buffer</span>: Deixe alguma capacidade livre para emergências ou oportunidades.</p>
                      <p>• <span className="font-bold">Planeje compras de recursos</span>: Antecipe as necessidades de recursos para evitar atrasos.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <PixelButton onClick={() => setHelpOpen(false)}>Fechar</PixelButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
