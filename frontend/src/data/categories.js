export const CATEGORY_OPTIONS = [
  {
    id: "street-food",
    name: "Street Food",
    description: "Quick bites full of local flavor and crunch.",
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "indian",
    name: "North Indian",
    description: "Rich gravies, tandoori favorites, and classic comfort food.",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "italian",
    name: "Italian",
    description: "Pasta, pizza, and cheesy crowd-pleasers.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "south-indian",
    name: "South Indian",
    description: "Dosa, idli, and spicy plates made for every time of day.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "chinese",
    name: "Chinese",
    description: "Noodles, rice bowls, and bold wok flavors.",
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "fast-food",
    name: "Fast Food",
    description: "Burgers, fries, pizzas, and quick comfort meals.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "mughlai",
    name: "Mughlai",
    description: "Rich, royal dishes like biryani, kebabs, and korma.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet endings, chilled treats, and indulgent bites.",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "beverages",
    name: "Drinks",
    description: "Cold, refreshing, and perfect with every meal.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "healthy",
    name: "Healthy",
    description: "Fresh bowls, lighter meals, and feel-good options.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  },
];



export const CATEGORY_NAME_MAP = CATEGORY_OPTIONS.reduce((acc, item) => {
  acc[item.id] = item.name;
  return acc;
}, {});