// The MelodIQ song pool — mainstream, widely recognizable tracks, ~10 per genre
// so a single-genre playlist can field a full 10-song game with distinct
// multiple-choice decoys. previewUrl is intentionally null here; run
// `npm run fetch:previews` to populate legal 30s previews from the iTunes
// Search API. The game still works with null previews (silent timed round).

export type SeedSong = {
  title: string;
  artist: string;
  genre: string;
  year: number;
  coverColor: string;
};

// Genre order is also used for the in-app genre picker.
export const GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Metal",
  "Electronic",
  "R&B",
  "Classics",
  "Modern",
] as const;

export const SONGS: SeedSong[] = [
  // ---------- Pop ----------
  { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop", year: 2019, coverColor: "#FF2D87" },
  { title: "Bad Guy", artist: "Billie Eilish", genre: "Pop", year: 2019, coverColor: "#22D3EE" },
  { title: "Shake It Off", artist: "Taylor Swift", genre: "Pop", year: 2014, coverColor: "#F472B6" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Pop", year: 2014, coverColor: "#FBBF24" },
  { title: "Rolling in the Deep", artist: "Adele", genre: "Pop", year: 2010, coverColor: "#A78BFA" },
  { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", year: 2017, coverColor: "#34D399" },
  { title: "Poker Face", artist: "Lady Gaga", genre: "Pop", year: 2008, coverColor: "#F87171" },
  { title: "Roar", artist: "Katy Perry", genre: "Pop", year: 2013, coverColor: "#FB923C" },
  { title: "Call Me Maybe", artist: "Carly Rae Jepsen", genre: "Pop", year: 2011, coverColor: "#60A5FA" },
  { title: "Umbrella", artist: "Rihanna", genre: "Pop", year: 2007, coverColor: "#A3A3A3" },

  // ---------- Rock ----------
  { title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", year: 1975, coverColor: "#8B5CF6" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Rock", year: 1991, coverColor: "#F59E0B" },
  { title: "Sweet Child o' Mine", artist: "Guns N' Roses", genre: "Rock", year: 1987, coverColor: "#EF4444" },
  { title: "Mr. Brightside", artist: "The Killers", genre: "Rock", year: 2003, coverColor: "#3B82F6" },
  { title: "Back in Black", artist: "AC/DC", genre: "Rock", year: 1980, coverColor: "#64748B" },
  { title: "Don't Stop Believin'", artist: "Journey", genre: "Rock", year: 1981, coverColor: "#F43F5E" },
  { title: "Seven Nation Army", artist: "The White Stripes", genre: "Rock", year: 2003, coverColor: "#DC2626" },
  { title: "Wonderwall", artist: "Oasis", genre: "Rock", year: 1995, coverColor: "#0EA5E9" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", genre: "Rock", year: 1986, coverColor: "#FACC15" },
  { title: "Basket Case", artist: "Green Day", genre: "Rock", year: 1994, coverColor: "#10B981" },

  // ---------- Hip-Hop ----------
  { title: "Lose Yourself", artist: "Eminem", genre: "Hip-Hop", year: 2002, coverColor: "#10B981" },
  { title: "HUMBLE.", artist: "Kendrick Lamar", genre: "Hip-Hop", year: 2017, coverColor: "#F97316" },
  { title: "Sicko Mode", artist: "Travis Scott", genre: "Hip-Hop", year: 2018, coverColor: "#6366F1" },
  { title: "In Da Club", artist: "50 Cent", genre: "Hip-Hop", year: 2003, coverColor: "#14B8A6" },
  { title: "God's Plan", artist: "Drake", genre: "Hip-Hop", year: 2018, coverColor: "#F59E0B" },
  { title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", genre: "Hip-Hop", year: 2009, coverColor: "#3B82F6" },
  { title: "Gold Digger", artist: "Kanye West ft. Jamie Foxx", genre: "Hip-Hop", year: 2005, coverColor: "#EAB308" },
  { title: "Old Town Road", artist: "Lil Nas X", genre: "Hip-Hop", year: 2019, coverColor: "#A16207" },
  { title: "Juicy", artist: "The Notorious B.I.G.", genre: "Hip-Hop", year: 1994, coverColor: "#DB2777" },
  { title: "Nuthin' but a 'G' Thang", artist: "Dr. Dre ft. Snoop Dogg", genre: "Hip-Hop", year: 1992, coverColor: "#65A30D" },

  // ---------- Metal ----------
  { title: "Enter Sandman", artist: "Metallica", genre: "Metal", year: 1991, coverColor: "#64748B" },
  { title: "Chop Suey!", artist: "System of a Down", genre: "Metal", year: 2001, coverColor: "#DC2626" },
  { title: "Crazy Train", artist: "Ozzy Osbourne", genre: "Metal", year: 1980, coverColor: "#7C3AED" },
  { title: "Paranoid", artist: "Black Sabbath", genre: "Metal", year: 1970, coverColor: "#475569" },
  { title: "Master of Puppets", artist: "Metallica", genre: "Metal", year: 1986, coverColor: "#52525B" },
  { title: "Bring Me to Life", artist: "Evanescence", genre: "Metal", year: 2003, coverColor: "#6D28D9" },
  { title: "Duality", artist: "Slipknot", genre: "Metal", year: 2004, coverColor: "#B91C1C" },
  { title: "Toxicity", artist: "System of a Down", genre: "Metal", year: 2001, coverColor: "#EA580C" },
  { title: "Iron Man", artist: "Black Sabbath", genre: "Metal", year: 1970, coverColor: "#78716C" },
  { title: "Holy Wars... The Punishment Due", artist: "Megadeth", genre: "Metal", year: 1990, coverColor: "#991B1B" },

  // ---------- Electronic ----------
  { title: "One More Time", artist: "Daft Punk", genre: "Electronic", year: 2000, coverColor: "#06B6D4" },
  { title: "Levels", artist: "Avicii", genre: "Electronic", year: 2011, coverColor: "#F43F5E" },
  { title: "Titanium", artist: "David Guetta ft. Sia", genre: "Electronic", year: 2011, coverColor: "#0EA5E9" },
  { title: "Wake Me Up", artist: "Avicii", genre: "Electronic", year: 2013, coverColor: "#22D3EE" },
  { title: "Get Lucky", artist: "Daft Punk ft. Pharrell Williams", genre: "Electronic", year: 2013, coverColor: "#FBBF24" },
  { title: "Scary Monsters and Nice Sprites", artist: "Skrillex", genre: "Electronic", year: 2010, coverColor: "#84CC16" },
  { title: "Clarity", artist: "Zedd ft. Foxes", genre: "Electronic", year: 2012, coverColor: "#38BDF8" },
  { title: "Animals", artist: "Martin Garrix", genre: "Electronic", year: 2013, coverColor: "#F472B6" },
  { title: "Don't You Worry Child", artist: "Swedish House Mafia", genre: "Electronic", year: 2012, coverColor: "#818CF8" },
  { title: "Faded", artist: "Alan Walker", genre: "Electronic", year: 2015, coverColor: "#2DD4BF" },

  // ---------- R&B ----------
  { title: "No One", artist: "Alicia Keys", genre: "R&B", year: 2007, coverColor: "#D946EF" },
  { title: "Crazy in Love", artist: "Beyoncé", genre: "R&B", year: 2003, coverColor: "#EC4899" },
  { title: "Adorn", artist: "Miguel", genre: "R&B", year: 2012, coverColor: "#8B5CF6" },
  { title: "Say My Name", artist: "Destiny's Child", genre: "R&B", year: 1999, coverColor: "#F59E0B" },
  { title: "No Scrubs", artist: "TLC", genre: "R&B", year: 1999, coverColor: "#14B8A6" },
  { title: "If I Ain't Got You", artist: "Alicia Keys", genre: "R&B", year: 2003, coverColor: "#C026D3" },
  { title: "Halo", artist: "Beyoncé", genre: "R&B", year: 2008, coverColor: "#FBCFE8" },
  { title: "End of the Road", artist: "Boyz II Men", genre: "R&B", year: 1992, coverColor: "#A78BFA" },
  { title: "We Belong Together", artist: "Mariah Carey", genre: "R&B", year: 2005, coverColor: "#F9A8D4" },
  { title: "Kiss from a Rose", artist: "Seal", genre: "R&B", year: 1994, coverColor: "#FB7185" },

  // ---------- Classics ----------
  { title: "Billie Jean", artist: "Michael Jackson", genre: "Classics", year: 1982, coverColor: "#FACC15" },
  { title: "Like a Rolling Stone", artist: "Bob Dylan", genre: "Classics", year: 1965, coverColor: "#A3A3A3" },
  { title: "Superstition", artist: "Stevie Wonder", genre: "Classics", year: 1972, coverColor: "#FB923C" },
  { title: "Hotel California", artist: "Eagles", genre: "Classics", year: 1976, coverColor: "#FCD34D" },
  { title: "Imagine", artist: "John Lennon", genre: "Classics", year: 1971, coverColor: "#93C5FD" },
  { title: "Hey Jude", artist: "The Beatles", genre: "Classics", year: 1968, coverColor: "#FDE68A" },
  { title: "(I Can't Get No) Satisfaction", artist: "The Rolling Stones", genre: "Classics", year: 1965, coverColor: "#EF4444" },
  { title: "Respect", artist: "Aretha Franklin", genre: "Classics", year: 1967, coverColor: "#F59E0B" },
  { title: "What's Going On", artist: "Marvin Gaye", genre: "Classics", year: 1971, coverColor: "#34D399" },
  { title: "Good Vibrations", artist: "The Beach Boys", genre: "Classics", year: 1966, coverColor: "#38BDF8" },

  // ---------- Modern ----------
  { title: "As It Was", artist: "Harry Styles", genre: "Modern", year: 2022, coverColor: "#F87171" },
  { title: "Flowers", artist: "Miley Cyrus", genre: "Modern", year: 2023, coverColor: "#34D399" },
  { title: "Anti-Hero", artist: "Taylor Swift", genre: "Modern", year: 2022, coverColor: "#60A5FA" },
  { title: "Unholy", artist: "Sam Smith ft. Kim Petras", genre: "Modern", year: 2022, coverColor: "#E879F9" },
  { title: "Levitating", artist: "Dua Lipa", genre: "Modern", year: 2020, coverColor: "#FBBF24" },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", genre: "Modern", year: 2021, coverColor: "#F472B6" },
  { title: "Heat Waves", artist: "Glass Animals", genre: "Modern", year: 2020, coverColor: "#FB923C" },
  { title: "drivers license", artist: "Olivia Rodrigo", genre: "Modern", year: 2021, coverColor: "#A78BFA" },
  { title: "Industry Baby", artist: "Lil Nas X & Jack Harlow", genre: "Modern", year: 2021, coverColor: "#F97316" },
  { title: "About Damn Time", artist: "Lizzo", genre: "Modern", year: 2022, coverColor: "#22D3EE" },
];
