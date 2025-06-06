// This file will contain all TypeScript types for the Human Design tools.
// As new types are defined from the markdown documents, they will be added here.
// All types will be exported.

export enum AuthorityType {
  Emotional = "Emotional",
  Sacral = "Sacral",
  Splenic = "Splenic",
  Ego = "Ego",
  SelfProjected = "Self-Projected",
  Mental = "Mental",
  Lunar = "Lunar",
  Unknown = "Unknown",
  NotSet = "NotSet", // As per instruction
}

export interface PatternRecognitionPattern { // Renamed from Pattern
  id: string;
  title: string;
  description: string;
  category: string; // "decision", "energy", "environment", "relationship", etc.
  confidence: number; // 0-1
  discoveredAt: string;
  dataPoints: number; // Number of data points supporting this pattern
  authorityRelevance: string; // How this relates to user's authority
  impactDomains: string[]; // Life areas impacted
}

export interface PatternDetail extends PatternRecognitionPattern { // Adjusted to extend renamed Pattern
  timeframe: {
    start: string;
    end: string;
  };
  frequencyMetrics: {
    occurrences: number;
    consistency: number; // 0-1
    trend: "increasing" | "decreasing" | "stable";
  };
  correlatedPatterns: {
    patternId: string;
    correlationStrength: number; // -1 to 1
    description: string;
  }[];
  visualizationData: any; // Format depends on visualization type
}

export interface SupportingPoint {
  timestamp: string;
  dataSource: string; // "living-log", "wave-witness", etc.
  entryId?: string;
  value: any;
  context?: object;
}

export interface AuthorityPattern {
  id: string;
  authorityType: string;
  patternName: string;
  description: string;
  confidence: number;
  recommendedActions: string[];
  impactScore: number; // 0-10
}

// From docs/implementation/LivingLog.md
export interface LogEntry {
  id: string;
  userId: string;
  content: string;
  mediaType: "text" | "voice" | "photo";
  mediaUrl?: string;
  timestamp: string;
  authorityData: {
    type: string; // "emotional", "sacral", "splenic", etc.
    state?: string; // e.g. "high", "low", "yes", "no"
    intensity?: number; // 0-10 scale where applicable
    context?: object; // Authority-specific context
  };
  tags?: string[];
  context?: {
    location?: string;
    people?: string[];
    environment?: string;
    lunarPhase?: string;
  };
  clarityMarker?: {
    isClarity: boolean;
    markedAt: string;
    notes?: string;
  };
}

export interface LivingLogPattern { // Renamed from Pattern
  id: string;
  description:string;
  confidence: number; // 0-1
  relatedEntryIds: string[];
  authorityType: string;
  patternType: string; // "emotional-clarity", "gut-response", etc.
  discoveredAt: string;
}

// From docs/implementation/WaveWitness.md
export interface EnergyCheckIn {
  id: string;
  userId: string;
  timestamp: string;
  energyLevel: number; // 1-10
  authorityData: {
    type: string; // "emotional", "sacral", "splenic", etc.
    state?: string; // Authority-specific state
    metrics?: object; // Authority-specific measurements
  };
  contextData?: {
    location?: string;
    activities?: string[];
    people?: string[];
    environment?: string;
    lunarPhase?: string;
    notes?: string;
  }
}

export interface EnergyPattern {
  id: string;
  description: string;
  confidence: number; // 0-1
  patternType: string; // "wave-cycle", "energy-peak", "clarity-window", etc.
  timeframe: {
    cycleLength?: number; // In days
    peakDays?: number[]; // Days of week or month
    timeOfDay?: string[]; // Morning, afternoon, evening
  };
  authoritySpecificData?: object;
}

export interface TimelinePoint {
  timestamp: string;
  energyLevel: number;
  authorityMetrics: object; // Authority-specific data points
  tags?: string[];
}

export interface ClarityPrediction {
  startTime: string;
  endTime: string;
  clarityLevel: number; // 0-1
  authorityBasis: string; // Description of why this is predicted
  recommendedUse: string; // How to use this clarity window
}

// From docs/implementation/Generators_ResponseIntelligence.md
export interface Response {
  id: string;
  userId: string;
  timestamp: string;
  question: string;
  responseType: "yes" | "no" | "neutral" | "unclear";
  responseStrength: number; // 0-10
  audioUrl?: string;
  energy: {
    before: number; // 0-10
    after: number; // 0-10
    shift: number; // -10 to 10
  };
  physical: {
    sensations: string[];
    locations: string[];
    intensity: number; // 0-10
  };
  context: {
    category: string;
    environment: string;
    timeOfDay: string;
    emotionalState?: string;
    importance: number; // 0-10
  };
  distortion: {
    detected: boolean;
    type?: string; // "mental", "emotional", "conditioning", etc.
    notes?: string;
  };
  satisfaction?: {
    level: number; // 0-10
    notes: string;
    recordedAt: string;
    outcomes: string[];
  };
}

export interface ResponsePattern {
  id: string;
  description: string;
  confidence: number; // 0-1
  attributes: {
    responseTypes: string[];
    categories: string[];
    timesOfDay: string[];
    environments: string[];
    physicalIndicators: string[];
  };
  metrics: {
    consistency: number; // 0-1
    satisfaction: number; // 0-1
    energyImpact: number; // -10 to 10
    distortionFrequency: number; // 0-1
  };
  recommendations: string[];
}

export interface SatisfactionMetrics {
  overall: number; // 0-1
  byResponseType: Record<string, number>;
  byResponseStrength: Record<string, number>;
  byCategory: Record<string, number>;
  byTimeOfDay: Record<string, number>;
  byEnvironment: Record<string, number>;
  trend: {
    direction: "improving" | "declining" | "stable";
    rate: number; // change per week
  };
}

export interface ResponseCorrelation {
  factor: string;
  correlationStrength: number; // -1 to 1
  confidence: number; // 0-1
  description: string;
  recommendation?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  steps: string[];
  purpose: string;
  duration: number; // minutes
  difficulty: number; // 1-5
  focus: string; // "clarity", "strength", "differentiation", etc.
  completionMetric: string;
}

export interface ProgressMetrics {
  responseClarity: number; // 0-1
  satisfactionAlignment: number; // 0-1
  distortionAwareness: number; // 0-1
  completedExercises: number;
  recommendedFocus: string[];
}

// From docs/implementation/ManifestingGenerators_ProjectFlowDynamics.md
export interface WorkflowSequence {
  id: string;
  userId: string;
  projectId: string;
  timestamp: string;
  sequenceStep: string;
  isSkipStep: boolean;
  energyLevel: number; // 1-10
  sacralResponse: string; // "yes", "no", "neutral"
  emotionalState?: string;
  splenicInput?: string;
  context: {
    projectType: string;
    collaborators: boolean;
    deadline?: string;
    priority: number;
    location?: string;
    concurrent: boolean; // Whether working on multiple projects
  };
  outcomes: {
    completionSuccess?: boolean;
    satisfactionLevel?: number;
    timeEfficiency?: number;
    energyEfficiency?: number;
    frustrationPoints?: string[];
  };
}

export interface WorkflowPattern {
  id: string;
  description: string;
  confidence: number; // 0-1
  projectTypes: string[];
  steps: {
    sequence: string[];
    skipSteps: string[];
    keyPoints: string[];
  };
  metrics: {
    completionRate: number;
    averageSatisfaction: number;
    frustrationRate: number;
    energyEfficiency: number;
  };
}

export interface SkipStepPattern {
  id: string;
  description: string;
  skippedStep: string;
  projectTypes: string[];
  effectiveness: "positive" | "negative" | "neutral";
  confidence: number; // 0-1
  impact: {
    timeImpact: number; // hours saved/lost
    qualityImpact: number; // -5 to 5
    frustrationImpact: number; // -5 to 5
    collaborationImpact: number; // -5 to 5
  };
  recommendedFor: string[];
  cautionsFor: string[];
}

export interface FrustrationPoint {
  id: string;
  timestamp: string;
  projectId: string;
  sequenceStep: string;
  frustrationLevel: number; // 1-10
  blockers: string[];
  context: {
    projectType: string;
    environment: string;
    collaborators?: string[];
    energyLevel: number;
    emotionalState?: string;
  };
  resolution?: {
    resolved: boolean;
    strategy: string;
    effectiveness: number;
    timeToResolution: number; // minutes
  };
}

export interface RhythmPattern {
  id: string;
  pattern: string; // e.g., "burst-pause-burst-complete"
  timeOfDay: string[];
  durationMinutes: {
    focus: number;
    transition: number;
    rest: number;
  };
  effectiveness: {
    energySustainability: number;
    completionRate: number;
    satisfactionLevel: number;
  };
  projectTypeMatch: Record<string, number>; // project type to effectiveness score
}

// From docs/implementation/Manifestors_ImpulseIntegration.md
export interface Impulse {
  id: string;
  userId: string;
  timestamp: string;
  description: string;
  impactScope: "personal" | "relational" | "collective" | "creative";
  urgencyLevel: number; // 1-10
  authorityState: {
    type: string; // "emotional", "ego", "splenic"
    state?: string; // Authority-specific state
    clarity?: number; // 0-1 scale
  };
  status: "new" | "evaluated" | "informed" | "implemented" | "abandoned";
  evaluation?: {
    alignmentScore: number;
    authorityInput: object;
    sustainability: number;
    implementationNotes: string;
    evaluatedAt: string;
  };
  informing?: {
    informedAt: string;
    stakeholders: string[];
    method: string;
    content: string;
    resistanceLevel?: number;
    feedback?: string;
  };
  implementation?: {
    startedAt: string;
    completedAt?: string;
    success?: boolean;
    energy: {
      required: number;
      actual: number;
      recovery: number;
    };
    impact: {
      personal: number;
      others: number;
      satisfaction: number;
    };
  };
  context?: {
    location?: string;
    environment?: string;
    triggers?: string[];
    energyState?: string;
  };
}

export interface ImpulsePattern {
  id: string;
  description: string;
  category: string;
  confidence: number; // 0-1
  attributes: {
    authorityState: string[];
    timing: object;
    impactScope: string[];
    successFactors: string[];
    resistanceFactors: string[];
  };
  metrics: {
    implementationRate: number;
    averageAlignment: number;
    resistanceLevel: number;
    energyEfficiency: number;
    satisfactionLevel: number;
  };
}

export interface InformStrategy {
  id: string;
  strategyName: string;
  description: string;
  stakeholderTypes: string[];
  authorityAlignment: string[];
  effectivenessScore: number; // 0-1
  timing: {
    idealTime: string[];
    cautionPeriods: string[];
    preparationNeeded: boolean;
  };
  components: {
    openingApproach: string;
    keyElements: string[];
    tonality: string;
    followUp: string;
  };
  adaptations: {
    forResistance: string;
    forMisunderstanding: string;
    forDelayedResponse: string;
  };
}

export interface EnergyPeriod {
  startTime: string;
  endTime: string;
  energyLevel: number; // 1-10
  initiationCapacity: number; // 1-10
  recommendedActivity: string[];
  cautionActivity: string[];
  recovery: {
    needed: boolean;
    durationMinutes: number;
    suggestedPractices: string[];
  };
}

export interface TimingGuidance {
  optimalTimes: {
    dayOfWeek?: string[];
    timeOfDay?: string[];
    relationToEvent?: string;
  };
  preparationPeriod: {
    minimum: string;
    ideal: string;
  };
  authoritySpecific: {
    waitingPeriod?: string;
    willpowerConsideration?: string;
    splenicTiming?: string;
  };
}

// From docs/implementation/Projectors_RecognitionNavigation.md
export interface Invitation {
  id: string;
  userId: string;
  timestamp: string;
  invitationType: string; // "work", "relationship", "project", etc.
  source: {
    name: string;
    relationship: string;
    history?: string;
    trustLevel?: number;
  };
  description: string;
  timeframe: {
    receivedAt: string;
    responseDeadline?: string;
    startDate?: string;
    endDate?: string;
  };
  status: "new" | "evaluating" | "accepted" | "declined" | "expired";
  initialResponse?: {
    type: string; // "interest", "hesitation", "excitement", "concern"
    notes: string;
    energyShift: number; // -10 to 10
  };
  evaluation?: {
    authorityType: string;
    authorityInput: object; // Authority-specific data
    clarity: number; // 0-1
    alignment: number; // 0-1
    energyProjection: {
      investment: number;
      return: number;
      sustainability: number;
    };
    recognitionQuality: number; // 0-1
    completedAt: string;
  };
  response?: {
    decision: "accepted" | "declined" | "negotiated";
    reasoning: string;
    communicatedAt: string;
    boundarySet?: string;
  };
  outcome?: {
    recognitionLevel: number; // 0-1
    energyImpact: number; // -10 to 10
    satisfaction: number; // 0-1
    learnings: string[];
    wouldRepeatDecision: boolean;
  };
}

export interface InvitationPattern {
  id: string;
  description: string;
  confidence: number; // 0-1
  attributes: {
    sources: string[];
    types: string[];
    recognitionQuality: string[];
    energyImpact: string;
  };
  metrics: {
    acceptanceRate: number;
    satisfactionRate: number;
    energySustainability: number;
    recognitionAlignment: number;
  };
  recommendations: string[];
}

export interface EnvironmentAssessment {
  id: string;
  name: string;
  type: string; // "workplace", "social", "family", etc.
  metrics: {
    recognitionQuality: number; // 0-1
    energyImpact: number; // -10 to 10
    invitationFrequency: number;
    alignmentScore: number; // 0-1
  };
  patterns: {
    bestTimes: string[];
    challengeTimes: string[];
    optimalDuration: number; // minutes
    recoveryNeeded: number; // minutes
  };
  relationships: {
    supportive: string[];
    draining: string[];
    neutral: string[];
  };
  recommendations: {
    boundarySettings: string[];
    energyStrategies: string[];
    visibilityTactics: string[];
  };
}

export interface RecognitionStrategy {
  id: string;
  name: string;
  description: string;
  authorityAlignment: string[];
  energyRequirement: number; // 1-10
  effectiveness: number; // 0-1
  implementationSteps: string[];
  bestFor: string[];
  cautionsFor: string[];
  examples: string[];
  personalizedNotes?: string;
}

export interface Practice {
  id: string;
  name: string;
  description: string;
  category: string; // "energy", "visibility", "communication", etc.
  duration: number; // minutes
  frequency: string;
  steps: string[];
  benefits: string[];
  authoritySpecificNotes: Record<string, string>;
}

// From docs/implementation/Reflectors_EnvironmentalAttunement.md
export interface LunarCheckIn {
  id: string;
  userId: string;
  timestamp: string;
  lunarDay: number; // 1-28
  lunarPhase: string;
  wellbeing: {
    overall: number; // 1-10
    physical: number;
    emotional: number;
    mental: number;
    social: number;
  };
  clarity: {
    level: number; // 1-10
    areas: string[];
    insights: string[];
  };
  environment: {
    id?: string;
    name: string;
    type: string;
    attributes: string[];
    duration: number; // hours
    impact: number; // -10 to 10
  };
  relationships: {
    people: string[];
    groupSize?: number;
    dynamics: string[];
    impact: number; // -10 to 10
  };
  significant: boolean;
  notes?: string;
  decisions?: {
    considered: string[];
    made: string[];
    satisfaction?: number;
  };
}

export interface LunarPattern {
  id: string;
  description: string;
  confidence: number; // 0-1
  cyclePosition: {
    days: number[]; // 1-28
    phase?: string[];
  };
  attributes: {
    wellbeing: string;
    clarity: string;
    environmentFactors: string[];
    relationshipFactors: string[];
  };
  consistency: {
    acrossCycles: number; // 0-1
    withinPhases: number; // 0-1
    exceptions: string[];
  };
  recommendations: string[];
}

export interface ClarityWindow {
  startDay: number; // 1-28
  endDay: number; // 1-28
  confidence: number; // 0-1
  decisionTypes: string[];
  environmentRecommendations: string[];
  preparation: string[];
}

export interface EnvironmentAnalysis {
  id: string;
  name: string;
  type: string;
  frequency: number; // times visited
  lunarCorrelation: {
    bestDays: number[]; // 1-28
    challengingDays: number[]; // 1-28
    neutralDays: number[]; // 1-28
  };
  impact: {
    wellbeing: number; // -10 to 10
    clarity: number; // -10 to 10
    energy: number; // -10 to 10
    authenticity: number; // -10 to 10
  };
  attributes: {
    supportive: string[];
    challenging: string[];
    neutral: string[];
  };
  recommendations: {
    timing: string[];
    duration: string;
    preparation: string[];
    integration: string[];
  };
}

export interface RelationshipAnalysis {
  id: string;
  person: string;
  type: string;
  frequency: number; // interactions
  lunarCorrelation: {
    bestDays: number[]; // 1-28
    challengingDays: number[]; // 1-28
    neutralDays: number[]; // 1-28
  };
  impact: {
    wellbeing: number; // -10 to 10
    clarity: number; // -10 to 10
    energy: number; // -10 to 10
    authenticity: number; // -10 to 10
  };
  dynamics: {
    supportive: string[];
    challenging: string[];
    neutral: string[];
  };
  recommendations: {
    timing: string[];
    duration: string;
    boundaries: string[];
    communication: string[];
  };
}

export interface TimingWindow {
  startDate: string;
  endDate: string;
  lunarDays: number[];
  confidence: number; // 0-1
  recommendedEnvironments: string[];
  recommendedConsultations: string[];
  preparation: string[];
  notes: string;
}
