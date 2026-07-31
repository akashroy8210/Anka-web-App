/**
 * Girlfriend's Day Special Experience — Placeholder Data Service
 * Provides default placeholder configurations, 5-chapter scrapbook contents,
 * 10 quiz questions across sections, love letters, 365 love reasons, and theme defaults.
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
    title: "First Date & Our Beginning",
    subtitle: "NEW YORK | 04.08.2021",
    photoLeft1: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400",
    photoLeft2: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
    memoryText: "For our first date, we met at the cozy cafe downtown. We both were so nervous at first, but within minutes we were laughing about everything. I bought roses for you, and when you smiled, I realized that I was starting to fall in love with you forever.",
    quote: "When butterflies turn into elephants ❤️",
    layoutStyle: "editorial"
  },
  {
    chapter: 2,
    title: "Our Favorite Days",
    subtitle: "PARIS & MEMORIES | 12.10.2022",
    photoLeft1: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80&w=400",
    photoLeft2: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
    memoryText: "From late-night long distance phone calls to random road trips in the middle of nowhere. Every single day with you feels like a page taken out of a fairy tale book.",
    quote: "With you, even quiet moments feel magical ✨",
    layoutStyle: "dual"
  },
  {
    chapter: 3,
    title: "Crazy Adventures",
    subtitle: "ROADS & LAUGHTER | 06.05.2023",
    photoLeft1: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400",
    photoLeft2: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800",
    memoryText: "Remember our midnight ice cream runs and how we got lost without GPS? We laughed so hard our stomachs hurt. You are my favorite partner in crime.",
    quote: "Life is short, make every adventure count 🚗",
    layoutStyle: "collage"
  },
  {
    chapter: 4,
    title: "Why I Love You",
    subtitle: "SIX REASONS MY HEART IS YOURS",
    photoLeft1: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    photoLeft2: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    memoryText: "1. Your kind and gentle heart.\n2. The cute way you laugh when you're shy.\n3. How you always hold my hand.\n4. Your smile that brightens my darkest days.\n5. How you care for me endlessly.\n6. You make me a better person every day.",
    quote: "You are my home and my safe place 🏡",
    layoutStyle: "polaroid"
  },
  {
    chapter: 5,
    title: "Forever & Always",
    subtitle: "OUR FUTURE TOGETHER",
    photoLeft1: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400",
    photoLeft2: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=400",
    photoRight: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
    memoryText: "We have so many dreams left to fulfill together: our dream house, international trips, and building a life filled with happiness. I promise to stand by your side forever.",
    quote: "Every page ends... But my love never will ❤️",
    layoutStyle: "journal"
  }
];

// Helper generator to create 365 rich love reasons
export const generate365Reasons = () => {
  const seedReasons = [
    { title: "Your contagious smile", desc: "The way your face lights up whenever you laugh makes my entire world stop.", icon: "😊" },
    { title: "The way you hold my hand", desc: "No matter where we are, having your fingers intertwined with mine feels like home.", icon: "🤝" },
    { title: "Your gentle heart", desc: "You care so deeply for everyone around you, and your kindness inspires me daily.", icon: "💖" },
    { title: "Our late-night talks", desc: "Talking with you until 2 AM about our wildest dreams and funniest childhood stories.", icon: "🌙" },
    { title: "Your cute shy giggle", desc: "Whenever I compliment you and you look away with a soft blush.", icon: "🥰" },
    { title: "How you make me feel safe", desc: "In your arms, all my worries and anxieties vanish instantly.", icon: "🏡" },
    { title: "Our coffee dates", desc: "Sitting across from you, sipping warm coffee and looking into your beautiful eyes.", icon: "☕" },
    { title: "Your unconditional support", desc: "You believe in me even when I doubt myself. You are my biggest cheerleader.", icon: "⭐" },
    { title: "The way you say my name", desc: "It sounds like a melody every time you call me.", icon: "🎵" },
    { title: "Our silly inside jokes", desc: "Nobody else understands why we start laughing out of nowhere, and I love that.", icon: "😂" },
    { title: "Your warm morning texts", desc: "Waking up to 'Good morning my love ❤️' makes every day start perfectly.", icon: "💌" },
    { title: "How smart you are", desc: "I love listening to you explain things you're passionate about.", icon: "🧠" },
    { title: "Your warm hugs", desc: "The kind of hug where you don't let go first. It heals my heart every time.", icon: "🤗" },
    { title: "Your style & grace", desc: "You look stunning in everything you wear, whether it's a dress or cozy pajamas.", icon: "✨" },
    { title: "How you remember small details", desc: "You notice the tiny things I love and surprise me when I least expect it.", icon: "🎁" },
    { title: "Your patience with me", desc: "Even when I'm being stubborn, you treat me with grace and understanding.", icon: "🕊️" },
    { title: "Our random road trips", desc: "Blasting our favorite playlist with the windows down and driving with you.", icon: "🚗" },
    { title: "Your loving eyes", desc: "When you look at me across a crowded room, I know I'm the luckiest person.", icon: "👀" },
    { title: "Your cooking & treats", desc: "Everything you make tastes like it was prepared with pure love.", icon: "🍰" },
    { title: "How you comfort me", desc: "When I've had a tough day, your voice is the only medicine I need.", icon: "🌸" },
    { title: "Our future dreams", desc: "Planning our house, our trips, and building our life together step by step.", icon: "🔮" },
    { title: "Because you are my soulmate", desc: "There is nobody else in this universe I would rather choose every single day.", icon: "❤️" }
  ];

  const fullList = [];
  for (let i = 1; i <= 365; i++) {
    const seed = seedReasons[(i - 1) % seedReasons.length];
    fullList.push({
      id: i,
      number: i,
      title: `${seed.title}`,
      description: i <= seedReasons.length 
        ? seed.desc 
        : `${seed.desc} (Reason #${i} why my heart belongs to you forever ❤️)`,
      icon: seed.icon,
      category: i % 4 === 0 ? "Daily Joy" : i % 3 === 0 ? "Cute Habits" : i % 2 === 0 ? "Deep Love" : "Our Future"
    });
  }

  return fullList;
};

export const DEFAULT_REASONS_365 = generate365Reasons();

export const DEFAULT_LETTER_TEXT = `My dearest Cutie,\n\nFrom the moment you came into my life, everything became brighter, happier, and full of purpose. You have this incredible way of making even the simplest days feel extraordinary.\n\nThank you for all your warmth, your laughs, your patience, and your unconditional love. Being your boyfriend is the greatest gift of my life.\n\nOn this Girlfriend's Day and every single day after, I promise to cherish you, protect your smile, and love you more than words could ever capture.`;

export class GirlfriendPlaceholderService {
  static getPlaceholderData() {
    return {
      girlfriendName: 'Cutie',
      boyfriendName: 'Your Boyfriend',
      theme: 'dark',
      photos: DEFAULT_PHOTOS,
      girlfriendPhoto: DEFAULT_PHOTOS[0],
      boyfriendPhoto: DEFAULT_PHOTOS[1],
      letterText: DEFAULT_LETTER_TEXT,
      chapters: DEFAULT_CHAPTERS,
      questions: DEFAULT_QUIZ_QUESTIONS,
      reasons: DEFAULT_REASONS_365
    };
  }

  static getPlaceholderChapters() {
    return DEFAULT_CHAPTERS;
  }

  static getPlaceholderQuestions() {
    return DEFAULT_QUIZ_QUESTIONS;
  }

  static getPlaceholderReasons() {
    return DEFAULT_REASONS_365;
  }

  static getPlaceholderLetter() {
    return DEFAULT_LETTER_TEXT;
  }
}

export default GirlfriendPlaceholderService;
