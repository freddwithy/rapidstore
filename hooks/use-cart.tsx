import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OrderProductHook {
  quantity: number;
  variantId: string;
  total: number;
}

interface TableItem {
  items: OrderProductHook[];
  addItem: (data: OrderProductHook) => void;
  addItems: (data: OrderProductHook[]) => void;
  removeItem: (variantId: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<TableItem>(
    (set, get) => ({
      items: [],
      addItem: (data: OrderProductHook) => {
        set({ items: [...get().items, data] });
      },
      addItems: (data: OrderProductHook[]) => {
        set({ items: [...get().items, ...data] });
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter((item) => item.variantId !== id)],
        });
      },
      removeAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: "item-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
