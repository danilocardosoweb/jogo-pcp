import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PlayerCharacter } from '@/types/game';

// Resource types
export type ResourceType = 'metal' | 'plastic' | 'electronics' | 'glass';

// Product types
export type ProductType = 'phone' | 'laptop' | 'tablet';

// Machine types
export type MachineType = 'assembly' | 'packaging' | 'quality';

// Machine status type
export type MachineStatus = 'idle' | 'working' | 'maintenance' | 'packaging' | 'quality';

// Order status type
export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'rejected';

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
}

// Game state interface
export interface GameState {
  money: number;
  day: number;
  simulationStarted: boolean; // Flag to track if simulation has started
  character: PlayerCharacter | null;
  resources: Resource[];
  products: Product[];
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
;

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

// Initial products - Reduced production time for faster manufacturing
const initialProducts: Product[] = [
  {
    type: 'phone',
    name: 'Smartphone',
    requires: { metal: 2, plastic: 3, electronics: 5, glass: 1 },
    price: 300,
    productionTime: 3, // Reduced from 6
    icon: '📱',
  },
  {
    type: 'laptop',
    name: 'Laptop',
    requires: { metal: 5, plastic: 4, electronics: 7, glass: 2 },
    price: 500,
    productionTime: 5, // Reduced from 10
    icon: '💻',
  },
  {
    type: 'tablet',
    name: 'Tablet',
    requires: { metal: 3, plastic: 3, electronics: 4, glass: 3 },
    price: 350,
    productionTime: 4, // Reduced from 8
    icon: '📲',
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
const createSampleOrders = (): ProductionOrder[] => [
  {
    id: 'o1',
    product: 'phone',
    quantity: 5,
    completed: 0,
    deadline: 15, // Much more reasonable deadline
    status: 'pending',
    reward: 5 * (300 * 1.2), // 5 phones com preço 300 + 20% imposto
  },
  {
    id: 'o2',
    product: 'laptop',
    quantity: 3,
    completed: 0,
    deadline: 20,
    status: 'pending',
    reward: 3 * (600 * 1.2), // 3 laptops com preço 600 + 20% imposto
  },
  {
    id: 'o3',
    product: 'tablet',
    quantity: 4,
    completed: 0,
    deadline: 18,
    status: 'pending',
    reward: 4 * (400 * 1.2), // 4 tablets com preço 400 + 20% imposto
  },
];

// Initial game state
const initialState: GameState = {
  money: 50000, // Increased from 5000 to 50000
  day: 1,
  simulationStarted: false, // New flag to track if simulation has started
  character: null,
  resources: initialResources,
  products: initialProducts,
  machines: initialMachines,
  orders: [],
  availableOrders: createSampleOrders(),
  inventory: {
    phone: 0,
    laptop: 0,
    tablet: 0
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
      const machineIndex = state.machines.findIndex((m) => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const product = state.products.find((p) => p.type === productType);
      if (!product) return state;
      
      const canProduce = Object.entries(product.requires).every(([resourceType, amount]) => {
        const resource = state.resources.find((r) => r.type === resourceType as ResourceType);
        return resource && resource.quantity >= (amount as number);
      });
      
      if (!canProduce) return state;
      
      const updatedResources = state.resources.map((resource) => {
        const required = product.requires[resource.type] || 0;
        return {
          ...resource,
          quantity: resource.quantity - required,
        };
      });
      
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...state.machines[machineIndex],
        status: 'working',
        currentProduct: productType,
        progress: 0,
        maxProgress: product.productionTime * 100,
      };
      
      return {
        ...state,
        resources: updatedResources,
        machines: updatedMachines,
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
      const orderIndex = state.availableOrders.findIndex((o) => o.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const order = state.availableOrders[orderIndex];
      const updatedAvailableOrders = state.availableOrders.filter((o) => o.id !== orderId);
      
      return {
        ...state,
        orders: [...state.orders, { ...order, status: 'in-progress' as OrderStatus }],
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
        const avgMotivation = updatedWorkers.reduce((sum, w) => sum + w.motivation, 0) / updatedWorkers.length;
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

        // Calculate worker bonus
        let workerSpeedBonus = 0;
        let workerQualityBonus = 0;
        
        // Get assigned workers for this machine
        const assignedWorkers = updatedWorkers.filter(w => w.machineId === updatedMachine.id);
        
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
      
      // Adjust inventory based on completed products
      const updatedInventory = { ...state.inventory };
      
      state.machines.forEach(machine => {
        // Calculate progress increment based on boosters, game pace, and workers
        let progressIncrement = machine.productionSpeed * 3; // Increased base speed
        
        // Add worker speed bonus
        const assignedWorkers = updatedWorkers.filter(w => w.machineId === machine.id);
        assignedWorkers.forEach(worker => {
          const isSkillRelevant = 
            (worker.skill === 'assembly' && machine.type === 'assembly') ||
            (worker.skill === 'packaging' && machine.type === 'packaging') ||
            (worker.skill === 'quality' && machine.type === 'quality');
          
          const skillMultiplier = isSkillRelevant ? 1.5 : 0.5;
          const motivationFactor = worker.motivation / 100;
          
          progressIncrement += (worker.skillLevel * 0.2 * skillMultiplier * motivationFactor);
        });
        
        // More workers = more production, but with diminishing returns
        if (assignedWorkers.length > 1) {
          progressIncrement = progressIncrement * Math.sqrt(assignedWorkers.length);
        }
        
        progressIncrement *= machine.efficiency;
        
        if (machine.boosterActive) {
          progressIncrement *= 3;
        }

        // Apply game pace adjustment
        progressIncrement = progressIncrement * state.gamePace;
        
        if (machine.status === 'working' && machine.currentProduct && !machine.hasDefect &&
            machine.progress + progressIncrement >= machine.maxProgress) {
          updatedInventory[machine.currentProduct] += 1;
          totalProduced += 1;
        }
      });
      
      let ordersCompleted = state.stats.ordersCompleted;
      let ordersFailed = state.stats.ordersFailed;
      
      const updatedOrders = state.orders.map((order) => {
        if (order.status === 'completed' || order.status === 'failed') return order;
        
        const product = state.products.find((p) => p.type === order.product);
        if (!product) return order;
        
        const inventoryAmount = updatedInventory[order.product];
        const neededAmount = Math.min(order.quantity - order.completed, inventoryAmount);
        
        if (neededAmount > 0) {
          updatedInventory[order.product] -= neededAmount;
          const newCompleted = order.completed + neededAmount;
          
          if (newCompleted >= order.quantity) {
            moneyEarned += order.reward;
            ordersCompleted += 1;
            return {
              ...order,
              completed: order.quantity,
              status: 'completed' as OrderStatus,
            };
          }
          
          return {
            ...order,
            completed: newCompleted,
          };
        }
        
        if (state.day >= order.deadline) {
          ordersFailed += 1;
          return {
            ...order,
            status: 'failed' as OrderStatus,
          };
        }
        
        return order;
      });
      
      const shouldGenerateNewOrder = Math.random() > 0.7;
      let newAvailableOrders = [...state.availableOrders];
      
      if (shouldGenerateNewOrder && newAvailableOrders.length < 5) {
        const productType = state.products[Math.floor(Math.random() * state.products.length)].type;
        const quantity = Math.floor(Math.random() * 5) + 3;
        // Generate more reasonable deadline based on the product type and current day
        const deadline = generateOrderDeadline(productType, state.day);
        const product = state.products.find(p => p.type === productType);
        
        const newOrder: ProductionOrder = {
          id: `o${Date.now()}`,
          product: productType,
          quantity,
          completed: 0,
          deadline,
          status: 'pending' as OrderStatus,
          reward: product ? quantity * (product.price * 1.2) : 1000, // Incluindo 20% de imposto no valor da NF
        };
        
        newAvailableOrders = [...newAvailableOrders, newOrder];
      }
      
      return {
        ...state,
        day: state.day + 1,
        money: state.money + moneyEarned - moneySpenOnSalaries - loanPayments,
        machines: updatedMachines,
        orders: updatedOrders,
        inventory: updatedInventory,
        availableOrders: newAvailableOrders,
        workers: updatedWorkers,
        availableWorkers: newAvailableWorkers,
        morale: newMorale,
        loans: updatedLoans,
        stats: {
          ...state.stats,
          totalProduced,
          totalEarned: state.stats.totalEarned + moneyEarned,
          ordersCompleted,
          ordersFailed,
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
