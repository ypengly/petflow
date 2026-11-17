export type AnimationState =
  | "idle" | "walking" | "running" | "jumping" | "dancing" | "sleeping"
  | "sitting" | "eating" | "playing" | "waving" | "spinning" | "happy"
  | "surprised" | "bored" | "working";

export type PetAction =
  | "dance" | "jump" | "play" | "sleep" | "wake" | "eat" | "sit" | "wave"
  | "spin" | "followMouse" | "clock" | "weather" | "countdown" | "settings" | "hide";

export type PetCategory = "furry" | "wild" | "water" | "fantasy";

/** Probability weights (0-1) for autonomous activities. Used from Stage 4. */
export type BehaviorConfig = Partial<Record<AnimationState, number>> & {
  cooldownMs: number;
  ignoresClicks?: number;
};

export interface PetDefinition {
  id: string;
  name: string;
  description: string;
  personality: string;
  category: PetCategory;
  defaultAnimation: AnimationState;
  animations: AnimationState[];
  animationSpeed: number;
  behavior: BehaviorConfig;
  /** Base path for frames; real sprite sheets arrive in Stage 2. */
  assetPath: string;
  palette: { body: string; accent: string };
}
