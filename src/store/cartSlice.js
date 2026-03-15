export const createCartSlice = (set, get) => ({
  cartItems: [],

  addItem: (item, selectedSize) =>
    set((state) => {
      const exists = state.cartItems.find(
        (i) => i._id === item._id && i.selectedSize === selectedSize,
      );
      if (exists) {
        exists.quantity += item.quantity;
      } else {
        state.cartItems.push({
          ...item,
          selectedSize,
          quantity: item.quantity,
        });
      }
    }),

  inc: (id, selectedSize) =>
    set((state) => {
      const item = state.cartItems.find(
        (i) => i._id === id && i.selectedSize === selectedSize,
      );
      if (item) item.quantity += 1;
    }),

  dec: (id, selectedSize) =>
    set((state) => {
      const item = state.cartItems.find(
        (i) => i._id === id && i.selectedSize === selectedSize,
      );
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          // ✅ reassign
          state.cartItems = state.cartItems.filter(
            (i) => !(i._id === id && i.selectedSize === selectedSize),
          );
        }
      }
    }),

  removeItem: (id, selectedSize) =>
    set((state) => {
      // ✅ reassign
      state.cartItems = state.cartItems.filter(
        (i) => !(i._id === id && i.selectedSize === selectedSize),
      );
    }),

  getTotalQuantity: () =>
    get().cartItems.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    ),
  clearCart: () =>
    set((state) => {
      state.cartItems = [];
    }),
});
