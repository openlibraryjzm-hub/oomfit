import { UserProfile } from "../data";
import { getBoardByCode, createThread, createReply, getThreadById, Thread, ThreadReply } from "./store";

export interface BotPersona {
  id: string;
  username: string;
  avatarBg: string;
  avatarText: string;
  initials: string;
  style: "analytical" | "enthusiast" | "skeptic" | "curator" | "casual";
}

export const botPersonas: BotPersona[] = [
  {
    id: "bot_circuit",
    username: "CircuitWeaver",
    avatarBg: "from-cyan-600 to-blue-800",
    avatarText: "text-white",
    initials: "CW",
    style: "analytical",
  },
  {
    id: "bot_pixel",
    username: "PixelHermit",
    avatarBg: "from-amber-600 to-red-800",
    avatarText: "text-white",
    initials: "PH",
    style: "enthusiast",
  },
  {
    id: "bot_synth",
    username: "SynthDrifter",
    avatarBg: "from-purple-600 to-indigo-900",
    avatarText: "text-white",
    initials: "SD",
    style: "curator",
  },
  {
    id: "bot_clover",
    username: "CloverWatcher",
    avatarBg: "from-emerald-600 to-teal-800",
    avatarText: "text-white",
    initials: "CW",
    style: "casual",
  },
  {
    id: "bot_null",
    username: "NullPointer",
    avatarBg: "from-zinc-700 to-slate-900",
    avatarText: "text-white",
    initials: "NP",
    style: "skeptic",
  },
  {
    id: "bot_glitch",
    username: "GlitchPoet",
    avatarBg: "from-rose-600 to-pink-800",
    avatarText: "text-white",
    initials: "GP",
    style: "enthusiast",
  },
];

// Contextual thread templates by board domain/topics
function generateThreadContent(boardName: string, boardDesc: string, tags: string[]): { title: string; comment: string } {
  const templates = [
    {
      title: `${boardName} General & Current Setups`,
      comment: `>be me\n>looking for fresh recommendations in ${boardName.toLowerCase()}\nWhat is everyone running or focusing on this week?\nDrop your thoughts and tips below.`,
    },
    {
      title: `What made you get into ${boardName}?`,
      comment: `Curious how everyone here first stumbled into this space.\n>started as a casual curiosity\n>now an everyday obsession\nAny key advice for newcomers getting started?`,
    },
    {
      title: `Underrated gems in ${boardName}`,
      comment: `Everyone always talks about the mainstream picks, but what about the underrated gems?\nShare anything you think deserves way more attention in ${tags.slice(0, 2).join(" & ") || boardName.toLowerCase()}.`,
    },
    {
      title: `Deep dive: Where is the space heading next?`,
      comment: `Been observing the evolution of ${boardDesc || boardName}.\n>tech and workflows are shifting faster than expected\nDo you prefer the older minimalist approach or the newer modular tools?`,
    },
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// Contextual reply templates
function generateReplyContent(targetPostNumber: number, opTitle: string): { comment: string; replyTo: number[] } {
  const replyTemplates = [
    `>>${targetPostNumber}\n>greentext checking in\nTotally agree with this take. Have been testing similar approaches for a few weeks now with solid results.`,
    `>>${targetPostNumber}\nFair point, but I've found keeping things simple usually yields better consistency over time.`,
    `>>${targetPostNumber}\n>underrated gems\nCan confirm. Switched over last month and haven't looked back.`,
    `>>${targetPostNumber}\nBased and authentic. The community needs more focused discussion on this instead of meta debates.`,
    `>>${targetPostNumber}\nInteresting setup. How are you dealing with the learning curve for beginners?`,
  ];

  const selected = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
  return {
    comment: selected,
    replyTo: [targetPostNumber],
  };
}

export async function createBotThread(boardShortcode: string): Promise<Thread> {
  const board = await getBoardByCode(boardShortcode);
  const boardName = board?.name || boardShortcode.toUpperCase();
  const boardDesc = board?.description || "";
  const tags = board?.tags || [];

  const persona = botPersonas[Math.floor(Math.random() * botPersonas.length)];
  const { title, comment } = generateThreadContent(boardName, boardDesc, tags);

  return await createThread({
    boardId: boardShortcode,
    title,
    comment,
    user: persona,
    hasImage: true,
  });
}

export async function createBotReply(threadId: number): Promise<ThreadReply> {
  const threadData = await getThreadById(threadId);
  if (!threadData) {
    throw new Error(`Thread #${threadId} does not exist to reply to.`);
  }

  const { op, replies } = threadData;
  // Choose to reply to either OP or a random recent reply
  const targetPostNumber =
    replies.length > 0 && Math.random() > 0.4
      ? replies[Math.floor(Math.random() * replies.length)].postNumber
      : op.threadNumber;

  const persona = botPersonas[Math.floor(Math.random() * botPersonas.length)];
  const { comment, replyTo } = generateReplyContent(targetPostNumber, op.title);

  return await createReply({
    threadId,
    comment,
    replyTo,
    user: persona,
    hasImage: Math.random() > 0.6,
  });
}
