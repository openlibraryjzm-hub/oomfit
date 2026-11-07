export interface Board {
  id: string;
  shortcode: string;
  name: string;
  domain: string;
  subCategory: string;
  description: string;
  tags: string[];
}

export interface PresetCategory {
  name: string;
  boards: Board[];
}

export interface Preset {
  id: string;
  name: string;
  command: string;
  aliases: string[];
  description?: string;
  categories: {
    name: string;
    boardCodes: string[];
  }[];
}

export const allBoards: Board[] = [
  // ==========================================
  // 🎮 VIDEO GAMES & CONSOLES
  // ==========================================
  {
    id: "v",
    shortcode: "v",
    name: "Video Games",
    domain: "Gaming",
    subCategory: "General",
    description: "General video game discussion, releases, reviews, and industry news",
    tags: ["gaming", "games", "videogames", "general", "releases", "play", "gamer"],
  },
  {
    id: "vg",
    shortcode: "vg",
    name: "Video Game Generals",
    domain: "Gaming",
    subCategory: "General",
    description: "Recurring general threads for specific video game franchises",
    tags: ["gaming", "generals", "franchises", "multiplayer", "fandom", "threads"],
  },
  {
    id: "vr",
    shortcode: "vr",
    name: "Retro Gaming",
    domain: "Gaming",
    subCategory: "Retro",
    description: "Classics and pre-seventh generation gaming memories and preservation",
    tags: ["gaming", "retro", "classic", "vintage", "90s", "80s", "2000s", "old", "pixel"],
  },
  {
    id: "pcg",
    shortcode: "pcg",
    name: "PC Gaming & Battlestations",
    domain: "Gaming",
    subCategory: "General",
    description: "PC hardware, Steam, graphic cards, benchmarks, and monitors",
    tags: ["gaming", "pc", "steam", "gpu", "battlestation", "rig", "desktop", "hardware"],
  },
  {
    id: "emug",
    shortcode: "emug",
    name: "Handhelds & Emulation",
    domain: "Gaming",
    subCategory: "Retro",
    description: "Emulators, handheld emulation devices, Odin, Steam Deck, ROMs",
    tags: ["gaming", "emulation", "handheld", "steamdeck", "odin", "roms", "portable"],
  },
  {
    id: "indie",
    shortcode: "indie",
    name: "Indie Games",
    domain: "Gaming",
    subCategory: "General",
    description: "Independent developers, itch.io gems, experimental mechanics",
    tags: ["gaming", "indie", "independent", "experimental", "dev", "art", "steam"],
  },
  {
    id: "speed",
    shortcode: "speed",
    name: "Speedrunning",
    domain: "Gaming",
    subCategory: "Niches",
    description: "Any%, glitches, routes, AGDQ records, tool-assisted runs",
    tags: ["gaming", "speedrun", "glitch", "record", "tas", "route", "competition"],
  },
  {
    id: "mod",
    shortcode: "mod",
    name: "Modding & Romhacks",
    domain: "Gaming",
    subCategory: "Niches",
    description: "Custom levels, Nexus mods, ROM translations, balance patches",
    tags: ["gaming", "mods", "romhack", "nexus", "custom", "patch", "translation"],
  },
  {
    id: "mc",
    shortcode: "mc",
    name: "Minecraft",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Survival servers, redstone engineering, creative builds & modpacks",
    tags: ["gaming", "minecraft", "blocks", "crafting", "survival", "voxel", "redstone", "java", "bedrock", "building"],
  },
  {
    id: "tf2",
    shortcode: "tf2",
    name: "Team Fortress 2",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Hat trading, class strategies, community servers & frag clips",
    tags: ["gaming", "tf2", "valve", "shooter", "fps", "hats", "source", "multiplayer", "mercenaries"],
  },
  {
    id: "tes",
    shortcode: "tes",
    name: "The Elder Scrolls",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Tamriel lore, Skyrim modding, Morrowind builds & Oblivion nostalgia",
    tags: ["gaming", "skyrim", "morrowind", "oblivion", "rpg", "bethesda", "fantasy", "lore", "elder scrolls"],
  },
  {
    id: "souls",
    shortcode: "souls",
    name: "Elden Ring & Soulsborne",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "FromSoftware, Dark Souls, Bloodborne, Sekiro lore, bosses & builds",
    tags: ["gaming", "souls", "elden ring", "dark souls", "bloodborne", "fromsoft", "rpg", "bosses", "hard"],
  },
  {
    id: "osrs",
    shortcode: "osrs",
    name: "Old School RuneScape",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Grinding, PK-ing, bossing, ironman journeys, and GE flipping",
    tags: ["gaming", "runescape", "osrs", "mmo", "grind", "ironman", "nostalgia", "wilderness"],
  },
  {
    id: "mmo",
    shortcode: "mmo",
    name: "MMORPGs & Online Worlds",
    domain: "Gaming",
    subCategory: "Genres",
    description: "World of Warcraft, FFXIV, Guild Wars 2, raids, guild politics",
    tags: ["gaming", "mmo", "mmorpg", "wow", "ffxiv", "online", "raids", "guild"],
  },
  {
    id: "smash",
    shortcode: "smash",
    name: "Super Smash Bros",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Melee tech, Ultimate roster balance, tournaments, local meetups",
    tags: ["gaming", "nintendo", "smash", "melee", "fighting", "competitive", "fgc"],
  },
  {
    id: "cs",
    shortcode: "cs",
    name: "Counter-Strike",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "CS2, smoke lineups, skin economy, Premier ranking, major tournaments",
    tags: ["gaming", "counterstrike", "cs", "cs2", "valve", "fps", "tactical", "shooter", "esports"],
  },
  {
    id: "dota",
    shortcode: "dota",
    name: "Dota 2",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "The International, hero patches, MMR ladder, item theorycrafting",
    tags: ["gaming", "dota", "valve", "moba", "strategy", "competitive", "ti"],
  },
  {
    id: "lol",
    shortcode: "lol",
    name: "League of Legends",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Summoner's Rift, champion reworks, Worlds, solo queue climbing",
    tags: ["gaming", "league", "lol", "riot", "moba", "esports", "ranked"],
  },
  {
    id: "ff",
    shortcode: "ff",
    name: "Final Fantasy",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Chocobos, Nobuo Uematsu soundtracks, turn-based vs action RPGs",
    tags: ["gaming", "rpg", "jrpg", "final fantasy", "square", "cloud", "sephiroth"],
  },
  {
    id: "pkmn",
    shortcode: "pkmn",
    name: "Pokémon",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Nuzlockes, VGC competitive, ROMhacks, retro generations, trading",
    tags: ["gaming", "pokemon", "nintendo", "nuzlocke", "jrpg", "creatures", "retro"],
  },
  {
    id: "mh",
    shortcode: "mh",
    name: "Monster Hunter",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Weapon metas, armor crafting, beast hunting, palicos & multiplayer hunts",
    tags: ["gaming", "capcom", "monster hunter", "coop", "hunting", "action", "weapons"],
  },
  {
    id: "doom",
    shortcode: "doom",
    name: "Doom & Boomer Shooters",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Quake, Ultrakill, Dusk, bunnyhopping, retro 90s FPS revival",
    tags: ["gaming", "doom", "fps", "boomer shooter", "quake", "retro", "action", "id software"],
  },
  {
    id: "hl",
    shortcode: "hl",
    name: "Half-Life & Portal",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Gordon Freeman, Black Mesa lore, Source physics, test chambers",
    tags: ["gaming", "halflife", "valve", "portal", "source", "sci-fi", "fps"],
  },
  {
    id: "halo",
    shortcode: "halo",
    name: "Halo",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Master Chief, Bungie trilogy, Forge maps, multiplayer LANs, lore",
    tags: ["gaming", "halo", "xbox", "fps", "bungie", "master chief", "sci-fi"],
  },
  {
    id: "zelda",
    shortcode: "zelda",
    name: "The Legend of Zelda",
    domain: "Gaming",
    subCategory: "Hit Titles",
    description: "Ocarina, Majora, BotW, TotK puzzles, Hyrule timeline, speedruns",
    tags: ["gaming", "zelda", "nintendo", "link", "hyrule", "action", "adventure"],
  },
  {
    id: "mv",
    shortcode: "mv",
    name: "Metroidvania",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Hollow Knight, Super Metroid, Castlevania SOTN, non-linear maps",
    tags: ["gaming", "metroidvania", "hollow knight", "metroid", "platformer", "exploration"],
  },
  {
    id: "rogue",
    shortcode: "rogue",
    name: "Roguelikes & Lites",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Hades, Binding of Isaac, Dead Cells, Spelunky, permadeath dungeon runs",
    tags: ["gaming", "roguelike", "roguelite", "hades", "isaac", "permadeath", "procedural"],
  },
  {
    id: "fgc",
    shortcode: "fgc",
    name: "Fighting Games (FGC)",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Street Fighter, Tekken, Guilty Gear, fightsticks, frame data",
    tags: ["gaming", "fighting", "fgc", "street fighter", "tekken", "guilty gear", "combos"],
  },
  {
    id: "strat",
    shortcode: "strat",
    name: "Grand Strategy & 4X",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Crusader Kings, Civilization, Stellaris, Hearts of Iron, map painting",
    tags: ["gaming", "strategy", "4x", "paradox", "civ", "history", "stellaris"],
  },
  {
    id: "factory",
    shortcode: "factory",
    name: "Factory & Automation",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Factorio, Satisfactory, Dyson Sphere Program, conveyor belts & ratios",
    tags: ["gaming", "factorio", "satisfactory", "automation", "base building", "engineering"],
  },
  {
    id: "sim",
    shortcode: "sim",
    name: "Simulators & Flight Sims",
    domain: "Gaming",
    subCategory: "Genres",
    description: "MS Flight Simulator, Euro Truck, HOTAS rigs, realism setups",
    tags: ["gaming", "sim", "simulation", "flight", "truck", "realism", "hotas"],
  },
  {
    id: "rhythm",
    shortcode: "rhythm",
    name: "Rhythm Games",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Osu!, Beat Saber, DDR, Chunithm, custom controllers, BPM mapping",
    tags: ["gaming", "rhythm", "music", "osu", "ddr", "arcade", "reflexes"],
  },
  {
    id: "vn",
    shortcode: "vn",
    name: "Visual Novels",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Steins;Gate, Clannad, Fate/stay night, branching routes, narrative art",
    tags: ["gaming", "visual novel", "vn", "anime", "story", "steins gate", "reading"],
  },
  {
    id: "sh",
    shortcode: "sh",
    name: "Survival Horror",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Silent Hill, Resident Evil, tank controls, inventory management, scares",
    tags: ["gaming", "horror", "survival horror", "silent hill", "resident evil", "creepy"],
  },
  {
    id: "gacha",
    shortcode: "gacha",
    name: "Gacha & Mobile Gaming",
    domain: "Gaming",
    subCategory: "Genres",
    description: "Genshin, Star Rail, Blue Archive, banner pulls, character builds",
    tags: ["gaming", "gacha", "anime", "genshin", "star rail", "mobile", "f2p"],
  },

  // Consoles
  {
    id: "ps2",
    shortcode: "ps2",
    name: "PlayStation 2",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "The golden generation, DVD playback, memory cards, vast library",
    tags: ["gaming", "console", "sony", "ps2", "retro", "nostalgia", "2000s"],
  },
  {
    id: "gc",
    shortcode: "gc",
    name: "Nintendo GameCube",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "The purple lunchbox, wavebirds, mini-DVDs, Melee, Wind Waker",
    tags: ["gaming", "console", "nintendo", "gamecube", "retro", "nostalgia"],
  },
  {
    id: "360",
    shortcode: "360",
    name: "Xbox 360",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "Blades dashboard, Halo 3 lobbies, red ring of death, Xbox Live",
    tags: ["gaming", "console", "xbox", "microsoft", "360", "retro", "fps"],
  },
  {
    id: "ds",
    shortcode: "ds",
    name: "Nintendo DS & 3DS",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "Dual screens, stylus gaming, StreetPass, homebrew, clamshell design",
    tags: ["gaming", "console", "handheld", "nintendo", "ds", "3ds", "portable"],
  },
  {
    id: "dc",
    shortcode: "dc",
    name: "Sega Dreamcast",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "Sega's final masterpiece, VMU screens, arcade ports, Shenmue",
    tags: ["gaming", "console", "sega", "dreamcast", "retro", "arcade", "90s"],
  },
  {
    id: "gba",
    shortcode: "gba",
    name: "Game Boy & Advance",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "Pixel art zenith, IPS screen mods, classic cartridges, chiptunes",
    tags: ["gaming", "console", "handheld", "nintendo", "gba", "gameboy", "retro"],
  },
  {
    id: "ps1",
    shortcode: "ps1",
    name: "PlayStation 1",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "Affordable CD-ROM era, low-poly aesthetics, memory cards, boot chime",
    tags: ["gaming", "console", "sony", "ps1", "retro", "lowpoly", "90s"],
  },
  {
    id: "crt",
    shortcode: "crt",
    name: "CRT Gaming & PVMs",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "Cathode ray tubes, scanlines, 240p clarity, Trinitron, zero latency",
    tags: ["gaming", "crt", "monitor", "retro", "scanlines", "hardware", "pvm", "vintage"],
  },
  {
    id: "arcade",
    shortcode: "arcade",
    name: "Arcade & Neo Geo",
    domain: "Gaming",
    subCategory: "Consoles",
    description: "Coin-op cabinets, candy cabs, CRT monitors, SNK, arcade preservation",
    tags: ["gaming", "arcade", "neogeo", "cabinet", "retro", "snk", "coin-op"],
  },

  // ==========================================
  // 💻 TECHNOLOGY & COMPUTING
  // ==========================================
  {
    id: "ai",
    shortcode: "ai",
    name: "Artificial Intelligence",
    domain: "Technology",
    subCategory: "AI & Agents",
    description: "LLMs, neural agents, diffusion art, and machine intelligence research",
    tags: ["tech", "ai", "artificial intelligence", "llm", "neural", "agents", "machine learning", "deep learning"],
  },
  {
    id: "vibe",
    shortcode: "vibe",
    name: "Vibecoding & Agentic Dev",
    domain: "Technology",
    subCategory: "AI & Agents",
    description: "Flow-state coding, AI pair programming, rapid prototype building",
    tags: ["tech", "coding", "vibe", "vibecoding", "ai", "programming", "prompt", "flow", "dev"],
  },
  {
    id: "localllm",
    shortcode: "localllm",
    name: "Local LLMs & Ollama",
    domain: "Technology",
    subCategory: "AI & Agents",
    description: "Quantized weights, GGUF, vLLM, self-hosted open-weights models",
    tags: ["tech", "ai", "local", "ollama", "gguf", "llama", "huggingface", "gpu", "open source"],
  },
  {
    id: "genart",
    shortcode: "genart",
    name: "AI Art & Diffusion",
    domain: "Technology",
    subCategory: "AI & Agents",
    description: "Stable Diffusion, ComfyUI workflows, LoRAs, generative media",
    tags: ["tech", "ai", "diffusion", "art", "comfyui", "midjourney", "images", "lora"],
  },
  {
    id: "g",
    shortcode: "g",
    name: "Technology & Hardware",
    domain: "Technology",
    subCategory: "General Tech",
    description: "General consumer electronics, smartphones, operating systems",
    tags: ["tech", "hardware", "gadgets", "phones", "pc", "electronics", "technology"],
  },
  {
    id: "prog",
    shortcode: "prog",
    name: "Programming & CS",
    domain: "Technology",
    subCategory: "Software",
    description: "Algorithms, code reviews, language debates, system architecture",
    tags: ["tech", "code", "programming", "software", "algorithms", "developer", "engineering"],
  },
  {
    id: "nix",
    shortcode: "nix",
    name: "Linux & BSD",
    domain: "Technology",
    subCategory: "Software",
    description: "Kernel hacking, distros, Arch, NixOS, open-source UNIX freedom",
    tags: ["tech", "linux", "unix", "bsd", "arch", "nixos", "foss", "open source", "kernel"],
  },
  {
    id: "home",
    shortcode: "home",
    name: "Self-Hosting & Homelab",
    domain: "Technology",
    subCategory: "Software",
    description: "Home servers, Docker containers, Proxmox, private cloud setups",
    tags: ["tech", "homelab", "server", "docker", "selfhosted", "proxmox", "nas", "storage"],
  },
  {
    id: "sec",
    shortcode: "sec",
    name: "Cybersecurity & NetSec",
    domain: "Technology",
    subCategory: "Software",
    description: "InfoSec, ethical hacking, CTF challenges, reverse engineering",
    tags: ["tech", "security", "cyber", "infosec", "hacking", "crypto", "privacy", "netsec"],
  },
  {
    id: "web",
    shortcode: "web",
    name: "Web Development",
    domain: "Technology",
    subCategory: "Software",
    description: "Frontend, backend, React, Next.js, minimalist websites, web design",
    tags: ["tech", "web", "html", "css", "javascript", "react", "nextjs", "typescript", "frontend"],
  },
  {
    id: "rust",
    shortcode: "rust",
    name: "Rust Programming",
    domain: "Technology",
    subCategory: "Software",
    description: "Borrow checker, zero-cost abstractions, memory safety without GC",
    tags: ["tech", "rust", "programming", "systems", "memory", "cargo", "dev"],
  },
  {
    id: "mech",
    shortcode: "mech",
    name: "Mechanical Keyboards",
    domain: "Technology",
    subCategory: "Hardware",
    description: "Custom switches, lubing, GMK keycaps, solder builds, typing sound tests",
    tags: ["tech", "hardware", "keyboard", "mech", "switches", "keycaps", "desk", "typing"],
  },
  {
    id: "build",
    shortcode: "build",
    name: "Custom PC Building",
    domain: "Technology",
    subCategory: "Hardware",
    description: "Part lists, cable management, custom water loops, cooling setups",
    tags: ["tech", "pc", "building", "hardware", "gpu", "cpu", "case", "cooling"],
  },
  {
    id: "pi",
    shortcode: "pi",
    name: "Raspberry Pi & SBCs",
    domain: "Technology",
    subCategory: "Hardware",
    description: "Microcomputers, DIY mini projects, Pi-hole, retro consoles",
    tags: ["tech", "hardware", "pi", "raspberry pi", "diy", "maker", "sbc", "iot"],
  },
  {
    id: "retro",
    shortcode: "retro",
    name: "Retrocomputing",
    domain: "Technology",
    subCategory: "Hardware",
    description: "Amiga, Commodore 64, IBM 5150, MS-DOS, floppy disks, legacy silicon",
    tags: ["tech", "retro", "vintage", "amiga", "commodore", "dos", "old", "mainframe"],
  },
  {
    id: "3dp",
    shortcode: "3dp",
    name: "3D Printing & CAD",
    domain: "Technology",
    subCategory: "Hardware",
    description: "FDM, resin printers, slicing profiles, functional prints, CAD modeling",
    tags: ["tech", "3d printing", "cad", "hardware", "maker", "diy", "pla", "resin"],
  },

  // ==========================================
  // 🎨 AESTHETICS & VISUAL ARTS
  // ==========================================
  {
    id: "moe",
    shortcode: "moe",
    name: "Moe Culture",
    domain: "Aesthetics",
    subCategory: "Digital Art",
    description: "Cute anime aesthetics, cozy illustrations, slice-of-life art & tropes",
    tags: ["art", "aesthetics", "moe", "cute", "anime", "illustration", "wholesome", "cozy"],
  },
  {
    id: "fa",
    shortcode: "fa",
    name: "Character Fanart",
    domain: "Aesthetics",
    subCategory: "Digital Art",
    description: "Original character illustrations, fan art showcases & digital sketches",
    tags: ["art", "aesthetics", "fanart", "drawing", "illustration", "characters", "sketches"],
  },
  {
    id: "aes",
    shortcode: "aes",
    name: "Aesthetics & Vibes",
    domain: "Aesthetics",
    subCategory: "Vibes",
    description: "Vaporwave, liminal spaces, design movements & ambient visual culture",
    tags: ["art", "aesthetics", "vibes", "mood", "visual", "vaporwave", "chill", "style"],
  },
  {
    id: "vapor",
    shortcode: "vapor",
    name: "Vaporwave & Future Funk",
    domain: "Aesthetics",
    subCategory: "Vibes",
    description: "Mall aesthetics, 90s nostalgia, marble statues, sunset gradients",
    tags: ["art", "aesthetics", "vaporwave", "retro", "90s", "nostalgia", "synth", "music"],
  },
  {
    id: "lim",
    shortcode: "lim",
    name: "Liminal Spaces & Kenopsia",
    domain: "Aesthetics",
    subCategory: "Vibes",
    description: "Empty hallways, eerie nocturnal lighting, backrooms, transitional areas",
    tags: ["art", "aesthetics", "liminal", "spaces", "eerie", "kenopsia", "nostalgia", "empty"],
  },
  {
    id: "pixel",
    shortcode: "pixel",
    name: "Pixel Art",
    domain: "Aesthetics",
    subCategory: "Digital Art",
    description: "Dithering, restricted color palettes, retro sprites, isometric worlds",
    tags: ["art", "pixel", "pixel art", "sprites", "retro", "dither", "8bit", "16bit"],
  },
  {
    id: "cyber",
    shortcode: "cyber",
    name: "Cyberpunk & Dystopia",
    domain: "Aesthetics",
    subCategory: "Vibes",
    description: "Neon rain, high tech low life, mega corporations, gritty retro-futurism",
    tags: ["art", "cyberpunk", "neon", "dystopia", "scifi", "tech", "futuristic"],
  },
  {
    id: "aero",
    shortcode: "aero",
    name: "Y2K & Frutiger Aero",
    domain: "Aesthetics",
    subCategory: "Vibes",
    description: "Skeuomorphism, glossy bubbles, green grass, optimistic mid-2000s tech",
    tags: ["art", "frutiger aero", "y2k", "2000s", "glossy", "optimism", "skeuomorphism", "nature"],
  },
  {
    id: "cozy",
    shortcode: "cozy",
    name: "Cozy & Comfy Spaces",
    domain: "Aesthetics",
    subCategory: "Vibes",
    description: "Warm lighting, rainy window panes, blankets, tea, peaceful rooms",
    tags: ["art", "cozy", "comfy", "warm", "peaceful", "rain", "blankets", "relax"],
  },
  {
    id: "w",
    shortcode: "w",
    name: "Wallpapers & Desktops",
    domain: "Aesthetics",
    subCategory: "Visual",
    description: "High resolution desktops, ultrawide wallpapers, OLED pure blacks",
    tags: ["art", "wallpapers", "backgrounds", "4k", "desktop", "images", "scenery"],
  },
  {
    id: "ic",
    shortcode: "ic",
    name: "Artwork & Critique",
    domain: "Aesthetics",
    subCategory: "Traditional",
    description: "Anatomy studies, color theory, sketch feedback, digital painting",
    tags: ["art", "critique", "drawing", "painting", "illustration", "feedback", "study"],
  },
  {
    id: "3d",
    shortcode: "3d",
    name: "3D Modeling & Blender",
    domain: "Aesthetics",
    subCategory: "Digital Art",
    description: "Topology, shaders, lighting, geometry nodes, octane renders",
    tags: ["art", "3d", "blender", "render", "cgi", "modeling", "animation", "shaders"],
  },
  {
    id: "ui",
    shortcode: "ui",
    name: "UI & UX Design",
    domain: "Aesthetics",
    subCategory: "Design",
    description: "Interface layouts, typography scale, micro-interactions, clean design",
    tags: ["art", "design", "ui", "ux", "interface", "web", "visual", "layout"],
  },
  {
    id: "type",
    shortcode: "type",
    name: "Typography & Fonts",
    domain: "Aesthetics",
    subCategory: "Design",
    description: "Serif, sans-serif, kerning, print layout, poster art, font pairing",
    tags: ["art", "typography", "fonts", "type", "print", "graphic design", "letters"],
  },
  {
    id: "film",
    shortcode: "film",
    name: "Analog & 35mm Photography",
    domain: "Aesthetics",
    subCategory: "Traditional",
    description: "Film stocks, grain, darkroom printing, rangefinders, Portra tones",
    tags: ["art", "photography", "film", "35mm", "analog", "camera", "vintage", "grain"],
  },

  // ==========================================
  // 🌸 ANIME & JAPANESE CULTURE
  // ==========================================
  {
    id: "a",
    shortcode: "a",
    name: "Anime & Animation",
    domain: "Anime",
    subCategory: "Anime & Manga",
    description: "Discussion of Japanese animation, seasons, directors, and studios",
    tags: ["anime", "animation", "japan", "shows", "series", "otaku", "manga"],
  },
  {
    id: "m",
    shortcode: "m",
    name: "Manga & Manhwa",
    domain: "Anime",
    subCategory: "Anime & Manga",
    description: "Weekly scanlations, print volumes, manhwa webtoons, panel layout",
    tags: ["anime", "manga", "manhwa", "comics", "reading", "scanlation", "otaku"],
  },
  {
    id: "sol",
    shortcode: "sol",
    name: "Slice of Life & Iyashikei",
    domain: "Anime",
    subCategory: "Anime & Manga",
    description: "Healing anime, Yuru Camp, Non Non Biyori, low stakes comfy stories",
    tags: ["anime", "slice of life", "iyashikei", "comfy", "cozy", "relax", "healing"],
  },
  {
    id: "vt",
    shortcode: "vt",
    name: "VTubers & Virtual Idols",
    domain: "Anime",
    subCategory: "Anime & Manga",
    description: "Hololive, Nijisanji, indie streamers, 2D avatar culture & songs",
    tags: ["anime", "vtuber", "hololive", "streaming", "virtual", "idols"],
  },
  {
    id: "gunpla",
    shortcode: "gunpla",
    name: "Gunpla & Model Kits",
    domain: "Anime",
    subCategory: "Anime & Manga",
    description: "Gundam plastic kits, panel lining, airbrushing, custom weathering",
    tags: ["anime", "gundam", "gunpla", "models", "kits", "mecha", "hobby", "craft"],
  },
  {
    id: "2hu",
    shortcode: "2hu",
    name: "Touhou Project",
    domain: "Anime",
    subCategory: "Anime & Manga",
    description: "ZUN bullet hell, fan music, Gensokyo lore, doujin culture",
    tags: ["anime", "touhou", "2hu", "zun", "bullet hell", "music", "doujin"],
  },

  // ==========================================
  // 🎧 MUSIC & AUDIO
  // ==========================================
  {
    id: "mu",
    shortcode: "mu",
    name: "Music Discussion",
    domain: "Music",
    subCategory: "General",
    description: "Album ratings, listening charts, genre history, discovery",
    tags: ["music", "albums", "songs", "sound", "band", "artist", "listening"],
  },
  {
    id: "gaze",
    shortcode: "gaze",
    name: "Shoegaze & Dream Pop",
    domain: "Music",
    subCategory: "Genres",
    description: "My Bloody Valentine, Slowdive, wall of fuzz reverb, glide guitar",
    tags: ["music", "shoegaze", "dreampop", "guitar", "reverb", "indie", "rock"],
  },
  {
    id: "elec",
    shortcode: "elec",
    name: "Electronic & Ambient",
    domain: "Music",
    subCategory: "Genres",
    description: "Aphex Twin, Boards of Canada, IDM, techno, modular synth soundscapes",
    tags: ["music", "electronic", "ambient", "idm", "techno", "synth", "chill"],
  },
  {
    id: "synth",
    shortcode: "synth",
    name: "Synthesizers & Modular",
    domain: "Music",
    subCategory: "Gear",
    description: "Eurorack cables, analog oscillators, filters, drum machines, jams",
    tags: ["music", "synthesizer", "modular", "eurorack", "analog", "audio", "gear"],
  },
  {
    id: "wax",
    shortcode: "wax",
    name: "Vinyl & Record Collecting",
    domain: "Music",
    subCategory: "Gear",
    description: "Turntables, crate digging, pressings, sleeve art, physical warmth",
    tags: ["music", "vinyl", "records", "turntable", "audio", "collecting", "physical"],
  },
  {
    id: "iem",
    shortcode: "iem",
    name: "Audiophile & IEMs",
    domain: "Music",
    subCategory: "Gear",
    description: "In-ear monitors, DACs, frequency response curves, FLAC lossless audio",
    tags: ["music", "audiophile", "iem", "headphones", "dac", "sound", "gear", "audio"],
  },

  // ==========================================
  // 🍳 CULINARY & FOOD
  // ==========================================
  {
    id: "ck",
    shortcode: "ck",
    name: "Food & Cooking",
    domain: "Culinary",
    subCategory: "Cooking",
    description: "Homemade dishes, recipe sharing, culinary techniques, prep ideas",
    tags: ["food", "cooking", "recipes", "kitchen", "meals", "dinner", "delicious"],
  },
  {
    id: "coffee",
    shortcode: "coffee",
    name: "Specialty Coffee & Espresso",
    domain: "Culinary",
    subCategory: "Brewing",
    description: "Single-origin beans, pour-overs, V60, manual grinders, espresso dial-in",
    tags: ["food", "coffee", "espresso", "beans", "v60", "roast", "brewing", "barista"],
  },
  {
    id: "tea",
    shortcode: "tea",
    name: "Tea & Gongfu Brewing",
    domain: "Culinary",
    subCategory: "Brewing",
    description: "Pu-erh, oolong, gaiwans, matcha whisks, clay teapots, tranquil sips",
    tags: ["food", "tea", "gongfu", "matcha", "oolong", "brewing", "relax"],
  },
  {
    id: "bake",
    shortcode: "bake",
    name: "Sourdough & Baking",
    domain: "Culinary",
    subCategory: "Cooking",
    description: "Starter cultures, crumb structure, Dutch ovens, scoring patterns",
    tags: ["food", "baking", "sourdough", "bread", "crust", "flour", "oven"],
  },
  {
    id: "ferm",
    shortcode: "ferm",
    name: "Fermentation & Pickling",
    domain: "Culinary",
    subCategory: "Cooking",
    description: "Kimchi, sauerkraut, hot sauces, kombucha, koji, preserving food",
    tags: ["food", "fermentation", "pickles", "kimchi", "kombucha", "microbiology"],
  },

  // ==========================================
  // 🛠️ HOBBIES, CRAFTS & LITERATURE
  // ==========================================
  {
    id: "wood",
    shortcode: "wood",
    name: "Woodworking & Joinery",
    domain: "Crafts",
    subCategory: "Maker",
    description: "Hand planes, mortise and tenon, hardwoods, workshop builds",
    tags: ["hobbies", "woodworking", "carpentry", "tools", "diy", "maker", "craft"],
  },
  {
    id: "time",
    shortcode: "time",
    name: "Mechanical Watches",
    domain: "Crafts",
    subCategory: "Collecting",
    description: "Automatic calibers, balance springs, watch straps, horology passion",
    tags: ["hobbies", "watches", "horology", "mechanical", "seiko", "collecting", "time"],
  },
  {
    id: "war",
    shortcode: "war",
    name: "Warhammer 40K",
    domain: "Crafts",
    subCategory: "Tabletop",
    description: "Miniature painting, Space Marines, tabletop strategy, grimdark lore",
    tags: ["hobbies", "warhammer", "40k", "miniatures", "painting", "tabletop", "scifi"],
  },
  {
    id: "tg",
    shortcode: "tg",
    name: "Tabletop Roleplaying (TTRPG)",
    domain: "Crafts",
    subCategory: "Tabletop",
    description: "D&D, Call of Cthulhu, campaign prep, polyhedral dice, storytelling",
    tags: ["hobbies", "ttrpg", "dnd", "tabletop", "dice", "roleplay", "story"],
  },
  {
    id: "pen",
    shortcode: "pen",
    name: "Fountain Pens & Stationery",
    domain: "Crafts",
    subCategory: "Collecting",
    description: "Gold nibs, shading inks, Tomoe River paper, handwriting practice",
    tags: ["hobbies", "pens", "stationery", "ink", "writing", "paper", "journaling"],
  },
  {
    id: "plant",
    shortcode: "plant",
    name: "Gardening & Houseplants",
    domain: "Lifestyle",
    subCategory: "Nature",
    description: "Bonsai pruning, monsteras, propagation, soil mixes, urban jungles",
    tags: ["lifestyle", "plants", "gardening", "bonsai", "nature", "green", "indoor"],
  },
  {
    id: "lit",
    shortcode: "lit",
    name: "Books & Literature",
    domain: "Literature",
    subCategory: "Reading",
    description: "Novels, classics, philosophy, bookmark collections, reading goals",
    tags: ["books", "reading", "literature", "novels", "author", "fiction", "classics"],
  },
  {
    id: "scifi",
    shortcode: "scifi",
    name: "Sci-Fi & Cyberpunk Books",
    domain: "Literature",
    subCategory: "Reading",
    description: "Dune, Neuromancer, hard sci-fi, space opera, speculative future worlds",
    tags: ["books", "scifi", "science fiction", "cyberpunk", "reading", "dune", "space"],
  },
  {
    id: "x",
    shortcode: "x",
    name: "Horror & Paranormal",
    domain: "Literature",
    subCategory: "Reading",
    description: "Eerie phenomena, analog horror, creepy sightings, lore deep dives",
    tags: ["horror", "creepy", "paranormal", "scary", "analog horror", "tales", "mysteries"],
  },
  {
    id: "tv",
    shortcode: "tv",
    name: "Cinema & Film",
    domain: "Literature",
    subCategory: "Media",
    description: "Movie critiques, auteur directors, cinematography, indie screenings",
    tags: ["movies", "film", "cinema", "directors", "watching", "critique", "actors"],
  },
  {
    id: "astro",
    shortcode: "astro",
    name: "Astronomy & Cosmos",
    domain: "Science",
    subCategory: "Science",
    description: "Telescope stargazing, astrophotography, nebulae, planetary orbits",
    tags: ["science", "astronomy", "space", "stars", "telescope", "cosmos", "planets"],
  },
  {
    id: "desk",
    shortcode: "desk",
    name: "Desk Setups & Workspaces",
    domain: "Lifestyle",
    subCategory: "Spaces",
    description: "Minimalist desks, ergonomic chairs, monitor arms, warm ambient lamps",
    tags: ["lifestyle", "desk", "setup", "workspace", "ergonomics", "office", "minimalism"],
  },
];

// Map lookup by code or id
export const boardsMap = new Map<string, Board>(
  allBoards.map((b) => [b.shortcode.toLowerCase(), b])
);

// Fallback board helper
export function getBoard(codeOrId?: string | null): Board {
  if (!codeOrId) return allBoards.find((b) => b.shortcode === "mc") || allBoards[0];
  const query = codeOrId.toLowerCase().replace(/^\/+|\/+$/g, "").trim();
  return (
    boardsMap.get(query) ||
    allBoards.find(
      (b) =>
        b.id.toLowerCase() === query ||
        b.shortcode.toLowerCase() === query ||
        b.name.toLowerCase() === query ||
        b.name.toLowerCase().replace(/\s+/g, "") === query
    ) ||
    allBoards.find((b) => b.shortcode === "mc") ||
    allBoards[0]
  );
}

// ==========================================
// 🌟 PRESET CONFIGURATIONS
// ==========================================
export const presets: Preset[] = [
  {
    id: "default",
    name: "Default",
    command: "/default",
    aliases: ["home", "main"],
    description: "Well-rounded balanced view of gaming, tech, aesthetics, and culture",
    categories: [
      {
        name: "Games",
        boardCodes: ["mc", "tf2", "tes", "souls", "osrs"],
      },
      {
        name: "Technology",
        boardCodes: ["ai", "vibe", "nix", "home", "mech"],
      },
      {
        name: "Aesthetics",
        boardCodes: ["moe", "fa", "aes", "vapor", "pixel"],
      },
      {
        name: "Culture",
        boardCodes: ["ck", "coffee", "mu", "a", "lit"],
      },
    ],
  },
  {
    id: "gaming",
    name: "Gaming",
    command: "/gaming",
    aliases: ["games", "v"],
    description: "Consoles, hit franchises, genres, and retro emulation",
    categories: [
      {
        name: "Consoles",
        boardCodes: ["ps2", "gc", "360", "dc", "crt", "arcade"],
      },
      {
        name: "Hit Titles",
        boardCodes: ["mc", "tf2", "tes", "souls", "osrs", "cs"],
      },
      {
        name: "Genres",
        boardCodes: ["rogue", "doom", "fgc", "mv", "factory", "strat"],
      },
      {
        name: "Handheld & Mods",
        boardCodes: ["ds", "gba", "emug", "mod", "speed", "indie"],
      },
    ],
  },
  {
    id: "consoles",
    name: "Consoles",
    command: "/consoles",
    aliases: ["console", "crt", "hardware"],
    description: "Classic home consoles, CRT tubes, arcade hardware, and handhelds",
    categories: [
      {
        name: "Sony PlayStation",
        boardCodes: ["ps1", "ps2"],
      },
      {
        name: "Nintendo Heritage",
        boardCodes: ["gc", "ds", "gba"],
      },
      {
        name: "Sega & Arcade",
        boardCodes: ["dc", "arcade", "360"],
      },
      {
        name: "Display & Emulation",
        boardCodes: ["crt", "emug", "mod"],
      },
    ],
  },
  {
    id: "retro",
    name: "Retro",
    command: "/retro",
    aliases: ["nostalgia", "vintage", "vr"],
    description: "Pre-HD gaming, pixel art, CRT scanlines, and vintage computing",
    categories: [
      {
        name: "Retro Games",
        boardCodes: ["vr", "doom", "arcade", "speed"],
      },
      {
        name: "Retro Consoles",
        boardCodes: ["ps1", "dc", "gba", "crt"],
      },
      {
        name: "Vintage Computing",
        boardCodes: ["retro", "pi", "mech"],
      },
      {
        name: "Nostalgic Vibes",
        boardCodes: ["vapor", "aero", "pixel"],
      },
    ],
  },
  {
    id: "tech",
    name: "Tech & Dev",
    command: "/tech",
    aliases: ["dev", "code", "g"],
    description: "Artificial intelligence, systems programming, and custom hardware",
    categories: [
      {
        name: "AI & Agents",
        boardCodes: ["ai", "vibe", "localllm", "genart"],
      },
      {
        name: "Software & Systems",
        boardCodes: ["prog", "nix", "home", "sec", "rust", "web"],
      },
      {
        name: "Hardware & Maker",
        boardCodes: ["g", "mech", "build", "pi", "retro", "3dp"],
      },
      {
        name: "Science & Space",
        boardCodes: ["astro", "desk", "ui", "type"],
      },
    ],
  },
  {
    id: "ai",
    name: "AI & Agents",
    command: "/ai",
    aliases: ["agents", "vibe", "llm"],
    description: "Neural intelligence, agentic pairing, local weights, and synthetic art",
    categories: [
      {
        name: "Models & Intelligence",
        boardCodes: ["ai", "localllm"],
      },
      {
        name: "Agentic Dev & Flow",
        boardCodes: ["vibe", "prog", "web"],
      },
      {
        name: "Generative Media",
        boardCodes: ["genart", "3d", "pixel"],
      },
      {
        name: "Systems & Homelab",
        boardCodes: ["home", "nix", "build"],
      },
    ],
  },
  {
    id: "aesthetics",
    name: "Aesthetics",
    command: "/aesthetics",
    aliases: ["art", "aes", "visual"],
    description: "Visual subcultures, anime, digital illustration, and photography",
    categories: [
      {
        name: "Visual Vibes",
        boardCodes: ["aes", "vapor", "lim", "cyber", "aero", "cozy"],
      },
      {
        name: "Digital Illustration",
        boardCodes: ["moe", "fa", "pixel", "3d", "ic", "w"],
      },
      {
        name: "Anime & Manga",
        boardCodes: ["a", "m", "sol", "vt", "gunpla", "2hu"],
      },
      {
        name: "Design & Analog",
        boardCodes: ["film", "ui", "type", "desk"],
      },
    ],
  },
  {
    id: "anime",
    name: "Anime & Otaku",
    command: "/anime",
    aliases: ["manga", "weeb", "a"],
    description: "Japanese animation, weekly manga, slice of life, VTubers, and model kits",
    categories: [
      {
        name: "Anime & Manga",
        boardCodes: ["a", "m", "sol"],
      },
      {
        name: "Virtual & Fanart",
        boardCodes: ["vt", "moe", "fa"],
      },
      {
        name: "Otaku Subcultures",
        boardCodes: ["gunpla", "2hu", "vn"],
      },
      {
        name: "Visuals & Rhythm",
        boardCodes: ["rhythm", "vapor", "w"],
      },
    ],
  },
  {
    id: "music",
    name: "Music & Audio",
    command: "/music",
    aliases: ["audio", "sound", "mu"],
    description: "Genre history, shoegaze, electronic soundscapes, vinyl, and audiophile gear",
    categories: [
      {
        name: "Genres & Sound",
        boardCodes: ["mu", "gaze", "elec"],
      },
      {
        name: "Audiophile Gear",
        boardCodes: ["synth", "wax", "iem"],
      },
      {
        name: "OSTs & Rhythm",
        boardCodes: ["rhythm", "vapor"],
      },
      {
        name: "Listening Spaces",
        boardCodes: ["film", "cozy", "desk"],
      },
    ],
  },
  {
    id: "culinary",
    name: "Food & Sips",
    command: "/culinary",
    aliases: ["food", "cook", "ck"],
    description: "Home cooking, single-origin espresso, tea, sourdough, and fermentation",
    categories: [
      {
        name: "Kitchen Cooking",
        boardCodes: ["ck", "bake", "ferm"],
      },
      {
        name: "Coffee & Tea",
        boardCodes: ["coffee", "tea"],
      },
      {
        name: "Greenery & Grow",
        boardCodes: ["plant"],
      },
      {
        name: "Cozy Living",
        boardCodes: ["cozy", "desk"],
      },
    ],
  },
  {
    id: "maker",
    name: "Maker & Crafts",
    command: "/maker",
    aliases: ["hobbies", "crafts", "diy"],
    description: "Wood joinery, mechanical watches, miniature painting, and tabletop roleplay",
    categories: [
      {
        name: "Workshop & Tech",
        boardCodes: ["wood", "3dp", "pi"],
      },
      {
        name: "Precision Crafts",
        boardCodes: ["time", "pen"],
      },
      {
        name: "Tabletop Gaming",
        boardCodes: ["war", "tg"],
      },
      {
        name: "Plant Living",
        boardCodes: ["plant", "desk"],
      },
    ],
  },
  {
    id: "media",
    name: "Books & Cinema",
    command: "/media",
    aliases: ["books", "cinema", "lit"],
    description: "Literature, speculative sci-fi, auteur cinema, and internet folklore",
    categories: [
      {
        name: "Literature & Lore",
        boardCodes: ["lit", "scifi", "x"],
      },
      {
        name: "Film & Screenings",
        boardCodes: ["tv", "vn"],
      },
      {
        name: "Cosmos & Deep Dives",
        boardCodes: ["astro"],
      },
      {
        name: "Reading Nooks",
        boardCodes: ["cozy", "desk"],
      },
    ],
  },
];

// Helper to calculate Levenshtein distance for typo recognition
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const d: number[][] = [];
  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return d[m][n];
}

// ==========================================
// 🔍 SOLUTION 1 & 3: LINGUISTIC SPECIFICITY SCORING (NO FAKE CATEGORIES)
// ==========================================
export function searchGenericBoards(query: string): Board[] {
  const q = query.trim().toLowerCase();
  if (!q) return allBoards;

  const scoredBoards: { board: Board; score: number }[] = [];

  for (const board of allBoards) {
    let score = 0;
    const nameLower = board.name.toLowerCase();
    const codeLower = board.shortcode.toLowerCase();
    const wordsInName = nameLower.split(/[\s&/,\-_]+/);

    // 1. EXACT MATCHES (Top Tier)
    if (codeLower === q) score += 150;
    if (nameLower === q) score += 120;

    // 2. NAME WORD MATCHES (Title contains exact query word)
    // e.g. "gaming" matches "Retro Gaming", "PC Gaming", "Video Games"
    for (const word of wordsInName) {
      if (word === q) {
        score += 90;
      } else if (word.startsWith(q)) {
        score += 70;
      } else if (word.includes(q)) {
        score += 50;
      }
    }

    // 3. TAG MATCHES (Direct tag match vs tag substring)
    for (const tag of board.tags) {
      if (tag === q) {
        score += 45;
      } else if (tag.startsWith(q)) {
        score += 35;
      } else if (tag.includes(q)) {
        score += 25;
      } else if (q.includes(tag) && tag.length >= 4) {
        score += 20;
      }
    }

    // 4. DOMAIN MATCH (e.g. searching "gaming", "music", "art")
    if (board.domain.toLowerCase() === q) score += 55;
    if (board.subCategory.toLowerCase() === q) score += 40;

    // 5. TYPO TOLERANCE (Levenshtein Distance)
    for (const word of wordsInName.concat(codeLower)) {
      if (Math.abs(word.length - q.length) <= 2) {
        const dist = levenshteinDistance(word, q);
        if (dist === 1) score += 32; // 1 typo (e.g. minceraft -> minecraft)
        else if (dist === 2 && q.length >= 5) score += 18; // 2 typos
      }
    }

    if (score > 0) {
      scoredBoards.push({ board, score });
    }
  }

  // Solution 3: Sort strictly by linguistic score, letting chips fall where they may!
  scoredBoards.sort((a, b) => b.score - a.score);

  // Return up to 32 top matches
  return scoredBoards.slice(0, 32).map((item) => item.board);
}

// ==========================================
// 🏛️ REMEDY 1: DOMAIN-LEVEL CLUSTERING FOR GENERIC SEARCH
// ==========================================
export function searchGenericCategories(query: string): PresetCategory[] {
  const topMatched = searchGenericBoards(query);
  if (topMatched.length === 0) {
    return [];
  }

  // 1. Group top matches by their broad Domain (Gaming, Tech, Aesthetics, etc.)
  const domainGroups = new Map<string, Board[]>();
  for (const b of topMatched) {
    const domain = b.domain || "Other";
    if (!domainGroups.has(domain)) {
      domainGroups.set(domain, []);
    }
    domainGroups.get(domain)!.push(b);
  }

  // If results span 2 or more domains (e.g. searching "retro" matches Gaming, Tech, Aesthetics):
  // Each Domain becomes a classic category column header!
  if (domainGroups.size >= 2) {
    const categories: PresetCategory[] = [];
    domainGroups.forEach((boards, domain) => {
      categories.push({
        name: domain,
        boards: boards.slice(0, 8), // Keep columns balanced
      });
    });
    return categories.slice(0, 4);
  }

  // 2. If all matches fall within a single domain (e.g. searching "shooter" where all are Gaming):
  // Sub-cluster by subCategory (e.g. "Hit Titles", "Genres", "Consoles") so we preserve multi-column categories!
  const subGroups = new Map<string, Board[]>();
  for (const b of topMatched) {
    const sub = b.subCategory || b.domain || "Featured";
    if (!subGroups.has(sub)) {
      subGroups.set(sub, []);
    }
    subGroups.get(sub)!.push(b);
  }

  if (subGroups.size >= 2) {
    const categories: PresetCategory[] = [];
    subGroups.forEach((boards, sub) => {
      categories.push({
        name: sub,
        boards: boards.slice(0, 8),
      });
    });
    return categories.slice(0, 4);
  }

  // 3. Fallback for single tight niche: divide into balanced columns
  const singleDomain = Array.from(domainGroups.keys())[0] || "Matches";
  if (topMatched.length > 5) {
    const half = Math.ceil(topMatched.length / 2);
    return [
      { name: `${singleDomain} (Part 1)`, boards: topMatched.slice(0, half) },
      { name: `${singleDomain} (Part 2)`, boards: topMatched.slice(half) },
    ];
  }

  return [
    {
      name: singleDomain,
      boards: topMatched,
    },
  ];
}

// Backwards-compatible alias
export function searchAndSynthesizePreset(query: string): PresetCategory[] {
  return searchGenericCategories(query);
}

// Helper to resolve a named preset into real board objects
export function resolvePreset(presetId: string): PresetCategory[] {
  const preset = presets.find((p) => p.id === presetId) || presets[0];
  return preset.categories.map((cat) => ({
    name: cat.name,
    boards: cat.boardCodes
      .map((code) => boardsMap.get(code.toLowerCase()))
      .filter((b): b is Board => Boolean(b)),
  }));
}

// ==========================================
// ⚡ DUAL SEARCH: "/" FOR PRESETS, REMEDY 1 CLUSTERING OTHERWISE
// ==========================================
export interface DualSearchResult {
  mode: "preset" | "generic";
  matchedPreset?: Preset;
  categories: PresetCategory[];
  query: string;
  isCommandTyping?: boolean;
}

export function executeDualSearch(
  rawQuery: string,
  fallbackPresetId: string = "default"
): DualSearchResult {
  const q = rawQuery.trim();

  // If query is empty, return currently selected preset
  if (!q) {
    const defaultP = presets.find((p) => p.id === fallbackPresetId) || presets[0];
    return {
      mode: "preset",
      matchedPreset: defaultP,
      categories: resolvePreset(defaultP.id),
      query: "",
    };
  }

  // 1. DUAL SEARCH: If starts with "/" -> Search ONLY curated presets
  if (q.startsWith("/")) {
    const cmd = q.slice(1).trim().toLowerCase();

    // If just typed "/"
    if (!cmd) {
      const p = presets.find((p) => p.id === fallbackPresetId) || presets[0];
      return {
        mode: "preset",
        matchedPreset: p,
        categories: resolvePreset(p.id),
        query: q,
        isCommandTyping: true,
      };
    }

    // Exact match on id or alias
    let matched = presets.find(
      (p) =>
        p.id.toLowerCase() === cmd ||
        p.command.toLowerCase() === `/${cmd}` ||
        p.aliases.some((a) => a.toLowerCase() === cmd)
    );

    // Prefix match among presets (e.g. "/ga" -> gaming, "/an" -> anime, "/mu" -> music)
    if (!matched) {
      matched = presets.find(
        (p) =>
          p.id.toLowerCase().startsWith(cmd) ||
          p.command.toLowerCase().startsWith(`/${cmd}`) ||
          p.name.toLowerCase().startsWith(cmd) ||
          p.aliases.some((a) => a.toLowerCase().startsWith(cmd))
      );
    }

    // Typo match among presets (Levenshtein distance <= 2)
    if (!matched && cmd.length >= 3) {
      for (const p of presets) {
        if (
          levenshteinDistance(p.id, cmd) <= 2 ||
          levenshteinDistance(p.name.toLowerCase(), cmd) <= 2
        ) {
          matched = p;
          break;
        }
      }
    }

    if (matched) {
      return {
        mode: "preset",
        matchedPreset: matched,
        categories: resolvePreset(matched.id),
        query: q,
      };
    }

    // Unmatched command -> fallback to default preset
    const fallbackP = presets.find((p) => p.id === fallbackPresetId) || presets[0];
    return {
      mode: "preset",
      matchedPreset: fallbackP,
      categories: resolvePreset(fallbackP.id),
      query: q,
    };
  }

  // 2. DUAL SEARCH: No "/" -> Generic search with Remedy 1 Domain-Level Category Clustering!
  const genericCategories = searchGenericCategories(q);
  return {
    mode: "generic",
    categories: genericCategories,
    query: q,
  };
}

