import * as products from "./searchProducts";
import * as filters from "./filters";
import * as cart from "./cart";

const apiClient = {
  searchProducts: products.searchProducts,
  getIngredients: filters.getIngredients,
  getProductItems: products.getProductItems,
  getCartAndItems: cart.getCartAndItems,
  setCartAndItems: cart.setCartAndItems,
  // findOrCreateCart: cart.findOrCreateCart
  // findCartByCookieToken: () => {},
};
export default apiClient;
