import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding complete Indian Campus menu with high-res dish photography & All-India colleges...');

  // 1. Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.wastePrediction.deleteMany();
  await prisma.demandPrediction.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.campusWallet.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.campusEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.review.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.qRToken.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.pickupSlot.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.foodCustomization.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.pickupCounter.deleteMany();
  await prisma.kitchenStation.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.canteen.deleteMany();
  await prisma.campus.deleteMany();
  await prisma.college.deleteMany();
  await prisma.university.deleteMany();
  await prisma.city.deleteMany();
  await prisma.state.deleteMany();

  // 2. States & Cities
  const statesData = [
    { name: 'Maharashtra', code: 'MH', cities: ['Mumbai', 'Pune', 'Nagpur'] },
    { name: 'Delhi NCR', code: 'DL', cities: ['New Delhi', 'Noida', 'Gurugram'] },
    { name: 'Karnataka', code: 'KA', cities: ['Bengaluru', 'Mysuru', 'Manipal'] },
    { name: 'Tamil Nadu', code: 'TN', cities: ['Chennai', 'Coimbatore', 'Vellore', 'Trichy'] },
    { name: 'Uttar Pradesh', code: 'UP', cities: ['Kanpur', 'Varanasi', 'Lucknow'] },
    { name: 'Telangana', code: 'TG', cities: ['Hyderabad', 'Warangal'] },
    { name: 'West Bengal', code: 'WB', cities: ['Kolkata', 'Kharagpur'] },
    { name: 'Rajasthan', code: 'RJ', cities: ['Pilani', 'Jaipur', 'Jodhpur'] },
    { name: 'Gujarat', code: 'GJ', cities: ['Gandhinagar', 'Ahmedabad', 'Surat'] },
    { name: 'Punjab', code: 'PB', cities: ['Chandigarh', 'Patiala', 'Ropar'] },
  ];

  const cityMap: Record<string, string> = {};
  for (const s of statesData) {
    const stateRecord = await prisma.state.create({ data: { name: s.name, code: s.code } });
    for (const cityName of s.cities) {
      const cityRecord = await prisma.city.create({ data: { name: cityName, stateId: stateRecord.id } });
      cityMap[cityName] = cityRecord.id;
    }
  }

  // 3. Universities & All-India Colleges
  const collegesList = [
    { name: 'IIT Bombay (Indian Institute of Technology)', code: 'IITB', city: 'Mumbai', lat: 19.1334, lng: 72.9133 },
    { name: 'VJTI Mumbai (Veermata Jijabai Technological Institute)', code: 'VJTI', city: 'Mumbai', lat: 19.0222, lng: 72.8561 },
    { name: 'COEP Technological University Pune', code: 'COEP', city: 'Pune', lat: 18.5293, lng: 73.8565 },
    { name: 'IIT Delhi (Indian Institute of Technology)', code: 'IITD', city: 'New Delhi', lat: 28.5450, lng: 77.1926 },
    { name: 'DTU (Delhi Technological University)', code: 'DTU', city: 'New Delhi', lat: 28.7501, lng: 77.1177 },
    { name: 'NSUT (Netaji Subhas University of Technology)', code: 'NSUT', city: 'New Delhi', lat: 28.6080, lng: 77.0354 },
    { name: 'Amity University Noida Campus', code: 'AMITY-NOIDA', city: 'Noida', lat: 28.5447, lng: 77.3331 },
    { name: 'IISc Bengaluru (Indian Institute of Science)', code: 'IISC', city: 'Bengaluru', lat: 13.0219, lng: 77.5671 },
    { name: 'RV College of Engineering (RVCE)', code: 'RVCE', city: 'Bengaluru', lat: 12.9237, lng: 77.4987 },
    { name: 'PES University Bengaluru', code: 'PESU', city: 'Bengaluru', lat: 12.9344, lng: 77.5345 },
    { name: 'IIT Madras (Indian Institute of Technology)', code: 'IITM', city: 'Chennai', lat: 12.9915, lng: 80.2337 },
    { name: 'VIT Vellore (Vellore Institute of Technology)', code: 'VIT', city: 'Vellore', lat: 12.9698, lng: 79.1559 },
    { name: 'NIT Trichy (National Institute of Technology)', code: 'NITT', city: 'Trichy', lat: 10.7589, lng: 78.8132 },
    { name: 'IIT Kanpur', code: 'IITK', city: 'Kanpur', lat: 26.5123, lng: 80.2329 },
    { name: 'IIT BHU Varanasi', code: 'IIT-BHU', city: 'Varanasi', lat: 25.2677, lng: 82.9913 },
    { name: 'IIT Hyderabad', code: 'IITH', city: 'Hyderabad', lat: 17.5947, lng: 78.1230 },
    { name: 'IIIT Hyderabad', code: 'IIITH', city: 'Hyderabad', lat: 17.4455, lng: 78.3489 },
    { name: 'BITS Pilani (Main Campus)', code: 'BITS-PILANI', city: 'Pilani', lat: 28.3639, lng: 75.5870 },
    { name: 'MNIT Jaipur', code: 'MNIT', city: 'Jaipur', lat: 26.8640, lng: 75.8108 },
    { name: 'IIT Kharagpur', code: 'IITKGP', city: 'Kharagpur', lat: 22.3149, lng: 87.3105 },
    { name: 'IIT Gandhinagar', code: 'IITGN', city: 'Gandhinagar', lat: 23.2115, lng: 72.6842 },
    { name: 'Thapar Institute of Engineering Patiala', code: 'TIET', city: 'Patiala', lat: 30.3564, lng: 76.3647 },
  ];

  let primaryCollegeId = '';
  let primaryCampusId = '';

  for (const c of collegesList) {
    const cId = cityMap[c.city] || Object.values(cityMap)[0];
    const uni = await prisma.university.create({
      data: { name: `${c.name} University Board`, shortName: c.code, cityId: cId },
    });
    const colRecord = await prisma.college.create({
      data: {
        name: c.name,
        code: c.code,
        universityId: uni.id,
        cityId: cId,
        address: `${c.city}, India`,
        latitude: c.lat,
        longitude: c.lng,
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
      },
    });

    const campusRecord = await prisma.campus.create({
      data: { name: 'Main Academic & Residential Campus', collegeId: colRecord.id },
    });

    const domainMap: Record<string, string> = {
      'IITB': 'iitb.ac.in',
      'IISC': 'iisc.ac.in',
      'DU': 'du.ac.in',
      'IITD': 'iitd.ac.in',
      'BITS': 'pilani.bits-pilani.ac.in',
      'NITK': 'nitk.edu.in',
      'SRM': 'srmist.edu.in',
    };
    const domainStr = domainMap[c.code] || `${c.code.toLowerCase()}.ac.in`;
    await prisma.collegeDomain.create({
      data: {
        collegeId: colRecord.id,
        domain: domainStr,
        isPrimary: true,
        isActive: true,
      },
    });

    if (c.code === 'IITB') {
      primaryCollegeId = colRecord.id;
      primaryCampusId = campusRecord.id;
    }
  }

  // 4. Primary Canteen
  const centralCanteen = await prisma.canteen.create({
    data: {
      name: 'CampusBite Central Food Hub',
      slug: 'campusbite-central-iitb',
      collegeId: primaryCollegeId,
      campusId: primaryCampusId,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      description: 'Official Multi-Cuisine Campus Food Station serving authentic North, South, West, East, Street Food, Biryani, Chinese & Combos.',
      rating: 4.85,
      isVegOnly: false,
      status: 'ACTIVE',
      prepTimeAvgMinutes: 8,
      crowdLevel: 'LOW',
      latitude: 19.1338,
      longitude: 72.9138,
    },
  });

  // 5. Kitchen Stations & Counters
  await prisma.kitchenStation.create({ data: { canteenId: centralCanteen.id, name: 'North & Curry Station', type: 'NORTH_INDIAN' } });
  await prisma.kitchenStation.create({ data: { canteenId: centralCanteen.id, name: 'Dosa & Tiffin Counter', type: 'SOUTH_INDIAN' } });
  await prisma.kitchenStation.create({ data: { canteenId: centralCanteen.id, name: 'Chinese & Fast Food', type: 'FAST_FOOD' } });
  await prisma.kitchenStation.create({ data: { canteenId: centralCanteen.id, name: 'Beverage & Snacks Bar', type: 'BEVERAGE' } });

  await prisma.pickupCounter.create({
    data: { canteenId: centralCanteen.id, code: 'Counter A', name: 'Main Pickup Counter A', location: 'Ground Floor Left' },
  });
  await prisma.pickupCounter.create({
    data: { canteenId: centralCanteen.id, code: 'Express Counter B', name: 'Express Quick Snack Counter', location: 'Ground Floor Right' },
  });

  // Pickup Slots
  const slots = [
    { startTime: '12:00', endTime: '12:15' },
    { startTime: '12:15', endTime: '12:30' },
    { startTime: '12:30', endTime: '12:45' },
    { startTime: '12:45', endTime: '13:00' },
    { startTime: '13:00', endTime: '13:15' },
    { startTime: '13:15', endTime: '13:30' },
  ];
  for (const s of slots) {
    await prisma.pickupSlot.create({
      data: { canteenId: centralCanteen.id, startTime: s.startTime, endTime: s.endTime, maxOrders: 35, currentOrders: 6 },
    });
  }

  // 6. ALL 12 MENU CATEGORIES WITH HIGH-RES GOOGLE / UNSPLASH FOOD PHOTOGRAPHY REFERENCES
  const categoriesData = [
    {
      name: 'North Indian',
      tagline: 'Rich Flavours, Timeless Classics',
      icon: '🍲',
      color: '#A0522D',
      items: [
        { name: 'Chole Bhature', price: 70, isVeg: true, rating: 4.9, prep: 8, img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80', desc: 'Fluffy fried bhature with spiced chickpea curry, pickled onions & mint chutney.' },
        { name: 'Rajma Chawal', price: 60, isVeg: true, rating: 4.8, prep: 5, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', desc: 'Homestyle slow-cooked red kidney beans gravy served over steamed basmati rice.' },
        { name: 'Dal Makhani', price: 70, isVeg: true, rating: 4.9, prep: 8, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Creamy black lentils simmered overnight with butter, cream and mild spices.' },
        { name: 'Paneer Butter Masala', price: 80, isVeg: true, rating: 4.9, prep: 10, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', desc: 'Soft cottage cheese cubes in rich tomato-cashew buttery gravy.' },
        { name: 'Aloo Paratha (2 pcs)', price: 50, isVeg: true, rating: 4.7, prep: 6, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Whole wheat flatbreads stuffed with spiced mashed potatoes, served with curd & pickle.' },
        { name: 'Stuffed Kulcha', price: 50, isVeg: true, rating: 4.7, prep: 6, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', desc: 'Crispy tandoor-baked kulcha filled with spiced paneer & potato stuffing.' },
        { name: 'Kadhi Chawal', price: 50, isVeg: true, rating: 4.6, prep: 5, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', desc: 'Tangy gram flour yogurt curry with crispy onion pakoras over fragrant rice.' },
      ],
    },
    {
      name: 'South Indian',
      tagline: 'Light. Healthy. Delicious.',
      icon: '🥞',
      color: '#2E8B57',
      items: [
        { name: 'Masala Dosa', price: 60, isVeg: true, rating: 4.9, prep: 7, img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', desc: 'Crispy golden rice crepe filled with tempered potato masala, with coconut chutney & sambar.' },
        { name: 'Plain Dosa', price: 50, isVeg: true, rating: 4.8, prep: 5, img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', desc: 'Classic golden crispy dosa served hot with sambar and fresh chutneys.' },
        { name: 'Idli (2 pcs)', price: 40, isVeg: true, rating: 4.7, prep: 4, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', desc: 'Steamed fluffy rice and lentil cakes served with drumstick sambar.' },
        { name: 'Medu Vada (2 pcs)', price: 40, isVeg: true, rating: 4.8, prep: 5, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Crispy golden fried lentil fritters infused with peppercorns & curry leaves.' },
        { name: 'Pongal', price: 50, isVeg: true, rating: 4.7, prep: 6, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Warm comforting rice & moong dal dish tempered with ghee, cashews & cumin.' },
        { name: 'Uttapam', price: 55, isVeg: true, rating: 4.8, prep: 8, img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', desc: 'Thick soft pancake topped with chopped onions, tomatoes, coriander & green chillies.' },
        { name: 'Rasam Rice', price: 40, isVeg: true, rating: 4.6, prep: 4, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Steamed rice served with aromatic pepper-tomato tamarind soup & papad.' },
        { name: 'Curd Rice', price: 40, isVeg: true, rating: 4.7, prep: 3, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Cool tempered yogurt rice with mustard seeds, curry leaves, pomegranate & pickle.' },
      ],
    },
    {
      name: 'West Indian',
      tagline: 'Vibrant Tastes, Every Bite',
      icon: '🥪',
      color: '#D97706',
      items: [
        { name: 'Vada Pav', price: 30, isVeg: true, rating: 4.9, prep: 3, img: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', desc: 'The Mumbai classic spiced potato patty inside soft bun with dry garlic chutney.' },
        { name: 'Pav Bhaji', price: 60, isVeg: true, rating: 4.9, prep: 7, img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', desc: 'Mashed spiced butter vegetable curry served with toasted buttered pav buns.' },
        { name: 'Misal Pav', price: 50, isVeg: true, rating: 4.8, prep: 5, img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', desc: 'Spicy sprouted moth bean curry topped with farsan, onions and lemon, with pav.' },
        { name: 'Dabeli', price: 40, isVeg: true, rating: 4.7, prep: 4, img: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', desc: 'Sweet & spicy potato filling with pomegranate, peanuts & sev in grilled bun.' },
        { name: 'Thepla (2 pcs)', price: 40, isVeg: true, rating: 4.7, prep: 4, img: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', desc: 'Gujarati spiced fenugreek whole wheat flatbreads with mango chunda & curd.' },
        { name: 'Khandvi', price: 40, isVeg: true, rating: 4.6, prep: 5, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Delicate rolled gram flour & yogurt snacks tempered with mustard seeds & coconut.' },
        { name: 'Poha', price: 35, isVeg: true, rating: 4.8, prep: 3, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Flattened rice tossed with onions, turmeric, crunchy roasted peanuts & fresh coriander.' },
        { name: 'Sabudana Khichdi', price: 40, isVeg: true, rating: 4.7, prep: 5, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Tapioca pearls sautéed with roasted crushed peanuts, cumin & green chillies.' },
      ],
    },
    {
      name: 'East Indian',
      tagline: 'Unique Flavours, Rich Heritage',
      icon: '🥟',
      color: '#1E3A8A',
      items: [
        { name: 'Veg Momos', price: 50, isVeg: true, rating: 4.8, prep: 6, img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', desc: 'Steamed Tibetan dumplings stuffed with seasoned finely minced vegetables & fiery red chutney.' },
        { name: 'Chicken Momos', price: 70, isVeg: false, rating: 4.9, prep: 7, img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', desc: 'Juicy steamed dumplings filled with tender minced chicken & aromatics with spicy dip.' },
        { name: 'Kathi Roll (Veg)', price: 60, isVeg: true, rating: 4.8, prep: 6, img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', desc: 'Kolkata style paratha wrap filled with spiced paneer, onions, capsicum & tangy sauces.' },
        { name: 'Kathi Roll (Chicken)', price: 80, isVeg: false, rating: 4.9, prep: 7, img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', desc: 'Egg-layered paratha wrapped around succulent marinated chicken tikka pieces.' },
        { name: 'Egg Roll', price: 60, isVeg: false, rating: 4.7, prep: 5, img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', desc: 'Crisp paratha with double egg coating, filled with crunchy onions, chaat masala & lime.' },
        { name: 'Litti Chokha', price: 50, isVeg: true, rating: 4.8, prep: 8, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Bihari wheat balls stuffed with sattu roasted over coal, with smoked baingan chokha.' },
        { name: 'Pakhala Bhata', price: 40, isVeg: true, rating: 4.6, prep: 4, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Traditional Odia fermented rice in curd water served with roasted potato mash & badi chura.' },
        { name: 'Macher Jhol (Fish Curry)', price: 80, isVeg: false, rating: 4.8, prep: 10, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Bengali style light mustard fish curry cooked with potatoes & panch phoron.' },
      ],
    },
    {
      name: 'Street Food',
      tagline: 'Campus Favourites',
      icon: '🥙',
      color: '#EA580C',
      items: [
        { name: 'Pani Puri (6 pcs)', price: 30, isVeg: true, rating: 4.9, prep: 3, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Crisp hollow puris filled with spiced potato-chickpeas and spicy mint-tamarind water.' },
        { name: 'Bhel Puri', price: 40, isVeg: true, rating: 4.7, prep: 3, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Puffed rice tossed with onions, tomatoes, spicy garlic chutney & sweet tamarind dip.' },
        { name: 'Sev Puri', price: 40, isVeg: true, rating: 4.8, prep: 4, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Flat papdis loaded with diced potatoes, onions, three signature chutneys & nylon sev.' },
        { name: 'Aloo Tikki', price: 40, isVeg: true, rating: 4.7, prep: 5, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Pan-fried spiced potato patties served with warm chole, curd and mint-tamarind chutneys.' },
        { name: 'Dahi Puri', price: 45, isVeg: true, rating: 4.8, prep: 4, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Crispy puris stuffed with potato mash, sweetened chilled yogurt, chutneys & sev.' },
        { name: 'Papdi Chaat', price: 45, isVeg: true, rating: 4.8, prep: 4, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Crunchy wheat crackers layered with boiled potatoes, chickpeas, curd & tangy spice mix.' },
        { name: 'Samosa (2 pcs)', price: 30, isVeg: true, rating: 4.9, prep: 3, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Golden triangular crispy pastry packed with spiced potato & green pea filling.' },
        { name: 'Kachori (2 pcs)', price: 35, isVeg: true, rating: 4.7, prep: 3, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', desc: 'Flaky deep-fried pastry stuffed with spiced moong dal mixture, with imli chutney.' },
      ],
    },
    {
      name: 'Rice & Biryani',
      tagline: 'For the Rice Lovers',
      icon: '🍚',
      color: '#6D28D9',
      items: [
        { name: 'Veg Biryani', price: 70, isVeg: true, rating: 4.8, prep: 7, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', desc: 'Fragrant basmati rice layered with garden vegetables, saffron & whole spices, with raita.' },
        { name: 'Chicken Biryani', price: 90, isVeg: false, rating: 4.95, prep: 8, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', desc: 'Authentic Hyderabadi dum biryani cooked with marinated chicken pieces & spices.' },
        { name: 'Egg Biryani', price: 80, isVeg: false, rating: 4.8, prep: 7, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', desc: 'Aromatic layered biryani rice served with golden-fried boiled eggs & salan.' },
        { name: 'Jeera Rice', price: 40, isVeg: true, rating: 4.6, prep: 4, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Basmati rice tempered with pure ghee, whole roasted cumin seeds & fresh coriander.' },
        { name: 'Steamed Rice', price: 30, isVeg: true, rating: 4.5, prep: 3, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Simple, fluffy long-grain steamed white basmati rice.' },
        { name: 'Curd Rice', price: 40, isVeg: true, rating: 4.7, prep: 3, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Traditional South Indian curd rice with mustard, ginger, green chillies & pickle.' },
        { name: 'Fried Rice (Veg)', price: 60, isVeg: true, rating: 4.7, prep: 6, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', desc: 'Wok-tossed rice with shredded carrots, cabbage, spring onions & soya sauce.' },
        { name: 'Fried Rice (Chicken)', price: 80, isVeg: false, rating: 4.85, prep: 7, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', desc: 'Chinese wok-tossed fried rice with egg ribbons, shredded chicken & scallions.' },
      ],
    },
    {
      name: 'Chinese',
      tagline: 'Bold. Spicy. Always a Hit.',
      icon: '🍜',
      color: '#DC2626',
      items: [
        { name: 'Veg Fried Noodles', price: 60, isVeg: true, rating: 4.7, prep: 6, img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', desc: 'Classic hakka noodles stir-fried in high flame with fresh bell peppers, cabbage & sauces.' },
        { name: 'Chicken Noodles', price: 80, isVeg: false, rating: 4.9, prep: 7, img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', desc: 'Wok-tossed noodles with spiced chicken chunks, scrambled egg & chilli garlic sauce.' },
        { name: 'Veg Manchurian', price: 70, isVeg: true, rating: 4.8, prep: 7, img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', desc: 'Crispy vegetable dumplings coated in rich spicy soya-garlic gravy with spring onions.' },
        { name: 'Chilli Chicken', price: 90, isVeg: false, rating: 4.9, prep: 8, img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', desc: 'Crispy batter-fried chicken bites tossed with capsicum, onion petals & hot garlic sauce.' },
        { name: 'Spring Rolls (Veg)', price: 60, isVeg: true, rating: 4.7, prep: 6, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', desc: 'Golden crispy rolls packed with julienned sauteed vegetables, with sweet chilli dip.' },
        { name: 'Spring Rolls (Chicken)', price: 80, isVeg: false, rating: 4.8, prep: 7, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', desc: 'Crunchy golden wrappers loaded with seasoned minced chicken and oriental spices.' },
        { name: 'Schezuan Rice', price: 70, isVeg: true, rating: 4.8, prep: 6, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', desc: 'Spicy fiery red fried rice tossed with authentic Schezwan sauce & fresh veggies.' },
        { name: 'Chilli Paneer', price: 80, isVeg: true, rating: 4.85, prep: 7, img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', desc: 'Paneer cubes wok-tossed with green bell peppers, dark soya sauce and green chillies.' },
      ],
    },
    {
      name: 'Beverages',
      tagline: 'Refresh. Recharge.',
      icon: '🥤',
      color: '#0284C7',
      items: [
        { name: 'Masala Chai', price: 15, isVeg: true, rating: 4.9, prep: 2, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', desc: 'Hot freshly brewed Indian tea infused with cardamom, ginger, cloves and milk.' },
        { name: 'Filter Coffee', price: 20, isVeg: true, rating: 4.9, prep: 3, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', desc: 'Authentic South Indian chicory filter coffee with frothy hot milk.' },
        { name: 'Cold Coffee', price: 50, isVeg: true, rating: 4.85, prep: 4, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80', desc: 'Blended chilled espresso with creamy milk, vanilla ice cream scoop and chocolate syrup.' },
        { name: 'Lassi (Sweet/Salted)', price: 40, isVeg: true, rating: 4.8, prep: 3, img: 'https://images.unsplash.com/photo-1571006682858-a458b8a69288?auto=format&fit=crop&w=800&q=80', desc: 'Thick traditional churned yogurt drink flavoured with cardamom and fresh malai.' },
        { name: 'Lemonade', price: 30, isVeg: true, rating: 4.6, prep: 2, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', desc: 'Refreshing sweet chilled lemonade made with freshly squeezed lemons & mint.' },
        { name: 'Fresh Lime Soda', price: 30, isVeg: true, rating: 4.7, prep: 2, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', desc: 'Fizzy carbonated soda with fresh lime juice, black salt, and sugar or salt syrup.' },
        { name: 'Iced Tea', price: 35, isVeg: true, rating: 4.6, prep: 2, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80', desc: 'Crisp cold black tea infused with lemon slices and mint over ice cubes.' },
        { name: 'Soft Drinks (500ml)', price: 40, isVeg: true, rating: 4.8, prep: 1, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', desc: 'Chilled bottle of your choice (Thums Up, Coca-Cola, Sprite, Fanta).' },
      ],
    },
    {
      name: 'Snacks & Quick Bites',
      tagline: 'Perfect for a Short Break',
      icon: '🥪',
      color: '#78350F',
      items: [
        { name: 'Veg Sandwich', price: 50, isVeg: true, rating: 4.7, prep: 5, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', desc: 'Fresh cucumber, tomato, beetroot slices with mint chutney & butter between soft bread.' },
        { name: 'Cheese Sandwich', price: 60, isVeg: true, rating: 4.8, prep: 5, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', desc: 'Toasted sandwich loaded with melted cheddar cheese, herbs and green chutney.' },
        { name: 'Paneer Roll', price: 60, isVeg: true, rating: 4.8, prep: 6, img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', desc: 'Grilled spiced paneer cubes wrapped in a soft flaky roti with sliced onions.' },
        { name: 'Chicken Roll', price: 80, isVeg: false, rating: 4.9, prep: 6, img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', desc: 'Juicy spiced chicken tikka wrapped in warm flaky flatbread with mint sauce.' },
        { name: 'French Fries', price: 50, isVeg: true, rating: 4.7, prep: 5, img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', desc: 'Crisp golden salted potato fries served hot with tomato ketchup & mayo dip.' },
        { name: 'Cheese Maggi', price: 50, isVeg: true, rating: 4.85, prep: 5, img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', desc: 'Classic college 2-minute instant noodles topped with generous melted cheese.' },
        { name: 'Veg Maggi', price: 40, isVeg: true, rating: 4.7, prep: 4, img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', desc: 'Hot masala Maggi tossed with chopped peas, carrots, onions & butter.' },
        { name: 'Chicken Maggi', price: 60, isVeg: false, rating: 4.8, prep: 5, img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', desc: 'Spiced Maggi noodles cooked with shredded chicken pieces and extra tastemaker.' },
      ],
    },
    {
      name: 'Desserts',
      tagline: 'Sweet Endings',
      icon: '🍨',
      color: '#9D174D',
      items: [
        { name: 'Gulab Jamun (2 pcs)', price: 30, isVeg: true, rating: 4.9, prep: 2, img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', desc: 'Warm soft milk-solid dumplings soaked in rose and cardamom flavoured sugar syrup.' },
        { name: 'Rasgulla (2 pcs)', price: 30, isVeg: true, rating: 4.8, prep: 2, img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', desc: 'Spongy cottage cheese balls cooked in light fragrant sugar syrup.' },
        { name: 'Kheer', price: 40, isVeg: true, rating: 4.8, prep: 3, img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', desc: 'Traditional slow-simmered rice pudding enriched with saffron, cardamom and dry fruits.' },
        { name: 'Ice Cream (1 scoop)', price: 30, isVeg: true, rating: 4.7, prep: 2, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', desc: 'Chilled creamy ice cream scoop (Vanilla, Chocolate, Butterscotch, Strawberry).' },
        { name: 'Jalebi (2 pcs)', price: 30, isVeg: true, rating: 4.85, prep: 3, img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', desc: 'Crispy fried spiral sweet pretzel soaked in saffron saffron sugar syrup.' },
        { name: 'Moong Dal Halwa', price: 40, isVeg: true, rating: 4.9, prep: 4, img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80', desc: 'Rich Rajasthani dessert made with ground yellow lentils, pure ghee and cashews.' },
      ],
    },
    {
      name: 'Meal Combos',
      tagline: 'Great Food. Better Value.',
      icon: '🍱',
      color: '#B45309',
      items: [
        { name: 'North Indian Thali', price: 90, isVeg: true, rating: 4.9, prep: 8, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', desc: 'Complete meal: Dal Makhani, Paneer Sabzi, Basmati Rice, 2 Butter Rotis, Salad & Sweet.' },
        { name: 'South Indian Combo', price: 80, isVeg: true, rating: 4.9, prep: 7, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', desc: '1 Butter Masala Dosa + 2 Steamed Idlis + Hot Sambar & 2 Chutneys.' },
        { name: 'Chinese Combo', price: 90, isVeg: true, rating: 4.85, prep: 8, img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', desc: 'Veg Hakka Noodles + Veg Manchurian Gravy + Fresh Cold Soft Drink.' },
        { name: 'Student Special', price: 70, isVeg: true, rating: 4.9, prep: 6, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', desc: 'Spiced Veg Dum Biryani + Cucumber Mint Raita + Cold Soft Drink.' },
      ],
    },
    {
      name: 'Diet & Healthy Options',
      tagline: 'Nutrition for a Better You',
      icon: '🥗',
      color: '#059669',
      items: [
        { name: 'Sprouts Salad', price: 50, isVeg: true, rating: 4.7, prep: 3, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', desc: 'High-protein sprouted green moong salad with tomatoes, cucumber, lemon juice & chat masala.' },
        { name: 'Grilled Sandwich', price: 60, isVeg: true, rating: 4.8, prep: 5, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', desc: 'Brown bread grilled sandwich filled with crisp bell peppers, zucchini, corn & low-fat paneer.' },
        { name: 'Boiled Egg (2 pcs)', price: 30, isVeg: false, rating: 4.6, prep: 2, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80', desc: 'Two farm-fresh hard boiled eggs sprinkled with black pepper & rock salt.' },
        { name: 'Oats Upma', price: 40, isVeg: true, rating: 4.7, prep: 5, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', desc: 'Fiber-rich rolled oats cooked with roasted vegetables, mustard seeds and curry leaves.' },
        { name: 'Multigrain Roti Thali', price: 70, isVeg: true, rating: 4.8, prep: 7, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', desc: '3 Multigrain rotis served with steamed yellow dal tadka, seasonal green sabzi & green salad.' },
        { name: 'Fruit Bowl', price: 50, isVeg: true, rating: 4.8, prep: 3, img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80', desc: 'Seasonal fresh cut fruits (Apple, Papaya, Banana, Pomegranate) with chia seeds.' },
      ],
    },
  ];

  let orderIndex = 1;
  for (const cat of categoriesData) {
    const catRecord = await prisma.category.create({
      data: {
        canteenId: centralCanteen.id,
        name: cat.name,
        displayOrder: orderIndex++,
        icon: cat.icon,
      },
    });

    for (const item of cat.items) {
      await prisma.foodItem.create({
        data: {
          canteenId: centralCanteen.id,
          categoryId: catRecord.id,
          name: item.name,
          description: item.desc,
          price: item.price,
          isVeg: item.isVeg,
          isAvailable: true,
          rating: item.rating,
          prepTimeMinutes: item.prep,
          image: item.img,
          calories: item.isVeg ? 250 : 380,
          spiceLevel: item.name.includes('Chilli') || item.name.includes('Misal') ? 'HIGH' : 'MEDIUM',
        },
      });
    }
  }

  // 7. Demo Users
  const demoPassword = 'CampusBite@123';

  // Student
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@campusbite.in',
      passwordHash: demoPassword,
      name: 'Aarav Sharma',
      phone: '+91 9876543210',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    },
  });

  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      collegeId: primaryCollegeId,
      campusId: primaryCampusId,
      course: 'B.Tech Computer Science',
      year: 3,
      rollNumber: '210050012',
      dietaryPref: 'VEG',
    },
  });

  await prisma.campusWallet.create({
    data: { studentId: studentProfile.id, balance: 750.0 },
  });

  const studentMembership = await prisma.collegeMembership.create({
    data: {
      userId: studentUser.id,
      collegeId: primaryCollegeId,
      campusId: primaryCampusId,
      studentId: '210050012',
      status: 'ACTIVE',
      verifiedAt: new Date(),
      verificationMethod: 'COLLEGE_EMAIL_AND_ID',
    },
  });

  await prisma.studentVerification.create({
    data: {
      userId: studentUser.id,
      collegeMembershipId: studentMembership.id,
      emailVerified: true,
      idCardVerified: true,
      status: 'COLLEGE_VERIFIED',
      verificationMethod: 'EMAIL_AND_ID',
      reviewedAt: new Date(),
    },
  });

  // Canteen Owner
  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@campusbite.in',
      passwordHash: demoPassword,
      name: 'Rajesh Patel',
      phone: '+91 9876543211',
      role: 'CANTEEN_OWNER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  await prisma.vendorProfile.create({
    data: {
      userId: ownerUser.id,
      canteenId: centralCanteen.id,
      businessRegNo: 'MH-CAN-2024-88',
      gstNo: '27AAACG1234F1Z5',
    },
  });

  // Kitchen Staff
  await prisma.user.create({
    data: {
      email: 'kitchen@campusbite.in',
      passwordHash: demoPassword,
      name: 'Vikram Singh',
      phone: '+91 9876543212',
      role: 'KITCHEN_STAFF',
    },
  });

  // College Admin
  await prisma.user.create({
    data: {
      email: 'collegeadmin@campusbite.in',
      passwordHash: demoPassword,
      name: 'Dr. Meenakshi Sundaram',
      phone: '+91 9876543213',
      role: 'COLLEGE_ADMIN',
    },
  });

  // Super Admin
  await prisma.user.create({
    data: {
      email: 'superadmin@campusbite.in',
      passwordHash: demoPassword,
      name: 'CampusBite SuperAdmin',
      phone: '+91 9876543214',
      role: 'SUPER_ADMIN',
    },
  });

  // Seed Campus Promo Coupons
  await prisma.coupon.create({
    data: {
      canteenId: centralCanteen.id,
      code: 'WELCOME50',
      discountType: 'PERCENTAGE',
      discountValue: 20, // 20% discount
      minOrderValue: 99,
      maxDiscount: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      usageLimit: 500,
    },
  });

  await prisma.coupon.create({
    data: {
      canteenId: centralCanteen.id,
      code: 'CAMPUS10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 50,
      maxDiscount: 30,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      usageLimit: 1000,
    },
  });

  console.log('✅ Complete Indian Campus Menu & All-India Colleges Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
