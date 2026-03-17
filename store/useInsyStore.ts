import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
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
  type: string;
  typeColor?: string;
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
  isLoading: boolean;
  profile: any | null;
  session: any | null;
  isPro: boolean;
  setRecording: (v: boolean) => void;
  setFilter: (f: "all" | "idea" | "task" | "insight") => void;
  addCapture: (c: Capture) => void;
  updateVaultItem: (id: number, updates: Partial<VaultItem>) => void;
  setUser: (session: any | null, profile: any | null) => void;
  initialize: () => Promise<void>;
  fetchProfile: (uid: string) => Promise<void>;
  signOut: () => Promise<void>;
  uploadAudio: (uri: string) => Promise<VaultItem | void>;
}

const mockVaultItems: VaultItem[] = [
  {
    id: 1,
    type: "idea",
    title: "Insy Monetization",
    desc: "Remove login friction. Use Apple Pay.",
    transcription:
      "I was thinking about how to monetize the app. We should really focus on removing any friction from the login and payment flow. Using Apple Pay would be a game changer for ADHD users who might lose focus if they have to type in credit card details.",
    time: "2h ago",
    tags: ["revenue", "ux"],
  },
  {
    id: 2,
    type: "task",
    title: "Buy groceries",
    desc: "Milk, eggs, bread before Tuesday.",
    transcription:
      "I need to go to the store and get some milk, eggs, and bread. I should do this before Tuesday because that's when I have that big meeting and I won't have time afterwards.",
    time: "Yesterday",
    due: "Tuesday",
  },
  {
    id: 3,
    type: "insight",
    title: "Focus routine idea",
    desc: "Body doubling Tuesday mornings.",
    transcription:
      "I noticed that I'm much more productive when someone else is around, even if we aren't working on the same thing. Maybe I should try body doubling on Tuesday mornings with some friends from the co-working space.",
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

export const useInsyStore = create<InsyStore>((set, get) => ({
  isRecording: false,
  isLoading: false,
  profile: null,
  session: null,
  isPro: false,
  captures: mockCaptures,
  vaultItems: mockVaultItems,
  selectedFilter: "all",
  setRecording: (v) => set({ isRecording: v }),
  setFilter: (f) => set({ selectedFilter: f }),
  addCapture: (c) => set((state) => ({ captures: [c, ...state.captures] })),
  uploadAudio: async (uri: string) => {
    const { supabase } = await import("../utils/supabase");
    
    set({ isLoading: true });
    try {
      const session = get().session;
      if (!session?.user?.id) throw new Error("User not authenticated");

      const fileName = `${session.user.id}/${Date.now()}.m4a`;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("recordings")
        .upload(fileName, decode(base64), {
          contentType: "audio/m4a",
        });

      if (uploadError) throw uploadError;

      // 2. Call Backend to process
      // Altere o IP para o seu IP local se estiver testando em dispositivo real
      // Ou use http://localhost:3000 se for simulador
      const BACKEND_URL = "http://10.0.0.35:3000/api/process"; 
      
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          fileUri: uploadData.path,
          userId: session.user.id,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to process audio");

      // 3. Update Store with new note
      const newItem: VaultItem = {
        id: result.item.id,
        type: result.item.category,
        title: result.item.title,
        desc: result.item.summary,
        transcription: result.item.transcription,
        time: "Just now",
        tags: result.item.action_items,
        due: result.item.due_date,
      };

      set((state) => ({
        vaultItems: [newItem, ...state.vaultItems],
        captures: [
          {
            id: String(newItem.id),
            type: newItem.type as any,
            title: newItem.title,
            subtitle: newItem.desc,
            timestamp: "Just now",
          },
          ...state.captures,
        ],
      }));

      return newItem;
    } catch (error: any) {
      console.error("Upload/Process error:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateVaultItem: (id, updates) =>
    set((state) => ({
      vaultItems: state.vaultItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),
  setUser: (session, profile) => {
    set({ session, profile });
    if (profile?.id) {
      get().fetchProfile(profile.id);
    }
  },
  fetchProfile: async (uid: string) => {
    const { supabase } = await import("../utils/supabase");
    try {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();
      
      // Se a linha não existe, vamos criar agora (Backfill automático)
      if (!data && !error) {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        
        if (user) {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .upsert({
              id: uid,
              email: user.email,
              full_name: user.user_metadata?.full_name || "Guest User",
              is_pro: false
            })
            .select()
            .single();
          
          data = newProfile;
        }
      }

      if (data) {
        set((state) => ({ 
          isPro: data.is_pro || false,
          profile: { ...state.profile, ...data }
        }));
      }
    } catch (err) {
      console.log("Profile sync failed, likely RLS or table missing.");
    }
  },
  initialize: async () => {
    set({ isLoading: true });
    try {
      // Sincronização básica inicial será feita no _layout
      console.log("Store metadata initialized");
    } catch (err) {
      console.error("Failed to sync store:", err);
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    const { supabase } = await import("../utils/supabase");
    await supabase.auth.signOut();
    set({ session: null, profile: null, captures: [], vaultItems: [] });
  },
}));
