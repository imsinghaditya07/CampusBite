import { create } from 'zustand';

export interface CartItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
  customizations?: string[];
}

export interface FoodItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable?: boolean;
  rating: number;
  prepTimeMinutes: number;
  image: string;
  calories?: number;
  spiceLevel?: string;
  categoryId?: string;
  category?: { name: string };
}

export interface CategoryData {
  id: string;
  name: string;
  displayOrder: number;
  icon: string;
  foodItems: FoodItemData[];
}

// Preloaded full menu data for instant SSR rendering
const INITIAL_CATEGORIES: CategoryData[] = [
  {
    id: 'cat-north',
    name: 'North Indian',
    displayOrder: 1,
    icon: '🍲',
    foodItems: [
      { id: 'ni-1', name: 'Chole Bhature', price: 70, isVeg: true, rating: 4.9, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80', description: 'Fluffy fried bhature with spiced chickpea curry, pickled onions & mint chutney.', category: { name: 'North Indian' } },
      { id: 'ni-2', name: 'Rajma Chawal', price: 60, isVeg: true, rating: 4.8, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', description: 'Homestyle slow-cooked red kidney beans gravy served over steamed basmati rice.', category: { name: 'North Indian' } },
      { id: 'ni-3', name: 'Dal Makhani', price: 70, isVeg: true, rating: 4.9, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Creamy black lentils simmered overnight with butter, cream and mild spices.', category: { name: 'North Indian' } },
      { id: 'ni-4', name: 'Paneer Butter Masala', price: 80, isVeg: true, rating: 4.9, prepTimeMinutes: 10, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', description: 'Soft cottage cheese cubes in rich tomato-cashew buttery gravy.', category: { name: 'North Indian' } },
      { id: 'ni-5', name: 'Aloo Paratha (2 pcs)', price: 50, isVeg: true, rating: 4.7, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Whole wheat flatbreads stuffed with spiced mashed potatoes, served with curd & pickle.', category: { name: 'North Indian' } },
      { id: 'ni-6', name: 'Stuffed Kulcha', price: 50, isVeg: true, rating: 4.7, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', description: 'Crispy tandoor-baked kulcha filled with spiced paneer & potato stuffing.', category: { name: 'North Indian' } },
      { id: 'ni-7', name: 'Kadhi Chawal', price: 50, isVeg: true, rating: 4.6, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', description: 'Tangy gram flour yogurt curry with crispy onion pakoras over fragrant rice.', category: { name: 'North Indian' } },
    ],
  },
  {
    id: 'cat-south',
    name: 'South Indian',
    displayOrder: 2,
    icon: '🥞',
    foodItems: [
      { id: 'si-1', name: 'Masala Dosa', price: 60, isVeg: true, rating: 4.9, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', description: 'Crispy golden rice crepe filled with tempered potato masala, with coconut chutney & sambar.', category: { name: 'South Indian' } },
      { id: 'si-2', name: 'Plain Dosa', price: 50, isVeg: true, rating: 4.8, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', description: 'Classic golden crispy dosa served hot with sambar and fresh chutneys.', category: { name: 'South Indian' } },
      { id: 'si-3', name: 'Idli (2 pcs)', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', description: 'Steamed fluffy rice and lentil cakes served with drumstick sambar.', category: { name: 'South Indian' } },
      { id: 'si-4', name: 'Medu Vada (2 pcs)', price: 40, isVeg: true, rating: 4.8, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Crispy golden fried lentil fritters infused with peppercorns & curry leaves.', category: { name: 'South Indian' } },
      { id: 'si-5', name: 'Pongal', price: 50, isVeg: true, rating: 4.7, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Warm comforting rice & moong dal dish tempered with ghee, cashews & cumin.', category: { name: 'South Indian' } },
      { id: 'si-6', name: 'Uttapam', price: 55, isVeg: true, rating: 4.8, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', description: 'Thick soft pancake topped with chopped onions, tomatoes, coriander & green chillies.', category: { name: 'South Indian' } },
      { id: 'si-7', name: 'Rasam Rice', price: 40, isVeg: true, rating: 4.6, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Steamed rice served with aromatic pepper-tomato tamarind soup & papad.', category: { name: 'South Indian' } },
      { id: 'si-8', name: 'Curd Rice', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Cool tempered yogurt rice with mustard seeds, curry leaves, pomegranate & pickle.', category: { name: 'South Indian' } },
    ],
  },
  {
    id: 'cat-west',
    name: 'West Indian',
    displayOrder: 3,
    icon: '🥪',
    foodItems: [
      { id: 'wi-1', name: 'Vada Pav', price: 30, isVeg: true, rating: 4.9, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', description: 'The Mumbai classic spiced potato patty inside soft bun with dry garlic chutney.', category: { name: 'West Indian' } },
      { id: 'wi-2', name: 'Pav Bhaji', price: 60, isVeg: true, rating: 4.9, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', description: 'Mashed spiced butter vegetable curry served with toasted buttered pav buns.', category: { name: 'West Indian' } },
      { id: 'wi-3', name: 'Misal Pav', price: 50, isVeg: true, rating: 4.8, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', description: 'Spicy sprouted moth bean curry topped with farsan, onions and lemon, with pav.', category: { name: 'West Indian' } },
      { id: 'wi-4', name: 'Dabeli', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', description: 'Sweet & spicy potato filling with pomegranate, peanuts & sev in grilled bun.', category: { name: 'West Indian' } },
      { id: 'wi-5', name: 'Thepla (2 pcs)', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Gujarati spiced fenugreek whole wheat flatbreads with mango chunda & curd.', category: { name: 'West Indian' } },
      { id: 'wi-6', name: 'Khandvi', price: 40, isVeg: true, rating: 4.6, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Delicate rolled gram flour & yogurt snacks tempered with mustard seeds & coconut.', category: { name: 'West Indian' } },
      { id: 'wi-7', name: 'Poha', price: 35, isVeg: true, rating: 4.8, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Flattened rice tossed with onions, turmeric, crunchy roasted peanuts & fresh coriander.', category: { name: 'West Indian' } },
      { id: 'wi-8', name: 'Sabudana Khichdi', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Tapioca pearls sautéed with roasted crushed peanuts, cumin & green chillies.', category: { name: 'West Indian' } },
    ],
  },
  {
    id: 'cat-east',
    name: 'East Indian',
    displayOrder: 4,
    icon: '🥟',
    foodItems: [
      { id: 'ei-1', name: 'Veg Momos', price: 50, isVeg: true, rating: 4.8, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', description: 'Steamed Tibetan dumplings stuffed with seasoned finely minced vegetables & fiery red chutney.', category: { name: 'East Indian' } },
      { id: 'ei-2', name: 'Chicken Momos', price: 70, isVeg: false, rating: 4.9, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', description: 'Juicy steamed dumplings filled with tender minced chicken & aromatics with spicy dip.', category: { name: 'East Indian' } },
      { id: 'ei-3', name: 'Kathi Roll (Veg)', price: 60, isVeg: true, rating: 4.8, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Kolkata style paratha wrap filled with spiced paneer, onions, capsicum & tangy sauces.', category: { name: 'East Indian' } },
      { id: 'ei-4', name: 'Kathi Roll (Chicken)', price: 80, isVeg: false, rating: 4.9, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Egg-layered paratha wrapped around succulent marinated chicken tikka pieces.', category: { name: 'East Indian' } },
      { id: 'ei-5', name: 'Egg Roll', price: 60, isVeg: false, rating: 4.7, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Crisp paratha with double egg coating, filled with crunchy onions, chaat masala & lime.', category: { name: 'East Indian' } },
      { id: 'ei-6', name: 'Litti Chokha', price: 50, isVeg: true, rating: 4.8, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Bihari wheat balls stuffed with sattu roasted over coal, with smoked baingan chokha.', category: { name: 'East Indian' } },
      { id: 'ei-7', name: 'Pakhala Bhata', price: 40, isVeg: true, rating: 4.6, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Traditional Odia fermented rice in curd water served with roasted potato mash & badi chura.', category: { name: 'East Indian' } },
      { id: 'ei-8', name: 'Macher Jhol (Fish Curry)', price: 80, isVeg: false, rating: 4.8, prepTimeMinutes: 10, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Bengali style light mustard fish curry cooked with potatoes & panch phoron.', category: { name: 'East Indian' } },
    ],
  },
  {
    id: 'cat-street',
    name: 'Street Food',
    displayOrder: 5,
    icon: '🥙',
    foodItems: [
      { id: 'sf-1', name: 'Pani Puri (6 pcs)', price: 30, isVeg: true, rating: 4.9, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Crisp hollow puris filled with spiced potato-chickpeas and spicy mint-tamarind water.', category: { name: 'Street Food' } },
      { id: 'sf-2', name: 'Bhel Puri', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Puffed rice tossed with onions, tomatoes, spicy garlic chutney & sweet tamarind dip.', category: { name: 'Street Food' } },
      { id: 'sf-3', name: 'Sev Puri', price: 40, isVeg: true, rating: 4.8, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Flat papdis loaded with diced potatoes, onions, three signature chutneys & nylon sev.', category: { name: 'Street Food' } },
      { id: 'sf-4', name: 'Aloo Tikki', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Pan-fried spiced potato patties served with warm chole, curd and mint-tamarind chutneys.', category: { name: 'Street Food' } },
      { id: 'sf-5', name: 'Dahi Puri', price: 45, isVeg: true, rating: 4.8, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Crispy puris stuffed with potato mash, sweetened chilled yogurt, chutneys & sev.', category: { name: 'Street Food' } },
      { id: 'sf-6', name: 'Papdi Chaat', price: 45, isVeg: true, rating: 4.8, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Crunchy wheat crackers layered with boiled potatoes, chickpeas, curd & tangy spice mix.', category: { name: 'Street Food' } },
      { id: 'sf-7', name: 'Samosa (2 pcs)', price: 30, isVeg: true, rating: 4.9, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Golden triangular crispy pastry packed with spiced potato & green pea filling.', category: { name: 'Street Food' } },
      { id: 'sf-8', name: 'Kachori (2 pcs)', price: 35, isVeg: true, rating: 4.7, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Flaky deep-fried pastry stuffed with spiced moong dal mixture, with imli chutney.', category: { name: 'Street Food' } },
    ],
  },
  {
    id: 'cat-rice',
    name: 'Rice & Biryani',
    displayOrder: 6,
    icon: '🍚',
    foodItems: [
      { id: 'rb-1', name: 'Veg Biryani', price: 70, isVeg: true, rating: 4.8, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', description: 'Fragrant basmati rice layered with garden vegetables, saffron & whole spices, with raita.', category: { name: 'Rice & Biryani' } },
      { id: 'rb-2', name: 'Chicken Biryani', price: 90, isVeg: false, rating: 4.95, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', description: 'Authentic Hyderabadi dum biryani cooked with marinated chicken pieces & spices.', category: { name: 'Rice & Biryani' } },
      { id: 'rb-3', name: 'Egg Biryani', price: 80, isVeg: false, rating: 4.8, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', description: 'Aromatic layered biryani rice served with golden-fried boiled eggs & salan.', category: { name: 'Rice & Biryani' } },
      { id: 'rb-4', name: 'Jeera Rice', price: 40, isVeg: true, rating: 4.6, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Basmati rice tempered with pure ghee, whole roasted cumin seeds & fresh coriander.', category: { name: 'Rice & Biryani' } },
      { id: 'rb-5', name: 'Steamed Rice', price: 30, isVeg: true, rating: 4.5, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Simple, fluffy long-grain steamed white basmati rice.', category: { name: 'Rice & Biryani' } },
      { id: 'rb-6', name: 'Curd Rice', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Traditional South Indian curd rice with mustard, ginger, green chillies & pickle.', category: { name: 'Rice & Biryani' } },
      { id: 'rb-7', name: 'Fried Rice (Veg)', price: 60, isVeg: true, rating: 4.7, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', description: 'Wok-tossed rice with shredded carrots, cabbage, spring onions & soya sauce.', category: { name: 'Rice & Biryani' } },
      { id: 'rb-8', name: 'Fried Rice (Chicken)', price: 80, isVeg: false, rating: 4.85, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', description: 'Chinese wok-tossed fried rice with egg ribbons, shredded chicken & scallions.', category: { name: 'Rice & Biryani' } },
    ],
  },
  {
    id: 'cat-chinese',
    name: 'Chinese',
    displayOrder: 7,
    icon: '🍜',
    foodItems: [
      { id: 'ch-1', name: 'Veg Fried Noodles', price: 60, isVeg: true, rating: 4.7, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', description: 'Classic hakka noodles stir-fried in high flame with fresh bell peppers, cabbage & sauces.', category: { name: 'Chinese' } },
      { id: 'ch-2', name: 'Chicken Noodles', price: 80, isVeg: false, rating: 4.9, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', description: 'Wok-tossed noodles with spiced chicken chunks, scrambled egg & chilli garlic sauce.', category: { name: 'Chinese' } },
      { id: 'ch-3', name: 'Veg Manchurian', price: 70, isVeg: true, rating: 4.8, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', description: 'Crispy vegetable dumplings coated in rich spicy soya-garlic gravy with spring onions.', category: { name: 'Chinese' } },
      { id: 'ch-4', name: 'Chilli Chicken', price: 90, isVeg: false, rating: 4.9, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', description: 'Crispy batter-fried chicken bites tossed with capsicum, onion petals & hot garlic sauce.', category: { name: 'Chinese' } },
      { id: 'ch-5', name: 'Spring Rolls (Veg)', price: 60, isVeg: true, rating: 4.7, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', description: 'Golden crispy rolls packed with julienned sauteed vegetables, with sweet chilli dip.', category: { name: 'Chinese' } },
      { id: 'ch-6', name: 'Spring Rolls (Chicken)', price: 80, isVeg: false, rating: 4.8, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', description: 'Crunchy golden wrappers loaded with seasoned minced chicken and oriental spices.', category: { name: 'Chinese' } },
      { id: 'ch-7', name: 'Schezuan Rice', price: 70, isVeg: true, rating: 4.8, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', description: 'Spicy fiery red fried rice tossed with authentic Schezwan sauce & fresh veggies.', category: { name: 'Chinese' } },
      { id: 'ch-8', name: 'Chilli Paneer', price: 80, isVeg: true, rating: 4.85, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', description: 'Paneer cubes wok-tossed with green bell peppers, dark soya sauce and green chillies.', category: { name: 'Chinese' } },
    ],
  },
  {
    id: 'cat-beverages',
    name: 'Beverages',
    displayOrder: 8,
    icon: '🥤',
    foodItems: [
      { id: 'bev-1', name: 'Masala Chai', price: 15, isVeg: true, rating: 4.9, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', description: 'Hot freshly brewed Indian tea infused with cardamom, ginger, cloves and milk.', category: { name: 'Beverages' } },
      { id: 'bev-2', name: 'Filter Coffee', price: 20, isVeg: true, rating: 4.9, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', description: 'Authentic South Indian chicory filter coffee with frothy hot milk.', category: { name: 'Beverages' } },
      { id: 'bev-3', name: 'Cold Coffee', price: 50, isVeg: true, rating: 4.85, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80', description: 'Blended chilled espresso with creamy milk, vanilla ice cream scoop and chocolate syrup.', category: { name: 'Beverages' } },
      { id: 'bev-4', name: 'Lassi (Sweet/Salted)', price: 40, isVeg: true, rating: 4.8, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1571006682858-a458b8a69288?auto=format&fit=crop&w=800&q=80', description: 'Thick traditional churned yogurt drink flavoured with cardamom and fresh malai.', category: { name: 'Beverages' } },
      { id: 'bev-5', name: 'Lemonade', price: 30, isVeg: true, rating: 4.6, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', description: 'Refreshing sweet chilled lemonade made with freshly squeezed lemons & mint.', category: { name: 'Beverages' } },
      { id: 'bev-6', name: 'Fresh Lime Soda', price: 30, isVeg: true, rating: 4.7, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', description: 'Fizzy carbonated soda with fresh lime juice, black salt, and sugar or salt syrup.', category: { name: 'Beverages' } },
      { id: 'bev-7', name: 'Iced Tea', price: 35, isVeg: true, rating: 4.6, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80', description: 'Crisp cold black tea infused with lemon slices and mint over ice cubes.', category: { name: 'Beverages' } },
      { id: 'bev-8', name: 'Soft Drinks (500ml)', price: 40, isVeg: true, rating: 4.8, prepTimeMinutes: 1, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', description: 'Chilled bottle of your choice (Thums Up, Coca-Cola, Sprite, Fanta).', category: { name: 'Beverages' } },
    ],
  },
  {
    id: 'cat-snacks',
    name: 'Snacks & Quick Bites',
    displayOrder: 9,
    icon: '🥪',
    foodItems: [
      { id: 'sn-1', name: 'Veg Sandwich', price: 50, isVeg: true, rating: 4.7, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', description: 'Fresh cucumber, tomato, beetroot slices with mint chutney & butter between soft bread.', category: { name: 'Snacks & Quick Bites' } },
      { id: 'sn-2', name: 'Cheese Sandwich', price: 60, isVeg: true, rating: 4.8, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', description: 'Toasted sandwich loaded with melted cheddar cheese, herbs and green chutney.', category: { name: 'Snacks & Quick Bites' } },
      { id: 'sn-3', name: 'Paneer Roll', price: 60, isVeg: true, rating: 4.8, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Grilled spiced paneer cubes wrapped in a soft flaky roti with sliced onions.', category: { name: 'Snacks & Quick Bites' } },
      { id: 'sn-4', name: 'Chicken Roll', price: 80, isVeg: false, rating: 4.9, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', description: 'Juicy spiced chicken tikka wrapped in warm flaky flatbread with mint sauce.', category: { name: 'Snacks & Quick Bites' } },
      { id: 'sn-5', name: 'French Fries', price: 50, isVeg: true, rating: 4.7, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', description: 'Crisp golden salted potato fries served hot with tomato ketchup & mayo dip.', category: { name: 'Snacks & Quick Bites' } },
      { id: 'sn-6', name: 'Cheese Maggi', price: 50, isVeg: true, rating: 4.85, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', description: 'Classic college 2-minute instant noodles topped with generous melted cheese.', category: { name: 'Snacks & Quick Bites' } },
      { id: 'sn-7', name: 'Veg Maggi', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', description: 'Hot masala Maggi tossed with chopped peas, carrots, onions & butter.', category: { name: 'Snacks & Quick Bites' } },
      { id: 'sn-8', name: 'Chicken Maggi', price: 60, isVeg: false, rating: 4.8, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', description: 'Spiced Maggi noodles cooked with shredded chicken pieces and extra tastemaker.', category: { name: 'Snacks & Quick Bites' } },
    ],
  },
  {
    id: 'cat-desserts',
    name: 'Desserts',
    displayOrder: 10,
    icon: '🍨',
    foodItems: [
      { id: 'des-1', name: 'Gulab Jamun (2 pcs)', price: 30, isVeg: true, rating: 4.9, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', description: 'Warm soft milk-solid dumplings soaked in rose and cardamom flavoured sugar syrup.', category: { name: 'Desserts' } },
      { id: 'des-2', name: 'Rasgulla (2 pcs)', price: 30, isVeg: true, rating: 4.8, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', description: 'Spongy cottage cheese balls cooked in light fragrant sugar syrup.', category: { name: 'Desserts' } },
      { id: 'des-3', name: 'Kheer', price: 40, isVeg: true, rating: 4.8, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', description: 'Traditional slow-simmered rice pudding enriched with saffron, cardamom and dry fruits.', category: { name: 'Desserts' } },
      { id: 'des-4', name: 'Ice Cream (1 scoop)', price: 30, isVeg: true, rating: 4.7, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', description: 'Chilled creamy ice cream scoop (Vanilla, Chocolate, Butterscotch, Strawberry).', category: { name: 'Desserts' } },
      { id: 'des-5', name: 'Jalebi (2 pcs)', price: 30, isVeg: true, rating: 4.85, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', description: 'Crispy fried spiral sweet pretzel soaked in saffron saffron sugar syrup.', category: { name: 'Desserts' } },
      { id: 'des-6', name: 'Moong Dal Halwa', price: 40, isVeg: true, rating: 4.9, prepTimeMinutes: 4, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', description: 'Rich Rajasthani dessert made with ground yellow lentils, pure ghee and cashews.', category: { name: 'Desserts' } },
    ],
  },
  {
    id: 'cat-combos',
    name: 'Meal Combos',
    displayOrder: 11,
    icon: '🍱',
    foodItems: [
      { id: 'mc-1', name: 'North Indian Thali', price: 90, isVeg: true, rating: 4.9, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', description: 'Complete meal: Dal Makhani, Paneer Sabzi, Basmati Rice, 2 Butter Rotis, Salad & Sweet.', category: { name: 'Meal Combos' } },
      { id: 'mc-2', name: 'South Indian Combo', price: 80, isVeg: true, rating: 4.9, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', description: '1 Butter Masala Dosa + 2 Steamed Idlis + Hot Sambar & 2 Chutneys.', category: { name: 'Meal Combos' } },
      { id: 'mc-3', name: 'Chinese Combo', price: 90, isVeg: true, rating: 4.85, prepTimeMinutes: 8, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', description: 'Veg Hakka Noodles + Veg Manchurian Gravy + Fresh Cold Soft Drink.', category: { name: 'Meal Combos' } },
      { id: 'mc-4', name: 'Student Special', price: 70, isVeg: true, rating: 4.9, prepTimeMinutes: 6, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', description: 'Spiced Veg Dum Biryani + Cucumber Mint Raita + Cold Soft Drink.', category: { name: 'Meal Combos' } },
    ],
  },
  {
    id: 'cat-healthy',
    name: 'Diet & Healthy Options',
    displayOrder: 12,
    icon: '🥗',
    foodItems: [
      { id: 'dh-1', name: 'Sprouts Salad', price: 50, isVeg: true, rating: 4.7, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'High-protein sprouted green moong salad with tomatoes, cucumber, lemon juice & chat masala.', category: { name: 'Diet & Healthy Options' } },
      { id: 'dh-2', name: 'Grilled Sandwich', price: 60, isVeg: true, rating: 4.8, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', description: 'Brown bread grilled sandwich filled with crisp bell peppers, zucchini, corn & low-fat paneer.', category: { name: 'Diet & Healthy Options' } },
      { id: 'dh-3', name: 'Boiled Egg (2 pcs)', price: 30, isVeg: false, rating: 4.6, prepTimeMinutes: 2, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80', description: 'Two farm-fresh hard boiled eggs sprinkled with black pepper & rock salt.', category: { name: 'Diet & Healthy Options' } },
      { id: 'dh-4', name: 'Oats Upma', price: 40, isVeg: true, rating: 4.7, prepTimeMinutes: 5, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', description: 'Fiber-rich rolled oats cooked with roasted vegetables, mustard seeds and curry leaves.', category: { name: 'Diet & Healthy Options' } },
      { id: 'dh-5', name: 'Multigrain Roti Thali', price: 70, isVeg: true, rating: 4.8, prepTimeMinutes: 7, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', description: '3 Multigrain rotis served with steamed yellow dal tadka, seasonal green sabzi & green salad.', category: { name: 'Diet & Healthy Options' } },
      { id: 'dh-6', name: 'Fruit Bowl', price: 50, isVeg: true, rating: 4.8, prepTimeMinutes: 3, image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80', description: 'Seasonal fresh cut fruits (Apple, Papaya, Banana, Pomegranate) with chia seeds.', category: { name: 'Diet & Healthy Options' } },
    ],
  },
];

const INITIAL_ALL_ITEMS: FoodItemData[] = INITIAL_CATEGORIES.flatMap((c) => c.foodItems);

export interface UserState {
  role: 'STUDENT' | 'CANTEEN_OWNER' | 'KITCHEN_STAFF' | 'COLLEGE_ADMIN' | 'SUPER_ADMIN';
  name: string;
  email: string;
  studentId: string;
  collegeId: string;
  collegeName: string;
  collegeCity: string;
  collegeState: string;
  collegeLat: number;
  collegeLng: number;
  canteenId: string;
  canteenName: string;
  cart: CartItem[];
  dietaryFilter: 'ALL' | 'VEG' | 'NON_VEG';
  searchQuery: string;
  categories: CategoryData[];
  foodItems: FoodItemData[];

  // Verification & Profile State
  isVerified: boolean;
  verificationStatus: 'UNVERIFIED' | 'EMAIL_VERIFIED' | 'ID_PENDING' | 'UNDER_REVIEW' | 'COLLEGE_VERIFIED' | 'REJECTED' | 'SUSPENDED';
  memberships: any[];
  activeMembership: any | null;
  studentProfile: any | null;

  // Actions
  setRole: (role: 'STUDENT' | 'CANTEEN_OWNER' | 'KITCHEN_STAFF' | 'COLLEGE_ADMIN' | 'SUPER_ADMIN') => void;
  setCollege: (id: string, name: string, city?: string, state?: string, lat?: number, lng?: number) => void;
  setCanteen: (id: string, name: string) => void;
  setDietaryFilter: (filter: 'ALL' | 'VEG' | 'NON_VEG') => void;
  setSearchQuery: (query: string) => void;
  setMenuData: (categories: CategoryData[], items: FoodItemData[]) => void;
  updateItemPriceAndAvailability: (itemId: string, price: number, isAvailable: boolean) => void;

  setVerificationStatus: (status: 'UNVERIFIED' | 'EMAIL_VERIFIED' | 'ID_PENDING' | 'UNDER_REVIEW' | 'COLLEGE_VERIFIED' | 'REJECTED' | 'SUSPENDED') => void;
  setStudentProfile: (profile: any) => void;
  setMemberships: (memberships: any[], activeMembership?: any) => void;

  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (foodItemId: string) => void;
  updateQuantity: (foodItemId: string, delta: number) => void;
  clearCart: () => void;
}

export const useStore = create<UserState>((set) => ({
  role: 'STUDENT',
  name: 'Aarav Sharma',
  email: 'student@campusbite.in',
  studentId: 'student-id-001',
  collegeId: 'primary-iitb-id',
  collegeName: 'IIT Bombay (Indian Institute of Technology)',
  collegeCity: 'Mumbai',
  collegeState: 'Maharashtra',
  collegeLat: 19.1334,
  collegeLng: 72.9133,
  canteenId: 'campusbite-central-iitb',
  canteenName: 'CampusBite Central Food Hub',
  cart: [],
  dietaryFilter: 'ALL',
  searchQuery: '',
  categories: INITIAL_CATEGORIES,
  foodItems: INITIAL_ALL_ITEMS,

  // Verification & Profile State Initial Values
  isVerified: true,
  verificationStatus: 'COLLEGE_VERIFIED',
  memberships: [],
  activeMembership: null,
  studentProfile: null,

  setRole: (role) => {
    let name = 'Aarav Sharma';
    let email = 'student@campusbite.in';
    if (role === 'CANTEEN_OWNER') {
      name = 'Rajesh Patel';
      email = 'owner@campusbite.in';
    } else if (role === 'KITCHEN_STAFF') {
      name = 'Vikram Singh';
      email = 'kitchen@campusbite.in';
    } else if (role === 'COLLEGE_ADMIN') {
      name = 'Dr. Meenakshi Sundaram';
      email = 'collegeadmin@campusbite.in';
    } else if (role === 'SUPER_ADMIN') {
      name = 'CampusBite SuperAdmin';
      email = 'superadmin@campusbite.in';
    }
    set({ role, name, email });
  },

  setVerificationStatus: (verificationStatus) =>
    set({
      verificationStatus,
      isVerified: verificationStatus === 'COLLEGE_VERIFIED' || verificationStatus === 'EMAIL_VERIFIED',
    }),

  setStudentProfile: (studentProfile) => set({ studentProfile }),

  setMemberships: (memberships, activeMembership) =>
    set({
      memberships,
      activeMembership: activeMembership || memberships[0] || null,
    }),

  setCollege: (collegeId, collegeName, city = 'Mumbai', state = 'Maharashtra', lat = 19.1334, lng = 72.9133) =>
    set({
      collegeId,
      collegeName,
      collegeCity: city,
      collegeState: state,
      collegeLat: lat,
      collegeLng: lng,
    }),

  setCanteen: (canteenId, canteenName) => set({ canteenId, canteenName }),
  setDietaryFilter: (dietaryFilter) => set({ dietaryFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setMenuData: (categories, foodItems) => set({ categories, foodItems }),

  updateItemPriceAndAvailability: (itemId, price, isAvailable) =>
    set((state) => {
      const updatedItems = state.foodItems.map((item) =>
        item.id === itemId ? { ...item, price, isAvailable } : item
      );
      const updatedCategories = state.categories.map((cat) => ({
        ...cat,
        foodItems: cat.foodItems.map((item) =>
          item.id === itemId ? { ...item, price, isAvailable } : item
        ),
      }));
      return { foodItems: updatedItems, categories: updatedCategories };
    }),

  addToCart: (item) =>
    set((state) => {
      const existingIndex = state.cart.findIndex((c) => c.foodItemId === item.foodItemId);
      if (existingIndex > -1) {
        const updated = [...state.cart];
        updated[existingIndex].quantity += 1;
        return { cart: updated };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),

  removeFromCart: (foodItemId) =>
    set((state) => ({ cart: state.cart.filter((c) => c.foodItemId !== foodItemId) })),

  updateQuantity: (foodItemId, delta) =>
    set((state) => {
      const updated = state.cart
        .map((item) => {
          if (item.foodItemId === foodItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      return { cart: updated };
    }),

  clearCart: () => set({ cart: [] }),
}));
