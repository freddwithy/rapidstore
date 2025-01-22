import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OrderProduct {
  productId: string;
  quantity: number;
}

interface TableItem {
  items: OrderProduct[];
  addItem: (data: OrderProduct) => void;
  addItems: (data: OrderProduct[]) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  itemsAdded: () => void;
}

const useItem = create(
  persist<TableItem>(
    (set, get) => ({
      items: [],
      addItem: (data: OrderProduct) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.productId === data.productId
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === data.productId ? data : item
            ),
          });
        } else {
          set({ items: [...get().items, data] });
        }
      },
      addItems: (data: OrderProduct[]) => {
        set({ items: [...get().items, ...data] });
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter((item) => item.productId !== id)],
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
