const CART_KEY = "cartItems";

export const getCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
};

export const saveCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};
  
export const addToCart = (food, quantity = 1) => {
  const existingItems = getCartItems();
  const index = existingItems.findIndex((item) => item._id === food._id);

  if (index >= 0) {
    existingItems[index].quantity += quantity;
  } else {
    existingItems.push({
      _id: food._id,
      itemName: food.itemName,
      price: food.price,
      image: food.image || food.images?.[0] || "",
      category: food.category,
      quantity,
    });
  }

  saveCartItems(existingItems);
  return existingItems;
};

export const updateCartQuantity = (foodId, quantity) => {
  const items = getCartItems()
    .map((item) =>
      item._id === foodId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
    .filter((item) => item.quantity > 0);

  saveCartItems(items);
  return items;
};

export const removeFromCart = (foodId) => {
  const items = getCartItems().filter((item) => item._id !== foodId);
  saveCartItems(items);
  return items;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
