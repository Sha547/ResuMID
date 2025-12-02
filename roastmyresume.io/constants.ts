import { RoastIntensity } from "./types";

export const INTENSITY_CONFIG = {
  [RoastIntensity.GENTLE]: {
    color: "text-violet-300",
    label: "soft",
    description: "barely hurts. for the weak."
  },
  [RoastIntensity.REALITY]: {
    color: "text-violet-400",
    label: "honest",
    description: "the truth hurts, doesn't it?"
  },
  [RoastIntensity.NO_MERCY]: {
    color: "text-violet-500",
    label: "mean",
    description: "i'm not your friend. i will cook you."
  },
  [RoastIntensity.DESTRUCTION]: {
    color: "text-violet-600",
    label: "savage",
    description: "emotional damage guaranteed. rip."
  }
};

export const LOADING_PHRASES = [
  "analyzing your poor life choices...",
  "judging your formatting...",
  "trying to find a skill... still looking...",
  "laughing at your objective statement...",
  "consulting the council of roasting...",
  "detecting buzzwords... cringe...",
  "measuring desperation levels...",
  "calculating emotional damage...",
];