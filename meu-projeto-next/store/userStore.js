import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      usuario: null,
      token: null,

      login: (dados) => {
        const { token, ...usuario } = dados;

        set({
          usuario,
          token: token || null,
        });
      },

      logout: () =>
        set({
          usuario: null,
          token: null,
        }),
    }),
    {
      name: 'comenta-comigo-usuario',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
