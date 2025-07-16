// src/hooks/useNarrativeCopy.ts
import { narrativeCopy, NarrativeCopyKeys } from '../constants/narrativeCopy';

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type CopyPath = DeepKeyOf<NarrativeCopyKeys>;

export const useNarrativeCopy = () => {
  const getCopy = (path: CopyPath): string => {
    const keys = path.split('.');
    let current: any = narrativeCopy;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        console.warn(`Copy path not found: ${path}`);
        return path; // Return the path as fallback
      }
    }

    return typeof current === 'string' ? current : path;
  };

  const getRandomCelebration = (): string => {
    const messages = narrativeCopy.completion.celebrationMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return {
    getCopy,
    getRandomCelebration,
    copy: narrativeCopy // Direct access for complex usage
  };
};
