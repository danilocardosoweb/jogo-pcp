import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PixelButton } from './ui/PixelButton';
import { Clock, X, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { OrderStatus } from '@/context/GameContext';

interface CustomerComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  deadline: number;
}

// Imagens dos clientes
const customerImages = [
  '/assets/customers/Cliente_01.png',
  '/assets/customers/Cliente_02.png',
  '/assets/customers/Cliente_03.png',
  '/assets/customers/Cliente_04.png',
];

// Textos de reclamação para cada cliente
const complaintTexts = [
  "Isso é inaceitável! Minha empresa está parada esperando essa entrega. Vocês têm noção do prejuízo que estão me causando?",
  "Eu confiei na sua empresa e vocês me decepcionaram. Como vou explicar esse atraso para os meus clientes agora?",
  "Já é a segunda vez que isso acontece! Estou considerando seriamente mudar de fornecedor se não resolverem essa situação.",
  "Precisava desse material com urgência! Agora todo meu cronograma está comprometido. O que vocês vão fazer a respeito?"
];

const CustomerComplaintModal: React.FC<CustomerComplaintModalProps> = ({ 
  open, 
  onOpenChange, 
  orderId,
  deadline
}) => {
  const { state, dispatch } = useGame();
  const [timeLeft, setTimeLeft] = useState(30);
  const [customerIndex, setCustomerIndex] = useState(0);

  // Encontrar o pedido correspondente
  const order = state.orders.find(o => o.id === orderId);
  
  // Seleciona uma imagem e texto de reclamação aleatória ao abrir o modal
  useEffect(() => {
    if (open) {
      setCustomerIndex(Math.floor(Math.random() * customerImages.length));
      setTimeLeft(30);
    }
  }, [open]);

  // Timer de 30 segundos
  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCancelOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [open]);

  // Função para negociar novo prazo
  const handleNegotiate = () => {
    if (!order) return;
    
    // Adiciona 3 dias ao prazo, mas aplica uma penalidade de 20% no valor
    const newDeadline = state.day + 3;
    const penaltyAmount = Math.round(order.reward * 0.2);
    
    // Atualiza o pedido com o novo prazo e penalidade
    dispatch({ 
      type: 'UPDATE_ORDER_DEADLINE', 
      orderId,
      newDeadline,
      penaltyAmount
    });
    
    toast.success('Novo prazo negociado com sucesso!');
    onOpenChange(false);
  };

  // Função para cancelar o pedido
  const handleCancelOrder = () => {
    if (!order) return;
    
    // Aplica uma penalidade financeira por cancelar o pedido
    const penaltyAmount = Math.round(order.reward * 0.5);
    
    // Deduz a penalidade do dinheiro do jogador
    dispatch({ 
      type: 'CANCEL_DELAYED_ORDER', 
      orderId,
      penaltyAmount
    });
    
    toast.error(`Pedido cancelado! Penalidade aplicada: R$ ${penaltyAmount.toLocaleString()}`);
    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-4 border-red-500">
        <DialogHeader>
          <DialogTitle className="text-xl pixel-font text-red-600">Cliente Insatisfeito!</DialogTitle>
          <DialogDescription className="pixel-text text-gray-800">
            O prazo de entrega do pedido expirou e o cliente está reclamando.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-red-400">
              <img 
                src={customerImages[customerIndex]} 
                alt="Cliente insatisfeito" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="pixel-text text-red-800 italic">
                "{complaintTexts[customerIndex]}"
              </p>
            </div>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <h3 className="font-bold pixel-text text-amber-800 mb-2">Detalhes do Pedido:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="pixel-text text-sm text-amber-800">
                  Prazo expirado há {state.day - order.deadline} dias
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarClock className="w-4 h-4 text-amber-600" />
                <span className="pixel-text text-sm text-amber-800">
                  Produto: {order.product}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold pixel-text text-blue-800">Tempo para decidir:</h3>
              <div className="px-3 py-1 bg-blue-100 rounded-full">
                <span className="pixel-text text-blue-800 font-bold">{timeLeft}s</span>
              </div>
            </div>
            <p className="pixel-text text-sm text-blue-700 mt-1">
              Você precisa tomar uma decisão em {timeLeft} segundos ou o pedido será automaticamente cancelado.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <PixelButton 
            variant="danger" 
            onClick={handleCancelOrder}
            icon={<X className="w-4 h-4" />}
          >
            Cancelar Pedido
          </PixelButton>
          <PixelButton 
            variant="primary" 
            onClick={handleNegotiate}
            icon={<CalendarClock className="w-4 h-4" />}
          >
            Negociar Novo Prazo
          </PixelButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerComplaintModal;
