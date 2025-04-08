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
  removeItem: (id: string, isProductId?: boolean) => void;
  removeAll: () => void;
  updateItem: (optionId: string, productId: string, quantity: number) => void;
}

const useCart = create(
  persist<TableItem>(
    (set, get) => ({
      items: [],
      addItem: (data: OrderProductHook) => {
        // Comprobar si el item ya existe en el carrito
        const existingItemIndex = get().items.findIndex(item => 
          (data.optionId && item.optionId === data.optionId) || 
          (!data.optionId && item.productId === data.productId)
        );
        
        if (existingItemIndex !== -1) {
          // Si el item ya existe, actualizar su cantidad
          const items = [...get().items];
          items[existingItemIndex].quantity += data.quantity;
          items[existingItemIndex].total += data.total;
          set({ items });
        } else {
          // Si es un item nuevo, añadirlo al carrito
          set({ items: [...get().items, data] });
        }
      },
      addItems: (data: OrderProductHook[]) => {
        set({ items: [...get().items, ...data] });
      },
      removeItem: (id: string, isProductId?: boolean) => {
        set({
          items: [...get().items.filter((item) => 
            isProductId ? item.productId !== id : item.optionId !== id
          )],
        });
      },
      removeAll: () => {
        set({ items: [] });
      },
      // si la cantidad llega a 0, remover el item
      updateItem: (optionId: string, productId: string, quantity: number) => {
        const items = get().items;
        const itemIndex = items.findIndex(
          (item) => 
            // Si hay optionId, comparar con eso
            (optionId && item.optionId === optionId) || 
            // Si no hay optionId o no coincide, comparar por productId
            (!item.optionId && productId && item.productId === productId)
        );
        
        if (itemIndex !== -1) {
          items[itemIndex].quantity = quantity;
          set({ items });
        }
        
        if (quantity <= 0) {
          // Si hay optionId, remover por optionId, de lo contrario remover por productId
          if (optionId) {
            get().removeItem(optionId);
          } else if (productId) {
            get().removeItem(productId, true);
          }
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
