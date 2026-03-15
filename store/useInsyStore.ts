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
  transcription?: string;
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
  updateVaultItem: (id: number, updates: Partial<VaultItem>) => void;
}

const mockVaultItems: VaultItem[] = [
  {
    id: 1,
    type: "idea",
    title: "Insy Monetization",
    desc: "Remove login friction. Use Apple Pay.",
    transcription: "I was thinking about how to monetize the app. We should really focus on removing any friction from the login and payment flow. Using Apple Pay would be a game changer for ADHD users who might lose focus if they have to type in credit card details.",
    time: "2h ago",
    tags: ["revenue", "ux"],
  },
  {
    id: 2,
    type: "task",
    title: "Buy groceries",
    desc: "Milk, eggs, bread before Tuesday.",
    transcription: "I need to go to the store and get some milk, eggs, and bread. I should do this before Tuesday because that's when I have that big meeting and I won't have time afterwards.",
    time: "Yesterday",
    due: "Tuesday",
  },
  {
    id: 3,
    type: "insight",
    title: "Focus routine idea",
    desc: "Body doubling Tuesday mornings.",
    transcription: "I noticed that I'm much more productive when someone else is around, even if we aren't working on the same thing. Maybe I should try body doubling on Tuesday mornings with some friends from the co-working space.",
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
  updateVaultItem: (id, updates) =>
    set((state) => ({
      vaultItems: state.vaultItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
}));
