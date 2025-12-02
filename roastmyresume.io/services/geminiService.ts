import { GoogleGenAI, Type } from "@google/genai";
import { RoastIntensity } from "../types";

// Helper to get enum values for prompt
const getIntensityPrompt = (intensity) => {
  switch (intensity) {
    case RoastIntensity.GENTLE:
      return "Playful teasing. Like a friend poking fun. Point out the obvious but don't be mean. Use lower case.";
    case RoastIntensity.REALITY:
      return "Direct and dry. Cut through the BS. Tell them what hiring managers actually think but won't say. Use lower case.";
    case RoastIntensity.NO_MERCY:
      return "Sarcastic and blunt. Mock the buzzwords, the formatting, and the career choices. No padding. Be mean. Use lower case.";
    case RoastIntensity.DESTRUCTION:
      return "Absolute violation. Be creative, witty, and devastating. Deconstruct their entire professional identity. Make them cry. Use lower case.";
    default:
      return "Savage roast.";
  }
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    roasts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 5-7 detailed, savage roast bullet points. Each point should be at least 2 sentences long.",
    },
    verdict: {
      type: Type.STRING,
      description: "A final 1-sentence savage summary verdict.",
    },
  },
  required: ["roasts", "verdict"],
};

// Dynamic Mock Data Pool
const MOCK_DATA = {
  [RoastIntensity.GENTLE]: {
    roasts: [
      "using times new roman in 2024? bold choice, grandpa.",
      "your 'skills' section looks like you just googled 'computer words'.",
      "3 months at a startup isn't 'extensive experience', it's a summer break.",
      "formatting so bad i thought my screen was broken.",
      "microsoft word expert? congrats on passing 3rd grade.",
      "maybe add some color? it looks like a tax form.",
      "a gmail address from 2010? cute.",
      "references available upon request? yeah, we know.",
      "you listed 'walking' as a hobby. ambitious.",
      "this resume is shorter than my grocery list."
    ],
    verdicts: [
      "this resume belongs in the recycling bin, not on a recruiter's desk.",
      "it's not terrible, but it's definitely not good.",
      "keep trying, you'll get there eventually. maybe."
    ]
  },
  [RoastIntensity.REALITY]: {
    roasts: [
      "stop listing 'communication' as a skill. it's a requirement, not a skill.",
      "your summary is just a list of adjectives that don't mean anything.",
      "nobody cares about your gpa from 5 years ago.",
      "two pages? for this little experience? cut it down.",
      "your linkedin link doesn't even work. professional.",
      "listing 'hard worker' is the best way to say you have no actual skills.",
      "this layout screams 'i made this in 5 minutes'.",
      "typos in a resume? immediate rejection.",
      "you claim to be 'detail oriented' but missed a period here.",
      "this objective statement is so generic it could apply to a golden retriever."
    ],
    verdicts: [
      "hiring managers are laughing at this in the group chat.",
      "you're going straight to the 'maybe' pile (which is the trash).",
      "honestly, i've seen better resumes from high schoolers."
    ]
  },
  [RoastIntensity.NO_MERCY]: {
    roasts: [
      "this entire document is a cry for help.",
      "you really thought 'detail-oriented' was a good thing to put after that formatting disaster?",
      "i'd hire you just to fire you for this resume.",
      "your career trajectory looks like a flatline.",
      "this is the visual equivalent of a wet sock.",
      "did you pay someone to make this bad, or is it natural talent?",
      "i'm getting second-hand embarrassment just reading this.",
      "your 'achievements' are just participation trophies.",
      "i've seen more professional resumes written in crayon.",
      "you have the qualifications of a ham sandwich."
    ],
    verdicts: [
      "burn this and start over. seriously.",
      "i hope you have a rich family because this career isn't happening.",
      "this is why you're ghosted by every recruiter."
    ]
  },
  [RoastIntensity.DESTRUCTION]: {
    roasts: [
      "this resume is the reason aliens won't talk to us.",
      "if disappointment had a file format, it would be this pdf.",
      "you have the professional appeal of a damp cardboard box.",
      "i've seen ransom notes with better formatting.",
      "your career is a joke, but this resume isn't funny.",
      "reading this lowered my iq.",
      "you're not unemployed, you're unemployable.",
      "this is an insult to the tree that died for the paper (if you printed it).",
      "i wouldn't hire you to water my plastic plants.",
      "your existence is a rounding error in the corporate world."
    ],
    verdicts: [
      "delete this file, delete your account, go live in the woods.",
      "emotional damage level: critical. career prospects: zero.",
      "i have no words, just pity."
    ]
  }
};

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateRoast = async (base64Data, mimeType, intensity, userName) => {
  try {
    // @ts-ignore - process.env is replaced by Vite at build time
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === '') {
      console.warn("No valid API key found. Using mock data.");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay

      const intensityData = MOCK_DATA[intensity] || MOCK_DATA[RoastIntensity.REALITY];
      return {
        roasts: getRandomItems(intensityData.roasts, 5),
        verdict: getRandomItem(intensityData.verdicts)
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const actualMimeType = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ? 'application/pdf'
      : mimeType;

    const prompt = `
      You are a savage, unformal, mean internet commenter. 
      Analyze this resume image/document. READ EVERY SINGLE WORD.
      
      User Name: ${userName} (Use this to make it personal, e.g., "listen here ${userName}...")
      Intensity Level: ${intensity}
      Instructions: ${getIntensityPrompt(intensity)}
      
      Your goal is to destroy this resume.
      
      CRITICAL INSTRUCTIONS:
      1.  **READ EVERYTHING**: Do not skim. Look at the dates, the job titles, the bullet points, the skills.
      2.  **QUOTE THE TEXT**: When you roast something, quote the exact text from the resume so they know you read it. (e.g., "you really wrote 'proficient in typing'? lol")
      3.  **BE SPECIFIC**: Do not give generic advice. Roast *this specific person* based on *this specific file*.
      4.  **QUANTITY**: Generate exactly 5 distinct roast points.
      5.  **LENGTH**: Make each roast point detailed (2-3 sentences). Explain *why* it sucks.
      
      Look for:
      - Specific cringey phrases they used.
      - Gaps in dates (calculate them!).
      - Weird job titles.
      - Formatting errors (alignment, fonts).
      - Nonsense buzzwords.
      
      Style Guide:
      - Be witty, sarcastic, and UNFORMAL.
      - Don't sound like a corporate bot. Sound like a judgmental person on the internet.
      - DO NOT use Gen-Z slang like "bestie" or "no cap" unless mocking it.
      - DO NOT use emojis in the text.
      - Use lower case for everything to look more casual/unbothered.
      - Be RUTHLESS.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: actualMimeType,
                data: base64Data
              }
            },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 1.0, // Max creativity
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }

      throw new Error("Empty response from AI");

    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      throw new Error("AI is tired of looking at bad resumes. Try again later.");
    }

  } catch (error) {
    console.error("Roast generation failed:", error);
    // Fallback to mock if API fails
    const intensityData = MOCK_DATA[intensity] || MOCK_DATA[RoastIntensity.REALITY];
    return {
      roasts: getRandomItems(intensityData.roasts, 5),
      verdict: getRandomItem(intensityData.verdicts)
    };
  }
};