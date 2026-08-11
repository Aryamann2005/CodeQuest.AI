export const user = {
  name: "Aarav Mehta",
  username: "@codeknight",
  avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aarav&backgroundColor=7c3aed",
  level: 24,
  xp: 4820,
  xpToNext: 6000,
  coins: 1245,
  streak: 12,
  rank: "Tree Guardian",
  title: "Tree Guardian",
  problemsSolved: 187,
  globalRank: 342,
};

export const bosses = [
  {
    id: "graph-dragon",
    name: "Graph Dragon",
    title: "Master of Connected Realms",
    difficulty: "Legendary",
    hp: 720,
    maxHp: 1000,
    rewards: { xp: 2500, coins: 800, item: "Dragon Slayer Title" },
    progress: 28,
    image: "🐉",
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    id: "array-titan",
    name: "Array Titan",
    title: "Colossus of Indexed Lands",
    difficulty: "Hard",
    hp: 0,
    maxHp: 600,
    rewards: { xp: 1500, coins: 500, item: "Titan Crown" },
    progress: 100,
    image: "⚔️",
    color: "from-blue-500 to-cyan-500",
    defeated: true,
  },
  {
    id: "dp-phoenix",
    name: "DP Phoenix",
    title: "Reborn of Subproblems",
    difficulty: "Mythic",
    hp: 1200,
    maxHp: 1200,
    rewards: { xp: 4000, coins: 1500, item: "Phoenix Cloak" },
    progress: 0,
    image: "🔥",
    color: "from-amber-500 to-rose-600",
  },
];

export const damageLog = [
  { time: "2m ago", action: "Solved 'Number of Islands'", damage: 180 },
  { time: "14m ago", action: "Used Hint Card (-XP)", damage: -50 },
  { time: "1h ago", action: "Solved 'Course Schedule'", damage: 220 },
  { time: "3h ago", action: "Critical Hit on 'Clone Graph'", damage: 320 },
  { time: "Yesterday", action: "Solved 'Word Ladder'", damage: 250 },
];

export const leaderboard = {
  global: [
    {
      rank: 1,
      name: "Riya Kapoor",
      title: "Legendary Developer",
      xp: 124800,
      solved: 1240,
      avatar: "Riya",
    },
    {
      rank: 2,
      name: "Kenji Tanaka",
      title: "Graph Dragon Slayer",
      xp: 118500,
      solved: 1198,
      avatar: "Kenji",
    },
    {
      rank: 3,
      name: "Sofia Alvarez",
      title: "Tree Guardian",
      xp: 109200,
      solved: 1102,
      avatar: "Sofia",
    },
    {
      rank: 4,
      name: "Marcus Chen",
      title: "Stack Warrior",
      xp: 98750,
      solved: 987,
      avatar: "Marcus",
    },
    {
      rank: 5,
      name: "Priya Sharma",
      title: "Linked List Knight",
      xp: 92100,
      solved: 945,
      avatar: "Priya",
    },
    {
      rank: 6,
      name: "Liam O'Brien",
      title: "Array Apprentice",
      xp: 88400,
      solved: 901,
      avatar: "Liam",
    },
    { rank: 7, name: "Yuki Sato", title: "Tree Guardian", xp: 84200, solved: 872, avatar: "Yuki" },
    {
      rank: 342,
      name: "Aarav Mehta (You)",
      title: "Tree Guardian",
      xp: 4820,
      solved: 187,
      avatar: "Aarav",
      you: true,
    },
  ],
  friends: [
    {
      rank: 1,
      name: "Devansh",
      title: "Graph Dragon Slayer",
      xp: 14200,
      solved: 412,
      avatar: "Devansh",
    },
    {
      rank: 2,
      name: "Aarav Mehta (You)",
      title: "Tree Guardian",
      xp: 4820,
      solved: 187,
      avatar: "Aarav",
      you: true,
    },
    { rank: 3, name: "Sneha", title: "Stack Warrior", xp: 3960, solved: 154, avatar: "Sneha" },
    {
      rank: 4,
      name: "Vikram",
      title: "Linked List Knight",
      xp: 2800,
      solved: 112,
      avatar: "Vikram",
    },
  ],
  college: [
    {
      rank: 1,
      name: "Ananya Iyer",
      title: "Tree Guardian",
      xp: 8420,
      solved: 298,
      avatar: "Ananya",
    },
    {
      rank: 2,
      name: "Rohit Verma",
      title: "Stack Warrior",
      xp: 7100,
      solved: 241,
      avatar: "Rohit",
    },
    {
      rank: 3,
      name: "Aarav Mehta (You)",
      title: "Tree Guardian",
      xp: 4820,
      solved: 187,
      avatar: "Aarav",
      you: true,
    },
    {
      rank: 4,
      name: "Meera Joshi",
      title: "Array Apprentice",
      xp: 3200,
      solved: 142,
      avatar: "Meera",
    },
  ],
};

export const achievements = [
  {
    id: 1,
    name: "First Steps",
    desc: "Solve your first problem",
    icon: "👶",
    unlocked: true,
    rarity: "common",
  },
  {
    id: 2,
    name: "Array Apprentice",
    desc: "Solve 50 Array problems",
    icon: "📦",
    unlocked: true,
    rarity: "common",
  },
  {
    id: 3,
    name: "Streak Master",
    desc: "Maintain a 30-day streak",
    icon: "🔥",
    unlocked: true,
    rarity: "rare",
  },
  {
    id: 4,
    name: "Boss Slayer",
    desc: "Defeat 5 bosses",
    icon: "⚔️",
    unlocked: true,
    rarity: "rare",
  },
  {
    id: 5,
    name: "Tree Guardian",
    desc: "Master all Tree problems",
    icon: "🌳",
    unlocked: true,
    rarity: "epic",
  },
  {
    id: 6,
    name: "Graph Dragon Slayer",
    desc: "Defeat the Graph Dragon",
    icon: "🐉",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: 7,
    name: "Speed Runner",
    desc: "Solve 10 problems in under an hour",
    icon: "⚡",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: 8,
    name: "Legendary Developer",
    desc: "Reach level 100",
    icon: "👑",
    unlocked: false,
    rarity: "mythic",
  },
];

export const activityHistory = [
  { date: "Today", action: "Solved 'Number of Islands'", xp: 180 },
  { date: "Today", action: "Daily mission completed", xp: 200 },
  { date: "Yesterday", action: "Defeated Array Titan", xp: 1500 },
  { date: "Yesterday", action: "Solved 3 Medium problems", xp: 360 },
  { date: "2 days ago", action: "Unlocked Trees skill node", xp: 500 },
  { date: "3 days ago", action: "Earned 'Streak Master' achievement", xp: 300 },
];

export const storeItems = {
  themes: [
    { id: 1, name: "Cyberpunk Neon", price: 800, image: "🌃", owned: false },
    { id: 2, name: "Forest Mystic", price: 600, image: "🌲", owned: true },
    { id: 3, name: "Ocean Deep", price: 700, image: "🌊", owned: false },
    { id: 4, name: "Volcano Lord", price: 1200, image: "🌋", owned: false },
  ],
  avatars: [
    { id: 1, name: "Shadow Ninja", price: 500, image: "🥷", owned: false },
    { id: 2, name: "Tech Wizard", price: 750, image: "🧙", owned: false },
    { id: 3, name: "Cyber Knight", price: 900, image: "🤖", owned: true },
    { id: 4, name: "Dragon Rider", price: 1500, image: "🐲", owned: false },
  ],
  plans: [
    {
      id: 1,
      name: "Quest Pass",
      price: "₹299/mo",
      perks: ["2x XP", "Daily AI Hints", "Exclusive Themes"],
      popular: false,
    },
    {
      id: 2,
      name: "Hero Pass",
      price: "₹599/mo",
      perks: ["3x XP", "Unlimited AI Mentor", "All Themes", "Priority Battles"],
      popular: true,
    },
    {
      id: 3,
      name: "Legend Pass",
      price: "₹4999/yr",
      perks: ["5x XP", "Unlimited Everything", "Exclusive Title", "Beta Access"],
      popular: false,
    },
  ],
  cosmetics: [
    { id: 1, name: "Golden Crown Frame", price: 1000, image: "👑", owned: false },
    { id: 2, name: "Flame Aura", price: 850, image: "🔥", owned: false },
    { id: 3, name: "Lightning Badge", price: 400, image: "⚡", owned: true },
    { id: 4, name: "Phoenix Wings", price: 2000, image: "🦅", owned: false },
  ],
};

export const aiConversations = [
  { id: 1, title: "Explain Dijkstra's algorithm", time: "2h ago" },
  { id: 2, title: "Help with Two Pointer technique", time: "Yesterday" },
  { id: 3, title: "When to use DP vs Greedy?", time: "2 days ago" },
  { id: 4, title: "Time complexity of merge sort", time: "Last week" },
];

export const suggestedQuestions = ["Explain Big-O notation with examples", "How does the sliding window pattern work?", "What's the difference between BFS and DFS?", "Walk me through dynamic programming"];

export const pricingPlans = [
  {
    name: "Apprentice",
    price: "Free",
    desc: "Start your coding adventure",
    features: ["50 problems/month", "Basic AI hints", "Community access", "Daily missions"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Hero",
    price: "₹599",
    period: "/month",
    desc: "Most popular for serious coders",
    features: ["Unlimited problems", "3x XP boost", "Unlimited AI Mentor", "All skill trees", "Boss battles", "Exclusive themes"],
    cta: "Become a Hero",
    popular: true,
  },
  {
    name: "Legend",
    price: "₹4,999",
    period: "/year",
    desc: "For the elite developers",
    features: ["Everything in Hero", "5x XP boost", "Personal AI coach", "Mock interviews", "Beta features", "Legendary title"],
    cta: "Go Legendary",
    popular: false,
  },
];

export const testimonials = [
  {
    name: "Ishaan Gupta",
    role: "SDE @ Google",
    avatar: "Ishaan",
    quote: "I cracked my FAANG interview after grinding boss battles for 3 months. The RPG system made it addictive in the best way.",
  },
  {
    name: "Neha Reddy",
    role: "CS Student, IIT",
    avatar: "Neha",
    quote: "The AI Mentor explains concepts better than most YouTube tutorials. I went from confused to confident on Graphs in a week.",
  },
  {
    name: "Aditya Singh",
    role: "Full Stack Dev",
    avatar: "Aditya",
    quote: "Finally a platform that doesn't feel like homework. Levelling up while learning DSA is genius.",
  },
];

export const features = [
  {
    icon: "⚔️",
    title: "Boss Battles",
    desc: "Defeat coding bosses by solving themed problem sets. Earn legendary loot.",
  },
  {
    icon: "🧠",
    title: "AI Mentor",
    desc: "Stuck? Your personal AI coach gives hints, explains concepts, and reviews code.",
  },
  {
    icon: "🌳",
    title: "Skill Tree",
    desc: "Visualize your mastery. Unlock new branches as you grow stronger.",
  },
  {
    icon: "🔥",
    title: "Daily Streaks",
    desc: "Build the habit. Maintain streaks, complete missions, climb leaderboards.",
  },
  {
    icon: "🏆",
    title: "Live Tournaments",
    desc: "Battle other coders in real-time ranked matches every weekend.",
  },
  {
    icon: "🎨",
    title: "Cosmetic Rewards",
    desc: "Themes, avatars, frames, titles — make CodeQuest yours.",
  },
];
