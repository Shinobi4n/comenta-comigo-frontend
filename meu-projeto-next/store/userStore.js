import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      usuario: null,

      login: (dadosUsuario) => set({ usuario: dadosUsuario }),

      logout: () => set({ usuario: null }),
    }),
    {
      name: 'comenta-comigo-usuario',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
