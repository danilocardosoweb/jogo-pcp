
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';
import { Banknote, Calculator, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import { toast } from 'sonner';

const FinanceDepartment: React.FC = () => {
  const { state, dispatch } = useGame();
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [loanDuration, setLoanDuration] = useState<number>(30);
  
  // Available loan options based on game progression
  const loanOptions = [
    { amount: 10000, interestRate: 0.10, duration: 30, label: 'Pequeno' },
    { amount: 25000, interestRate: 0.08, duration: 60, label: 'Médio' },
    { amount: 50000, interestRate: 0.06, duration: 90, label: 'Grande' },
  ];
  
  const handleTakeLoan = (amount: number, duration: number, interestRate: number) => {
    dispatch({ 
      type: 'TAKE_LOAN', 
      loanAmount: amount, 
      duration, 
      interestRate 
    });
    toast.success(`Empréstimo de ${formatMoney(amount)} aprovado!`);
  };
  
  // Calculate total payment and daily payment for a loan option
  const calculateLoanPayments = (amount: number, duration: number, interestRate: number) => {
    const totalInterest = amount * interestRate * (duration / 365);
    const totalPayment = amount + totalInterest;
    const dailyPayment = totalPayment / duration;
    
    return { totalPayment, dailyPayment };
  };
  
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl pixel-font text-game-primary">Departamento Financeiro</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <PixelCard className="bg-green-100 border-2 border-green-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg pixel-font text-green-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Saldo Atual
            </h3>
          </div>
          <p className="text-2xl font-bold text-green-900">{formatMoney(state.money)}</p>
        </PixelCard>
        
        <PixelCard className="bg-blue-100 border-2 border-blue-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg pixel-font text-blue-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Renda Diária
            </h3>
          </div>
          <p className="text-lg text-blue-900">
            Pedidos: +{formatMoney(state.stats.totalEarned / Math.max(1, state.day - 1))}/dia
          </p>
        </PixelCard>
        
        <PixelCard className="bg-amber-100 border-2 border-amber-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg pixel-font text-amber-800 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Despesas Diárias
            </h3>
          </div>
          <p className="text-lg text-amber-900">
            Salários: -{formatMoney(state.workers.reduce((sum, w) => sum + w.salary, 0))}/dia
          </p>
          {state.loans.length > 0 && (
            <p className="text-lg text-amber-900">
              Empréstimos: -{formatMoney(state.loans.reduce((sum, l) => sum + l.dailyPayment, 0))}/dia
            </p>
          )}
        </PixelCard>
      </div>
      
      {/* Loan System */}
      <PixelCard className="mb-6 border-2 border-blue-500">
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl pixel-font text-blue-800">Sistema de Empréstimos</h3>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <p className="pixel-text text-blue-700">
              Empréstimos são uma forma rápida de obter capital para sua fábrica. 
              Lembre-se que você terá que pagar parcelas diárias até quitar a dívida.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loanOptions.map((option) => {
            const { totalPayment, dailyPayment } = calculateLoanPayments(
              option.amount, 
              option.duration, 
              option.interestRate
            );
            
            const canTakeLoan = state.loans.length === 0; // Only one active loan at a time
            
            return (
              <PixelCard 
                key={option.label} 
                className={`border ${canTakeLoan ? 'border-blue-300' : 'border-gray-300 opacity-70'}`}
              >
                <h4 className="pixel-text font-bold text-blue-800 mb-2">
                  Empréstimo {option.label}
                </h4>
                <ul className="space-y-1 mb-3">
                  <li className="text-sm pixel-text">
                    <span className="font-bold">Valor:</span> {formatMoney(option.amount)}
                  </li>
                  <li className="text-sm pixel-text">
                    <span className="font-bold">Taxa de juros:</span> {(option.interestRate * 100).toFixed(1)}% ao ano
                  </li>
                  <li className="text-sm pixel-text">
                    <span className="font-bold">Duração:</span> {option.duration} dias
                  </li>
                  <li className="text-sm pixel-text">
                    <span className="font-bold">Pagamento diário:</span> {formatMoney(dailyPayment)}
                  </li>
                  <li className="text-sm pixel-text">
                    <span className="font-bold">Total a pagar:</span> {formatMoney(totalPayment)}
                  </li>
                </ul>
                
                <PixelButton
                  variant="success"
                  size="sm"
                  className="w-full"
                  disabled={!canTakeLoan}
                  onClick={() => handleTakeLoan(option.amount, option.duration, option.interestRate)}
                >
                  {canTakeLoan ? 'Solicitar Empréstimo' : 'Já possui empréstimo ativo'}
                </PixelButton>
              </PixelCard>
            );
          })}
        </div>
      </PixelCard>
      
      {/* Active Loans */}
      {state.loans.length > 0 && (
        <PixelCard className="border-2 border-amber-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-amber-600" />
            <h3 className="text-xl pixel-font text-amber-800">Empréstimos Ativos</h3>
          </div>
          
          <div className="space-y-4">
            {state.loans.map((loan) => (
              <div key={loan.id} className="border rounded-md p-3 bg-amber-50 border-amber-200">
                <div className="flex justify-between mb-2">
                  <span className="font-bold pixel-text text-amber-800">
                    Empréstimo de {formatMoney(loan.amount)}
                  </span>
                  <span className="pixel-text text-amber-700">
                    {loan.remainingDays} dias restantes
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="pixel-text text-amber-700">Pagamento diário:</span>
                    <span className="pixel-text text-amber-800">{formatMoney(loan.dailyPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-text text-amber-700">Já pago:</span>
                    <span className="pixel-text text-amber-800">
                      {formatMoney(loan.totalPaid)} 
                      ({((loan.totalPaid / loan.totalToPay) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-text text-amber-700">Total a pagar:</span>
                    <span className="pixel-text text-amber-800">{formatMoney(loan.totalToPay)}</span>
                  </div>
                </div>
                
                <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${(loan.totalPaid / loan.totalToPay) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </PixelCard>
      )}
    </div>
  );
};

export default FinanceDepartment;
