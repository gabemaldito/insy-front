import { create } from "zustand";

export interface Capture {
  id: string;
  type: "idea" | "task" | "insight";
  title: string;
  subtitle: string;
  timestamp: string;
  icon?: string;
}

export interface VaultItem {
  id: number;
  type: "idea" | "task" | "insight";
  title: string;
  desc: string;
  time: string;
  tags?: string[];
  due?: string;
}

interface InsyStore {
  isRecording: boolean;
  captures: Capture[];
  vaultItems: VaultItem[];
  selectedFilter: "all" | "idea" | "task" | "insight";
  setRecording: (v: boolean) => void;
  setFilter: (f: "all" | "idea" | "task" | "insight") => void;
  addCapture: (c: Capture) => void;
}

const mockVaultItems: VaultItem[] = [
  {
    id: 1,
    type: "idea",
    title: "Insy Monetization",
    desc: "Remove login friction. Use Apple Pay.",
    time: "2h ago",
    tags: ["revenue", "ux"],
  },
  {
    id: 2,
    type: "task",
    title: "Buy groceries",
    desc: "Milk, eggs, bread before Tuesday.",
    time: "Yesterday",
    due: "Tuesday",
  },
  {
    id: 3,
    type: "insight",
    title: "Focus routine idea",
    desc: "Body doubling Tuesday mornings.",
    time: "3d ago",
    tags: [],
  },
];

const mockCaptures: Capture[] = [
  {
    id: "c1",
    type: "idea",
    title: "App refactor",
    subtitle: "Use glassmorphism",
    timestamp: "10m ago",
  },
  {
    id: "c2",
    type: "task",
    title: "Call mom",
    subtitle: "Discuss weekend plans",
    timestamp: "1h ago",
  },
];

export const useInsyStore = create<InsyStore>((set) => ({
  isRecording: false,
  captures: mockCaptures,
  vaultItems: mockVaultItems,
  selectedFilter: "all",
  setRecording: (v) => set({ isRecording: v }),
  setFilter: (f) => set({ selectedFilter: f }),
  addCapture: (c) => set((state) => ({ captures: [c, ...state.captures] })),
}));
