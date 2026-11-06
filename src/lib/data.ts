export interface AspectRatioConfig {
  ratioClass: string;
  dimLabel: string;
}

export const aspectRatios: AspectRatioConfig[] = [
  { ratioClass: "aspect-[16/9] w-full max-h-[140px]", dimLabel: "1920x1080 (16:9)" },
  { ratioClass: "aspect-[4/3] w-full max-h-[140px]", dimLabel: "1024x768 (4:3)" },
  { ratioClass: "aspect-[3/2] w-full max-h-[140px]", dimLabel: "1200x800 (3:2)" },
  { ratioClass: "aspect-square h-[140px] w-[140px]", dimLabel: "1080x1080 (1:1)" },
  { ratioClass: "aspect-[4/5] h-[145px] w-[116px]", dimLabel: "1080x1350 (4:5)" },
  { ratioClass: "aspect-[3/4] h-[145px] w-[108px]", dimLabel: "900x1200 (3:4)" },
  { ratioClass: "aspect-[9/16] h-[145px] w-[82px]", dimLabel: "1080x1920 (9:16)" },
];

export interface UserProfile {
  id: string;
  username: string;
  avatarBg: string;
  avatarText: string;
  initials: string;
}

export const mockUsers: UserProfile[] = [
  { id: "u1", username: "IronLifter", avatarBg: "from-blue-600 to-indigo-800", avatarText: "text-white", initials: "IL" },
  { id: "u2", username: "KetoRunner", avatarBg: "from-emerald-600 to-teal-800", avatarText: "text-white", initials: "KR" },
  { id: "u3", username: "ZenYogi", avatarBg: "from-purple-600 to-fuchsia-800", avatarText: "text-white", initials: "ZY" },
  { id: "u4", username: "BenchBoss", avatarBg: "from-amber-600 to-orange-800", avatarText: "text-white", initials: "BB" },
  { id: "u5", username: "MacroChef", avatarBg: "from-rose-600 to-pink-800", avatarText: "text-white", initials: "MC" },
  { id: "u6", username: "CardioQueen", avatarBg: "from-cyan-600 to-blue-800", avatarText: "text-white", initials: "CQ" },
  { id: "u7", username: "FormCoach", avatarBg: "from-lime-600 to-emerald-800", avatarText: "text-white", initials: "FC" },
  { id: "u8", username: "GainsGoblin", avatarBg: "from-violet-600 to-purple-800", avatarText: "text-white", initials: "GG" },
  { id: "u9", username: "RecoveryKing", avatarBg: "from-sky-600 to-indigo-800", avatarText: "text-white", initials: "RK" },
  { id: "u10", username: "DeadliftDan", avatarBg: "from-red-600 to-rose-900", avatarText: "text-white", initials: "DD" },
];

export interface PostItem {
  id: number;
  threadNumber: number;
  title: string;
  teaser: string;
  replies: number;
  images: number;
  timestamp: string;
  colorTone: string;
  aspect: AspectRatioConfig;
  user: UserProfile;
}

export interface ThreadReply {
  id: number;
  postNumber: number;
  user: UserProfile;
  timestamp: string;
  parentId: number;
  replyTo: number[];
  type: "image-text" | "text-only" | "image-only";
  file?: {
    name: string;
    size: string;
    dimensions: string;
    ratioClass: string;
    colorTone: string;
    imageNum: number;
  };
  comment?: string[];
}

export const sampleTopics = [
  "Beginner 5x3 Strength Routine",
  "Daily Meal Prep & Macro Tracking",
  "Recovery Days: Sleep & Hydration",
  "Calisthenics vs Free Weights",
  "Best Running Shoes for High Arches",
  "Zone 2 Cardio Protocols",
  "Supplements That Actually Work",
  "Desk Posture & Mobility Drills",
  "Home Gym Equipment Essentials",
  "Mindset & Consistency Habits",
  "Progressive Overload Tracking",
  "Electrolytes and Intra-workout",
  "Rotator Cuff Prehab Routine",
  "High Protein Vegan Sources",
  "Deadlift Form Check Thread",
];

export const colorAccents = [
  "from-amber-600/35 to-amber-950/60 border-amber-500/40 text-amber-200",
  "from-blue-600/35 to-blue-950/60 border-blue-500/40 text-blue-200",
  "from-emerald-600/35 to-emerald-950/60 border-emerald-500/40 text-emerald-200",
  "from-purple-600/35 to-purple-950/60 border-purple-500/40 text-purple-200",
  "from-rose-600/35 to-rose-950/60 border-rose-500/40 text-rose-200",
  "from-cyan-600/35 to-cyan-950/60 border-cyan-500/40 text-cyan-200",
  "from-teal-600/35 to-teal-950/60 border-teal-500/40 text-teal-200",
  "from-orange-600/35 to-orange-950/60 border-orange-500/40 text-orange-200",
];

// Generate 150 placeholder catalog posts
export const initialPosts: PostItem[] = Array.from({ length: 150 }, (_, i) => {
  const num = i + 1;
  const topic = sampleTopics[i % sampleTopics.length];
  const accent = colorAccents[i % colorAccents.length];
  const aspect = aspectRatios[(num * 3 + 2) % aspectRatios.length];
  const replies = (num * 11) % 245;
  const images = Math.max(1, Math.floor(replies / 4));
  const user = mockUsers[i % mockUsers.length];

  return {
    id: num,
    threadNumber: 1000000 + num * 47,
    title: `Title #${num}: ${topic}`,
    teaser: `Post text #${num}: Discussing practical tips, progressions, and community questions regarding ${topic.toLowerCase()}. Drop your experience below.`,
    replies,
    images,
    timestamp: `${(num % 12) + 1}h ago`,
    colorTone: accent,
    aspect,
    user,
  };
});

interface ConversationSnippet {
  text: string[];
  type: "image-text" | "text-only" | "image-only";
}

export function getThreadData(threadId: number) {
  const basePost = initialPosts.find((p) => p.id === threadId) || initialPosts[0];
  const opNumber = basePost.threadNumber;
  const opUser = basePost.user;

  const opFile = {
    name: `workout_chart_${basePost.id}.png`,
    size: `${140 + (basePost.id * 17) % 800} KB`,
    dimensions: basePost.aspect.dimLabel,
    ratioClass: basePost.aspect.ratioClass,
    colorTone: basePost.colorTone,
    imageNum: basePost.id,
  };

  const opComments = [
    `Welcome to thread #${basePost.id} on ${basePost.title.replace(/^Title #\d+:\s*/, "")}.`,
    `>decided to take training and recovery seriously this month`,
    `>tracking macros and keeping consistent log`,
    `What are everyone's current benchmarks, routines, or questions? Post your setup, routine adjustments, or form check thoughts.`,
  ];

  const branchBlueprints: Array<{
    parentOffset: number;
    userIndex: number;
    snippet: ConversationSnippet;
  }> = [
    // Branch 1: Sleep & Recovery
    {
      parentOffset: 0,
      userIndex: 1, // KetoRunner
      snippet: {
        type: "image-text",
        text: [
          `>>${opNumber}`,
          `Sleep hygiene made 10x more difference for my bench press than creatine or pre-workout ever did. Minimum 7.5 hours uninterrupted.`,
        ],
      },
    },
    {
      parentOffset: 1,
      userIndex: 3, // BenchBoss
      snippet: {
        type: "text-only",
        text: [
          `>Minimum 7.5 hours`,
          `How do you handle early morning shifts? I wake up at 5:30 AM and struggle to fall asleep before 11 PM.`,
        ],
      },
    },
    {
      parentOffset: 2,
      userIndex: 8, // RecoveryKing
      snippet: {
        type: "text-only",
        text: [
          `No screens 45 minutes before bed, magnesium glycinate 30 mins prior, and keep room temperature under 68°F (20°C). Game changer.`,
        ],
      },
    },
    {
      parentOffset: 3,
      userIndex: 1, // KetoRunner
      snippet: {
        type: "image-text",
        text: [
          `+1 for magnesium glycinate. Here is my sleep tracker log from the past month. RHR dropped by 4 bpm.`,
        ],
      },
    },

    // Branch 2: Routine split inquiry
    {
      parentOffset: 0,
      userIndex: 6, // FormCoach
      snippet: {
        type: "text-only",
        text: [
          `>>${opNumber}`,
          `Anyone here switched from PPL (Push Pull Legs) 6 days a week to Upper / Lower 4 days a week? Thoughts on volume vs recovery?`,
        ],
      },
    },
    {
      parentOffset: 5,
      userIndex: 9, // DeadliftDan
      snippet: {
        type: "image-text",
        text: [
          `I made the switch 6 months ago. Joint aches completely went away and progress on deadlifts/squats surged because extra rest days allow systemic recovery.`,
        ],
      },
    },
    {
      parentOffset: 6,
      userIndex: 0, // IronLifter
      snippet: {
        type: "text-only",
        text: [
          `>Joint aches completely went away`,
          `Exactly this. PPL 6 days is overkill for natural lifters unless your food, sleep, and lifestyle are 100% stress-free.`,
        ],
      },
    },
    {
      parentOffset: 5,
      userIndex: 5, // CardioQueen
      snippet: {
        type: "image-only",
        text: [],
      },
    },

    // Branch 3: Form Check & Mobility
    {
      parentOffset: 0,
      userIndex: 2, // ZenYogi
      snippet: {
        type: "image-text",
        text: [
          `>>${opNumber}`,
          `Form check cue that saved my lower back: think about "pushing the floor away with your legs" rather than "pulling the bar up" on conventional deadlifts.`,
        ],
      },
    },
    {
      parentOffset: 9,
      userIndex: 9, // DeadliftDan
      snippet: {
        type: "text-only",
        text: [
          `>pushing the floor away`,
          `Also pull slack out of the barbell before the pull breaks the ground. Click the bar against the plates.`,
        ],
      },
    },
    {
      parentOffset: 10,
      userIndex: 6, // FormCoach
      snippet: {
        type: "text-only",
        text: [
          `The slack pull cue clicked for me instantly. Instant +10kg on my working sets without back rounding.`,
        ],
      },
    },

    // Branch 4: Calorie deficit & energy
    {
      parentOffset: 0,
      userIndex: 4, // MacroChef
      snippet: {
        type: "text-only",
        text: [
          `>>${opNumber}`,
          `What's your current deficit? If you're cutting, keep it around 300-400 kcal below maintenance. Don't crash cut at -1000 kcal or your strength tanks.`,
        ],
      },
    },
    {
      parentOffset: 12,
      userIndex: 7, // GainsGoblin
      snippet: {
        type: "image-text",
        text: [
          `Agreed. High volume low calorie foods like zucchini, cauliflower rice, and egg whites make a 400 kcal cut feel totally painless.`,
        ],
      },
    },

    // Branch 5: Equipment & gear
    {
      parentOffset: 0,
      userIndex: 3, // BenchBoss
      snippet: {
        type: "image-text",
        text: [
          `>>${opNumber}`,
          `Flat sole shoes or lifting barefoot on platform > running shoes with squishy soles. Running shoes leak power transfer.`,
        ],
      },
    },
    {
      parentOffset: 14,
      userIndex: 0, // IronLifter
      snippet: {
        type: "text-only",
        text: [
          `>running shoes with squishy soles`,
          `Lifting in running shoes feels like squatting on a mattress. Wrestling shoes or basic flat sneakers are best budget choice.`,
        ],
      },
    },
    {
      parentOffset: 15,
      userIndex: 2, // ZenYogi
      snippet: {
        type: "image-only",
        text: [],
      },
    },
  ];

  const replies: ThreadReply[] = [];

  branchBlueprints.forEach((b, index) => {
    const postNum = opNumber + index + 1;
    const parentNum = b.parentOffset === 0 ? opNumber : opNumber + b.parentOffset;
    const accent = colorAccents[(index + threadId) % colorAccents.length];
    const aspect = aspectRatios[(index * 3) % aspectRatios.length];
    const user = mockUsers[b.userIndex % mockUsers.length];

    const item: ThreadReply = {
      id: index + 1,
      postNumber: postNum,
      user,
      timestamp: `11/07/26(Sat) 08:${(12 + index * 2).toString().padStart(2, "0")}:19`,
      parentId: parentNum,
      replyTo: [parentNum],
      type: b.snippet.type,
      comment: b.snippet.text.length > 0 ? b.snippet.text : undefined,
    };

    if (b.snippet.type === "image-text" || b.snippet.type === "image-only") {
      item.file = {
        name: `attachment_${index + 1}_${postNum}.jpg`,
        size: `${95 + (index * 37) % 580} KB`,
        dimensions: aspect.dimLabel,
        ratioClass: aspect.ratioClass,
        colorTone: accent,
        imageNum: basePost.id * 100 + (index + 1),
      };
    }

    replies.push(item);
  });

  return {
    op: {
      id: basePost.id,
      threadNumber: opNumber,
      title: basePost.title,
      user: opUser,
      timestamp: "11/07/26(Sat) 08:02:11",
      file: opFile,
      comments: opComments,
    },
    replies,
  };
}
