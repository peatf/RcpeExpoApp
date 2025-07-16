// src/constants/narrativeCopy.ts
export const narrativeCopy = {
  // Authentication & Onboarding
  auth: {
    signUp: {
      title: "Begin Your Quest",
      subtitle: "Embark on a journey of self-discovery",
      button: "Begin Your Quest",
      footer: "Already on a journey? Continue your path"
    },
    login: {
      title: "Continue Your Journey",
      subtitle: "Welcome back, traveler",
      button: "Continue Your Journey",
      footer: "New to the path? Begin your quest"
    }
  },

  // Navigation & Tabs
  navigation: {
    questMap: "Quest Map",
    questLog: "Quest Log",
    oracle: "Oracle",
    calibration: "Frequency Tuner",
    livingLog: "Journey Journal",
    profile: "Your Path"
  },

  // Quest Map
  questMap: {
    title: "Your Quest Map",
    subtitle: "Navigate your journey of self-discovery",
    sections: {
      activeQuests: "Active Quests",
      completedQuests: "Completed Quests",
      personalSymbol: "Your Journey Symbol"
    },
    emptyState: {
      title: "Your adventure awaits",
      description: "Complete the onboarding to begin your first quest"
    }
  },

  // Quest Log
  questLog: {
    title: "Quest Log",
    subtitle: "Your chronicle of discovery and growth",
    emptyState: {
      title: "Your Quest Log is Empty",
      description: "Complete quests, make reflections, and interact with tools to see your journey unfold here."
    }
  },

  // Oracle
  oracle: {
    title: "Consult the Oracle",
    subtitle: "Seek wisdom from the depths of knowledge",
    inputPlaceholder: "What guidance do you seek?",
    button: "Seek Wisdom",
    responsePrefix: "The Oracle reveals:",
    questComplete: "Oracle Consultation Complete"
  },

  // Calibration Tool
  calibration: {
    title: "Frequency Tuner",
    subtitle: "Calibrate your inner resonance",
    description: "Align yourself with your true frequency",
    button: "Begin Calibration",
    completeButton: "Complete Calibration Quest",
    resultPrefix: "Your frequency resonates at:",
    questComplete: "Frequency Calibration Complete"
  },

  // Living Log / Journal
  livingLog: {
    title: "Journey Journal",
    subtitle: "Record your path of discovery",
    entryPlaceholder: "Document your current experience...",
    titlePlaceholder: "What shall we call this reflection?",
    saveButton: "Complete Micro-Quest: Record Your Experience",
    questComplete: "Experience Recorded"
  },

  // Micro-Quests
  microQuests: {
    prefix: "🎯 Micro-Quest:",
    completionToast: "Quest Complete!",
    tracker: {
      livingLog: {
        title: "Record Your Experience",
        description: "Document your current state in the Journey Journal"
      },
      calibration: {
        title: "Calibrate Your Energy",
        description: "Use the Frequency Tuner to align your resonance"
      },
      oracle: {
        title: "Seek Wisdom",
        description: "Consult the Oracle for guidance on your path"
      }
    }
  },

  // Onboarding Banners
  onboarding: {
    bannerPrefix: "New Quest: Discover the",
    dismissButton: "Got it",
    descriptions: {
      frequencyMapper: "Explore your energetic landscape and discover resonant frequencies",
      oracle: "Seek ancient wisdom and guidance for your journey ahead",
      livingLog: "Chronicle your experiences and reflections as you grow"
    }
  },

  // General UI
  common: {
    continue: "Continue",
    next: "Next Quest",
    back: "Return",
    save: "Preserve",
    cancel: "Pause",
    complete: "Complete",
    start: "Begin",
    loading: "Preparing your path...",
    error: "The path seems unclear. Please try again.",
    success: "Quest milestone achieved!"
  },

  // Completion & Progress
  completion: {
    questComplete: "Quest Complete!",
    congratulations: "You have taken another step on your journey",
    nextQuestButton: "Discover Next Quest",
    viewProgress: "View Your Progress",
    celebrationMessages: [
      "Your wisdom grows with each step",
      "The path reveals itself to those who walk it",
      "Another milestone on your journey of discovery",
      "Your quest continues to unfold"
    ]
  }
} as const;

export type NarrativeCopyKeys = typeof narrativeCopy;
