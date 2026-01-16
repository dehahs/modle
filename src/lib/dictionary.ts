// Comprehensive 5-letter words dictionary
// Uses the official Wordle word lists for complete coverage

/**
 * Fallback word list - comprehensive set of common 5-letter words
 * This is used if the remote fetch fails
 */
function getFallbackWordList(): Set<string> {
  // Expanded comprehensive word list
  const words = [
    "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT",
    "AFTER", "AGAIN", "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT",
    "ALIEN", "ALIGN", "ALIKE", "ALIVE", "ALLOW", "ALONE", "ALONG", "ALTER",
    "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA",
    "ARGUE", "ARISE", "ARRAY", "ARROW", "ASIDE", "ASSET", "AVOID", "AWAKE",
    "AWARD", "AWARE", "BADLY", "BAKER", "BASES", "BASIC", "BEACH", "BEGAN",
    "BEGIN", "BEING", "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK", "BLAME",
    "BLANK", "BLAST", "BLIND", "BLOCK", "BLOOD", "BLOOM", "BLOWN", "BLUES",
    "BOARD", "BOAST", "BOBBY", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND",
    "BRASS", "BRAVE", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD",
    "BROKE", "BROWN", "BRUSH", "BUDDY", "BUILD", "BUNCH", "BURST", "CABLE",
    "CALIF", "CALLS", "CAMEL", "CANAL", "CANDY", "CARGO", "CARRY", "CATCH",
    "CAUSE", "CHAIN", "CHAIR", "CHAOS", "CHARM", "CHART", "CHASE", "CHEAP",
    "CHECK", "CHESS", "CHEST", "CHIEF", "CHILD", "CHINA", "CHIPS", "CHOSE",
    "CHUNK", "CIVIL", "CLAIM", "CLASH", "CLASS", "CLEAN", "CLEAR", "CLICK",
    "CLIFF", "CLIMB", "CLING", "CLOCK", "CLOSE", "CLOUD", "CLOWN", "COACH",
    "COAST", "COCOA", "COINS", "COLOR", "COMIC", "COMMA", "CONDO", "COUCH",
    "COULD", "COUNT", "COURT", "COVER", "CRACK", "CRAFT", "CRANE", "CRASH",
    "CRAZY", "CREAM", "CRIME", "CROPS", "CROSS", "CROWD", "CROWN", "CRUDE",
    "CURVE", "CYCLE", "DAILY", "DAIRY", "DANCE", "DATED", "DEALT", "DEATH",
    "DEBIT", "DEBUG", "DELAY", "DELTA", "DENSE", "DEPTH", "DOING", "DOUBT",
    "DOUGH", "DRAFT", "DRAIN", "DRAMA", "DRANK", "DRAWN", "DREAM", "DRESS",
    "DRIED", "DRILL", "DRINK", "DRIVE", "DROVE", "DRUNK", "DYING", "EAGER",
    "EARLY", "EARTH", "EIGHT", "ELBOW", "ELDER", "ELECT", "ELITE", "EMPTY",
    "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY",
    "EXACT", "EXIST", "EXTRA", "FAITH", "FALSE", "FANCY", "FARMS", "FATAL",
    "FAULT", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FINDS",
    "FINES", "FIRED", "FIRES", "FIRST", "FIXED", "FLAGS", "FLAME", "FLASH",
    "FLEET", "FLESH", "FLOAT", "FLOOD", "FLOOR", "FLORA", "FLOWN", "FLUID",
    "FOCUS", "FOLKS", "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT",
    "FROST", "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE",
    "GLORY", "GLOVE", "GOING", "GONNA", "GOODS", "GRACE", "GRADE", "GRAIN",
    "GRAND", "GRANT", "GRASS", "GRAVE", "GREAT", "GREEN", "GREET", "GRIEF",
    "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "GUILT",
    "HABIT", "HAPPY", "HARSH", "HEART", "HEAVY", "HENCE", "HILLS", "HINTS",
    "HIRED", "HOBBY", "HOLDS", "HOLES", "HONOR", "HORSE", "HOTEL", "HOURS",
    "HOUSE", "HUMAN", "HURRY", "ICONS", "IDEAL", "IDEAS", "IMAGE", "IMPLY",
    "INBOX", "INDEX", "INNER", "INPUT", "INTRO", "ISSUE", "ITEMS", "IVORY",
    "JAZZY", "JEANS", "JELLY", "JEWEL", "JOINT", "JOKES", "JUDGE", "JUICE",
    "KNEES", "KNIFE", "KNOCK", "KNOWN", "LABEL", "LARGE", "LASER", "LATER",
    "LAUGH", "LAYER", "LEADS", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL",
    "LEMON", "LEVEL", "LIGHT", "LIMIT", "LINKS", "LIONS", "LISTS", "LIVED",
    "LIVER", "LOANS", "LOCAL", "LOCUS", "LODGE", "LOGIC", "LOOSE", "LORRY",
    "LOSER", "LOVED", "LOVER", "LOWER", "LUCKY", "LUNCH", "LYING", "MAGIC",
    "MAJOR", "MAKER", "MALES", "MARCH", "MARKS", "MARRY", "MATCH", "MAYBE",
    "MAYOR", "MEALS", "MEANS", "MEANT", "MEATS", "MEDIA", "MEETS", "MERCY",
    "MERGE", "MERIT", "MERRY", "MESSY", "METAL", "METER", "METRO", "MIDST",
    "MIGHT", "MILES", "MINDS", "MINES", "MINOR", "MINUS", "MIXED", "MODAL",
    "MODEL", "MODES", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT", "MOUSE",
    "MOUTH", "MOVED", "MOVES", "MOVIE", "MUSIC", "NAKED", "NAMED", "NAMES",
    "NASTY", "NEEDS", "NERVE", "NEVER", "NEWLY", "NIGHT", "NOISE", "NORTH",
    "NOSES", "NOTED", "NOTES", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER",
    "OFTEN", "OLDER", "OLIVE", "ONION", "OPENS", "OPERA", "ORBIT", "ORDER",
    "ORGAN", "OTHER", "OUGHT", "OUTER", "OWNED", "OWNER", "PAGES", "PAINT",
    "PAIRS", "PANEL", "PANIC", "PAPER", "PARKS", "PARTS", "PARTY", "PASTE",
    "PATCH", "PATHS", "PEACE", "PEAKS", "PEARL", "PENNY", "PERKS", "PHASE",
    "PHONE", "PHOTO", "PIANO", "PIECE", "PILOT", "PITCH", "PIZZA", "PLACE",
    "PLAIN", "PLANE", "PLANS", "PLANT", "PLATE", "PLAZA", "POEMS", "POINT",
    "POKER", "POLAR", "POLES", "POOLS", "PORCH", "PORTS", "POSED", "POUND",
    "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE",
    "PROBE", "PROOF", "PROPS", "PROUD", "PROVE", "PULSE", "PUNCH", "PUPIL",
    "PURSE", "QUEEN", "QUERY", "QUEST", "QUICK", "QUIET", "QUITE", "QUOTE",
    "RADIO", "RAINS", "RAISE", "RALLY", "RANCH", "RANGE", "RANKS", "RAPID",
    "RATES", "RATIO", "REACH", "REACT", "READS", "READY", "REALM", "REBEL",
    "REFER", "RELAX", "RELAY", "RELIC", "REMIT", "RENEW", "REPAY", "REPLY",
    "RIDER", "RIDES", "RIDGE", "RIFLE", "RIGHT", "RIGID", "RINGS", "RISES",
    "RISKS", "RIVER", "ROADS", "ROBOT", "ROCKS", "ROCKY", "ROGER", "ROLES",
    "ROLLS", "ROMAN", "ROOMS", "ROOTS", "ROPES", "ROSES", "ROUGH", "ROUND",
    "ROUTE", "ROYAL", "RULER", "RULES", "RURAL", "SADLY", "SAFER", "SALAD",
    "SALES", "SALON", "SALTY", "SANDY", "SATIN", "SAUCE", "SAVED", "SAVES",
    "SCALE", "SCARE", "SCARF", "SCARY", "SCENE", "SCOPE", "SCORE", "SCOTS",
    "SCOUT", "SCRAP", "SCREW", "SEALS", "SEAMS", "SEATS", "SEEDS", "SEEKS",
    "SEEMS", "SELLS", "SENDS", "SENSE", "SERVE", "SETUP", "SEVEN", "SHADE",
    "SHAKE", "SHALL", "SHAME", "SHAPE", "SHARE", "SHARK", "SHARP", "SHEEP",
    "SHEER", "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHINY", "SHIPS",
    "SHIRT", "SHOCK", "SHOES", "SHOOT", "SHOPS", "SHORE", "SHORT", "SHOTS",
    "SHOUT", "SHOVE", "SHOWN", "SHOWS", "SIDES", "SIGHT", "SIGNS", "SILLY",
    "SINCE", "SIXTH", "SIXTY", "SIZED", "SIZES", "SKIES", "SKILL", "SKINS",
    "SKIRT", "SKULL", "SLASH", "SLAVE", "SLEEP", "SLEPT", "SLICE", "SLIDE",
    "SLOPE", "SLOTS", "SMALL", "SMART", "SMILE", "SMITH", "SMOKE", "SNAKE",
    "SNEAK", "SNOWY", "SOAPS", "SOBER", "SOCKS", "SOFAS", "SOILS", "SOLAR",
    "SOLID", "SOLVE", "SONGS", "SONIC", "SORRY", "SORTS", "SOULS", "SOUND",
    "SOUTH", "SPACE", "SPARE", "SPARK", "SPEAK", "SPEED", "SPELL", "SPEND",
    "SPENT", "SPICE", "SPIES", "SPIKE", "SPILL", "SPINE", "SPITE", "SPLIT",
    "SPOKE", "SPOON", "SPORT", "SPOTS", "SPRAY", "SQUAD", "STACK", "STAFF",
    "STAGE", "STAKE", "STALE", "STALL", "STAMP", "STAND", "STARE", "STARK",
    "STARS", "START", "STATE", "STATS", "STAYS", "STEAD", "STEAK", "STEAL",
    "STEAM", "STEEL", "STEEP", "STEER", "STEMS", "STICK", "STILL", "STING",
    "STINK", "STINT", "STOCK", "STOLE", "STOOD", "STOOL", "STOPS", "STORE",
    "STORM", "STORY", "STOVE", "STRAP", "STRAW", "STRAY", "STRIP", "STUCK",
    "STUDY", "STUFF", "STUMP", "STUNG", "STUNK", "STUNT", "STYLE", "SUGAR",
    "SUITE", "SUNNY", "SUPER", "SURGE", "SWAMP", "SWARM", "SWASH", "SWEAT",
    "SWEEP", "SWEET", "SWEPT", "SWIFT", "SWING", "SWIRL", "SWISS", "SWORD",
    "SWORE", "SWORN", "SWUNG", "SYRUP", "TABLE", "TABOO", "TACKY", "TACOS",
    "TAILS", "TAKEN", "TAKES", "TALES", "TALKS", "TANGO", "TANKS", "TAPES",
    "TASKS", "TASTE", "TASTY", "TAXES", "TEACH", "TEAMS", "TEARS", "TEASE",
    "TEENS", "TEETH", "TELLS", "TEMPO", "TENDS", "TENSE", "TENTH", "TERMS",
    "TERRY", "TESTS", "TEXAS", "TEXTS", "THANK", "THEFT", "THEIR", "THEME",
    "THERE", "THESE", "THICK", "THIEF", "THIGH", "THING", "THINK", "THIRD",
    "THOSE", "THREE", "THREW", "THROB", "THROW", "THRUM", "THUMB", "THUMP",
    "THUNK", "TIDAL", "TIGER", "TIGHT", "TILES", "TIMER", "TIMES", "TINGE",
    "TIPSY", "TIRED", "TIRES", "TITAN", "TITLE", "TOAST", "TODAY", "TOKEN",
    "TONES", "TONGS", "TONIC", "TOOLS", "TOOTH", "TOPIC", "TORCH", "TORSO",
    "TOTAL", "TOUCH", "TOUGH", "TOURS", "TOWEL", "TOWER", "TOWNS", "TOXIC",
    "TRACE", "TRACK", "TRACT", "TRADE", "TRAIL", "TRAIN", "TRAIT", "TRAMP",
    "TRASH", "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES",
    "TRILL", "TRIMS", "TRIPS", "TROLL", "TROOP", "TROUT", "TRUCK", "TRULY",
    "TRUMP", "TRUNK", "TRUST", "TRUTH", "TUBES", "TULIP", "TUNES", "TURBO",
    "TURNS", "TUTOR", "TWAIN", "TWANG", "TWEAK", "TWEED", "TWEET", "TWICE",
    "TWIGS", "TWILL", "TWINS", "TWIRL", "TWIST", "TWITS", "TYING", "TYPES",
    "TYPOS", "ULTRA", "UMBRA", "UNARM", "UNARY", "UNBID", "UNBOX", "UNCLE",
    "UNCUT", "UNDER", "UNDID", "UNDUE", "UNFED", "UNFIT", "UNIFY", "UNION",
    "UNITE", "UNITS", "UNITY", "UNLIT", "UNMET", "UNSET", "UNTIE", "UNTIL",
    "UNWED", "UNZIP", "UPPER", "UPSET", "URBAN", "URGED", "URGES", "USAGE",
    "USERS", "USHER", "USING", "USUAL", "USURP", "UTTER", "VAGUE", "VALET",
    "VALID", "VALUE", "VALVE", "VAPOR", "VAULT", "VEGAN", "VEINS", "VENOM",
    "VENTS", "VENUE", "VERBS", "VERGE", "VERSE", "VESTS", "VEXED", "VIBES",
    "VICAR", "VIDEO", "VIEWS", "VIGOR", "VILLA", "VINYL", "VIOLA", "VIPER",
    "VIRAL", "VIRUS", "VISAS", "VISIT", "VISOR", "VISTA", "VITAL", "VIVID",
    "VIXEN", "VOCAL", "VODKA", "VOGUE", "VOICE", "VOMIT", "VOTER", "VOTES",
    "VOUCH", "VOWEL", "WACKY", "WAFER", "WAGER", "WAGES", "WAGON", "WAIST",
    "WAITS", "WAIVE", "WAKES", "WALKS", "WALLS", "WALTZ", "WANDS", "WANES",
    "WANNA", "WANTS", "WARDS", "WARES", "WARMS", "WARNS", "WARPS", "WARTS",
    "WASTE", "WATCH", "WATER", "WAVED", "WAVER", "WAVES", "WAXED", "WAXES",
    "WEARY", "WEAVE", "WEDGE", "WEEDS", "WEEKS", "WEEPS", "WEEPY", "WEIGH",
    "WEIRD", "WELLS", "WELSH", "WENCH", "WHACK", "WHALE", "WHARF", "WHEAT",
    "WHEEL", "WHELP", "WHERE", "WHICH", "WHIFF", "WHILE", "WHIMS", "WHINE",
    "WHIPS", "WHIRL", "WHIRR", "WHISK", "WHIST", "WHITE", "WHOLE", "WHOMP",
    "WHOOP", "WHOSE", "WIDEN", "WIDER", "WIDOW", "WIDTH", "WIELD", "WIGHT",
    "WIMPY", "WINCE", "WINCH", "WINDS", "WINDY", "WINES", "WINGS", "WINKS",
    "WINOS", "WIPED", "WIPER", "WIPES", "WIRED", "WIRES", "WISER", "WISPY",
    "WITCH", "WIVES", "WIZEN", "WOMAN", "WOMEN", "WOOED", "WOOER", "WOOFS",
    "WOOLS", "WOOZY", "WORDS", "WORDY", "WORKS", "WORLD", "WORMS", "WORRY",
    "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WOVEN", "WRACK", "WRAPS",
    "WRATH", "WREAK", "WRECK", "WRENS", "WREST", "WRICK", "WRING", "WRIST",
    "WRITE", "WRITS", "WRONG", "WROTE", "WRUNG", "WRYLY", "YACHT", "YAHOO",
    "YANKS", "YARDS", "YARNS", "YAWED", "YAWLS", "YAWNS", "YEARS", "YEAST",
    "YELLS", "YELPS", "YIELD", "YODEL", "YOKEL", "YOUNG", "YOURS", "YOUTH",
    "YUMMY", "ZAPPY", "ZEBRA", "ZEROS", "ZESTY", "ZILCH", "ZINCS", "ZINGS",
    "ZIPPY", "ZONAL", "ZONED", "ZONES", "ZOOMS"
  ];
  
  return new Set(words);
}

// Initialize with fallback list immediately so validation works synchronously
let VALID_WORDS: Set<string> = getFallbackWordList();
let loadPromise: Promise<Set<string>> | null = null;

/**
 * Load comprehensive word list from public source
 * This fetches the full Wordle valid words list (~12,900+ words)
 */
async function loadWordList(): Promise<Set<string>> {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      // Try to fetch from a public Wordle word list source
      // Using a well-known GitHub repository with Wordle words
      const response = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
      
      if (!response.ok) {
        throw new Error('Failed to fetch word list');
      }

      const text = await response.text();
      // Word list is newline-separated, filter to 5-letter words and convert to uppercase
      const words = text
        .split('\n')
        .map(word => word.trim().toUpperCase())
        .filter(word => word.length === 5 && /^[A-Z]{5}$/.test(word));

      VALID_WORDS = new Set(words);
      console.log(`Loaded ${VALID_WORDS.size} words from Wordle dictionary`);
      return VALID_WORDS;
    } catch (error) {
      console.warn('Failed to load word list from remote source, using fallback list', error);
      // Keep using the fallback list that's already initialized
      return VALID_WORDS;
    }
  })();

  return loadPromise;
}

/**
 * Check if a word is valid (exists in the dictionary)
 * @param word - The word to check (will be converted to uppercase)
 * @returns true if the word is valid, false otherwise
 */
export function isValidWord(word: string): boolean {
  return VALID_WORDS.has(word.toUpperCase());
}

/**
 * Get the word length expected by the dictionary
 */
export const WORD_LENGTH = 5;

/**
 * Get the total number of valid words in the dictionary
 */
export function getDictionarySize(): number {
  return VALID_WORDS.size;
}

/**
 * Load the full Wordle word list asynchronously
 * Call this during app initialization to get the complete list
 * @returns Promise that resolves when the dictionary is loaded
 */
export async function initializeFullDictionary(): Promise<void> {
  await loadWordList();
}
