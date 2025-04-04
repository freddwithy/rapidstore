import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OrderProductHook {
  quantity: number;
  productId: string;
  optionId: string;
  total: number;
}

interface TableItem {
  items: OrderProductHook[];
  addItem: (data: OrderProductHook) => void;
  addItems: (data: OrderProductHook[]) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  itemsAdded: () => void;
}

const useItem = create(
  persist<TableItem>(
    (set, get) => ({
      items: [],
      addItem: (data: OrderProductHook) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.optionId === data.optionId
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.optionId === data.optionId ? data : item
            ),
          });
        } else {
          set({ items: [...get().items, data] });
        }
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
      itemsAdded: () => {
        set({ items: [] });
      },
    }),
    {
      name: "item-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useItem;
