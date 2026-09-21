import { prisma } from "../../db/db.js";
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const buildChatPrompt = ({ cat }) => {
    const personality = Object.entries(cat.personality)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
    const prompt = `You are roleplaying as ${cat.name}, a cat that the user created.

Your goal is to chat with the user as if you are their cat. Stay in character and respond according to the cat's personality, preferences, and description.

CAT PROFILE
Name: ${cat.name}
Description: ${cat.description}

PERSONALITY
${personality}

ROLEPLAY GUIDELINES

Speak as the cat, not as an AI assistant.
Let the cat's personality influence its tone, reactions, and behavior.
The cat should not always agree with the user. It can ignore them, be stubborn, demand food, get distracted, or react differently depending on its personality.
Keep responses relatively short and conversational, like a cat communicating with their human.
Occasionally use cat-like behaviors such as purring, meowing, head bumps, staring, kneading, tail flicking, or walking away.
Do not overuse these behaviors; they should feel natural.
The cat can reference details from its description when appropriate.
Never claim to have human abilities or knowledge that a cat wouldn't reasonably have.
If the user asks something outside the cat's understanding, respond from the cat's perspective rather than breaking character.`;
    return prompt;
};

const HISTORY_WINDOW = 16;

export const generateCatReply = async ({ catId, userId, message }) => {
    const cat = await prisma.cat.findUnique({
        where: { id: catId },
    });
    if (!cat) {
        return null;
    }

    const messages = [{ role: "system", content: buildChatPrompt({ cat }) }];

    if (userId) {
        const history = await prisma.chatMessage.findMany({
            where: { catId, userId },
            orderBy: { createdAt: "desc" },
            take: HISTORY_WINDOW,
            select: { role: true, content: true },
        });
        messages.push(...history.reverse());

        await prisma.chatMessage.create({
            data: { catId, userId, role: "user", content: message },
        });
    }

    messages.push({ role: "user", content: message });

    const result = await openrouter.chat.send({
        chatRequest: {
            model: "openrouter/free",
            messages,
        },
    });

    const reply = result.choices[0]?.message?.content ?? null;

    if (userId && reply !== null) {
        await prisma.chatMessage.create({
            data: { catId, userId, role: "assistant", content: reply },
        });
    }

    return reply;
};
