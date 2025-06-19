import { SCREEN_EXPLAINERS } from '../constants/screenExplainers';

describe('SCREEN_EXPLAINERS', () => {
  const MAX_WORDS_ALLOWED = 40;

  Object.entries(SCREEN_EXPLAINERS).forEach(([key, text]) => {
    it(`should have a word count of ${MAX_WORDS_ALLOWED} or less for ${key}`, () => {
      const wordCount = text.split(' ').length;
      expect(wordCount).toBeLessThanOrEqual(MAX_WORDS_ALLOWED);
    });

    it(`should not be empty for ${key}`, () => {
      expect(text.trim().length).toBeGreaterThan(0);
    });
  });
});
