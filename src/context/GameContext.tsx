import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  GameState, 
  GameAction, 
  Resource, 
  Product, 
  Machine, 
  Order,
  Worker,
  PlayerCharacter,
  ResourceType,
  ProductType,
  MachineType,
  MachineStatus,
  WorkerStatus,
  WorkerSkillType,
  OrderStatus
} from '@/types/game';

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

// Initial resources
const initialResources: Resource[] = [
  { type: 'metal', name: 'Metal', quantity: 100, max: 200, cost: 10, icon: '🔧' },
  { type: 'plastic', name: 'Plastic', quantity: 100, max: 200, cost: 5, icon: '📦' },
  { type: 'electronics', name: 'Electronics', quantity: 80, max: 150, cost: 20, icon: '💾' },
  { type: 'glass', name: 'Glass', quantity: 50, max: 100, cost: 15, icon: '🔍' },
];

// Initial products
const initialProducts: Product[] = [
  {
    type: 'phone',
    name: 'Smartphone',
    requires: { metal: 2, plastic: 3, electronics: 5, glass: 1 },
    price: 300,
    productionTime: 3,
    icon: '📱',
  },
  {
    type: 'laptop',
    name: 'Laptop',
    requires: { metal: 5, plastic: 4, electronics: 7, glass: 2 },
    price: 500,
    productionTime: 5,
    icon: '💻',
  },
  {
    type: 'tablet',
    name: 'Tablet',
    requires: { metal: 3, plastic: 3, electronics: 4, glass: 3 },
    price: 350,
    productionTime: 4,
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

// Generate a random worker
const generateRandomWorker = (day: number): Worker => {
  const skillTypes: WorkerSkillType[] = ['assembly', 'packaging', 'quality'];
  const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
  const randomName = workerNames[Math.floor(Math.random() * workerNames.length)];
  const skillLevel = Math.floor(Math.random() * 3) + 1;
  
  return {
    id: `w${Date.now()}${Math.floor(Math.random() * 1000)}`,
    name: randomName,
    skill: randomSkill,
    skillLevel,
    motivation: 70 + Math.floor(Math.random() * 31),
    salary: 100 + (skillLevel * 50),
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

// Generate a random order
const generateOrder = (day: number): Order => {
  const products: ProductType[] = ['phone', 'laptop', 'tablet'];
  const productType = products[Math.floor(Math.random() * products.length)];
  const quantity = Math.floor(Math.random() * 5) + 1;
  const deadline = day + Math.floor(Math.random() * 10) + 5;
  const basePrice = {
    'phone': 300,
    'laptop': 500,
    'tablet': 350
  }[productType] || 300;
  
  return {
    id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    product: productType,
    quantity,
    deadline,
    reward: quantity * basePrice * 1.2, // 20% profit margin
    status: 'pending',
    completed: 0
  };
};

// Generate initial orders
const generateInitialOrders = (day: number, count: number = 3): Order[] => {
  return Array.from({ length: count }, () => generateOrder(day));
};

// Initial game state
const initialState: GameState = {
  day: 1,
  money: 50000,
  resources: initialResources,
  products: initialProducts,
  machines: initialMachines,
  availableOrders: generateInitialOrders(1),
  completedOrders: [],
  workers: [],
  availableWorkers: generateInitialWorkers(1, 3),
  simulationStarted: false,
  gamePace: 1.0,
  character: null,
  morale: 80,
  loans: [],
  inventory: {
    phone: 0,
    tablet: 0,
    laptop: 0
  },
  stats: {
    ordersCompleted: 0,
    ordersLate: 0,
    machinesRepaired: 0,
    workersHired: 0,
    workersMotivated: 0,
    loansTaken: 0,
    totalProduced: 0,
    totalEarned: 0,
    ordersFailed: 0
  }
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_SIMULATION': {
      return {
        ...state,
        simulationStarted: true,
        gamePace: 1.0
      };
    }
    
    case 'TICK': {
      // Update game state on each tick
      const newState = { ...state };
      newState.day = state.day + 1;
      
      // Update machine production
      newState.machines = state.machines.map(machine => {
        if (machine.status === 'working' && machine.currentProduct) {
          const product = state.products.find(p => p.type === machine.currentProduct);
          if (product) {
            let productionIncrease = machine.productionSpeed * machine.efficiency;
            
            // Apply worker bonuses
            let workerSpeedBonus = 0;
            let workerQualityBonus = 0;
            
            machine.assignedWorkers.forEach(worker => {
              const skillMultiplier = worker.skill === machine.type ? 1.5 : 1;
              const motivationFactor = worker.motivation / 100;
              
              workerSpeedBonus += (worker.skillLevel * 0.1 * skillMultiplier * motivationFactor);
              workerQualityBonus += (worker.skillLevel * 0.15 * skillMultiplier * motivationFactor);
            });
            
            if (machine.assignedWorkers.length > 1) {
              workerSpeedBonus = workerSpeedBonus * Math.sqrt(machine.assignedWorkers.length);
            }
            
            productionIncrease *= (1 + workerSpeedBonus);
            
            // Update progress
            machine.progress += productionIncrease;
            
            // Check for completion
            if (machine.progress >= machine.maxProgress) {
              machine.progress = 0;
              machine.status = 'idle';
              
              // Add produced item to inventory
              newState.inventory[machine.currentProduct] += 1;
              newState.stats.totalProduced += 1;
              
              // Clear current product
              machine.currentProduct = undefined;
            }
          }
        }
        return machine;
      });
      
      // Update orders
      const updatedOrders = state.availableOrders.map(order => {
        if (order.status === 'completed' || order.status === 'failed' || order.status === 'rejected') {
          return order;
        }
        
        // Check if order is late
        if (state.day > order.deadline && order.status === 'pending') {
          newState.stats.ordersLate += 1;
          return {
            ...order,
            status: 'failed'
          };
        }
        
        // Check if we can complete the order
        if (order.status === 'pending' && state.inventory[order.product] >= order.quantity) {
          // Remove products from inventory
          newState.inventory[order.product] -= order.quantity;
          
          // Add reward
          newState.money += order.reward;
          newState.stats.totalEarned += order.reward;
          newState.stats.ordersCompleted += 1;
          
          return {
            ...order,
            status: 'completed',
            completed: order.quantity
          };
        }
        
        return order;
      });
      
      // Move completed/failed orders
      const activeOrders = updatedOrders.filter(o => o.status === 'pending' || o.status === 'in-progress');
      const completedOrders = [
        ...state.completedOrders,
        ...updatedOrders.filter(o => o.status === 'completed' || o.status === 'failed' || o.status === 'rejected')
      ];
      
      // Generate new orders occasionally
      if (Math.random() > 0.7 && activeOrders.length < 5) {
        activeOrders.push(generateOrder(state.day));
      }
      
      // Update worker motivation and morale
      const updatedWorkers = state.workers.map(worker => {
        // Workers lose motivation over time
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
      
      // Calculate overall factory morale
      let newMorale = state.morale;
      if (updatedWorkers.length > 0) {
        const avgMotivation = updatedWorkers.reduce((sum, w) => sum + w.motivation, 0) / updatedWorkers.length;
        newMorale = state.morale + (avgMotivation - state.morale) * 0.1;
        newMorale = Math.max(0, Math.min(100, newMorale));
      }
      
      // Pay daily salaries
      let totalSalaries = 0;
      updatedWorkers.forEach(worker => {
        totalSalaries += worker.salary;
      });
      
      return {
        ...newState,
        money: newState.money - totalSalaries,
        availableOrders: activeOrders,
        completedOrders,
        workers: updatedWorkers,
        morale: newMorale
      };
    }
    
    case 'ACCEPT_ORDER': {
      const { orderId } = action;
      const orderIndex = state.availableOrders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const updatedOrders = state.availableOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'in-progress' as OrderStatus }
          : order
      );
      
      return {
        ...state,
        availableOrders: updatedOrders
      };
    }
    
    case 'REJECT_ORDER': {
      const { orderId } = action;
      const orderIndex = state.availableOrders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const updatedOrders = state.availableOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'rejected' as OrderStatus }
          : order
      );
      
      return {
        ...state,
        availableOrders: updatedOrders.filter(o => o.status !== 'rejected'),
        completedOrders: [
          ...state.completedOrders,
          ...updatedOrders.filter(o => o.status === 'rejected')
        ]
      };
    }
    
    case 'ASSIGN_MACHINE': {
      const { machineId, productType } = action;
      const machineIndex = state.machines.findIndex(m => m.id === machineId);
      
      if (machineIndex === -1) return state;
      
      const machine = state.machines[machineIndex];
      const product = state.products.find(p => p.type === productType);
      
      if (!product) return state;
      
      // Check if we have enough resources
      const hasResources = Object.entries(product.requires).every(([type, amount]) => {
        const resource = state.resources.find(r => r.type === type as ResourceType);
        return resource && resource.quantity >= (amount || 0);
      });
      
      if (!hasResources) return state;
      
      // Consume resources
      const updatedResources = state.resources.map(resource => {
        const required = product.requires[resource.type] || 0;
        return {
          ...resource,
          quantity: resource.quantity - required
        };
      });
      
      // Update machine
      const updatedMachines = [...state.machines];
      updatedMachines[machineIndex] = {
        ...machine,
        status: 'working',
        currentProduct: productType,
        progress: 0,
        maxProgress: product.productionTime * 100
      };
      
      return {
        ...state,
        resources: updatedResources,
        machines: updatedMachines
      };
    }
    
    case 'HIRE_WORKER': {
      const { workerId } = action;
      const worker = state.availableWorkers.find(w => w.id === workerId);
      
      if (!worker) return state;
      
      const hiringCost = worker.salary * 5; // Initial hiring cost
      
      if (state.money < hiringCost) return state;
      
      return {
        ...state,
        money: state.money - hiringCost,
        workers: [...state.workers, worker],
        availableWorkers: state.availableWorkers.filter(w => w.id !== workerId),
        stats: {
          ...state.stats,
          workersHired: state.stats.workersHired + 1
        }
      };
    }
    
    case 'ASSIGN_WORKER': {
      const { workerId, machineId } = action;
      const worker = state.workers.find(w => w.id === workerId);
      const machine = state.machines.find(m => m.id === machineId);
      
      if (!worker || !machine) return state;
      
      // Remove worker from any previous machine
      const updatedMachines = state.machines.map(m => ({
        ...m,
        assignedWorkers: m.id === machineId 
          ? [...m.assignedWorkers, worker]
          : m.assignedWorkers.filter(w => w.id !== workerId)
      }));
      
      const updatedWorkers = state.workers.map(w => 
        w.id === workerId ? { ...w, machineId } : w
      );
      
      return {
        ...state,
        machines: updatedMachines,
        workers: updatedWorkers
      };
    }
    
    case 'UNASSIGN_WORKER': {
      const { workerId } = action;
      const worker = state.workers.find(w => w.id === workerId);
      
      if (!worker || !worker.machineId) return state;
      
      const updatedMachines = state.machines.map(m => ({
        ...m,
        assignedWorkers: m.assignedWorkers.filter(w => w.id !== workerId)
      }));
      
      const updatedWorkers = state.workers.map(w => 
        w.id === workerId ? { ...w, machineId: undefined } : w
      );
      
      return {
        ...state,
        machines: updatedMachines,
        workers: updatedWorkers
      };
    }
    
    case 'MOTIVATE_WORKER': {
      const { workerId, amount } = action;
      const worker = state.workers.find(w => w.id === workerId);
      
      if (!worker) return state;
      
      const motivationCost = 50 * amount;
      
      if (state.money < motivationCost) return state;
      
      const updatedWorkers = state.workers.map(w => {
        if (w.id === workerId) {
          const newMotivation = Math.min(100, w.motivation + amount * 10);
          return {
            ...w,
            motivation: newMotivation,
            status: newMotivation > 30 ? 'working' : 'unmotivated'
          };
        }
        return w;
      });
      
      return {
        ...state,
        money: state.money - motivationCost,
        workers: updatedWorkers,
        stats: {
          ...state.stats,
          workersMotivated: state.stats.workersMotivated + 1
        }
      };
    }
    
    default:
      return state;
  }
};

// Create context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Game provider component
const GameProvider = React.memo(({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const ticker = setInterval(() => {
      if (state.simulationStarted) {
        dispatch({ type: 'TICK' });
      }
    }, 10000); // Changed from 1000ms to 10000ms (10 seconds)
    return () => clearInterval(ticker);
  }, [state.simulationStarted]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
});

GameProvider.displayName = 'GameProvider';

// Custom hook for accessing game state and dispatch
const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { GameProvider, useGame };
