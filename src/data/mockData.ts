export const lotteries = [
  {
    id: 1,
    name: "Удача +",
    description: "Традиционная лотерея с высоким шансом выигрыша",
    image: "/placeholder.svg",
    nextDraw: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min from now
    ticketPrice: 100,
    prizePool: 25000,
    jackpot: 10000,
    remainingTickets: 150,
    totalTickets: 500,
    prizeDistribution: "50% призовой фонд, 20% мгновенные выигрыши, 30% джекпот",
    drawFrequency: "Каждые 15 минут",
    participantsCount: 320,
    rules: "Победители определяются каждые 15 минут. Совпадение 6 из 36 чисел даёт главный приз.",
    popularityScore: 4.8,
    type: "traditional",
  },
  {
    id: 2,
    name: "Бонус Лото",
    description: "Лотерея с мгновенными выигрышами и бонусами за участие",
    image: "/placeholder.svg",
    nextDraw: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min from now
    ticketPrice: 150,
    prizePool: 35000,
    jackpot: 15000,
    remainingTickets: 200,
    totalTickets: 700,
    prizeDistribution: "60% призовой фонд, 15% мгновенные выигрыши, 25% джекпот",
    drawFrequency: "Каждые 30 минут",
    participantsCount: 480,
    rules: "Победители определяются каждые 30 минут. Совпадение 5 из 45 чисел даёт главный приз.",
    popularityScore: 4.5,
    type: "traditional",
  },
  {
    id: 3,
    name: "Экспресс Джекпот",
    description: "Быстрые розыгрыши с нарастающим джекпотом",
    image: "/placeholder.svg",
    nextDraw: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min from now
    ticketPrice: 200,
    prizePool: 50000,
    jackpot: 25000,
    remainingTickets: 100,
    totalTickets: 300,
    prizeDistribution: "70% призовой фонд, 10% мгновенные выигрыши, 20% джекпот",
    drawFrequency: "Каждые 10 минут",
    participantsCount: 290,
    rules: "Победители определяются каждые 10 минут. Совпадение 4 из 20 чисел даёт главный приз.",
    popularityScore: 4.9,
    type: "traditional",
  },
  {
    id: 4,
    name: "Сокровище Империи",
    description: "Стратегическая игра с использованием бонусной валюты",
    image: "/placeholder.svg",
    nextDraw: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 min from now
    ticketPrice: 0, // Free with bonus currency
    bonusCost: 500,
    prizePool: "Бонусная валюта + игровые предметы",
    jackpot: "10000 бонусных монет",
    remainingTickets: "Не ограничено",
    totalTickets: -1,
    prizeDistribution: "80% бонусные монеты, 20% игровые предметы",
    drawFrequency: "Каждый час",
    participantsCount: 1200,
    rules: "Стратегическая игра с использованием бонусной валюты. Постройте свою империю и выигрывайте ценные призы.",
    popularityScore: 4.7,
    type: "strategic",
  },
  {
    id: 5,
    name: "АвтоНомер",
    description: "Угадайте автомобильный номер и выиграйте приз",
    image: "/placeholder.svg",
    nextDraw: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 min from now
    ticketPrice: 120,
    prizePool: 30000,
    jackpot: 12000,
    remainingTickets: 180,
    totalTickets: 600,
    prizeDistribution: "55% призовой фонд, 15% мгновенные выигрыши, 30% джекпот",
    drawFrequency: "Каждые 45 минут",
    participantsCount: 350,
    rules: "Угадайте автомобильный номер в формате: 1 буква - 3 цифры - 2 цифры - 2 цифры (например, А123-45-67). Полное совпадение даёт джекпот, частичное - денежные призы.",
    popularityScore: 4.7,
    type: "special",
  },
];

export const miniGames = [
  {
    id: 1,
    name: "Счастливое Колесо",
    description: "Крутите колесо и выигрывайте призы",
    image: "/placeholder.svg",
    bonusReward: "10-100 бонусных монет",
    averagePlayTime: "30 секунд",
    popularity: 4.8,
  },
  {
    id: 2,
    name: "Сокровища Пирамиды",
    description: "Найдите скрытые сокровища в пирамиде",
    image: "/placeholder.svg",
    bonusReward: "50-200 бонусных монет",
    averagePlayTime: "2 минуты",
    popularity: 4.6,
  },
  {
    id: 3,
    name: "Космические Гонки",
    description: "Управляйте космическим кораблем и собирайте бонусы",
    image: "/placeholder.svg",
    bonusReward: "20-150 бонусных монет",
    averagePlayTime: "1 минута",
    popularity: 4.7,
  },
  {
    id: 4,
    name: "Wordle",
    description: "Угадайте слово из 5 букв за 6 попыток",
    image: "/placeholder.svg",
    bonusReward: "30-150 бонусных монет",
    averagePlayTime: "3 минуты",
    popularity: 4.9,
  },
];

export const battlePassLevels = [
  {
    level: 1,
    reward: "100 бонусных монет",
    xpRequired: 100,
    completed: true
  },
  {
    level: 2,
    reward: "VIP скидка 5%",
    xpRequired: 300,
    completed: true
  },
  {
    level: 3,
    reward: "200 бонусных монет",
    xpRequired: 600,
    completed: true
  },
  {
    level: 4,
    reward: "Эксклюзивный аватар",
    xpRequired: 1000,
    completed: false
  },
  {
    level: 5,
    reward: "500 бонусных монет",
    xpRequired: 1500,
    completed: false
  },
  {
    level: 6,
    reward: "VIP скидка 10%",
    xpRequired: 2000,
    completed: false
  },
  {
    level: 7,
    reward: "Бесплатный билет",
    xpRequired: 2500,
    completed: false
  },
  {
    level: 8,
    reward: "800 бонусных монет",
    xpRequired: 3000,
    completed: false
  },
  {
    level: 9,
    reward: "VIP бонусы x2",
    xpRequired: 3500,
    completed: false
  },
  {
    level: 10,
    reward: "Эксклюзивный титул",
    xpRequired: 4000,
    completed: false
  }
];

export const userTickets = [
  {
    id: 1,
    lotteryId: 1,
    lotteryName: "Удача +",
    numbers: [5, 12, 18, 24, 30, 36],
    purchaseDate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    drawDate: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: 2,
    lotteryId: 2,
    lotteryName: "Бонус Лото",
    numbers: [7, 15, 23, 31, 42],
    purchaseDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    drawDate: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: 3,
    lotteryId: 3,
    lotteryName: "Экспресс Джекпот",
    numbers: [4, 8, 12, 16],
    purchaseDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    drawDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: "won",
    winAmount: 500,
  },
];

export const dailyTasks = [
  {
    id: 1,
    title: "Купить лотерейный билет",
    description: "Купите любой билет для участия в лотерее",
    reward: "50 бонусных монет",
    progress: 1,
    total: 1,
    completed: true
  },
  {
    id: 2,
    title: "Сыграть в мини-игры",
    description: "Сыграйте в 3 мини-игры",
    reward: "100 бонусных монет",
    progress: 2,
    total: 3,
    completed: false
  },
  {
    id: 3,
    title: "Пригласить друга",
    description: "Пригласите друга на платформу",
    reward: "200 бонусных монет",
    progress: 0,
    total: 1,
    completed: false
  }
];

export const weeklyTasks = [
  {
    id: 1,
    title: "Участие в 10 розыгрышах",
    description: "Примите участие в 10 различных лотереях",
    reward: "500 бонусных монет",
    progress: 3,
    total: 10,
    completed: false
  },
  {
    id: 2,
    title: "Выиграть в лотерее",
    description: "Выиграйте любой приз в лотерее",
    reward: "VIP очки 300",
    progress: 0,
    total: 1,
    completed: false
  }
];

export const vipLevels = [
  {
    level: 1,
    name: "Бронзовый",
    pointsRequired: 0,
    benefits: ["Бонус 3% к выигрышам", "Доступ к эксклюзивным акциям"]
  },
  {
    level: 2,
    name: "Серебряный",
    pointsRequired: 1000,
    benefits: ["Бонус 5% к выигрышам", "Ежедневный бонус 50 монет"]
  },
  {
    level: 3,
    name: "Золотой",
    pointsRequired: 5000,
    benefits: ["Бонус 10% к выигрышам", "Ежедневный бонус 100 монет", "Скидка 5% на покупку билетов"]
  },
  {
    level: 4,
    name: "Платиновый",
    pointsRequired: 15000,
    benefits: ["Бонус 15% к выигрышам", "Ежедневный бонус 250 монет", "Скидка 10% на покупку билетов", "Личный менеджер"]
  },
  {
    level: 5,
    name: "Бриллиантовый",
    pointsRequired: 50000,
    benefits: ["Бонус 25% к выигрышам", "Ежедневный бонус 500 монет", "Скидка 15% на покупку билетов", "Личный менеджер", "Эксклюзивные розыгрыши"]
  }
];

export const user = {
  id: 1,
  username: "Player123",
  email: "player@example.com",
  balance: 2500,
  bonusBalance: 1200,
  vipPoints: 3800,
  vipLevel: 3,
  registrationDate: "2023-01-15T00:00:00Z",
  purchaseHistory: [
    { date: "2023-05-18T14:30:00Z", amount: 1000, type: "Пополнение баланса" },
    { date: "2023-05-16T09:20:00Z", amount: 500, type: "Покупка билетов" },
    { date: "2023-05-10T11:15:00Z", amount: 200, type: "Покупка бонусов" }
  ],
  battlePassXp: 850,
  battlePassLevel: 3,
  completedQuests: 12,
  wonGames: 5,
  totalTicketsBought: 24
};
