// Game types and interfaces
export enum GamePhase {
  WELCOME = 'welcome',
  CHARACTER_SELECTION = 'character_selection',
  INTERVIEW = 'interview',
  FACTORY = 'factory'
}

export type PlayerCharacterType = 'male' | 'female';

// Base types
export type ResourceType = 'metal' | 'plastic' | 'electronics' | 'glass';
export type ProductType = 'phone' | 'laptop' | 'tablet';
export type MachineType = 'assembly' | 'packaging' | 'quality';
export type MachineStatus = 'idle' | 'working' | 'maintenance' | 'broken';
export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'rejected';
export type WorkerSkillType = 'assembly' | 'packaging' | 'quality';
export type WorkerStatus = 'working' | 'tired' | 'unmotivated';

export interface PlayerCharacter {
  type: PlayerCharacterType;
  name: string;
  image: string;
}

export interface Resource {
  type: ResourceType;
  name: string;
  icon: string;
  quantity: number;
  max: number;
  cost: number;
}

export interface Product {
  type: ProductType;
  name: string;
  icon: string;
  price: number;
  productionTime: number;
  requires: { [key in ResourceType]?: number };
}

export interface Order {
  id: string;
  product: ProductType;
  quantity: number;
  deadline: number;
  reward: number;
  status: OrderStatus;
  completed: number;
}

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

export interface Worker {
  id: string;
  name: string;
  skill: WorkerSkillType;
  skillLevel: number;
  motivation: number;
  salary: number;
  status: WorkerStatus;
  icon: string;
  hireDay: number;
  machineId?: string;
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number;
  remainingDays: number;
  dailyPayment: number;
  totalPaid: number;
  totalToPay: number;
}

export interface GameState {
  day: number;
  money: number;
  resources: Resource[];
  products: Product[];
  machines: Machine[];
  availableOrders: Order[];
  completedOrders: Order[];
  workers: Worker[];
  availableWorkers: Worker[];
  simulationStarted: boolean;
  gamePace: number;
  character: PlayerCharacter | null;
  morale: number;
  loans: Loan[];
  inventory: {
    phone: number;
    tablet: number;
    laptop: number;
  };
  stats: {
    ordersCompleted: number;
    ordersLate: number;
    machinesRepaired: number;
    workersHired: number;
    workersMotivated: number;
    loansTaken: number;
    totalProduced: number;
    totalEarned: number;
    ordersFailed: number;
  };
}

export type GameAction =
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
  | { type: 'START_SIMULATION' }
  | { type: 'COMPLETE_ORDER'; orderId: string };
