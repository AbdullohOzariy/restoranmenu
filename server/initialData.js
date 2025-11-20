const initialBranches = [
  { id: '1', name: 'Markaziy Filial', address: 'Amir Temur ko\'chasi, 15', phone: '+998 90 123 45 67', isActive: true },
  { id: '2', name: 'Chilonzor Filiali', address: 'Bunyodkor shoh ko\'chasi, 5', phone: '+998 90 987 65 43', isActive: true },
];

const initialCategories = [
  { id: '1', name: 'Pitsalar', sortOrder: 1 },
  { id: '2', name: 'Lavashlar', sortOrder: 2 },
  { id: '3', name: 'Ichimliklar', sortOrder: 3 },
  { id: '4', name: 'Shirinliklar', sortOrder: 4 },
];

const initialItems = [
  {
    id: '101',
    name: 'Pepperoni Pitsa',
    description: 'Mol go\'shti, motsarella pishlog\'i, maxsus sous, pepperoni.',
    variants: [
      { name: '30sm', price: 85000 },
      { name: '40sm', price: 105000 },
    ],
    imageUrl: 'https://picsum.photos/800/450?random=1',
    categoryId: '1',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '102',
    name: 'Margarita Pitsa',
    description: 'Pomidor, motsarella pishlog\'i, oregano.',
    variants: [
      { name: 'Standard', price: 70000 },
    ],
    imageUrl: 'https://picsum.photos/800/450?random=2',
    categoryId: '1',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: '201',
    name: 'Lavash',
    description: 'Tovuq yoki mol go\'shti, bodring, pomidor, chips, sous.',
    variants: [
      { name: 'Mol go\'shtli', price: 35000 },
      { name: 'Tovuq go\'shtli', price: 32000 },
    ],
    imageUrl: 'https://picsum.photos/800/450?random=3',
    categoryId: '2',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '301',
    name: 'Coca Cola',
    description: 'Yaxna ichimlik.',
    variants: [
      { name: '0.5L', price: 12000 },
      { name: '1.5L', price: 18000 },
    ],
    imageUrl: 'https://picsum.photos/800/450?random=4',
    categoryId: '3',
    branchIds: ['1', '2'],
    isActive: true,
    sortOrder: 1,
  },
];

const initialSettings = {
  brandName: 'Lazzat Food',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
  primaryColor: '#e11d48',
  headingColor: '#1f2937',
  bodyTextColor: '#4b5563',
  adminPassword: 'admin',
};

module.exports = {
  branches: initialBranches,
  categories: initialCategories,
  items: initialItems,
  settings: initialSettings,
};
