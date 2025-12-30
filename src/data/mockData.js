
import coverChronomancer from '../assets/cover_chronomancer.png';
import coverDeep from '../assets/cover_deep.png';
import coverNeon from '../assets/cover_neon.png';

export const BOOKS = [
  {
    id: 'b1',
    title: 'The Chronomancer\'s Debt',
    author: 'Elena Void',
    logline: 'Time is a currency, and he is bankrupt.',
    blurb: 'In a city where seconds are traded like gold, Kaelen discovers a way to steal time from the future. But the debt collectors are coming, and they don\'t just want his years—they want his existence.',
    coverImage: coverChronomancer,
    genre: 'Sci-Fi / Thriller',
    releaseDate: '2025-01-15',
    length: '320 pages',
    rating: 4.8,
    seriesName: 'The Time Ledger',
    seriesIndex: 1,
    frequencyInterval: 1, // Days between chapters
    priceFull: 14.99,
    externalLinks: [
      { platform: 'Amazon', url: '#' },
      { platform: 'Audible', url: '#' }
    ],
    narrator: 'Sarah Millican (Deep Fake)',
    shortDescription: 'A time-travel thriller narrated with a Northern accent.',
  },
  {
    id: 'b2',
    title: 'Echoes of the Deep',
    author: 'Captain J. Sparrow (Not that one)',
    logline: 'The ocean whispers secrets to those who listen.',
    blurb: 'A deep-sea salvage crew finds a wreck that shouldn\'t exist. Inside, they find a diary written in a language that hurts to read. Then the knocking starts.',
    coverImage: coverDeep,
    genre: 'Horror',
    releaseDate: '2024-11-01',
    length: '8h 15m',
    narrator: 'James Earl Jones (AI Clone)',
    shortDescription: 'A deep-sea horror story that will make you fear the water.',
    rating: 4.5,
    frequencyInterval: 7, // Weekly
    priceFull: 9.99,
    externalLinks: []
  },
  {
    id: 'b3',
    title: 'Neon Samurai',
    author: 'Kenji Sato',
    logline: 'Steel meets silicon in old Tokyo.',
    blurb: 'A ronin in a cyberpunk future protects a child carrying the source code for a new god.',
    coverImage: coverNeon,
    genre: 'Cyberpunk',
    releaseDate: '2025-03-10',
    length: '450 pages',
    rating: 4.9,
    frequencyInterval: 3,
    priceFull: 12.99,
    narrator: 'Keanu Reeves (Authorized AI)',
    shortDescription: 'Cyberpunk noir read by the One himself.',
    externalLinks: [{ platform: 'Kobo', url: '#' }]
  }
];

export const CHAPTERS = {
  'b1': [
    { id: 'c1-1', sequence: 1, title: 'Chapter 1: The Overdraft', content: 'Kaelen stared at his wrist. 00:00:05. Five seconds left...' },
    { id: 'c1-2', sequence: 2, title: 'Chapter 2: Borrowed Time', content: 'The loan shark smiled. "Interest is high, kid."' },
    { id: 'c1-3', sequence: 3, title: 'Chapter 3: The Heist', content: 'They planned to break into the Central Time Bank.' },
    { id: 'c1-4', sequence: 4, title: 'Chapter 4: Chrono-Trigger', content: 'Everything changed when the alarm went off.' },
  ],
  'b2': [
    { id: 'c2-1', sequence: 1, title: 'Entry 1: Descent', content: 'We are diving to 4000 meters today.' },
    { id: 'c2-2', sequence: 2, title: 'Entry 2: The Door', content: 'There is a door on the hull. It opens specifically for me.' },
  ],
  'b3': [
    { id: 'c3-1', sequence: 1, title: 'Chapter 1: Rain', content: 'Acid rain washed the neon grime off the pavement.' },
  ]
};

// Simulated "User" state that would normally be in a database
export const INITIAL_USER_STATE = {
  subscriptions: [
    // { bookId: 'b1', startDate: '2025-12-20T10:00:00Z', currentChapter: 1, ... }
  ],
  walletBalance: 50.00,
  role: 'reader', // 'reader' or 'creator'
  isAuthenticated: false
};

export const AUTHORS = [
  {
    id: 'a1',
    name: 'Elena Void',
    genre: 'Sci-Fi / Thriller',
    description: 'Elena Void is a former quantum physicist turned speculative fiction author. Her work explores the intersection of time, consciousness, and late-stage capitalism. When not writing, she stares into the abyss (and it stares back).',
    bookIds: ['b1'],
    recommendedAuthorIds: ['a3'],
    socials: {
      x: '#',
      instagram: '#',
      facebook: null,
      tiktok: '#'
    }
  },
  {
    id: 'a2',
    name: 'Captain J. Sparrow (Not that one)',
    genre: 'Horror',
    description: 'A deep-sea diver with a penchant for telling tall tales that turn out to be terrifyingly true. He writes what he sees in the crushing dark.',
    bookIds: ['b2'],
    recommendedAuthorIds: ['a1'],
    socials: {
      x: null,
      instagram: '#',
      facebook: '#',
      tiktok: null
    }
  },
  {
    id: 'a3',
    name: 'Kenji Sato',
    genre: 'Sci-fi / Cyberpunk',
    description: 'Born in Neo-Tokyo, Kenji captures the pulse of a city that never sleeps. His cyberpunk noirs are gritty, neon-soaked, and dangerously prophetic.',
    bookIds: ['b3'],
    recommendedAuthorIds: ['a2'],
    socials: {
      x: '#',
      instagram: '#',
      facebook: null,
      tiktok: '#'
    }
  }
];
