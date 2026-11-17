import type { AnimationState, PetDefinition, PetCategory, BehaviorConfig } from "../types";

const CORE: AnimationState[] = ["idle", "walking", "jumping", "dancing", "sleeping", "sitting", "waving", "happy"];

function pet(
  id: string, name: string, category: PetCategory, personality: string, description: string,
  body: string, accent: string, behavior: Partial<BehaviorConfig> = {}
): PetDefinition {
  return {
    id, name, category, personality, description,
    defaultAnimation: "idle", animations: CORE, animationSpeed: 1,
    behavior: { cooldownMs: 20000, idle: 0.4, walking: 0.2, sleeping: 0.1, ...behavior },
    assetPath: `/assets/pets/${id}`, palette: { body, accent },
  };
}

export const PETS: PetDefinition[] = [
  pet("cat", "Cat", "furry", "Sleepy and independent", "Naps often, stretches sometimes, and may playfully ignore you.", "#F6C38B", "#E9946A", { sleeping: 0.3, ignoresClicks: 0.2 }),
  pet("dog", "Dog", "furry", "Excited and loyal", "Wags constantly and jumps whenever you click.", "#D9A66C", "#8A5A33", { jumping: 0.3 }),
  pet("rabbit", "Rabbit", "furry", "Bouncy and shy", "Hops around, twitches its ears, and sometimes hides.", "#F3E9F2", "#F7A8C4", { walking: 0.35 }),
  pet("panda", "Panda", "wild", "Calm and snacky", "Rolls, sits, and munches bamboo at its own pace.", "#FFFFFF", "#3A3A4A", { sitting: 0.3 }),
  pet("frog", "Frog", "water", "Cheerful and springy", "Leaps from spot to spot and loves rainy days.", "#8FD694", "#4DAF6A", { jumping: 0.35 }),
  pet("penguin", "Penguin", "water", "Goofy and clumsy", "Waddles, slips, and dances very seriously.", "#4A5170", "#FFB84D", { dancing: 0.25 }),
  pet("fox", "Fox", "wild", "Clever and curious", "Watches your cursor with a sly look.", "#F59A5B", "#FFF1DE", { walking: 0.3 }),
  pet("hamster", "Hamster", "furry", "Busy and round", "Stuffs its cheeks and scurries about.", "#F2D3A4", "#E6A87C", { running: 0.25 }),
  pet("turtle", "Turtle", "water", "Slow and steady", "Takes its time and hides in its shell for a nap.", "#7CC9A0", "#B58B5A", { sleeping: 0.25 }),
  pet("dinosaur", "Dinosaur", "fantasy", "Brave and stompy", "Stomps around and roars a very tiny roar.", "#9AD36A", "#5C9B3E", { walking: 0.3 }),
  pet("chick", "Chick", "furry", "Tiny and peppy", "Peeps, hops, and follows your cursor.", "#FFE27A", "#FFA94D", { running: 0.25 }),
  pet("dragon", "Dragon", "fantasy", "Proud and warm", "Puffs little smoke rings and guards your desktop.", "#B79CFF", "#FF8FAE", { dancing: 0.2 }),
];

export const getPet = (id: string) => PETS.find((p) => p.id === id);
