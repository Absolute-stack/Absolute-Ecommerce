import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store/store.js";

export function useCart() {
  return useStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      addItem: state.addItem,
      inc: state.inc,
      dec: state.dec,
      removeItem: state.removeItem,
      clearCart: state.clearCart,
      totalQuantity: state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      totalPrice: state.cartItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      ),
    })),
  );
}
