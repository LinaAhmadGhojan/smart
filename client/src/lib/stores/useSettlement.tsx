import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "paused";

export type BuildingType = "home" | "farm" | "workshop" | "well";

export interface Building {
  id: string;
  type: BuildingType;
  position: [number, number, number];
  built: boolean;
  health: number;
}

export interface Resources {
  wood: number;
  stone: number;
  food: number;
  population: number;
  happiness: number;
}

export interface BuildingCost {
  wood: number;
  stone: number;
  food: number;
}

export const BUILDING_COSTS: Record<BuildingType, BuildingCost> = {
  home: { wood: 20, stone: 10, food: 0 },
  farm: { wood: 15, stone: 5, food: 0 },
  workshop: { wood: 25, stone: 15, food: 0 },
  well: { wood: 10, stone: 20, food: 0 },
};

export const BUILDING_BENEFITS: Record<BuildingType, Partial<Resources>> = {
  home: { population: 5, happiness: 2 },
  farm: { food: 10 },
  workshop: { wood: 3, stone: 2 },
  well: { happiness: 5 },
};

interface SettlementState {
  phase: GamePhase;
  resources: Resources;
  buildings: Building[];
  selectedBuildingType: BuildingType | null;
  timeOfDay: number;
  season: number;
  sustainabilityScore: number;

  // Actions
  setPhase: (phase: GamePhase) => void;
  selectBuildingType: (type: BuildingType | null) => void;
  canAffordBuilding: (type: BuildingType) => boolean;
  placeBuilding: (type: BuildingType, position: [number, number, number]) => void;
  updateResources: (delta: Partial<Resources>) => void;
  updateTime: (delta: number) => void;
  removeBuilding: (id: string) => void;
  reset: () => void;
  
  // Passive resource generation
  generateResources: () => void;
}

const INITIAL_RESOURCES: Resources = {
  wood: 50,
  stone: 30,
  food: 40,
  population: 5,
  happiness: 50,
};

export const useSettlement = create<SettlementState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    resources: { ...INITIAL_RESOURCES },
    buildings: [],
    selectedBuildingType: null,
    timeOfDay: 0.25,
    season: 0,
    sustainabilityScore: 100,

    setPhase: (phase) => set({ phase }),

    selectBuildingType: (type) => set({ selectedBuildingType: type }),

    canAffordBuilding: (type) => {
      const { resources } = get();
      const cost = BUILDING_COSTS[type];
      return (
        resources.wood >= cost.wood &&
        resources.stone >= cost.stone &&
        resources.food >= cost.food
      );
    },

    placeBuilding: (type, position) => {
      const { resources, canAffordBuilding } = get();
      
      if (!canAffordBuilding(type)) {
        console.log(`Cannot afford ${type}`);
        return;
      }

      const cost = BUILDING_COSTS[type];
      const building: Building = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        built: true,
        health: 100,
      };

      set((state) => ({
        buildings: [...state.buildings, building],
        resources: {
          ...state.resources,
          wood: resources.wood - cost.wood,
          stone: resources.stone - cost.stone,
          food: resources.food - cost.food,
        },
        selectedBuildingType: null,
      }));

      console.log(`Placed ${type} at`, position);
    },

    updateResources: (delta) => {
      set((state) => ({
        resources: {
          wood: Math.max(0, state.resources.wood + (delta.wood || 0)),
          stone: Math.max(0, state.resources.stone + (delta.stone || 0)),
          food: Math.max(0, state.resources.food + (delta.food || 0)),
          population: Math.max(0, state.resources.population + (delta.population || 0)),
          happiness: Math.max(0, Math.min(100, state.resources.happiness + (delta.happiness || 0))),
        },
      }));
    },

    updateTime: (delta) => {
      set((state) => {
        let newTime = state.timeOfDay + delta;
        let newSeason = state.season;
        
        // Day cycles from 0 to 1
        if (newTime >= 1) {
          newTime = 0;
          newSeason = (state.season + 0.01) % 1; // Slow season progression
        }
        
        return {
          timeOfDay: newTime,
          season: newSeason,
        };
      });
    },

    removeBuilding: (id) => {
      set((state) => ({
        buildings: state.buildings.filter((b) => b.id !== id),
      }));
    },

    reset: () => {
      set({
        phase: "menu",
        resources: { ...INITIAL_RESOURCES },
        buildings: [],
        selectedBuildingType: null,
        timeOfDay: 0.25,
        season: 0,
        sustainabilityScore: 100,
      });
    },

    generateResources: () => {
      const { buildings, resources } = get();
      
      let foodGen = 0;
      let woodGen = 0;
      let stoneGen = 0;
      let happinessGen = 0;
      let populationGen = 0;

      buildings.forEach((building) => {
        if (!building.built) return;
        
        const benefits = BUILDING_BENEFITS[building.type];
        foodGen += benefits.food || 0;
        woodGen += benefits.wood || 0;
        stoneGen += benefits.stone || 0;
        happinessGen += benefits.happiness || 0;
        populationGen += benefits.population || 0;
      });

      // Food consumption based on population
      const foodConsumption = resources.population * 0.5;
      const netFood = foodGen - foodConsumption;

      set((state) => ({
        resources: {
          wood: Math.max(0, state.resources.wood + woodGen * 0.01),
          stone: Math.max(0, state.resources.stone + stoneGen * 0.01),
          food: Math.max(0, state.resources.food + netFood * 0.01),
          population: populationGen,
          happiness: Math.max(0, Math.min(100, 50 + happinessGen * 0.5)),
        },
      }));
    },
  }))
);
