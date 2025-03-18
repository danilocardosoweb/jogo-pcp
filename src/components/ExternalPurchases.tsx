import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { toast } from 'sonner';
import NegotiationResult from './NegotiationResult';

interface Supplier {
  id: number;
  name: string;
  products: {
    type: string;
    name: string;
    price: number;
    deliveryDays: number;
    quantity: number;
  }[];
}

const ExternalPurchases: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [negotiationPrice, setNegotiationPrice] = useState<number>(0);
  const [negotiationDays, setNegotiationDays] = useState<number>(0);
  const [negotiationQuantity, setNegotiationQuantity] = useState<number>(0);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  // Gera fornecedores aleatórios com preços e prazos diferentes
  const generateSuppliers = (): Supplier[] => {
    const suppliers: Supplier[] = [];
    const supplierNames = ['TechFab Solutions', 'GlobalTech Industries', 'SmartDevice Co.'];
    
    supplierNames.forEach((name, index) => {
      const supplier: Supplier = {
        id: index + 1,
        name,
        products: state.products.map(product => ({
          type: product.type,
          name: product.name,
          price: Math.floor(product.price * (0.8 + Math.random() * 0.4)), // 80-120% do preço base
          deliveryDays: Math.floor(3 + Math.random() * 5), // 3-7 dias
          quantity: Math.floor(10 + Math.random() * 40) // 10-50 unidades
        }))
      };
      suppliers.push(supplier);
    });
    
    return suppliers;
  };

  const suppliers = generateSuppliers();

  const handleNegotiate = (supplier: Supplier, product: any) => {
    setSelectedSupplier(supplier.id);
    setSelectedProduct(product);
    setNegotiationPrice(product.price);
    setNegotiationDays(product.deliveryDays);
    setNegotiationQuantity(1);
    setShowNegotiation(true);
  };

  const handleSubmitNegotiation = () => {
    if (!selectedProduct || !selectedSupplier) return;

    const basePrice = selectedProduct.price;
    const baseDays = selectedProduct.deliveryDays;
    
    // Calcula a probabilidade de aceitação baseada no preço e prazo propostos
    const priceRatio = negotiationPrice / basePrice;
    const daysRatio = negotiationDays / baseDays;
    
    // Rejeita automaticamente se o preço proposto for menor que 80% do preço base
    if (priceRatio < 0.8) {
      setIsAccepted(false);
      setShowResult(true);
      setShowNegotiation(false);
      return;
    }
    
    const acceptanceProbability = 
      (priceRatio >= 0.8 ? (priceRatio <= 1.2 ? 1 : 0.5) : 0) * 
      (daysRatio >= 0.8 ? (daysRatio <= 1.5 ? 1 : 0.7) : 0.4);
    
    const accepted = Math.random() < acceptanceProbability;
    setIsAccepted(accepted);
    setShowResult(true);

    if (accepted) {
      dispatch({
        type: 'EXTERNAL_PURCHASE',
        payload: {
          productType: selectedProduct.type,
          quantity: negotiationQuantity,
          price: negotiationPrice,
          deliveryDays: negotiationDays
        }
      });
      toast.success('Proposta aceita! O produto será entregue em breve.', {
        className: 'pixel-text bg-game-bg border-2 border-game-primary text-white'
      });
    } else {
      toast.error('Proposta recusada. Tente outros valores.', {
        className: 'pixel-text bg-game-bg border-2 border-game-primary text-white'
      });
    }

    setShowNegotiation(false);
  };

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-2xl pixel-font text-game-primary mb-4">Compras Externas</h2>
      <p className="pixel-text text-game-secondary mb-4">
        Compre produtos acabados de outras fábricas para atender à demanda rapidamente
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suppliers.map(supplier => (
          <PixelCard key={supplier.id} className="supplier">
            <h3 className="pixel-text font-bold text-lg mb-4">{supplier.name}</h3>
            
            <div className="space-y-4">
              {supplier.products.map(product => (
                <div key={product.type} className="border-b border-game-secondary pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="pixel-text">{product.name}</span>
                    <span className="pixel-text text-game-primary">R${product.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="pixel-text text-sm">Prazo de entrega:</span>
                    <span className="pixel-text text-sm">{product.deliveryDays} dias</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="pixel-text text-sm">Disponível:</span>
                    <span className="pixel-text text-sm">{product.quantity} unidades</span>
                  </div>
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleNegotiate(supplier, product)}
                  >
                    Negociar
                  </PixelButton>
                </div>
              ))}
            </div>
          </PixelCard>
        ))}
      </div>

      {showNegotiation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PixelCard className="w-full max-w-md">
            <h3 className="pixel-text font-bold text-lg mb-4">Negociação</h3>
            
            <div className="space-y-4">
              <div>
                <label className="pixel-text block mb-2">Quantidade:</label>
                <input
                  type="number"
                  className="pixel-input w-full"
                  min="1"
                  max={selectedProduct?.quantity || 1}
                  value={negotiationQuantity}
                  onChange={(e) => setNegotiationQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <label className="pixel-text block mb-2">Preço por unidade (R$):</label>
                <input
                  type="number"
                  className="pixel-input w-full"
                  min="1"
                  value={negotiationPrice}
                  onChange={(e) => setNegotiationPrice(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="pixel-text block mb-2">Prazo de entrega (dias):</label>
                <input
                  type="number"
                  className="pixel-input w-full"
                  min="1"
                  value={negotiationDays}
                  onChange={(e) => setNegotiationDays(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <PixelButton
                  variant="primary"
                  className="flex-1"
                  onClick={handleSubmitNegotiation}
                >
                  Enviar Proposta
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowNegotiation(false)}
                >
                  Cancelar
                </PixelButton>
              </div>
            </div>
          </PixelCard>
        </div>
      )}
      <NegotiationResult 
        isOpen={showResult}
        isAccepted={isAccepted}
        onClose={() => setShowResult(false)}
      />
    </div>
  );
};

export default ExternalPurchases;
