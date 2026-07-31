/**
 * Girlfriend's Day Special Experience — Placeholder Data Service
 * Provides default placeholder configurations, 5-chapter scrapbook contents,
 * 10 quiz questions across sections, love letters, 365 love reasons generator, and theme defaults.
 */

export const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"
];

export const DEFAULT_QUIZ_QUESTIONS = [
  { id: 1, section: "Our Story", question: "Where did we first meet?", options: ["Online / Social Media", "At a Cafe / Restaurant", "Through Mutual Friends", "At School / Work"], correctIndex: 0 },
  { id: 2, section: "Our Story", question: "Who said 'I love you' first?", options: ["You did! ❤️", "I did! 🥰", "We both said it together", "Still arguing about it 😂"], correctIndex: 0 },
  { id: 3, section: "Our Story", question: "What's our anniversary date?", options: ["The day we first met", "The day we made it official", "Every day is our anniversary", "I know the exact date ❤️"], correctIndex: 1 },
  { id: 4, section: "Our Story", question: "Who gets angry first?", options: ["Definitely You 🙈", "Definitely Me 😅", "Neither of us", "It depends on mood 😂"], correctIndex: 0 },
  { id: 5, section: "Our Story", question: "Who apologizes first?", options: ["Boyfriend (Always) ❤️", "Girlfriend (Sometimes)", "Whoever is right", "We hug it out"], correctIndex: 0 },
  { id: 6, section: "Favorites", question: "What is my favorite nickname for you?", options: ["Cutie ❤️", "Babe 🥰", "Angel ✨", "Princess 👑"], correctIndex: 0 },
  { id: 7, section: "Favorites", question: "What is our dream travel destination?", options: ["Paris, France 🇫🇷", "Tokyo, Japan 🇯🇵", "Santorini, Greece 🇬🇷", "Cozy Cabin in the Mountains 🏔️"], correctIndex: 0 },
  { id: 8, section: "Cute Habits", question: "What do I love doing most when we are together?", options: ["Holding your hand 🤝", "Watching movies & cuddling 🎬", "Talking for hours 🗣️", "Eating delicious food 🍕"], correctIndex: 1 },
  { id: 9, section: "Cute Habits", question: "Who takes longer to get ready?", options: ["Girlfriend (Always) 💄", "Boyfriend 👔", "Both take equal time ⏰", "We are fast ⚡"], correctIndex: 0 },
  { id: 10, section: "Forever", question: "How much do I love you?", options: ["To the moon & back 🌙", "More than pizza 🍕", "More than words can say ❤️", "Infinite amount ✨"], correctIndex: 2 }
];

export const DEFAULT_CHAPTERS = [
  {
    chapter: 1,
    title: "Who's that girl?",
    subtitle: "NEW YORK | 04.08.2021",
    photo1: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
    photo2: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400",
    photo3: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
    photo4: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400",
    photoLeft1: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
    photoLeft2: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
    photoRight2: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400",
    memoryText: "She is grown and stronger. A portrait of elegance that shines in the darkest rooms. Her laugh, her beauty, her presence is unmatched.",
    quote: "Who's that girl? She's rare — a beauty ❤️",
    layoutStyle: "editorial"
  },
  {
    chapter: 2,
    title: "Our Favorite Days",
    subtitle: "PARIS & MEMORIES | 12.10.2022",
    photo1: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80&w=600",
    photo2: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
    photo3: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600",
    photo4: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=400",
    photoLeft1: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80&w=600",
    photoLeft2: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600",
    photoRight2: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=400",
    memoryText: "From late-night long distance phone calls to random road trips in the middle of nowhere. Every single day with you feels like a page taken out of a fairy tale book.",
    quote: "With you, even quiet moments feel magical ✨",
    layoutStyle: "reference"
  },
  {
    chapter: 3,
    title: "Crazy Adventures",
    subtitle: "ROADS & LAUGHTER | 06.05.2023",
    photo1: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600",
    photo2: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    photo3: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=600",
    photo4: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400",
    photoLeft1: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600",
    photoLeft2: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=600",
    photoRight2: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400",
    memoryText: "Remember our midnight ice cream runs and how we got lost without GPS? We laughed so hard our stomachs hurt. You are my favorite partner in crime.",
    quote: "Life is short, make every adventure count 🚗",
    layoutStyle: "polaroid"
  },
  {
    chapter: 4,
    title: "Why I Love You",
    subtitle: "REASONS MY HEART IS YOURS",
    photo1: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    photo2: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    photo3: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
    photo4: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400",
    photoLeft1: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    photoLeft2: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
    photoRight2: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400",
    memoryText: "1. Your kind and gentle heart.\n2. The cute way you laugh when you're shy.\n3. How you always hold my hand.\n4. Your smile that brightens my darkest days.",
    quote: "You are my home and my safe place 🏡",
    layoutStyle: "journal"
  }
];

/**
 * Generates 365 unique love reasons with titles, descriptions, and emojis.
 */
export const generate365Reasons = (count = 365) => {
  const titles = [
    "Your Contagious Laugh", "The Way You Hold My Hand", "Your Morning Smile", "Late Night Conversations",
    "How You Care For Others", "Your Cozy Hugs", "Your Kind Soul", "How Beautiful You Look",
    "Your Sense of Humor", "Your Passionate Heart", "Random Coffee Dates", "Our Road Trip Memories",
    "How You Make Me Better", "Your Sweet Kisses", "Your Warm Comfort", "Everything About You"
  ];

  const descriptions = [
    "The way your eyes light up when you smile opens up my whole world and makes everything better.",
    "How safe and complete I feel every single time I hold you in my arms.",
    "Hearing your voice instantly brightens even the busiest and hardest of my days.",
    "The way you remember tiny details about us that nobody else notices.",
    "Your unconditional love and endless patience with me every single day.",
    "How you make ordinary moments feel like an extraordinary fairy tale adventure.",
    "Your warm touch that calms my soul and reassures me that we are forever."
  ];

  const icons = ["❤️", "💖", "🥰", "✨", "😊", "🌸", "🤗", "🎶", "🌹", "👑", "🌙", "💍"];

  const reasons = [];
  for (let i = 1; i <= count; i++) {
    const title = titles[(i - 1) % titles.length];
    const desc = descriptions[(i - 1) % descriptions.length];
    const icon = icons[(i - 1) % icons.length];
    reasons.push({
      id: i,
      number: i,
      title: `Reason #${i}: ${title}`,
      description: desc,
      icon: icon
    });
  }
  return reasons;
};

export const DEFAULT_REASONS_365 = generate365Reasons(365);

export default {
  DEFAULT_PHOTOS,
  DEFAULT_QUIZ_QUESTIONS,
  DEFAULT_CHAPTERS,
  DEFAULT_REASONS_365,
  generate365Reasons,
  getPlaceholderChapters: () => DEFAULT_CHAPTERS,
  getPlaceholderQuestions: () => DEFAULT_QUIZ_QUESTIONS,
  getPlaceholderReasons: () => DEFAULT_REASONS_365
};
