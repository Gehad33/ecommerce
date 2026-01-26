import { createSlice } from '@reduxjs/toolkit';

// دالة مساعدة لتحميل العربة بناءً على المستخدم
const loadUserCartHelper = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    const userCart = localStorage.getItem(`cart_${user.id}`);
    return userCart ? JSON.parse(userCart) : [];
  }
  return JSON.parse(localStorage.getItem('guestCart')) || [];
};

// دالة مساعدة لحفظ العربة بناءً على المستخدم
const saveUserCartHelper = (cartItems) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
  } else {
    localStorage.setItem('guestCart', JSON.stringify(cartItems));
  }
};

// دالة مساعدة لحساب المجموع
const updateCartTotalsHelper = (state) => {
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadUserCartHelper(),
    totalItems: 0,
    totalPrice: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveUserCartHelper(state.items);
      updateCartTotalsHelper(state);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveUserCartHelper(state.items);
      updateCartTotalsHelper(state);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity < 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      saveUserCartHelper(state.items);
      updateCartTotalsHelper(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      saveUserCartHelper(state.items);
      updateCartTotalsHelper(state);
    },
    
    loadCart: (state) => {
      state.items = loadUserCartHelper();
      updateCartTotalsHelper(state);
    },
    
    mergeGuestCart: (state, action) => {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const userCart = loadUserCartHelper();
      
      // دمج العربات
      const mergedCart = [...userCart];
      guestCart.forEach(guestItem => {
        const existingItem = mergedCart.find(item => item.id === guestItem.id);
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });
      
      state.items = mergedCart;
      saveUserCartHelper(mergedCart);
      localStorage.removeItem('guestCart');
      updateCartTotalsHelper(state);
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  loadCart,
  mergeGuestCart 
} = cartSlice.actions;
export default cartSlice.reducer;