import { 
  ResourceType, 
  ProductType, 
  MachineType, 
  MachineStatus, 
  OrderStatus, 
  WorkerSkillType, 
  WorkerStatus 
} from '@/context/GameContext';

export enum GamePhase {
  WELCOME = 'welcome',
  CHARACTER_SELECTION = 'character_selection',
  INTERVIEW = 'interview',
  FACTORY = 'factory'
}

export type PlayerCharacterType = 'male' | 'female';

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
}

export interface Machine {
  id: string;
  type: MachineType;
  name: string;
  status: MachineStatus;
  efficiency: number;
  icon: string;
}

export interface Worker {
  id: string;
  name: string;
  skill: WorkerSkillType;
  status: WorkerStatus;
  icon: string;
}

export interface GameState {
  day: number;
  money: number;
  resources: Resource[];
  products: Product[];
  machines: Machine[];
  availableOrders: Order[];
  workers: Worker[];
}

export type GameAction = 
  | { type: 'BUY_RESOURCE'; resourceType: ResourceType; quantity: number }
  | { type: 'SELL_PRODUCT'; productId: ProductType; price: number }
  | { type: 'ACCEPT_ORDER'; orderId: string }
  | { type: 'REJECT_ORDER'; orderId: string }
  | { type: 'TICK' }
  | { type: 'REPAIR_MACHINE'; machineId: string }
  | { type: 'BUY_MACHINE'; machineType: MachineType }
  | { type: 'UPGRADE_MACHINE'; machineId: string };
