import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PlayerCharacter } from '@/types/game';
import { toast } from 'sonner';

// Resource types
export type ResourceType = 'metal' | 'plastic' | 'electronics' | 'glass';

// Product types
export type ProductType = 'phone' | 'laptop' | 'tablet' | 'smartwatch' | 'earbuds' | 'console';

// Machine types
export type MachineType = 'assembly' | 'packaging' | 'quality';

// Machine status type
export type MachineStatus = 'idle' | 'working' | 'maintenance' | 'packaging' | 'quality';

// Order status type
export type OrderStatus = 'pending' | 'in_production' | 'completed' | 'failed' | 'rejected';

// Worker skill types
export type WorkerSkillType = 'assembly' | 'packaging' | 'quality';

// Worker status
export type WorkerStatus = 'working' | 'tired' | 'unmotivated';

// Loan type
export interface Loan {
  id: string;
  amount: number;
  interestRate: number; // Annual interest rate (e.g., 0.1 for 10%)
  duration: number; // In days
  remainingDays: number;
  dailyPayment: number;
  totalPaid: number;
  totalToPay: number;
}

// Resources interface
export interface Resource {
  type: ResourceType;
  name: string;
  quantity: number;
  max: number;
  cost: number;
  icon: string;
}

// Product interface
export interface Product {
  type: ProductType;
  name: string;
  requires: { [key in ResourceType]?: number };
  price: number;
  productionTime: number;
  icon: string;
}

// Machine interface
export interface Machine {
  id: string;
  type: MachineType;
  name: string;
  status: MachineStatus;
  efficiency: number;
  level: number;
  productionSpeed: number;
  currentProduct?: ProductType;
  progress: number;
  maxProgress: number;
  icon: string;
  hasDefect: boolean;
  boosterActive?: boolean;
  boosterEndDay?: number;
  assignedTo?: string; // ID do pedido ao qual a máquina está atribuída
  assignedWorkers: Worker[];
}

// Worker interface
export interface Worker {
  id: string;
  name: string;
  skill: WorkerSkillType;
  skillLevel: number;
  motivation: number; // 0-100
  salary: number;
  status: WorkerStatus;
  icon: string;
  hireDay: number;
  machineId?: string; // Reference to the machine they're assigned to
}

// Order interface
export interface ProductionOrder {
  id: string;
  product: ProductType;
  quantity: number;
  completed: number;
  deadline: number;
  status: OrderStatus;
  reward: number;
  progress: number;
  efficiency: number;
}

// Game state interface
export interface GameState {
  money: number;
  day: number;
  simulationStarted: boolean; // Flag to track if simulation has started
  character: PlayerCharacter | null;
  resources: Resource[];
  products: Product[];
  unlockedProducts: ProductType[];
  machines: Machine[];
  orders: ProductionOrder[];
  availableOrders: ProductionOrder[];
  inventory: {[key in ProductType]: number};
  gamePace: number;
  workers: Worker[];
  availableWorkers: Worker[];
  morale: number; // Overall factory morale (0-100)
  loans: Loan[]; // Available and active loans
  stats: {
    totalProduced: number;
    totalEarned: number;
    ordersCompleted: number;
    ordersFailed: number;
    ordersRejected: number;
    defectsFixed: number;
    defectsDiscarded: number;
    workersHired: number;
    workersMotivated: number;
    loansTaken: number;
  };
}

// Action types
type GameAction =
  | { type: 'BUY_RESOURCE'; resourceType: ResourceType; amount: number }
  | { type: 'ASSIGN_MACHINE'; machineId: string; productType: ProductType }
  | { type: 'UNASSIGN_MACHINE'; machineId: string }
  | { type: 'UPGRADE_MACHINE'; machineId: string }
  | { type: 'ACCEPT_ORDER'; orderId: string }
  | { type: 'REJECT_ORDER'; orderId: string }
  | { type: 'START_PRODUCTION'; orderId: string }
  | { type: 'PAUSE_PRODUCTION'; orderId: string }
  | { type: 'TICK' }
  | { type: 'REPAIR_MACHINE'; machineId: string }
  | { type: 'SELL_PRODUCT'; productType: ProductType; amount: number }
  | { type: 'SET_PRODUCT_PRICE'; productType: ProductType; price: number }
  | { type: 'BUY_MACHINE'; machine: Machine }
  | { type: 'SET_CHARACTER'; character: PlayerCharacter }
  | { type: 'SHIP_PRODUCT'; orderId: string }
  | { type: 'FIX_DEFECT'; machineId: string }
  | { type: 'DISCARD_DEFECT'; machineId: string }
  | { type: 'ADJUST_GAME_PACE'; pace: number }
  | { type: 'APPLY_BOOSTER'; machineId: string; duration: number }
  | { type: 'HIRE_WORKER'; workerId: string }
  | { type: 'ASSIGN_WORKER'; workerId: string; machineId: string }
  | { type: 'UNASSIGN_WORKER'; workerId: string }
  | { type: 'MOTIVATE_WORKER'; workerId: string; amount: number }
  | { type: 'TRAIN_WORKER'; workerId: string }
  | { type: 'TAKE_LOAN'; loanAmount: number; duration: number; interestRate: number }
  | { type: 'START_SIMULATION' } // New action to start the simulation
  | { type: 'UNLOCK_PRODUCT'; productType: ProductType };

// Worker names pool
const workerNames = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Mariana', 'José', 'Fernanda', 
  'Paulo', 'Juliana', 'Roberto', 'Camila', 'Lucas', 'Amanda', 'Marcos', 'Patrícia', 
  'Ricardo', 'Natália', 'André', 'Beatriz', 'Felipe', 'Cristina', 'Bruno', 'Daniela'
];

// Worker skill icons
const skillIcons = {
  assembly: '🔧',
  packaging: '📦',
  quality: '🔍',
};

// Generate a random worker
const generateRandomWorker = (day: number): Worker => {
  const skillTypes: WorkerSkillType[] = ['assembly', 'packaging', 'quality'];
  const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
  const randomName = workerNames[Math.floor(Math.random() * workerNames.length)];
  const skillLevel = Math.floor(Math.random() * 3) + 1; // 1-3 initial skill level
  
  return {
    id: `w${Date.now()}${Math.floor(Math.random() * 1000)}`,
    name: randomName,
    skill: randomSkill,
    skillLevel,
    motivation: 70 + Math.floor(Math.random() * 31), // 70-100 initial motivation
    salary: 100 + (skillLevel * 50), // Base salary + skill bonus
    status: 'working',
    icon: skillIcons[randomSkill],
    hireDay: day,
  };
};

// Generate initial available workers
const generateInitialWorkers = (day: number, count: number = 3): Worker[] => {
  const workers: Worker[] = [];
  for (let i = 0; i < count; i++) {
    workers.push(generateRandomWorker(day));
  }
  return workers;
};

// Initial resources
const initialResources: Resource[] = [
  { type: 'metal', name: 'Metal', quantity: 100, max: 200, cost: 10, icon: '🔧' },
  { type: 'plastic', name: 'Plastic', quantity: 100, max: 200, cost: 5, icon: '📦' },
  { type: 'electronics', name: 'Electronics', quantity: 80, max: 150, cost: 20, icon: '💾' },
  { type: 'glass', name: 'Glass', quantity: 50, max: 100, cost: 15, icon: '🔍' },
];

// Initial products with adjusted production times
const initialProducts: Product[] = [
  {
    type: 'phone',
    name: 'Smartphone',
    requires: { metal: 2, plastic: 3, electronics: 5, glass: 1 },
    price: 300,
    productionTime: 0.2, // 5 por dia
    icon: '📱',
  },
  {
    type: 'laptop',
    name: 'Laptop',
    requires: { metal: 5, plastic: 4, electronics: 7, glass: 2 },
    price: 500,
    productionTime: 0.33, // 3 por dia
    icon: '💻',
  },
  {
    type: 'tablet',
    name: 'Tablet',
    requires: { metal: 3, plastic: 3, electronics: 4, glass: 3 },
    price: 350,
    productionTime: 0.25, // 4 por dia
    icon: '📲',
  },
];

// Novos produtos disponíveis para desbloqueio
export const unlockableProducts: Product[] = [
  {
    type: 'smartwatch',
    name: 'Smartwatch',
    requires: { metal: 1, plastic: 2, electronics: 3, glass: 1 },
    price: 200,
    productionTime: 0.2, // 5 por dia
    icon: '⌚',
  },
  {
    type: 'earbuds',
    name: 'Fones Sem Fio',
    requires: { metal: 1, plastic: 2, electronics: 2 },
    price: 150,
    productionTime: 0.17, // 6 por dia
    icon: '🎧',
  },
  {
    type: 'console',
    name: 'Console Portátil',
    requires: { metal: 4, plastic: 3, electronics: 6, glass: 2 },
    price: 450,
    productionTime: 0.25, // 4 por dia
    icon: '🎮',
  },
];

// Initial machines
const initialMachines: Machine[] = [
  {
    id: 'm1',
    type: 'assembly',
    name: 'Assembly Line 1',
    status: 'idle',
    efficiency: 1.0,
    level: 1,
    productionSpeed: 1,
    progress: 0,
    maxProgress: 100,
    icon: '🔨',
    hasDefect: false,
    assignedWorkers: [],
  },
  {
    id: 'm2',
    type: 'packaging',
    name: 'Packaging Unit 1',
    status: 'idle',
    efficiency: 1.0,
    level: 1,
    productionSpeed: 1,
    progress: 0,
    maxProgress: 100,
    icon: '📦',
    hasDefect: false,
    assignedWorkers: [],
  },
];

// Generate more reasonable order deadlines based on product complexity
const generateOrderDeadline = (productType: ProductType, currentDay: number): number => {
  const baseTime = {
    'phone': 8,  // Base time for phone
    'laptop': 12, // Base time for laptop
    'tablet': 10  // Base time for tablet
  }[productType] || 10;
  
  // Add some variability (5-10 days)
  const variability = Math.floor(Math.random() * 6) + 5;
  
  return currentDay + baseTime + variability;
};

// Sample orders
const createSampleOrders = (): ProductionOrder[] => {
  const orders: ProductionOrder[] = [];
  const products: ProductType[] = ['phone', 'laptop', 'tablet'];
  
  for (let i = 0; i < 3; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 50) + 10;
    const basePrice = product === 'phone' ? 1000 : product === 'laptop' ? 2000 : 1500;
    const reward = quantity * basePrice * (1 + Math.random() * 0.3); // Base price + up to 30% margin
    
    orders.push({
      id: `order_${Date.now()}_${i}`,
      product,
      quantity,
      completed: 0,
      deadline: Math.floor(Math.random() * 10) + 5, // 5-15 days
      status: 'pending',
      reward,
      progress: 0,
      efficiency: 0.8 + Math.random() * 0.4, // 80-120% efficiency
    });
  }
  
  return orders;
};

// Initial game state
const initialState: GameState = {
  money: 150000, // Increased initial capital to 150.000
  day: 1,
  simulationStarted: false, // New flag to track if simulation has started
  character: null,
  resources: initialResources,
  products: initialProducts,
  unlockedProducts: ['phone', 'laptop', 'tablet'],
  machines: initialMachines,
  orders: [],
  availableOrders: createSampleOrders(),
  inventory: {
    phone: 0,
    laptop: 0,
    tablet: 0,
    smartwatch: 0,
    earbuds: 0,
    console: 0
  },
  gamePace: 1, // Default game pace (1 = normal)
  workers: [],
  availableWorkers: generateInitialWorkers(1, 3),
  morale: 80, // Initial factory morale
  loans: [],
  stats: {
    totalProduced: 0,
    totalEarned: 0,
    ordersCompleted: 0,
    ordersFailed: 0,
    ordersRejected: 0,
    defectsFixed: 0,
    defectsDiscarded: 0,
    workersHired: 0,
    workersMotivated: 0,
    loansTaken: 0,
  },
};

// Função para calcular a eficiência do trabalhador
const calculateWorkerEfficiency = (worker: Worker): number => {
  const baseEfficiency = 0.5; // 50% de eficiência base
  const skillBonus = worker.skillLevel * 0.1; // Cada nível adiciona 10%
  const motivationBonus = (worker.motivation / 100) * 0.5; // Motivação máxima adiciona 50%
  
  return Math.min(baseEfficiency + skillBonus + motivationBonus, 1.5); // Máximo de 150% de eficiência
};

// Função para calcular a capacidade produtiva total
const calculateTotalProductionCapacity = (state: GameState): number => {
  const workingMachines = state.machines.filter(m => m.status === 'working').length;
  const totalWorkerEfficiency = state.workers.reduce((acc, worker) => acc + calculateWorkerEfficiency(worker), 0);
  
  return Math.floor(workingMachines * (totalWorkerEfficiency / state.workers.length) * 10); // Cada máquina pode produzir até 10 itens por dia
};

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'BUY_RESOURCE': {
      const { resourceType, amount } = action;
      const resourceIndex = state.resources.findIndex((r) => r.type === resourceType);
      
      if (resourceIndex === -1) return state;
      
      const resource = state.resources[resourceIndex];
      const cost = resource.cost * amount;
      
      if (state.money < cost) return state;
      if (resource.quantity + amount > resource.max) return state;
      
      const updatedResources = [...state.resources];
      updatedResources[resourceIndex] = {
        ...resource,
        quantity: resource.quantity + amount,
      };
      
      return {
        ...state,
        money: state.money - cost,
        resources: updatedResources,
      };
    }
    
    case 'ASSIGN_MACHINE': {
      const { machineId, productType } = action;
      return {
        ...state,
        machines: state.machines.map((machine) =>
          machine.id === machineId
            ? {
                ...machine,
                currentProduct: productType,
                status: 'working',
                assignedTo: state.orders.find(o => o.product === productType)?.id
              }
            : machine
        ),
      };
    }
    
    case 'UNASSIGN_MACHINE': {
      const { machineId } = action;
      const machineIndex = state.machines.findIndex((m) => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...state.machines[machineIndex],
        status: 'idle',
        currentProduct: undefined,
        progress: 0,
      };
      
      return {
        ...state,
        machines: updatedMachines,
      };
    }
    
    case 'UPGRADE_MACHINE': {
      const { machineId } = action;
      const machineIndex = state.machines.findIndex((m) => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const machine = state.machines[machineIndex];
      const upgradeCost = machine.level * 1000;
      
      if (state.money < upgradeCost) return state;
      
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...machine,
        level: machine.level + 1,
        efficiency: machine.efficiency + 0.1,
        productionSpeed: machine.productionSpeed + 0.2,
      };
      
      return {
        ...state,
        money: state.money - upgradeCost,
        machines: updatedMachines,
      };
    }
    
    case 'ACCEPT_ORDER': {
      const { orderId } = action;
      const order = state.availableOrders.find(o => o.id === orderId);
      const updatedAvailableOrders = state.availableOrders.filter(o => o.id !== orderId);
      
      if (!order) return state;
      
      // Verifica se o prazo já expirou
      if (order.deadline - state.day <= 0) {
        toast.error('Não é possível aceitar pedidos com prazo expirado');
        return state;
      }
      
      return {
        ...state,
        orders: [...state.orders, { 
          ...order, 
          status: 'pending' as OrderStatus,
          progress: 0,
          efficiency: 0.8 + Math.random() * 0.4 // 80-120% efficiency
        }],
        availableOrders: updatedAvailableOrders,
      };
    }
    
    case 'REJECT_ORDER': {
      const { orderId } = action;
      const orderIndex = state.availableOrders.findIndex((o) => o.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const updatedAvailableOrders = state.availableOrders.filter((o) => o.id !== orderId);
      
      return {
        ...state,
        availableOrders: updatedAvailableOrders,
        stats: {
          ...state.stats,
          ordersRejected: state.stats.ordersRejected + 1
        }
      };
    }
    
    case 'REPAIR_MACHINE': {
      const { machineId } = action;
      const machineIndex = state.machines.findIndex((m) => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const machine = state.machines[machineIndex];
      const repairCost = machine.level * 200;
      
      if (state.money < repairCost) return state;
      
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...machine,
        status: 'idle',
        efficiency: 1.0,
      };
      
      return {
        ...state,
        money: state.money - repairCost,
        machines: updatedMachines,
      };
    }
    
    case 'SELL_PRODUCT': {
      const { productType, amount } = action;
      
      if (state.inventory[productType] < amount) return state;
      
      const product = state.products.find(p => p.type === productType);
      if (!product) return state;
      
      const revenue = product.price * amount;
      
      return {
        ...state,
        money: state.money + revenue,
        inventory: {
          ...state.inventory,
          [productType]: state.inventory[productType] - amount
        }
      };
    }
    
    case 'SHIP_PRODUCT': {
      const { orderId } = action;
      const orderIndex = state.orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      
      if (order.status !== 'completed') return state;
      
      const updatedOrders = state.orders.filter(o => o.id !== orderId);
      
      return {
        ...state,
        orders: updatedOrders
      };
    }
    
    case 'BUY_MACHINE': {
      const { machine } = action;
      const machineCost = machine.type === 'assembly' ? 3000 : 
                         machine.type === 'packaging' ? 2500 : 4000;
      
      if (state.money < machineCost) return state;
      
      return {
        ...state,
        money: state.money - machineCost,
        machines: [...state.machines, machine],
      };
    }
    
    case 'SET_CHARACTER': {
      return {
        ...state,
        character: action.character
      };
    }
    
    case 'FIX_DEFECT': {
      const { machineId } = action;
      const machineIndex = state.machines.findIndex((m) => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const machine = state.machines[machineIndex];
      const reworkCost = machine.level * 100;
      
      if (state.money < reworkCost) return state;
      
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...machine,
        hasDefect: false,
        status: 'working',
      };
      
      return {
        ...state,
        money: state.money - reworkCost,
        machines: updatedMachines,
        stats: {
          ...state.stats,
          defectsFixed: state.stats.defectsFixed + 1,
        },
      };
    }
    
    case 'DISCARD_DEFECT': {
      const { machineId } = action;
      const machineIndex = state.machines.findIndex((m) => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const machine = state.machines[machineIndex];
      
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...machine,
        hasDefect: false,
        status: 'idle',
        currentProduct: undefined,
        progress: 0,
      };
      
      return {
        ...state,
        machines: updatedMachines,
        stats: {
          ...state.stats,
          defectsDiscarded: state.stats.defectsDiscarded + 1,
        },
      };
    }
    
    case 'ADJUST_GAME_PACE': {
      return {
        ...state,
        gamePace: action.pace
      };
    }
    
    case 'APPLY_BOOSTER': {
      const { machineId, duration } = action;
      const machineIndex = state.machines.findIndex((m) => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const machine = state.machines[machineIndex];
      const boosterCost = machine.level * 150; // Cost depends on machine level
      
      if (state.money < boosterCost) return state;
      
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...machine,
        boosterActive: true,
        boosterEndDay: state.day + duration,
      };
      
      return {
        ...state,
        money: state.money - boosterCost,
        machines: updatedMachines,
      };
    }
    
    case 'HIRE_WORKER': {
      const { workerId } = action;
      const workerIndex = state.availableWorkers.findIndex(w => w.id === workerId);
      
      if (workerIndex === -1) return state;
      
      const worker = state.availableWorkers[workerIndex];
      
      // Check if we have enough money
      if (state.money < worker.salary * 5) return state; // Initial cost is 5x salary
      
      const updatedAvailableWorkers = state.availableWorkers.filter(w => w.id !== workerId);
      
      return {
        ...state,
        money: state.money - (worker.salary * 5), // Pay initial hiring cost
        workers: [...state.workers, worker],
        availableWorkers: updatedAvailableWorkers,
        stats: {
          ...state.stats,
          workersHired: state.stats.workersHired + 1
        }
      };
    }
    
    case 'ASSIGN_WORKER': {
      const { workerId, machineId } = action;
      const workerIndex = state.workers.findIndex(w => w.id === workerId);
      const machineIndex = state.machines.findIndex(m => m.id === machineId);
      
      if (workerIndex === -1 || machineIndex === -1) return state;
      
      const worker = state.workers[workerIndex];
      const machine = state.machines[machineIndex];
      
      // Remove worker from any previous machine
      const updatedMachines = state.machines.map(m => {
        if (m.id === machine.id) {
          return {
            ...m,
            assignedWorkers: [...m.assignedWorkers, worker]
          };
        } else if (m.assignedWorkers.some(w => w.id === worker.id)) {
          return {
            ...m,
            assignedWorkers: m.assignedWorkers.filter(w => w.id !== worker.id)
          };
        }
        return m;
      });
      
      const updatedWorkers = [...state.workers];
      updatedWorkers[workerIndex] = {
        ...worker,
        machineId
      };
      
      return {
        ...state,
        machines: updatedMachines,
        workers: updatedWorkers
      };
    }
    
    case 'UNASSIGN_WORKER': {
      const { workerId } = action;
      const workerIndex = state.workers.findIndex(w => w.id === workerId);
      
      if (workerIndex === -1) return state;
      
      const worker = state.workers[workerIndex];
      
      // No machine assigned
      if (!worker.machineId) return state;
      
      const updatedMachines = state.machines.map(m => {
        if (m.id === worker.machineId) {
          return {
            ...m,
            assignedWorkers: m.assignedWorkers.filter(w => w.id !== worker.id)
          };
        }
        return m;
      });
      
      const updatedWorkers = [...state.workers];
      updatedWorkers[workerIndex] = {
        ...worker,
        machineId: undefined
      };
      
      return {
        ...state,
        machines: updatedMachines,
        workers: updatedWorkers
      };
    }
    
    case 'MOTIVATE_WORKER': {
      const { workerId, amount } = action;
      const workerIndex = state.workers.findIndex(w => w.id === workerId);
      
      if (workerIndex === -1) return state;
      
      const worker = state.workers[workerIndex];
      const motivationCost = 50 * amount; // Cost to increase motivation
      
      if (state.money < motivationCost) return state;
      
      const newMotivation = Math.min(100, worker.motivation + (amount * 10));
      
      const updatedWorkers = [...state.workers];
      updatedWorkers[workerIndex] = {
        ...worker,
        motivation: newMotivation,
        status: newMotivation > 30 ? 'working' : 'unmotivated'
      };
      
      return {
        ...state,
        money: state.money - motivationCost,
        workers: updatedWorkers,
        morale: Math.min(100, state.morale + 2), // Slightly increase overall morale
        stats: {
          ...state.stats,
          workersMotivated: state.stats.workersMotivated + 1
        }
      };
    }
    
    case 'TRAIN_WORKER': {
      const { workerId } = action;
      const workerIndex = state.workers.findIndex(w => w.id === workerId);
      
      if (workerIndex === -1) return state;
      
      const worker = state.workers[workerIndex];
      const trainingCost = 200 * worker.skillLevel; // Cost increases with skill level
      
      if (state.money < trainingCost) return state;
      
      const updatedWorkers = [...state.workers];
      updatedWorkers[workerIndex] = {
        ...worker,
        skillLevel: worker.skillLevel + 1,
        motivation: Math.min(100, worker.motivation + 10) // Training also motivates
      };
      
      return {
        ...state,
        money: state.money - trainingCost,
        workers: updatedWorkers
      };
    }
    
    case 'TAKE_LOAN': {
      const { loanAmount, duration, interestRate } = action;
      
      // Calculate daily payment (simple interest calculation)
      const totalInterest = loanAmount * interestRate * (duration / 365); // Annual interest rate
      const totalToPay = loanAmount + totalInterest;
      const dailyPayment = totalToPay / duration;
      
      const newLoan: Loan = {
        id: `loan_${Date.now()}`,
        amount: loanAmount,
        interestRate,
        duration,
        remainingDays: duration,
        dailyPayment,
        totalPaid: 0,
        totalToPay,
      };
      
      return {
        ...state,
        money: state.money + loanAmount,
        loans: [...state.loans, newLoan],
        stats: {
          ...state.stats,
          loansTaken: state.stats.loansTaken + 1
        }
      };
    }
    
    case 'TICK': {
      // Primeiro, remove pedidos disponíveis com prazo expirado
      const currentAvailableOrders = state.availableOrders.filter(order => {
        const remainingDays = order.deadline - state.day;
        if (remainingDays <= 0) {
          toast.info(`Pedido expirado removido: ${order.product}`);
          return false;
        }
        return true;
      });
      
      // Generate new worker candidate every ~3 days
      const shouldGenerateNewWorker = Math.random() > 0.7 && state.availableWorkers.length < 5;
      let newAvailableWorkers = [...state.availableWorkers];
      
      if (shouldGenerateNewWorker) {
        newAvailableWorkers = [...newAvailableWorkers, generateRandomWorker(state.day)];
      }
      
      // Workers lose motivation over time
      const updatedWorkers = state.workers.map(worker => {
        // Calculate motivation loss (0.5-1.5 per day)
        const motivationLoss = 0.5 + Math.random();
        const newMotivation = Math.max(0, worker.motivation - motivationLoss);
        
        // Update worker status based on motivation
        let newStatus = worker.status;
        if (newMotivation < 20) {
          newStatus = 'unmotivated';
        } else if (newMotivation < 40) {
          newStatus = 'tired';
        } else {
          newStatus = 'working';
        }
        
        return {
          ...worker,
          motivation: newMotivation,
          status: newStatus
        };
      });
      
      // Calculate overall factory morale based on worker motivation
      let newMorale = state.morale;
      if (updatedWorkers.length > 0) {
        const avgMotivation = updatedWorkers.reduce((sum, w) => sum + w.motivation, 0) / 
                            Math.max(updatedWorkers.length, 1);
        // Slowly adjust morale towards avg motivation
        newMorale = state.morale + (avgMotivation - state.morale) * 0.1;
        newMorale = Math.max(0, Math.min(100, newMorale));
      }
      
      const updatedMachines = state.machines.map((machine) => {
        // Check if booster has expired
        let updatedMachine = { ...machine };
        if (machine.boosterActive && machine.boosterEndDay && machine.boosterEndDay <= state.day) {
          updatedMachine = {
            ...updatedMachine,
            boosterActive: false,
            boosterEndDay: undefined
          };
        }

        if (updatedMachine.status !== 'working' || !updatedMachine.currentProduct || updatedMachine.hasDefect) 
          return updatedMachine;
        
        const product = state.products.find((p) => p.type === updatedMachine.currentProduct);
        if (!product) return updatedMachine;

        // Verificar se há recursos suficientes para continuar a produção
        const hasEnoughResources = Object.entries(product.requires).every(([resourceType, amount]) => {
          const resource = state.resources.find(r => r.type === resourceType);
          return resource && resource.quantity >= amount;
        });

        if (!hasEnoughResources) {
          toast.error(`Recursos insuficientes para produzir ${product.name}`);
          return {
            ...updatedMachine,
            status: 'idle' as MachineStatus,
            progress: 0,
            currentProduct: undefined,
          };
        }

        // Calculate worker bonus
        let workerSpeedBonus = 0;
        let workerQualityBonus = 0;
        
        // Get assigned workers for this machine
        const assignedWorkers = updatedWorkers.filter(w => 
          w.machineId === updatedMachine.id && 
          state.machines.some(m => m.status === 'working' && m.assignedTo === updatedMachine.assignedTo)
        );
        
        assignedWorkers.forEach(worker => {
          // Calculate speed bonus based on skill relevance and level
          const isSkillRelevant = 
            (worker.skill === 'assembly' && updatedMachine.type === 'assembly') ||
            (worker.skill === 'packaging' && updatedMachine.type === 'packaging') ||
            (worker.skill === 'quality' && updatedMachine.type === 'quality');
          
          const skillMultiplier = isSkillRelevant ? 1.5 : 0.5;
          const motivationFactor = worker.motivation / 100;
          
          workerSpeedBonus += (worker.skillLevel * 0.2 * skillMultiplier * motivationFactor);
          workerQualityBonus += (worker.skillLevel * 0.15 * skillMultiplier * motivationFactor);
        });
        
        if (assignedWorkers.length > 1) {
          workerSpeedBonus = workerSpeedBonus * Math.sqrt(assignedWorkers.length);
        }

        let progressIncrement = (updatedMachine.productionSpeed * 5 + workerSpeedBonus) * updatedMachine.efficiency;
        
        if (updatedMachine.boosterActive) {
          progressIncrement *= 3;
        }

        progressIncrement = progressIncrement * state.gamePace;
        
        const newProgress = updatedMachine.progress + progressIncrement;
        
        const qualityFactor = Math.min(1, updatedMachine.efficiency + workerQualityBonus);
        const defectChance = Math.max(0.01, 0.15 - (qualityFactor * 0.12));
        const hasDefect = Math.random() < defectChance;
        
        if (newProgress >= updatedMachine.maxProgress) {
          // Consumir recursos necessários
          const updatedResources = state.resources.map(resource => {
            const requiredAmount = product.requires[resource.type as ResourceType];
            if (requiredAmount) {
              return {
                ...resource,
                quantity: Math.max(0, resource.quantity - requiredAmount)
              };
            }
            return resource;
          });
          
          // Atualizar recursos do estado
          state.resources = updatedResources;

          if (hasDefect) {
            return {
              ...updatedMachine,
              progress: updatedMachine.maxProgress,
              hasDefect: true,
            };
          }
          
          // Add the produced item to inventory when production completes
          const productType = updatedMachine.currentProduct!;
          state.inventory[productType] = (state.inventory[productType] || 0) + 1;
          state.stats.totalProduced += 1;
          
          return {
            ...updatedMachine,
            status: 'idle' as MachineStatus,
            progress: 0,
            currentProduct: undefined,
            hasDefect: false,
          };
        }
        
        return {
          ...updatedMachine,
          progress: newProgress,
        };
      });
      
      let moneyEarned = 0;
      let totalProduced = state.stats.totalProduced;
      let moneySpenOnSalaries = 0;
      
      // Pay salaries to workers
      updatedWorkers.forEach(worker => {
        moneySpenOnSalaries += worker.salary;
      });
      
      // Process loan payments
      let updatedLoans = [...state.loans];
      let loanPayments = 0;
      
      updatedLoans = updatedLoans.map(loan => {
        if (loan.remainingDays > 0) {
          loanPayments += loan.dailyPayment;
          return {
            ...loan,
            remainingDays: loan.remainingDays - 1,
            totalPaid: loan.totalPaid + loan.dailyPayment
          };
        }
        return loan;
      });
      
      // Remove fully paid loans
      updatedLoans = updatedLoans.filter(loan => loan.remainingDays > 0);
      
      // Atualiza eficiência dos trabalhadores em produção
      const updatedOrders = state.orders.map(order => {
        if (order.status === 'in_production') {
          // Encontra máquinas e trabalhadores atribuídos a este pedido
          const assignedMachines = state.machines.filter(m => m.assignedTo === order.id && m.status === 'working');
          const assignedWorkers = updatedWorkers.filter(w => 
            w.machineId && assignedMachines.some(m => m.id === w.machineId)
          );
          
          const totalEfficiency = assignedWorkers.reduce((acc, worker) => 
            acc + calculateWorkerEfficiency(worker), 0
          ) / Math.max(assignedWorkers.length, 1);
          
          const progressIncrease = totalEfficiency * (assignedWorkers.length > 0 ? 1 : 0);
          const newProgress = Math.min(order.progress + progressIncrease, order.quantity);
          
          return {
            ...order,
            progress: newProgress,
            efficiency: totalEfficiency,
            completed: Math.floor(newProgress),
            status: newProgress >= order.quantity ? 'completed' as OrderStatus : order.status
          };
        }
        return order;
      });
      
      // Gera novos pedidos com base na capacidade produtiva
      const productionCapacity = calculateTotalProductionCapacity(state);
      const currentOrdersLoad = state.orders.reduce((acc, order) => 
        acc + (order.quantity - order.completed), 0
      );
      const availableCapacity = Math.max(productionCapacity - currentOrdersLoad, 0);
      
      let newAvailableOrders = [...currentAvailableOrders];
      const shouldGenerateNewOrder = Math.random() < 0.3 && // 30% de chance por dia
                                   newAvailableOrders.length < 5 && // Máximo de 5 pedidos disponíveis
                                   availableCapacity > 0; // Só gera se houver capacidade
      
      if (shouldGenerateNewOrder) {
        const productType = state.products[Math.floor(Math.random() * state.products.length)].type;
        // Quantidade baseada na capacidade disponível
        const maxQuantity = Math.min(availableCapacity, 50);
        const quantity = Math.floor(Math.random() * (maxQuantity * 0.7)) + Math.ceil(maxQuantity * 0.3);
        
        // Prazo baseado na quantidade e eficiência média atual
        const avgEfficiency = updatedWorkers.reduce((acc, w) => acc + calculateWorkerEfficiency(w), 0) / 
                            Math.max(updatedWorkers.length, 1);
        const estimatedDays = Math.ceil((quantity / avgEfficiency) / 5); // Assume 5 itens por dia por máquina
        const deadline = state.day + Math.max(estimatedDays + 2, 5); // Mínimo de 5 dias
        
        const product = state.products.find(p => p.type === productType);
        if (!product) return state;
        
        const baseReward = quantity * product.price;
        const urgencyMultiplier = 1 + (0.5 * (10 / Math.max(deadline - state.day, 1))); // Mais urgente = maior recompensa
        
        const newOrder: ProductionOrder = {
          id: `order_${Date.now()}`,
          product: productType,
          quantity,
          completed: 0,
          deadline,
          status: 'pending',
          reward: Math.floor(baseReward * urgencyMultiplier),
          progress: 0,
          efficiency: 0
        };
        
        newAvailableOrders = [...newAvailableOrders, newOrder];
      }
      
      return {
        ...state,
        day: state.day + 1,
        money: state.money + moneyEarned - moneySpenOnSalaries - loanPayments,
        machines: updatedMachines,
        orders: updatedOrders,
        availableOrders: newAvailableOrders,
        workers: updatedWorkers,
        availableWorkers: newAvailableWorkers,
        morale: newMorale,
        loans: updatedLoans,
        stats: {
          ...state.stats,
          totalProduced,
          totalEarned: state.stats.totalEarned + moneyEarned,
          ordersCompleted: state.stats.ordersCompleted,
          ordersFailed: state.stats.ordersFailed,
          ordersRejected: state.stats.ordersRejected,
        },
      };
    }
    
    case 'SET_PRODUCT_PRICE': {
      const { productType, price } = action;
      const productIndex = state.products.findIndex(p => p.type === productType);
      
      if (productIndex === -1) return state;
      
      const updatedProducts = [...state.products];
      updatedProducts[productIndex] = {
        ...state.products[productIndex],
        price
      };
      
      return {
        ...state,
        products: updatedProducts
      };
    }
    
    case 'START_SIMULATION': {
      // Generate initial available orders
      const initialOrders = createSampleOrders();
      
      // Generate initial available workers
      const initialAvailableWorkers = generateInitialWorkers(state.day);
      
      return {
        ...state,
        simulationStarted: true,
        availableOrders: initialOrders,
        availableWorkers: initialAvailableWorkers,
        gamePace: 1.0 // Ensure game pace is set to normal speed
      };
    }
    
    case 'START_PRODUCTION': {
      const { orderId } = action;
      const orderIndex = state.orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      
      return {
        ...state,
        orders: state.orders.map((o, i) =>
          i === orderIndex ? { ...o, status: 'in_production' } : o
        ),
      };
    }
    
    case 'PAUSE_PRODUCTION': {
      const { orderId } = action;
      const orderIndex = state.orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      
      return {
        ...state,
        orders: state.orders.map((o, i) =>
          i === orderIndex ? { ...o, status: 'pending' } : o
        ),
      };
    }
    
    case 'UNLOCK_PRODUCT': {
      const { productType } = action;
      
      // Verificar se o produto já está desbloqueado
      if (state.unlockedProducts.includes(productType)) {
        toast.error('Este produto já está desbloqueado!');
        return state;
      }

      // Encontrar o produto nos produtos desbloqueáveis
      const productToUnlock = unlockableProducts.find(p => p.type === productType);
      if (!productToUnlock) {
        toast.error('Produto não encontrado!');
        return state;
      }

      // Custo para desbloquear o produto (baseado no preço)
      const unlockCost = productToUnlock.price * 100;
      if (state.money < unlockCost) {
        toast.error('Dinheiro insuficiente para desbloquear este produto!');
        return state;
      }

      toast.success(`${productToUnlock.name} desbloqueado com sucesso!`);

      return {
        ...state,
        money: state.money - unlockCost,
        products: [...state.products, productToUnlock],
        unlockedProducts: [...state.unlockedProducts, productType],
      };
    }
    
    default:
      return state;
  }
};

// Create context
type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Context provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  useEffect(() => {
    // Game loop timer
    const ticker = setInterval(() => {
      if (state.simulationStarted) {
        dispatch({ type: 'TICK' });
      }
    }, 5000); // Reduced to 5 seconds for better game pacing
    
    return () => clearInterval(ticker);
  }, [state.simulationStarted, state.day]); // Added state.day to dependencies
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
