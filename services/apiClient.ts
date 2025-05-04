import * as products from "./searchProducts";
import * as filters from "./filters";
import * as cart from "./cart";
import * as auth from "./auth";
const apiClient = {
  searchProducts: products.searchProducts,
  getIngredients: filters.getIngredients,
  getProductItems: products.getProductItems,
  getCartAndItems: cart.getCartAndItems,
  setCartAndItems: cart.setCartAndItems,

  authEmail: auth.authEmail,
  authPhone: auth.authPhone,
  registration: auth.registration,
  logout: auth.logout,
  isCheckAuth: auth.isCheckAuth,
  // findOrCreateCart: cart.findOrCreateCart
  // findCartByCookieToken: () => {},
};
export default apiClient;
