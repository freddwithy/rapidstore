import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OrderProductHook {
  quantity: number;
  optionId?: string;
  productId?: string;
  total: number;
}

interface TableItem {
  items: OrderProductHook[];
  addItem: (data: OrderProductHook) => void;
  addItems: (data: OrderProductHook[]) => void;
  removeItem: (optionId: string) => void;
  removeAll: () => void;
  updateItem: (optionId: string, quantity: number) => void;
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
          items: [...get().items.filter((item) => item.optionId !== id)],
        });
      },
      removeAll: () => {
        set({ items: [] });
      },
      // si la cantidad llega a 0, remover el item
      updateItem: (optionId: string, quantity: number) => {
        const items = get().items;
        const itemIndex = items.findIndex((item) => item.optionId === optionId);
        if (itemIndex !== -1) {
          items[itemIndex].quantity = quantity;
          set({ items });
        }
        if (quantity <= 0) {
          get().removeItem(optionId);
        }
      },
    }),
    {
      name: "item-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
