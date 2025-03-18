import React, { createContext, useContext, useReducer } from 'react';

// Interview question interface
export interface InterviewQuestion {
  id: number;
  question: string;
  options: {
    id: number;
    text: string;
    score: number;
  }[];
}

// Interview state interface
export interface InterviewState {
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: InterviewQuestion[];
  score: number;
  isPassed: boolean;
  isCompleted: boolean;
  hasClockIn: boolean;
}

// Initial interview questions
const initialQuestions: InterviewQuestion[] = [
  {
    id: 1,
    question: "Qual é o principal objetivo do Planejamento e Controle da Produção (PCP)?",
    options: [
      { id: 1, text: "Aumentar o número de funcionários", score: 0 },
      { id: 2, text: "Otimizar recursos e garantir que a produção atenda à demanda no prazo", score: 10 },
      { id: 3, text: "Focar apenas na redução de custos", score: 3 },
      { id: 4, text: "Aumentar o estoque de produtos acabados", score: 1 }
    ]
  },
  {
    id: 2,
    question: "O que é MRP (Material Requirements Planning)?",
    options: [
      { id: 1, text: "Um método de precificação de produtos", score: 0 },
      { id: 2, text: "Um sistema de planejamento de recursos humanos", score: 0 },
      { id: 3, text: "Um sistema que calcula necessidades de materiais baseado na demanda", score: 10 },
      { id: 4, text: "Uma estratégia de marketing para produtos industriais", score: 0 }
    ]
  },
  {
    id: 3,
    question: "Qual destes NÃO é um indicador típico de desempenho em PCP?",
    options: [
      { id: 1, text: "Lead time", score: 0 },
      { id: 2, text: "Taxa de ocupação das máquinas", score: 0 },
      { id: 3, text: "Nível de rotatividade de funcionários", score: 10 },
      { id: 4, text: "Nível de estoque", score: 0 }
    ]
  },
  {
    id: 4,
    question: "O que é um gargalo de produção?",
    options: [
      { id: 1, text: "Um problema na comunicação entre departamentos", score: 0 },
      { id: 2, text: "Um recurso cuja capacidade é menor que a demanda", score: 10 },
      { id: 3, text: "Um excesso de matéria-prima", score: 0 },
      { id: 4, text: "Um problema de qualidade do produto", score: 2 }
    ]
  },
  {
    id: 5,
    question: "Qual é o método de sequenciamento que prioriza tarefas com menor tempo de processamento?",
    options: [
      { id: 1, text: "FIFO (First In, First Out)", score: 0 },
      { id: 2, text: "Regra da data prometida", score: 0 },
      { id: 3, text: "SPT (Shortest Processing Time)", score: 10 },
      { id: 4, text: "Regra do cliente prioritário", score: 0 }
    ]
  },
];

// Initial interview state
const initialState: InterviewState = {
  currentQuestionIndex: 0,
  totalQuestions: initialQuestions.length,
  questions: initialQuestions,
  score: 0,
  isPassed: false,
  isCompleted: false,
  hasClockIn: false,
};

// Action types
type InterviewAction =
  | { type: 'ANSWER_QUESTION'; optionId: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET_INTERVIEW' }
  | { type: 'CLOCK_IN' };

// Reducer function
const interviewReducer = (state: InterviewState, action: InterviewAction): InterviewState => {
  switch (action.type) {
    case 'ANSWER_QUESTION': {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const selectedOption = currentQuestion.options.find(option => option.id === action.optionId);
      
      if (!selectedOption) return state;
      
      const newScore = state.score + selectedOption.score;
      const isLastQuestion = state.currentQuestionIndex === state.totalQuestions - 1;
      
      return {
        ...state,
        score: newScore,
        isCompleted: isLastQuestion ? true : state.isCompleted,
        isPassed: isLastQuestion ? newScore >= 30 : state.isPassed, // Pontuação mínima para passar
      };
    }
    
    case 'NEXT_QUESTION': {
      if (state.currentQuestionIndex >= state.totalQuestions - 1) {
        return state;
      }
      
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    }
    
    case 'RESET_INTERVIEW': {
      return initialState;
    }
    
    case 'CLOCK_IN': {
      return {
        ...state,
        hasClockIn: true,
      };
    }
    
    default:
      return state;
  }
};

// Create context
type InterviewContextType = {
  state: InterviewState;
  dispatch: React.Dispatch<InterviewAction>;
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

// Context provider
export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(interviewReducer, initialState);
  
  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
};

// Custom hook to use the interview context
export const useInterview = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
