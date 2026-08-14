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
];
