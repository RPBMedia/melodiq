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
  /** PRD M2 tier: 1 easy · 2 medium · 3 hard. Defaults to 2 when omitted. */
  difficulty?: 1 | 2 | 3;
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
  { title: "Blinding Lights", artist: "The Weeknd", genre: "pop", year: 2019, coverColor: "#FF2D87" },
  { title: "Bad Guy", artist: "Billie Eilish", genre: "pop", year: 2019, coverColor: "#22D3EE" },
  { title: "Shake It Off", artist: "Taylor Swift", genre: "pop", year: 2014, coverColor: "#F472B6" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "pop", year: 2014, coverColor: "#FBBF24" },
  { title: "Rolling in the Deep", artist: "Adele", genre: "pop", year: 2010, coverColor: "#A78BFA" },
  { title: "Shape of You", artist: "Ed Sheeran", genre: "pop", year: 2017, coverColor: "#34D399" },
  { title: "Poker Face", artist: "Lady Gaga", genre: "pop", year: 2008, coverColor: "#F87171" },
  { title: "Roar", artist: "Katy Perry", genre: "pop", year: 2013, coverColor: "#FB923C" },
  { title: "Call Me Maybe", artist: "Carly Rae Jepsen", genre: "pop", year: 2011, coverColor: "#60A5FA" },
  { title: "Umbrella", artist: "Rihanna", genre: "pop", year: 2007, coverColor: "#A3A3A3" },

  // ---------- Rock ----------
  { title: "Bohemian Rhapsody", artist: "Queen", genre: "rock", year: 1975, coverColor: "#8B5CF6" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "rock", year: 1991, coverColor: "#F59E0B" },
  { title: "Sweet Child o' Mine", artist: "Guns N' Roses", genre: "rock", year: 1987, coverColor: "#EF4444" },
  { title: "Don't Stop Believin'", artist: "Journey", genre: "rock", year: 1981, coverColor: "#F43F5E" },
  { title: "Seven Nation Army", artist: "The White Stripes", genre: "rock", year: 2003, coverColor: "#DC2626" },
  { title: "Wonderwall", artist: "Oasis", genre: "rock", year: 1995, coverColor: "#0EA5E9" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", genre: "rock", year: 1986, coverColor: "#FACC15" },
  { title: "Basket Case", artist: "Green Day", genre: "rock", year: 1994, coverColor: "#10B981" },

  // ---------- Hip-Hop ----------
  { title: "Lose Yourself", artist: "Eminem", genre: "hip hop", year: 2002, coverColor: "#10B981" },
  { title: "HUMBLE.", artist: "Kendrick Lamar", genre: "hip hop", year: 2017, coverColor: "#F97316" },
  { title: "Sicko Mode", artist: "Travis Scott", genre: "hip hop", year: 2018, coverColor: "#6366F1" },
  { title: "In Da Club", artist: "50 Cent", genre: "hip hop", year: 2003, coverColor: "#14B8A6" },
  { title: "God's Plan", artist: "Drake", genre: "hip hop", year: 2018, coverColor: "#F59E0B" },
  { title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", genre: "hip hop", year: 2009, coverColor: "#3B82F6" },
  { title: "Gold Digger", artist: "Kanye West ft. Jamie Foxx", genre: "hip hop", year: 2005, coverColor: "#EAB308" },
  { title: "Old Town Road", artist: "Lil Nas X", genre: "hip hop", year: 2019, coverColor: "#A16207" },
  { title: "Juicy", artist: "The Notorious B.I.G.", genre: "hip hop", year: 1994, coverColor: "#DB2777" },
  { title: "Nuthin' but a 'G' Thang", artist: "Dr. Dre ft. Snoop Dogg", genre: "hip hop", year: 1992, coverColor: "#65A30D" },

  // ---------- Metal ----------
  { title: "Enter Sandman", artist: "Metallica", genre: "heavy metal", year: 1991, coverColor: "#64748B" },
  { title: "Chop Suey!", artist: "System of a Down", genre: "heavy metal", year: 2001, coverColor: "#DC2626" },
  { title: "Bring Me to Life", artist: "Evanescence", genre: "heavy metal", year: 2003, coverColor: "#6D28D9" },
  { title: "Duality", artist: "Slipknot", genre: "heavy metal", year: 2004, coverColor: "#B91C1C" },
  { title: "Toxicity", artist: "System of a Down", genre: "heavy metal", year: 2001, coverColor: "#EA580C" },
  { title: "Iron Man", artist: "Black Sabbath", genre: "heavy metal", year: 1970, coverColor: "#78716C" },
  { title: "Holy Wars... The Punishment Due", artist: "Megadeth", genre: "heavy metal", year: 1990, coverColor: "#991B1B" },

  // ---------- Electronic ----------
  { title: "One More Time", artist: "Daft Punk", genre: "dance", year: 2000, coverColor: "#06B6D4" },
  { title: "Levels", artist: "Avicii", genre: "dance", year: 2011, coverColor: "#F43F5E" },
  { title: "Titanium", artist: "David Guetta ft. Sia", genre: "dance", year: 2011, coverColor: "#0EA5E9" },
  { title: "Wake Me Up", artist: "Avicii", genre: "dance", year: 2013, coverColor: "#22D3EE" },
  { title: "Get Lucky", artist: "Daft Punk ft. Pharrell Williams", genre: "dance", year: 2013, coverColor: "#FBBF24" },
  { title: "Scary Monsters and Nice Sprites", artist: "Skrillex", genre: "dance", year: 2010, coverColor: "#84CC16" },
  { title: "Clarity", artist: "Zedd ft. Foxes", genre: "dance", year: 2012, coverColor: "#38BDF8" },
  { title: "Animals", artist: "Martin Garrix", genre: "dance", year: 2013, coverColor: "#F472B6" },
  { title: "Don't You Worry Child", artist: "Swedish House Mafia", genre: "dance", year: 2012, coverColor: "#818CF8" },
  { title: "Faded", artist: "Alan Walker", genre: "dance", year: 2015, coverColor: "#2DD4BF" },

  // ---------- R&B ----------
  { title: "No One", artist: "Alicia Keys", genre: "r&b", year: 2007, coverColor: "#D946EF" },
  { title: "Crazy in Love", artist: "Beyoncé", genre: "r&b", year: 2003, coverColor: "#EC4899" },
  { title: "Adorn", artist: "Miguel", genre: "r&b", year: 2012, coverColor: "#8B5CF6" },
  { title: "Say My Name", artist: "Destiny's Child", genre: "r&b", year: 1999, coverColor: "#F59E0B" },
  { title: "No Scrubs", artist: "TLC", genre: "r&b", year: 1999, coverColor: "#14B8A6" },
  { title: "If I Ain't Got You", artist: "Alicia Keys", genre: "r&b", year: 2003, coverColor: "#C026D3" },
  { title: "Halo", artist: "Beyoncé", genre: "r&b", year: 2008, coverColor: "#FBCFE8" },
  { title: "End of the Road", artist: "Boyz II Men", genre: "r&b", year: 1992, coverColor: "#A78BFA" },
  { title: "We Belong Together", artist: "Mariah Carey", genre: "r&b", year: 2005, coverColor: "#F9A8D4" },
  { title: "Kiss from a Rose", artist: "Seal", genre: "r&b", year: 1994, coverColor: "#FB7185" },

  // ---------- Classics ----------
  { title: "Billie Jean", artist: "Michael Jackson", genre: "pop", year: 1982, coverColor: "#FACC15" },
  { title: "Like a Rolling Stone", artist: "Bob Dylan", genre: "rock", year: 1965, coverColor: "#A3A3A3" },
  { title: "Superstition", artist: "Stevie Wonder", genre: "r&b", year: 1972, coverColor: "#FB923C" },
  { title: "Hotel California", artist: "Eagles", genre: "rock", year: 1976, coverColor: "#FCD34D" },
  { title: "Imagine", artist: "John Lennon", genre: "pop", year: 1971, coverColor: "#93C5FD" },
  { title: "Hey Jude", artist: "The Beatles", genre: "rock", year: 1968, coverColor: "#FDE68A" },
  { title: "(I Can't Get No) Satisfaction", artist: "The Rolling Stones", genre: "rock", year: 1965, coverColor: "#EF4444" },
  { title: "Respect", artist: "Aretha Franklin", genre: "r&b", year: 1967, coverColor: "#F59E0B" },
  { title: "What's Going On", artist: "Marvin Gaye", genre: "r&b", year: 1971, coverColor: "#34D399" },
  { title: "Good Vibrations", artist: "The Beach Boys", genre: "pop", year: 1966, coverColor: "#38BDF8" },

  // ---------- Modern ----------
  { title: "As It Was", artist: "Harry Styles", genre: "pop", year: 2022, coverColor: "#F87171" },
  { title: "Flowers", artist: "Miley Cyrus", genre: "pop", year: 2023, coverColor: "#34D399" },
  { title: "Anti-Hero", artist: "Taylor Swift", genre: "pop", year: 2022, coverColor: "#60A5FA" },
  { title: "Unholy", artist: "Sam Smith ft. Kim Petras", genre: "pop", year: 2022, coverColor: "#E879F9" },
  { title: "Levitating", artist: "Dua Lipa", genre: "pop", year: 2020, coverColor: "#FBBF24" },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", genre: "pop", year: 2021, coverColor: "#F472B6" },
  { title: "Heat Waves", artist: "Glass Animals", genre: "pop", year: 2020, coverColor: "#FB923C" },
  { title: "drivers license", artist: "Olivia Rodrigo", genre: "pop", year: 2021, coverColor: "#A78BFA" },
  { title: "Industry Baby", artist: "Lil Nas X & Jack Harlow", genre: "pop", year: 2021, coverColor: "#F97316" },
  { title: "About Damn Time", artist: "Lizzo", genre: "pop", year: 2022, coverColor: "#22D3EE" },

  // ---- M2 taxonomy batch 1 (metal, jazz, blues, classical, score, folk, …) ----
  // heavy metal
  { title: "The Trooper", artist: "Iron Maiden", genre: "heavy metal", year: 1983, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Paranoid", artist: "Black Sabbath", genre: "heavy metal", year: 1970, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Painkiller", artist: "Judas Priest", genre: "heavy metal", year: 1990, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Master of Puppets", artist: "Metallica", genre: "heavy metal", year: 1986, coverColor: "#8B5CF6", difficulty: 1 },
  { title: "Symphony of Destruction", artist: "Megadeth", genre: "heavy metal", year: 1992, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Holy Diver", artist: "Dio", genre: "heavy metal", year: 1983, coverColor: "#8B5CF6", difficulty: 2 },
  // hard rock
  { title: "Back in Black", artist: "AC/DC", genre: "hard rock", year: 1980, coverColor: "#FB7185", difficulty: 1 },
  { title: "Welcome to the Jungle", artist: "Guns N' Roses", genre: "hard rock", year: 1987, coverColor: "#FB7185", difficulty: 1 },
  { title: "Whole Lotta Love", artist: "Led Zeppelin", genre: "hard rock", year: 1969, coverColor: "#FB7185", difficulty: 1 },
  { title: "Smoke on the Water", artist: "Deep Purple", genre: "hard rock", year: 1972, coverColor: "#FB7185", difficulty: 1 },
  { title: "Walk This Way", artist: "Aerosmith", genre: "hard rock", year: 1975, coverColor: "#FB7185", difficulty: 2 },
  { title: "Panama", artist: "Van Halen", genre: "hard rock", year: 1984, coverColor: "#FB7185", difficulty: 2 },
  // death metal
  { title: "Pull the Plug", artist: "Death", genre: "death metal", year: 1988, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Hammer Smashed Face", artist: "Cannibal Corpse", genre: "death metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Chapel of Ghouls", artist: "Morbid Angel", genre: "death metal", year: 1989, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Slowly We Rot", artist: "Obituary", genre: "death metal", year: 1989, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Crystal Mountain", artist: "Death", genre: "death metal", year: 1995, coverColor: "#8B5CF6", difficulty: 3 },
  // black metal
  { title: "Freezing Moon", artist: "Mayhem", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "I Am the Black Wizards", artist: "Emperor", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Transilvanian Hunger", artist: "Darkthrone", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "A Fine Day to Die", artist: "Bathory", genre: "black metal", year: 1988, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Mother North", artist: "Satyricon", genre: "black metal", year: 1996, coverColor: "#8B5CF6", difficulty: 3 },
  // folk metal
  { title: "Lai Lai Hey", artist: "Ensiferum", genre: "folk metal", year: 2004, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Inis Mona", artist: "Eluveitie", genre: "folk metal", year: 2008, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Vodka", artist: "Korpiklaani", genre: "folk metal", year: 2009, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Trollhammaren", artist: "Finntroll", genre: "folk metal", year: 2004, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Twilight of the Thunder God", artist: "Amon Amarth", genre: "folk metal", year: 2008, coverColor: "#8B5CF6", difficulty: 2 },
  // industrial
  { title: "Closer", artist: "Nine Inch Nails", genre: "industrial", year: 1994, coverColor: "#22D3EE", difficulty: 1 },
  { title: "Du Hast", artist: "Rammstein", genre: "industrial", year: 1997, coverColor: "#22D3EE", difficulty: 1 },
  { title: "The Beautiful People", artist: "Marilyn Manson", genre: "industrial", year: 1996, coverColor: "#22D3EE", difficulty: 2 },
  { title: "Jesus Built My Hotrod", artist: "Ministry", genre: "industrial", year: 1991, coverColor: "#22D3EE", difficulty: 3 },
  { title: "Head Like a Hole", artist: "Nine Inch Nails", genre: "industrial", year: 1989, coverColor: "#22D3EE", difficulty: 2 },
  // jazz
  { title: "Take Five", artist: "The Dave Brubeck Quartet", genre: "jazz", year: 1959, coverColor: "#FBBF24", difficulty: 1 },
  { title: "So What", artist: "Miles Davis", genre: "jazz", year: 1959, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Giant Steps", artist: "John Coltrane", genre: "jazz", year: 1960, coverColor: "#FBBF24", difficulty: 3 },
  { title: "What a Wonderful World", artist: "Louis Armstrong", genre: "jazz", year: 1967, coverColor: "#FBBF24", difficulty: 1 },
  { title: "Take the \"A\" Train", artist: "Duke Ellington", genre: "jazz", year: 1941, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Cantaloupe Island", artist: "Herbie Hancock", genre: "jazz", year: 1964, coverColor: "#FBBF24", difficulty: 3 },
  // blues
  { title: "The Thrill Is Gone", artist: "B.B. King", genre: "blues", year: 1969, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Hoochie Coochie Man", artist: "Muddy Waters", genre: "blues", year: 1954, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Boom Boom", artist: "John Lee Hooker", genre: "blues", year: 1962, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Cross Road Blues", artist: "Robert Johnson", genre: "blues", year: 1936, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Pride and Joy", artist: "Stevie Ray Vaughan", genre: "blues", year: 1983, coverColor: "#FBBF24", difficulty: 2 },
  { title: "At Last", artist: "Etta James", genre: "blues", year: 1960, coverColor: "#FBBF24", difficulty: 1 },
  // classical
  { title: "Symphony No. 5", artist: "Ludwig van Beethoven", genre: "classical", year: 1808, coverColor: "#34D399", difficulty: 1 },
  { title: "Eine kleine Nachtmusik", artist: "Wolfgang Amadeus Mozart", genre: "classical", year: 1787, coverColor: "#34D399", difficulty: 1 },
  { title: "The Four Seasons: Spring", artist: "Antonio Vivaldi", genre: "classical", year: 1725, coverColor: "#34D399", difficulty: 2 },
  { title: "Toccata and Fugue in D minor", artist: "Johann Sebastian Bach", genre: "classical", year: 1708, coverColor: "#34D399", difficulty: 2 },
  { title: "1812 Overture", artist: "Pyotr Ilyich Tchaikovsky", genre: "classical", year: 1880, coverColor: "#34D399", difficulty: 2 },
  { title: "In the Hall of the Mountain King", artist: "Edvard Grieg", genre: "classical", year: 1875, coverColor: "#34D399", difficulty: 2 },
  // score / soundtrack
  { title: "Time", artist: "Hans Zimmer", genre: "ost", year: 2010, coverColor: "#34D399", difficulty: 2 },
  { title: "Star Wars (Main Title)", artist: "John Williams", genre: "ost", year: 1977, coverColor: "#34D399", difficulty: 1 },
  { title: "Concerning Hobbits", artist: "Howard Shore", genre: "ost", year: 2001, coverColor: "#34D399", difficulty: 3 },
  { title: "The Good, the Bad and the Ugly", artist: "Ennio Morricone", genre: "ost", year: 1966, coverColor: "#34D399", difficulty: 2 },
  { title: "Chariots of Fire", artist: "Vangelis", genre: "ost", year: 1981, coverColor: "#34D399", difficulty: 2 },
  { title: "Game of Thrones (Main Title)", artist: "Ramin Djawadi", genre: "ost", year: 2011, coverColor: "#34D399", difficulty: 2 },
  // folk
  { title: "Blowin' in the Wind", artist: "Bob Dylan", genre: "folk", year: 1963, coverColor: "#FB923C", difficulty: 1 },
  { title: "The Sound of Silence", artist: "Simon & Garfunkel", genre: "folk", year: 1964, coverColor: "#FB923C", difficulty: 1 },
  { title: "This Land Is Your Land", artist: "Woody Guthrie", genre: "folk", year: 1944, coverColor: "#FB923C", difficulty: 2 },
  { title: "Diamonds & Rust", artist: "Joan Baez", genre: "folk", year: 1975, coverColor: "#FB923C", difficulty: 3 },
  { title: "Pink Moon", artist: "Nick Drake", genre: "folk", year: 1972, coverColor: "#FB923C", difficulty: 3 },
  { title: "The Boxer", artist: "Simon & Garfunkel", genre: "folk", year: 1969, coverColor: "#FB923C", difficulty: 2 },
  // new age
  { title: "Orinoco Flow", artist: "Enya", genre: "new-age", year: 1988, coverColor: "#34D399", difficulty: 2 },
  { title: "Santorini", artist: "Yanni", genre: "new-age", year: 1994, coverColor: "#34D399", difficulty: 3 },
  { title: "Silk Road", artist: "Kitaro", genre: "new-age", year: 1980, coverColor: "#34D399", difficulty: 3 },
  { title: "Return to Innocence", artist: "Enigma", genre: "new-age", year: 1993, coverColor: "#34D399", difficulty: 2 },
  { title: "Watermark", artist: "Enya", genre: "new-age", year: 1988, coverColor: "#34D399", difficulty: 3 },
  // indie
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", genre: "indie", year: 2013, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Last Nite", artist: "The Strokes", genre: "indie", year: 2001, coverColor: "#FF2D87", difficulty: 2 },
  { title: "A-Punk", artist: "Vampire Weekend", genre: "indie", year: 2008, coverColor: "#FF2D87", difficulty: 2 },
  { title: "The Less I Know the Better", artist: "Tame Impala", genre: "indie", year: 2015, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Dog Days Are Over", artist: "Florence + The Machine", genre: "indie", year: 2008, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Take Me Out", artist: "Franz Ferdinand", genre: "indie", year: 2004, coverColor: "#FF2D87", difficulty: 2 },
  // pop rock
  { title: "Mr. Brightside", artist: "The Killers", genre: "pop rock", year: 2003, coverColor: "#FB7185", difficulty: 1 },
  { title: "Yellow", artist: "Coldplay", genre: "pop rock", year: 2000, coverColor: "#FB7185", difficulty: 1 },
  { title: "Counting Stars", artist: "OneRepublic", genre: "pop rock", year: 2013, coverColor: "#FB7185", difficulty: 1 },
  { title: "Radioactive", artist: "Imagine Dragons", genre: "pop rock", year: 2012, coverColor: "#FB7185", difficulty: 1 },
  { title: "She Will Be Loved", artist: "Maroon 5", genre: "pop rock", year: 2004, coverColor: "#FB7185", difficulty: 2 },

  // ---- M2 taxonomy batch 2 (depth) ----
  // heavy metal
  { title: "Crazy Train", artist: "Ozzy Osbourne", genre: "heavy metal", year: 1980, coverColor: "#8B5CF6", difficulty: 1 },
  { title: "Walk", artist: "Pantera", genre: "heavy metal", year: 1992, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Raining Blood", artist: "Slayer", genre: "heavy metal", year: 1986, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Ace of Spades", artist: "Motörhead", genre: "heavy metal", year: 1980, coverColor: "#8B5CF6", difficulty: 1 },
  // hard rock
  { title: "Rock and Roll All Nite", artist: "Kiss", genre: "hard rock", year: 1975, coverColor: "#FB7185", difficulty: 2 },
  { title: "La Grange", artist: "ZZ Top", genre: "hard rock", year: 1973, coverColor: "#FB7185", difficulty: 2 },
  { title: "Rock You Like a Hurricane", artist: "Scorpions", genre: "hard rock", year: 1984, coverColor: "#FB7185", difficulty: 2 },
  { title: "Baba O'Riley", artist: "The Who", genre: "hard rock", year: 1971, coverColor: "#FB7185", difficulty: 2 },
  // death metal
  { title: "Eaten", artist: "Bloodbath", genre: "death metal", year: 2004, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Sarcophagus", artist: "Nile", genre: "death metal", year: 1998, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "World Eater", artist: "Bolt Thrower", genre: "death metal", year: 1991, coverColor: "#8B5CF6", difficulty: 3 },
  // black metal
  { title: "Dunkelheit", artist: "Burzum", genre: "black metal", year: 1996, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Mourning Palace", artist: "Dimmu Borgir", genre: "black metal", year: 1997, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Sons of Northern Darkness", artist: "Immortal", genre: "black metal", year: 2002, coverColor: "#8B5CF6", difficulty: 3 },
  // folk metal
  { title: "Rasputin", artist: "Turisas", genre: "folk metal", year: 2007, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Keelhauled", artist: "Alestorm", genre: "folk metal", year: 2009, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Sons of Winter and Stars", artist: "Wintersun", genre: "folk metal", year: 2004, coverColor: "#8B5CF6", difficulty: 3 },
  // industrial
  { title: "Hurt", artist: "Nine Inch Nails", genre: "industrial", year: 1994, coverColor: "#22D3EE", difficulty: 2 },
  { title: "Sonne", artist: "Rammstein", genre: "industrial", year: 2001, coverColor: "#22D3EE", difficulty: 2 },
  { title: "A Drug Against War", artist: "KMFDM", genre: "industrial", year: 1993, coverColor: "#22D3EE", difficulty: 3 },
  // jazz
  { title: "Ornithology", artist: "Charlie Parker", genre: "jazz", year: 1946, coverColor: "#FBBF24", difficulty: 3 },
  { title: "'Round Midnight", artist: "Thelonious Monk", genre: "jazz", year: 1947, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Strange Fruit", artist: "Billie Holiday", genre: "jazz", year: 1939, coverColor: "#FBBF24", difficulty: 2 },
  { title: "My Funny Valentine", artist: "Chet Baker", genre: "jazz", year: 1954, coverColor: "#FBBF24", difficulty: 2 },
  // blues
  { title: "Smokestack Lightnin'", artist: "Howlin' Wolf", genre: "blues", year: 1956, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Crossroads", artist: "Cream", genre: "blues", year: 1968, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Damn Right, I've Got the Blues", artist: "Buddy Guy", genre: "blues", year: 1991, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Sweet Home Chicago", artist: "Robert Johnson", genre: "blues", year: 1937, coverColor: "#FBBF24", difficulty: 3 },
  // classical
  { title: "Für Elise", artist: "Ludwig van Beethoven", genre: "classical", year: 1810, coverColor: "#34D399", difficulty: 1 },
  { title: "Canon in D", artist: "Johann Pachelbel", genre: "classical", year: 1680, coverColor: "#34D399", difficulty: 1 },
  { title: "Nocturne Op. 9 No. 2", artist: "Frédéric Chopin", genre: "classical", year: 1832, coverColor: "#34D399", difficulty: 2 },
  { title: "The Planets: Mars", artist: "Gustav Holst", genre: "classical", year: 1916, coverColor: "#34D399", difficulty: 3 },
  // score / soundtrack
  { title: "Jurassic Park Theme", artist: "John Williams", genre: "ost", year: 1993, coverColor: "#34D399", difficulty: 1 },
  { title: "He's a Pirate", artist: "Klaus Badelt", genre: "ost", year: 2003, coverColor: "#34D399", difficulty: 2 },
  { title: "Gonna Fly Now", artist: "Bill Conti", genre: "ost", year: 1976, coverColor: "#34D399", difficulty: 2 },
  { title: "Back to the Future", artist: "Alan Silvestri", genre: "ost", year: 1985, coverColor: "#34D399", difficulty: 2 },
  // folk
  { title: "Both Sides Now", artist: "Joni Mitchell", genre: "folk", year: 1969, coverColor: "#FB923C", difficulty: 2 },
  { title: "Heart of Gold", artist: "Neil Young", genre: "folk", year: 1972, coverColor: "#FB923C", difficulty: 2 },
  { title: "Wild World", artist: "Cat Stevens", genre: "folk", year: 1970, coverColor: "#FB923C", difficulty: 2 },
  { title: "Puff, the Magic Dragon", artist: "Peter, Paul and Mary", genre: "folk", year: 1963, coverColor: "#FB923C", difficulty: 2 },
  // new age
  { title: "Only Time", artist: "Enya", genre: "new-age", year: 2000, coverColor: "#34D399", difficulty: 2 },
  { title: "Oxygène, Pt. IV", artist: "Jean-Michel Jarre", genre: "new-age", year: 1976, coverColor: "#34D399", difficulty: 3 },
  { title: "Tubular Bells", artist: "Mike Oldfield", genre: "new-age", year: 1973, coverColor: "#34D399", difficulty: 3 },
  // indie
  { title: "Skinny Love", artist: "Bon Iver", genre: "indie", year: 2007, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Kids", artist: "MGMT", genre: "indie", year: 2007, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Pumped Up Kicks", artist: "Foster the People", genre: "indie", year: 2010, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Breezeblocks", artist: "Alt-J", genre: "indie", year: 2012, coverColor: "#FF2D87", difficulty: 2 },
  // pop rock
  { title: "Sugar, We're Goin Down", artist: "Fall Out Boy", genre: "pop rock", year: 2005, coverColor: "#FB7185", difficulty: 2 },
  { title: "Misery Business", artist: "Paramore", genre: "pop rock", year: 2007, coverColor: "#FB7185", difficulty: 2 },
  { title: "Boulevard of Broken Dreams", artist: "Green Day", genre: "pop rock", year: 2004, coverColor: "#FB7185", difficulty: 1 },
  { title: "How to Save a Life", artist: "The Fray", genre: "pop rock", year: 2005, coverColor: "#FB7185", difficulty: 2 },

  // ---- M2 taxonomy batch 3 (breadth toward 500) ----
  // pop
  { title: "Bad Romance", artist: "Lady Gaga", genre: "pop", year: 2009, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Firework", artist: "Katy Perry", genre: "pop", year: 2010, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Toxic", artist: "Britney Spears", genre: "pop", year: 2003, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Since U Been Gone", artist: "Kelly Clarkson", genre: "pop", year: 2004, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Happy", artist: "Pharrell Williams", genre: "pop", year: 2013, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "pop", year: 2016, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Someone Like You", artist: "Adele", genre: "pop", year: 2011, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Royals", artist: "Lorde", genre: "pop", year: 2013, coverColor: "#FF2D87", difficulty: 2 },
  // rock
  { title: "Comfortably Numb", artist: "Pink Floyd", genre: "rock", year: 1979, coverColor: "#FB7185", difficulty: 2 },
  { title: "Under Pressure", artist: "Queen & David Bowie", genre: "rock", year: 1981, coverColor: "#FB7185", difficulty: 2 },
  { title: "Born to Run", artist: "Bruce Springsteen", genre: "rock", year: 1975, coverColor: "#FB7185", difficulty: 2 },
  { title: "Sultans of Swing", artist: "Dire Straits", genre: "rock", year: 1978, coverColor: "#FB7185", difficulty: 2 },
  { title: "American Idiot", artist: "Green Day", genre: "rock", year: 2004, coverColor: "#FB7185", difficulty: 1 },
  { title: "Everlong", artist: "Foo Fighters", genre: "rock", year: 1997, coverColor: "#FB7185", difficulty: 2 },
  { title: "Losing My Religion", artist: "R.E.M.", genre: "rock", year: 1991, coverColor: "#FB7185", difficulty: 2 },
  { title: "With or Without You", artist: "U2", genre: "rock", year: 1987, coverColor: "#FB7185", difficulty: 1 },
  // heavy metal
  { title: "Fade to Black", artist: "Metallica", genre: "heavy metal", year: 1984, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Hallowed Be Thy Name", artist: "Iron Maiden", genre: "heavy metal", year: 1982, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Fear of the Dark", artist: "Iron Maiden", genre: "heavy metal", year: 1992, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Angel of Death", artist: "Slayer", genre: "heavy metal", year: 1986, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Cowboys from Hell", artist: "Pantera", genre: "heavy metal", year: 1990, coverColor: "#8B5CF6", difficulty: 2 },
  // hard rock
  { title: "You Shook Me All Night Long", artist: "AC/DC", genre: "hard rock", year: 1980, coverColor: "#FB7185", difficulty: 1 },
  { title: "Paradise City", artist: "Guns N' Roses", genre: "hard rock", year: 1987, coverColor: "#FB7185", difficulty: 1 },
  { title: "Barracuda", artist: "Heart", genre: "hard rock", year: 1977, coverColor: "#FB7185", difficulty: 2 },
  { title: "More Than a Feeling", artist: "Boston", genre: "hard rock", year: 1976, coverColor: "#FB7185", difficulty: 2 },
  { title: "Immigrant Song", artist: "Led Zeppelin", genre: "hard rock", year: 1970, coverColor: "#FB7185", difficulty: 2 },
  // jazz
  { title: "Fly Me to the Moon", artist: "Frank Sinatra", genre: "jazz", year: 1964, coverColor: "#FBBF24", difficulty: 1 },
  { title: "Blue in Green", artist: "Miles Davis", genre: "jazz", year: 1959, coverColor: "#FBBF24", difficulty: 3 },
  { title: "My Favorite Things", artist: "John Coltrane", genre: "jazz", year: 1961, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Feeling Good", artist: "Nina Simone", genre: "jazz", year: 1965, coverColor: "#FBBF24", difficulty: 1 },
  { title: "Sing, Sing, Sing", artist: "Benny Goodman", genre: "jazz", year: 1937, coverColor: "#FBBF24", difficulty: 2 },
  { title: "In a Sentimental Mood", artist: "Duke Ellington", genre: "jazz", year: 1963, coverColor: "#FBBF24", difficulty: 3 },
  // blues
  { title: "Born Under a Bad Sign", artist: "Albert King", genre: "blues", year: 1967, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Stormy Monday", artist: "T-Bone Walker", genre: "blues", year: 1947, coverColor: "#FBBF24", difficulty: 3 },
  { title: "I'd Rather Go Blind", artist: "Etta James", genre: "blues", year: 1968, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Red House", artist: "Jimi Hendrix", genre: "blues", year: 1967, coverColor: "#FBBF24", difficulty: 2 },
  { title: "The Sky Is Crying", artist: "Elmore James", genre: "blues", year: 1960, coverColor: "#FBBF24", difficulty: 3 },
  // classical
  { title: "Moonlight Sonata", artist: "Ludwig van Beethoven", genre: "classical", year: 1801, coverColor: "#34D399", difficulty: 1 },
  { title: "Ride of the Valkyries", artist: "Richard Wagner", genre: "classical", year: 1856, coverColor: "#34D399", difficulty: 2 },
  { title: "Clair de Lune", artist: "Claude Debussy", genre: "classical", year: 1905, coverColor: "#34D399", difficulty: 2 },
  { title: "Boléro", artist: "Maurice Ravel", genre: "classical", year: 1928, coverColor: "#34D399", difficulty: 2 },
  { title: "Ode to Joy", artist: "Ludwig van Beethoven", genre: "classical", year: 1824, coverColor: "#34D399", difficulty: 1 },
  { title: "Air on the G String", artist: "Johann Sebastian Bach", genre: "classical", year: 1731, coverColor: "#34D399", difficulty: 3 },
  // score / soundtrack
  { title: "The Imperial March", artist: "John Williams", genre: "ost", year: 1980, coverColor: "#34D399", difficulty: 1 },
  { title: "Now We Are Free", artist: "Hans Zimmer & Lisa Gerrard", genre: "ost", year: 2000, coverColor: "#34D399", difficulty: 2 },
  { title: "Hedwig's Theme", artist: "John Williams", genre: "ost", year: 2001, coverColor: "#34D399", difficulty: 1 },
  { title: "Cornfield Chase", artist: "Hans Zimmer", genre: "ost", year: 2014, coverColor: "#34D399", difficulty: 2 },
  { title: "E.T. Flying Theme", artist: "John Williams", genre: "ost", year: 1982, coverColor: "#34D399", difficulty: 2 },
  { title: "The Avengers", artist: "Alan Silvestri", genre: "ost", year: 2012, coverColor: "#34D399", difficulty: 2 },
  // folk
  { title: "Fast Car", artist: "Tracy Chapman", genre: "folk", year: 1988, coverColor: "#FB923C", difficulty: 1 },
  { title: "The Times They Are a-Changin'", artist: "Bob Dylan", genre: "folk", year: 1964, coverColor: "#FB923C", difficulty: 2 },
  { title: "Big Yellow Taxi", artist: "Joni Mitchell", genre: "folk", year: 1970, coverColor: "#FB923C", difficulty: 2 },
  { title: "Landslide", artist: "Fleetwood Mac", genre: "folk", year: 1975, coverColor: "#FB923C", difficulty: 2 },
  { title: "If I Had a Hammer", artist: "Pete Seeger", genre: "folk", year: 1949, coverColor: "#FB923C", difficulty: 3 },
  // indie
  { title: "Somebody That I Used to Know", artist: "Gotye", genre: "indie", year: 2011, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Ho Hey", artist: "The Lumineers", genre: "indie", year: 2012, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Electric Feel", artist: "MGMT", genre: "indie", year: 2007, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Feel It Still", artist: "Portugal. The Man", genre: "indie", year: 2017, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Little Talks", artist: "Of Monsters and Men", genre: "indie", year: 2011, coverColor: "#FF2D87", difficulty: 2 },
  // pop rock
  { title: "Viva la Vida", artist: "Coldplay", genre: "pop rock", year: 2008, coverColor: "#FB7185", difficulty: 1 },
  { title: "Somebody Told Me", artist: "The Killers", genre: "pop rock", year: 2004, coverColor: "#FB7185", difficulty: 2 },
  { title: "Believer", artist: "Imagine Dragons", genre: "pop rock", year: 2017, coverColor: "#FB7185", difficulty: 1 },
  { title: "The Middle", artist: "Jimmy Eat World", genre: "pop rock", year: 2001, coverColor: "#FB7185", difficulty: 2 },
  { title: "Sugar", artist: "Maroon 5", genre: "pop rock", year: 2014, coverColor: "#FB7185", difficulty: 1 },
  // new age
  { title: "Adiemus", artist: "Karl Jenkins", genre: "new-age", year: 1995, coverColor: "#34D399", difficulty: 3 },
  { title: "Nuvole Bianche", artist: "Ludovico Einaudi", genre: "new-age", year: 2004, coverColor: "#34D399", difficulty: 2 },
  { title: "Divenire", artist: "Ludovico Einaudi", genre: "new-age", year: 2006, coverColor: "#34D399", difficulty: 3 },
  // death metal
  { title: "Zombie Ritual", artist: "Death", genre: "death metal", year: 1987, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Blinded by Fear", artist: "At the Gates", genre: "death metal", year: 1995, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Heartwork", artist: "Carcass", genre: "death metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  // industrial
  { title: "Wish", artist: "Nine Inch Nails", genre: "industrial", year: 1992, coverColor: "#22D3EE", difficulty: 2 },
  { title: "Stripped", artist: "Rammstein", genre: "industrial", year: 1998, coverColor: "#22D3EE", difficulty: 2 },
  { title: "Firestarter", artist: "The Prodigy", genre: "industrial", year: 1996, coverColor: "#22D3EE", difficulty: 2 },

  // ---- M2 taxonomy batch 4 (deepen metal family + thin genres) ----
  // heavy metal
  { title: "Run to the Hills", artist: "Iron Maiden", genre: "heavy metal", year: 1982, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "The Number of the Beast", artist: "Iron Maiden", genre: "heavy metal", year: 1982, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "2 Minutes to Midnight", artist: "Iron Maiden", genre: "heavy metal", year: 1984, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Aces High", artist: "Iron Maiden", genre: "heavy metal", year: 1984, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "One", artist: "Metallica", genre: "heavy metal", year: 1988, coverColor: "#8B5CF6", difficulty: 1 },
  { title: "For Whom the Bell Tolls", artist: "Metallica", genre: "heavy metal", year: 1984, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Ride the Lightning", artist: "Metallica", genre: "heavy metal", year: 1984, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Breaking the Law", artist: "Judas Priest", genre: "heavy metal", year: 1980, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Peace Sells", artist: "Megadeth", genre: "heavy metal", year: 1986, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "War Pigs", artist: "Black Sabbath", genre: "heavy metal", year: 1970, coverColor: "#8B5CF6", difficulty: 1 },
  // hard rock
  { title: "Highway to Hell", artist: "AC/DC", genre: "hard rock", year: 1979, coverColor: "#FB7185", difficulty: 1 },
  { title: "T.N.T.", artist: "AC/DC", genre: "hard rock", year: 1975, coverColor: "#FB7185", difficulty: 2 },
  { title: "Dream On", artist: "Aerosmith", genre: "hard rock", year: 1973, coverColor: "#FB7185", difficulty: 1 },
  { title: "Sweet Emotion", artist: "Aerosmith", genre: "hard rock", year: 1975, coverColor: "#FB7185", difficulty: 2 },
  { title: "Kashmir", artist: "Led Zeppelin", genre: "hard rock", year: 1975, coverColor: "#FB7185", difficulty: 2 },
  { title: "Jump", artist: "Van Halen", genre: "hard rock", year: 1984, coverColor: "#FB7185", difficulty: 1 },
  { title: "Free Bird", artist: "Lynyrd Skynyrd", genre: "hard rock", year: 1973, coverColor: "#FB7185", difficulty: 1 },
  { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", genre: "hard rock", year: 1974, coverColor: "#FB7185", difficulty: 1 },
  // death metal
  { title: "Spirit Crusher", artist: "Death", genre: "death metal", year: 1998, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "The Bleeding", artist: "Cannibal Corpse", genre: "death metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Left Hand Path", artist: "Entombed", genre: "death metal", year: 1990, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Only for the Weak", artist: "In Flames", genre: "death metal", year: 2000, coverColor: "#8B5CF6", difficulty: 3 },
  // black metal
  { title: "A Blaze in the Northern Sky", artist: "Darkthrone", genre: "black metal", year: 1992, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Det Som Engang Var", artist: "Burzum", genre: "black metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Deathcrush", artist: "Mayhem", genre: "black metal", year: 1987, coverColor: "#8B5CF6", difficulty: 3 },
  // folk metal
  { title: "Wooden Pints", artist: "Korpiklaani", genre: "folk metal", year: 2003, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Guardians of Fate", artist: "Ensiferum", genre: "folk metal", year: 2007, coverColor: "#8B5CF6", difficulty: 3 },
  // industrial
  { title: "The Perfect Drug", artist: "Nine Inch Nails", genre: "industrial", year: 1997, coverColor: "#22D3EE", difficulty: 2 },
  { title: "Mein Teil", artist: "Rammstein", genre: "industrial", year: 2004, coverColor: "#22D3EE", difficulty: 2 },
  { title: "Assimilate", artist: "Skinny Puppy", genre: "industrial", year: 1985, coverColor: "#22D3EE", difficulty: 3 },
  { title: "Headhunter", artist: "Front 242", genre: "industrial", year: 1988, coverColor: "#22D3EE", difficulty: 3 },
  // new age
  { title: "Caribbean Blue", artist: "Enya", genre: "new-age", year: 1991, coverColor: "#34D399", difficulty: 2 },
  { title: "Cristofori's Dream", artist: "David Lanz", genre: "new-age", year: 1988, coverColor: "#34D399", difficulty: 3 },
  { title: "Experience", artist: "Ludovico Einaudi", genre: "new-age", year: 2013, coverColor: "#34D399", difficulty: 3 },
  // indie
  { title: "Reptilia", artist: "The Strokes", genre: "indie", year: 2003, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Fluorescent Adolescent", artist: "Arctic Monkeys", genre: "indie", year: 2007, coverColor: "#FF2D87", difficulty: 2 },
  { title: "1901", artist: "Phoenix", genre: "indie", year: 2009, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Midnight City", artist: "M83", genre: "indie", year: 2011, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Sweater Weather", artist: "The Neighbourhood", genre: "indie", year: 2013, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Riptide", artist: "Vance Joy", genre: "indie", year: 2013, coverColor: "#FF2D87", difficulty: 1 },
  // jazz
  { title: "Mack the Knife", artist: "Bobby Darin", genre: "jazz", year: 1959, coverColor: "#FBBF24", difficulty: 1 },
  { title: "Moanin'", artist: "Art Blakey", genre: "jazz", year: 1958, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Blue Bossa", artist: "Kenny Dorham", genre: "jazz", year: 1963, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Birdland", artist: "Weather Report", genre: "jazz", year: 1977, coverColor: "#FBBF24", difficulty: 2 },
  // blues
  { title: "Killing Floor", artist: "Howlin' Wolf", genre: "blues", year: 1964, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Little Red Rooster", artist: "Howlin' Wolf", genre: "blues", year: 1961, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Statesboro Blues", artist: "The Allman Brothers Band", genre: "blues", year: 1971, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Sweet Little Angel", artist: "B.B. King", genre: "blues", year: 1956, coverColor: "#FBBF24", difficulty: 3 },
  // classical
  { title: "Flight of the Bumblebee", artist: "Nikolai Rimsky-Korsakov", genre: "classical", year: 1900, coverColor: "#34D399", difficulty: 2 },
  { title: "Habanera (Carmen)", artist: "Georges Bizet", genre: "classical", year: 1875, coverColor: "#34D399", difficulty: 2 },
  { title: "Morning Mood (Peer Gynt)", artist: "Edvard Grieg", genre: "classical", year: 1875, coverColor: "#34D399", difficulty: 2 },
  { title: "The Blue Danube", artist: "Johann Strauss II", genre: "classical", year: 1866, coverColor: "#34D399", difficulty: 2 },

  // ---- M2 taxonomy batch 5 (breadth) ----
  // pop
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", genre: "pop", year: 1987, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", genre: "pop", year: 1983, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Wannabe", artist: "Spice Girls", genre: "pop", year: 1996, coverColor: "#FF2D87", difficulty: 1 },
  { title: "...Baby One More Time", artist: "Britney Spears", genre: "pop", year: 1998, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Vogue", artist: "Madonna", genre: "pop", year: 1990, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Teenage Dream", artist: "Katy Perry", genre: "pop", year: 2010, coverColor: "#FF2D87", difficulty: 1 },
  { title: "Just Dance", artist: "Lady Gaga", genre: "pop", year: 2008, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Physical", artist: "Dua Lipa", genre: "pop", year: 2020, coverColor: "#FF2D87", difficulty: 2 },
  // rock
  { title: "Paint It Black", artist: "The Rolling Stones", genre: "rock", year: 1966, coverColor: "#FB7185", difficulty: 1 },
  { title: "Purple Haze", artist: "Jimi Hendrix", genre: "rock", year: 1967, coverColor: "#FB7185", difficulty: 1 },
  { title: "Come As You Are", artist: "Nirvana", genre: "rock", year: 1991, coverColor: "#FB7185", difficulty: 1 },
  { title: "Creep", artist: "Radiohead", genre: "rock", year: 1992, coverColor: "#FB7185", difficulty: 1 },
  { title: "Learn to Fly", artist: "Foo Fighters", genre: "rock", year: 1999, coverColor: "#FB7185", difficulty: 2 },
  { title: "Zombie", artist: "The Cranberries", genre: "rock", year: 1994, coverColor: "#FB7185", difficulty: 1 },
  { title: "Killing in the Name", artist: "Rage Against the Machine", genre: "rock", year: 1992, coverColor: "#FB7185", difficulty: 1 },
  { title: "The Scientist", artist: "Coldplay", genre: "rock", year: 2002, coverColor: "#FB7185", difficulty: 1 },
  // heavy metal
  { title: "Battery", artist: "Metallica", genre: "heavy metal", year: 1986, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Mr. Crowley", artist: "Ozzy Osbourne", genre: "heavy metal", year: 1980, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Electric Eye", artist: "Judas Priest", genre: "heavy metal", year: 1982, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Hangar 18", artist: "Megadeth", genre: "heavy metal", year: 1990, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Wasted Years", artist: "Iron Maiden", genre: "heavy metal", year: 1986, coverColor: "#8B5CF6", difficulty: 3 },
  // hard rock
  { title: "Black Dog", artist: "Led Zeppelin", genre: "hard rock", year: 1971, coverColor: "#FB7185", difficulty: 2 },
  { title: "Rock and Roll", artist: "Led Zeppelin", genre: "hard rock", year: 1971, coverColor: "#FB7185", difficulty: 2 },
  { title: "Runnin' with the Devil", artist: "Van Halen", genre: "hard rock", year: 1978, coverColor: "#FB7185", difficulty: 2 },
  { title: "You Really Got Me", artist: "The Kinks", genre: "hard rock", year: 1964, coverColor: "#FB7185", difficulty: 2 },
  // jazz
  { title: "Summertime", artist: "Ella Fitzgerald", genre: "jazz", year: 1968, coverColor: "#FBBF24", difficulty: 2 },
  { title: "Freddie Freeloader", artist: "Miles Davis", genre: "jazz", year: 1959, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Georgia on My Mind", artist: "Ray Charles", genre: "jazz", year: 1960, coverColor: "#FBBF24", difficulty: 2 },
  { title: "A Love Supreme", artist: "John Coltrane", genre: "jazz", year: 1965, coverColor: "#FBBF24", difficulty: 3 },
  // blues
  { title: "Mannish Boy", artist: "Muddy Waters", genre: "blues", year: 1955, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Dust My Broom", artist: "Elmore James", genre: "blues", year: 1951, coverColor: "#FBBF24", difficulty: 3 },
  { title: "Texas Flood", artist: "Stevie Ray Vaughan", genre: "blues", year: 1983, coverColor: "#FBBF24", difficulty: 3 },
  { title: "I Can't Quit You Baby", artist: "Otis Rush", genre: "blues", year: 1956, coverColor: "#FBBF24", difficulty: 3 },
  // classical
  { title: "Symphony No. 40", artist: "Wolfgang Amadeus Mozart", genre: "classical", year: 1788, coverColor: "#34D399", difficulty: 2 },
  { title: "Requiem: Lacrimosa", artist: "Wolfgang Amadeus Mozart", genre: "classical", year: 1791, coverColor: "#34D399", difficulty: 3 },
  { title: "William Tell Overture", artist: "Gioachino Rossini", genre: "classical", year: 1829, coverColor: "#34D399", difficulty: 2 },
  { title: "Swan Lake", artist: "Pyotr Ilyich Tchaikovsky", genre: "classical", year: 1876, coverColor: "#34D399", difficulty: 2 },
  // score / soundtrack
  { title: "Duel of the Fates", artist: "John Williams", genre: "ost", year: 1999, coverColor: "#34D399", difficulty: 2 },
  { title: "Cantina Band", artist: "John Williams", genre: "ost", year: 1977, coverColor: "#34D399", difficulty: 2 },
  { title: "Schindler's List (Theme)", artist: "John Williams", genre: "ost", year: 1993, coverColor: "#34D399", difficulty: 2 },
  { title: "The Godfather Waltz", artist: "Nino Rota", genre: "ost", year: 1972, coverColor: "#34D399", difficulty: 2 },
  { title: "Married Life", artist: "Michael Giacchino", genre: "ost", year: 2009, coverColor: "#34D399", difficulty: 3 },
  // folk
  { title: "Mr. Tambourine Man", artist: "Bob Dylan", genre: "folk", year: 1965, coverColor: "#FB923C", difficulty: 2 },
  { title: "Take Me Home, Country Roads", artist: "John Denver", genre: "folk", year: 1971, coverColor: "#FB923C", difficulty: 1 },
  { title: "American Pie", artist: "Don McLean", genre: "folk", year: 1971, coverColor: "#FB923C", difficulty: 1 },
  { title: "Homeward Bound", artist: "Simon & Garfunkel", genre: "folk", year: 1966, coverColor: "#FB923C", difficulty: 2 },
  // indie
  { title: "Float On", artist: "Modest Mouse", genre: "indie", year: 2004, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Young Folks", artist: "Peter Bjorn and John", genre: "indie", year: 2006, coverColor: "#FF2D87", difficulty: 2 },
  { title: "Two Weeks", artist: "Grizzly Bear", genre: "indie", year: 2009, coverColor: "#FF2D87", difficulty: 3 },
  { title: "Chamber of Reflection", artist: "Mac DeMarco", genre: "indie", year: 2014, coverColor: "#FF2D87", difficulty: 2 },
  // pop rock
  { title: "Chasing Cars", artist: "Snow Patrol", genre: "pop rock", year: 2006, coverColor: "#FB7185", difficulty: 1 },
  { title: "Use Somebody", artist: "Kings of Leon", genre: "pop rock", year: 2008, coverColor: "#FB7185", difficulty: 1 },
  { title: "Clocks", artist: "Coldplay", genre: "pop rock", year: 2002, coverColor: "#FB7185", difficulty: 1 },
  { title: "Somewhere Only We Know", artist: "Keane", genre: "pop rock", year: 2004, coverColor: "#FB7185", difficulty: 2 },
  { title: "De Mysteriis Dom Sathanas", artist: "Mayhem", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Funeral Fog", artist: "Mayhem", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Life Eternal", artist: "Mayhem", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Pagan Fears", artist: "Mayhem", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Kathaarian Life Code", artist: "Darkthrone", genre: "black metal", year: 1992, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Slottet i det fjerne", artist: "Darkthrone", genre: "black metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "En As I Dype Skogen", artist: "Darkthrone", genre: "black metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Inno a Satana", artist: "Emperor", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Ye Entrancemperium", artist: "Emperor", genre: "black metal", year: 1997, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "The Loss and Curse of Reverence", artist: "Emperor", genre: "black metal", year: 1997, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Thus Spake the Nightspirit", artist: "Emperor", genre: "black metal", year: 1997, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "With Strength I Burn", artist: "Emperor", genre: "black metal", year: 1997, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Key to the Gate", artist: "Burzum", genre: "black metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Lost Wisdom", artist: "Burzum", genre: "black metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "War", artist: "Burzum", genre: "black metal", year: 1992, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "At the Heart of Winter", artist: "Immortal", genre: "black metal", year: 1999, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "All Shall Fall", artist: "Immortal", genre: "black metal", year: 2009, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Blashyrkh (Mighty Ravendark)", artist: "Immortal", genre: "black metal", year: 1995, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "One by One", artist: "Immortal", genre: "black metal", year: 1999, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Tyrants", artist: "Immortal", genre: "black metal", year: 1995, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "K.I.N.G.", artist: "Satyricon", genre: "black metal", year: 2006, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Now, Diabolical", artist: "Satyricon", genre: "black metal", year: 2006, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Fuel for Hatred", artist: "Satyricon", genre: "black metal", year: 2002, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Progenies of the Great Apocalypse", artist: "Dimmu Borgir", genre: "black metal", year: 2003, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Gateways", artist: "Dimmu Borgir", genre: "black metal", year: 2010, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Puritania", artist: "Dimmu Borgir", genre: "black metal", year: 2001, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "The Serpentine Offering", artist: "Dimmu Borgir", genre: "black metal", year: 2007, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Blood Fire Death", artist: "Bathory", genre: "black metal", year: 1988, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "One Rode to Asa Bay", artist: "Bathory", genre: "black metal", year: 1990, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Enter the Eternal Fire", artist: "Bathory", genre: "black metal", year: 1988, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Call from the Grave", artist: "Bathory", genre: "black metal", year: 1985, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Black Metal", artist: "Venom", genre: "black metal", year: 1982, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Welcome to Hell", artist: "Venom", genre: "black metal", year: 1981, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "In League with Satan", artist: "Venom", genre: "black metal", year: 1981, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Panzer Division Marduk", artist: "Marduk", genre: "black metal", year: 1999, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Those of the Unlight", artist: "Marduk", genre: "black metal", year: 1993, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Isa", artist: "Enslaved", genre: "black metal", year: 2004, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Return to Yggdrasill", artist: "Enslaved", genre: "black metal", year: 1998, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "O Father O Satan O Sun", artist: "Behemoth", genre: "black metal", year: 2014, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Conquer All", artist: "Behemoth", genre: "black metal", year: 2004, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Ov Fire and the Void", artist: "Behemoth", genre: "black metal", year: 2009, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Chant for Eschaton 2000", artist: "Behemoth", genre: "black metal", year: 1999, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Malfeitor", artist: "Watain", genre: "black metal", year: 2010, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Lawless Darkness", artist: "Watain", genre: "black metal", year: 2010, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "The Wild Hunt", artist: "Watain", genre: "black metal", year: 2013, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "1184", artist: "Windir", genre: "black metal", year: 2001, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Nordbundet", artist: "Taake", genre: "black metal", year: 2005, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Dream House", artist: "Deafheaven", genre: "black metal", year: 2013, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Sunbather", artist: "Deafheaven", genre: "black metal", year: 2013, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Non Serviam", artist: "Rotting Christ", genre: "black metal", year: 1994, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Her Ghost in the Fog", artist: "Cradle of Filth", genre: "black metal", year: 2000, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "Nymphetamine Fix", artist: "Cradle of Filth", genre: "black metal", year: 2004, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "From the Cradle to Enslave", artist: "Cradle of Filth", genre: "black metal", year: 1999, coverColor: "#8B5CF6", difficulty: 2 },
  { title: "The Secrets of the Black Arts", artist: "Dark Funeral", genre: "black metal", year: 1996, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Sculptor of Flesh", artist: "1349", genre: "black metal", year: 2005, coverColor: "#8B5CF6", difficulty: 3 },
  { title: "Black Metal ist Krieg", artist: "Nargaroth", genre: "black metal", year: 2001, coverColor: "#8B5CF6", difficulty: 3 },
];
