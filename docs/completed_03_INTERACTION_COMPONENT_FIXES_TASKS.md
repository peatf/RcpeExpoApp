# Interaction & Component Fixes Implementation Tasks

## Overview
This document outlines the interaction improvements and component fixes required for the Reality Creation Profile Engine app. These changes focus on improving user experience, functionality, and removing placeholder behaviors.

## 1. Quick-Start Chips Text Paste Fix (Requirement ⑨)

### Task Description
Quick-start chips in Frequency Mapper should paste without trailing ellipses (...).

### Technical Implementation
```typescript
// File: src/components/QuickStartChip.tsx
interface QuickStartChipProps {
  text: string;
  onPress: (text: string) => void;
  truncateLength?: number;
}

const QuickStartChip: React.FC<QuickStartChipProps> = ({ 
  text, 
  onPress, 
  truncateLength = 30 
}) => {
  // Store full text for pasting, but display truncated version
  const displayText = text.length > truncateLength 
    ? `${text.substring(0, truncateLength)}...` 
    : text;
  
  const handlePress = () => {
    // Pass the FULL text, not the truncated display text
    onPress(text);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.chip}>
      <Text style={styles.chipText}>{displayText}</Text>
    </TouchableOpacity>
  );
};

// File: src/screens/Main/FrequencyMapperScreen.tsx
const FrequencyMapperScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  
  const quickStartPhrases = [
    "I want to feel more confident in my relationships",
    "I desire financial abundance and security",
    "I want to find my life purpose and passion",
    "I need to heal from past trauma and pain",
    "I want to create meaningful work that fulfills me"
  ];

  const handleChipPress = (fullText: string) => {
    // Paste the complete text without ellipses
    setInputText(fullText);
  };

  return (
    <ScrollView>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Describe what you want to create..."
        multiline
      />
      
      <Text style={styles.quickStartLabel}>Quick Start:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {quickStartPhrases.map((phrase, index) => (
          <QuickStartChip
            key={index}
            text={phrase}
            onPress={handleChipPress}
            truncateLength={25}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
};
```

### Testing Implementation
```typescript
// File: src/__tests__/QuickStartChip.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import QuickStartChip from '../components/QuickStartChip';

describe('QuickStartChip', () => {
  it('should pass full text when pressed, not truncated version', () => {
    const fullText = "This is a very long text that should be truncated in display but passed in full";
    const mockOnPress = jest.fn();
    
    const { getByText } = render(
      <QuickStartChip 
        text={fullText} 
        onPress={mockOnPress}
        truncateLength={20}
      />
    );
    
    // Display should be truncated
    expect(getByText(/This is a very long/)).toBeTruthy();
    
    // But onPress should receive full text
    fireEvent.press(getByText(/This is a very long/));
    expect(mockOnPress).toHaveBeenCalledWith(fullText);
  });
});
```

### Acceptance Criteria
- [ ] Text box contains user phrase only (no ellipses)
- [ ] Full phrase is pasted even if display is truncated
- [ ] Quick-start chips work across all phrase lengths
- [ ] No text corruption during paste operation

### Files to Modify
- `src/components/QuickStartChip.tsx`
- `src/screens/Main/FrequencyMapperScreen.tsx`
- `src/__tests__/QuickStartChip.test.tsx` (new)

---

## 2. Calibration 6-Slider Update (Requirement ⑩)

### Task Description
Update Calibration to support 6 sliders including 2 for worthiness (one measuring ability to receive while feeling comfortable receiving).

### Technical Implementation
```typescript
// File: src/types/calibration.ts
export interface SliderValues {
  belief: number;
  belief_logical: number;
  openness: number;
  openness_acceptance: number;
  worthiness: number;
  worthiness_receiving: number;
}

export interface SliderConfig {
  key: keyof SliderValues;
  label: string;
  description: string;
  leftAnchor: string;
  rightAnchor: string;
}

// File: src/constants/sliderConfigs.ts
export const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'belief',
    label: 'Belief in Outcome',
    description: 'How strongly do you believe you can achieve your desired state?',
    leftAnchor: 'Doubtful',
    rightAnchor: 'Certain'
  },
  {
    key: 'belief_logical',
    label: 'Logical Sense',
    description: 'How much does receiving your desire make logical sense to you?',
    leftAnchor: 'Illogical',
    rightAnchor: 'Makes Sense'
  },
  {
    key: 'openness',
    label: 'Openness to Life',
    description: 'Willingness to surrender to life, God, the Universe',
    leftAnchor: 'Resistant',
    rightAnchor: 'Surrendered'
  },
  {
    key: 'openness_acceptance',
    label: 'Acceptance of Now',
    description: 'How well do you accept your current reality?',
    leftAnchor: 'Fighting',
    rightAnchor: 'Accepting'
  },
  {
    key: 'worthiness',
    label: 'Core Worthiness',
    description: 'How worthy do you feel of your desired outcome?',
    leftAnchor: 'Unworthy',
    rightAnchor: 'Worthy'
  },
  {
    key: 'worthiness_receiving',
    label: 'Comfort Receiving',
    description: 'How comfortable are you with receiving support and abundance?',
    leftAnchor: 'Uncomfortable',
    rightAnchor: 'Comfortable'
  }
];

// File: src/components/CalibrationSlider.tsx
interface CalibrationSliderProps {
  config: SliderConfig;
  value: number;
  onValueChange: (value: number) => void;
}

const CalibrationSlider: React.FC<CalibrationSliderProps> = ({
  config,
  value,
  onValueChange
}) => {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{config.label}</Text>
      <Text style={styles.sliderDescription}>{config.description}</Text>
      
      <View style={styles.sliderTrack}>
        <Text style={styles.anchor}>{config.leftAnchor}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={value}
          onValueChange={onValueChange}
          step={0.1}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#E5E5E5"
          thumbStyle={styles.thumb}
        />
        <Text style={styles.anchor}>{config.rightAnchor}</Text>
      </View>
      
      <Text style={styles.valueDisplay}>
        {Math.round(value * 100)}%
      </Text>
    </View>
  );
};
```

### Updated Calibration Screen
```typescript
// File: src/screens/Main/CalibrationToolScreen.tsx
const CalibrationToolScreen: React.FC = () => {
  const [sliderValues, setSliderValues] = useState<SliderValues>({
    belief: 0.5,
    belief_logical: 0.5,
    openness: 0.5,
    openness_acceptance: 0.5,
    worthiness: 0.5,
    worthiness_receiving: 0.5
  });

  const handleSliderChange = (key: keyof SliderValues, value: number) => {
    setSliderValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const submitCalibration = async () => {
    try {
      const response = await calibrationService.submitCalibration(sliderValues);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Now let's calibrate your unique alignment.</Text>
      
      {SLIDER_CONFIGS.map((config) => (
        <CalibrationSlider
          key={config.key}
          config={config}
          value={sliderValues[config.key]}
          onValueChange={(value) => handleSliderChange(config.key, value)}
        />
      ))}
      
      <TouchableOpacity onPress={submitCalibration} style={styles.submitButton}>
        <Text style={styles.submitText}>Complete Calibration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

### AI Integration Update
```typescript
// File: src/services/aiCalibrationService.ts
export interface CalibrationRequest {
  frequency_mapper_output: {
    desired_state: string;
    // ...other fields
  };
  slider_positions: SliderValues;
}

export const submitCalibration = async (sliderValues: SliderValues) => {
  const request: CalibrationRequest = {
    frequency_mapper_output: {
      desired_state: getCurrentDesiredState(),
    },
    slider_positions: sliderValues
  };
  
  const response = await apiClient.post('/api/v1/ai/calibration-tool/', request);
  return response.data;
};
```

### Acceptance Criteria
- [ ] 6 sliders implemented (belief, belief_logical, openness, openness_acceptance, worthiness, worthiness_receiving)
- [ ] Worthiness receiving slider measures comfort with receiving
- [ ] AI backend integration updated for 6-slider structure
- [ ] Slider values properly submitted to calibration API
- [ ] Visual design consistent across all sliders

### Files to Create/Modify
- `src/types/calibration.ts`
- `src/constants/sliderConfigs.ts` (new)
- `src/components/CalibrationSlider.tsx` (new)
- `src/screens/Main/CalibrationToolScreen.tsx`
- `src/services/aiCalibrationService.ts`

---

## 3. Base Tools Functional Actions (Requirement ⑪)

### Task Description
Buttons in base tools must complete an action (log entry, toast) instead of showing a spinner that does nothing.

### Technical Implementation
```typescript
// File: src/components/ActionButton.tsx
interface ActionButtonProps {
  title: string;
  onPress: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  successMessage = 'Action completed successfully',
  errorMessage = 'Action failed. Please try again.',
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onPress();
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: successMessage
      });
    } catch (error) {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[styles.button, disabled && styles.disabled]}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// File: src/services/dataStore.ts
export interface LogEntry {
  id: string;
  timestamp: Date;
  type: string;
  content: any;
  userId: string;
}

class DataStoreService {
  async saveLogEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<LogEntry> {
    const newEntry: LogEntry = {
      ...entry,
      id: generateUUID(),
      timestamp: new Date()
    };
    
    // Save to local storage
    const existingEntries = await this.getLogEntries();
    const updatedEntries = [...existingEntries, newEntry];
    await AsyncStorage.setItem('logEntries', JSON.stringify(updatedEntries));
    
    // Optionally sync to server
    try {
      await this.syncToServer(newEntry);
    } catch (error) {
      console.warn('Failed to sync to server, will retry later:', error);
    }
    
    return newEntry;
  }

  async getLogEntries(): Promise<LogEntry[]> {
    const entries = await AsyncStorage.getItem('logEntries');
    return entries ? JSON.parse(entries) : [];
  }
}

export const dataStore = new DataStoreService();
```

### Base Tool Implementation Examples
```typescript
// File: src/screens/Main/BaseTools/ResponseInventoryScreen.tsx
const ResponseInventoryScreen: React.FC = () => {
  const [sacralResponse, setSacralResponse] = useState('');
  const [situation, setSituation] = useState('');

  const saveResponse = async () => {
    if (!sacralResponse || !situation) {
      throw new Error('Please fill in all fields');
    }

    await dataStore.saveLogEntry({
      type: 'SACRAL_RESPONSE',
      content: {
        situation,
        response: sacralResponse,
        timestamp: new Date().toISOString()
      },
      userId: getCurrentUserId()
    });
  };

  return (
    <ScrollView>
      <TextInput
        placeholder="Describe the situation..."
        value={situation}
        onChangeText={setSituation}
        multiline
      />
      
      <TextInput
        placeholder="What was your sacral response?"
        value={sacralResponse}
        onChangeText={setSacralResponse}
        multiline
      />
      
      <ActionButton
        title="Save Response"
        onPress={saveResponse}
        successMessage="Sacral response logged successfully"
        disabled={!sacralResponse || !situation}
      />
    </ScrollView>
  );
};

// File: src/screens/Main/BaseTools/LivingLogScreen.tsx
const LivingLogScreen: React.FC = () => {
  const [logEntry, setLogEntry] = useState('');
  const [mood, setMood] = useState<number>(5);

  const saveLogEntry = async () => {
    if (!logEntry.trim()) {
      throw new Error('Please write something in your log');
    }

    await dataStore.saveLogEntry({
      type: 'LIVING_LOG',
      content: {
        entry: logEntry,
        mood,
        timestamp: new Date().toISOString()
      },
      userId: getCurrentUserId()
    });

    // Clear form after successful save
    setLogEntry('');
    setMood(5);
  };

  return (
    <ScrollView>
      <TextInput
        placeholder="What's happening in your world today?"
        value={logEntry}
        onChangeText={setLogEntry}
        multiline
        numberOfLines={6}
      />
      
      <Text>Mood: {mood}/10</Text>
      <Slider
        value={mood}
        onValueChange={setMood}
        minimumValue={1}
        maximumValue={10}
        step={1}
      />
      
      <ActionButton
        title="Save Entry"
        onPress={saveLogEntry}
        successMessage="Log entry saved"
        disabled={!logEntry.trim()}
      />
    </ScrollView>
  );
};
```

### Acceptance Criteria
- [ ] All base tool buttons perform actual actions
- [ ] Log entries saved to local datastore
- [ ] Success/error toasts shown appropriately
- [ ] No more infinite spinners
- [ ] QA testing passes for all base tools

### Files to Create/Modify
- `src/components/ActionButton.tsx` (new)
- `src/services/dataStore.ts` (new)
- `src/screens/Main/BaseTools/ResponseInventoryScreen.tsx`
- `src/screens/Main/BaseTools/LivingLogScreen.tsx`
- `src/screens/Main/BaseTools/InvitationTrackerScreen.tsx`
- All other base tool screens

---

## 4. Oracle Quest Check-in Modal (Requirement ⑫)

### Task Description
"Update Progress" in Oracle quest check-in should open a modal (textarea or emoji picker).

### Technical Implementation
```typescript
// File: src/components/ProgressUpdateModal.tsx
interface ProgressUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (update: ProgressUpdate) => void;
  questTitle: string;
}

interface ProgressUpdate {
  type: 'text' | 'emoji';
  content: string;
  mood?: number;
  notes?: string;
}

const ProgressUpdateModal: React.FC<ProgressUpdateModalProps> = ({
  visible,
  onClose,
  onSubmit,
  questTitle
}) => {
  const [updateType, setUpdateType] = useState<'text' | 'emoji'>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const update: ProgressUpdate = {
      type: updateType,
      content: updateType === 'text' ? textContent : selectedEmoji,
      mood,
      notes: notes.trim() || undefined
    };

    onSubmit(update);
    
    // Reset form
    setTextContent('');
    setSelectedEmoji('');
    setMood(5);
    setNotes('');
    onClose();
  };

  const emojiOptions = ['😊', '😐', '😔', '🤗', '😤', '🎉', '💪', '🙏', '❤️', '✨'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Update Progress</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.questTitle}>{questTitle}</Text>
          
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeButton, updateType === 'text' && styles.activeType]}
              onPress={() => setUpdateType('text')}
            >
              <Text>Text Update</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeButton, updateType === 'emoji' && styles.activeType]}
              onPress={() => setUpdateType('emoji')}
            >
              <Text>Emoji Check-in</Text>
            </TouchableOpacity>
          </View>

          {updateType === 'text' ? (
            <TextInput
              style={styles.textInput}
              placeholder="How are you progressing with this quest?"
              value={textContent}
              onChangeText={setTextContent}
              multiline
              numberOfLines={6}
            />
          ) : (
            <View style={styles.emojiGrid}>
              {emojiOptions.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.selectedEmoji
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.moodSection}>
            <Text style={styles.moodLabel}>Energy Level: {mood}/10</Text>
            <Slider
              value={mood}
              onValueChange={setMood}
              minimumValue={1}
              maximumValue={10}
              step={1}
              style={styles.moodSlider}
            />
          </View>

          <TextInput
            style={styles.notesInput}
            placeholder="Additional notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

// File: src/screens/Main/OracleScreen.tsx
const OracleScreen: React.FC = () => {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);

  const handleUpdateProgress = (update: ProgressUpdate) => {
    if (!currentQuest) return;

    // Save progress update
    dataStore.saveLogEntry({
      type: 'QUEST_PROGRESS',
      content: {
        questId: currentQuest.id,
        questTitle: currentQuest.title,
        update
      },
      userId: getCurrentUserId()
    });

    Toast.show({
      type: 'success',
      text1: 'Progress Updated',
      text2: 'Your quest progress has been saved'
    });
  };

  return (
    <ScrollView>
      {/* ...existing oracle content... */}
      
      <TouchableOpacity 
        style={styles.updateProgressButton}
        onPress={() => {
          setCurrentQuest(getCurrentQuest());
          setShowProgressModal(true);
        }}
      >
        <Text>Update Progress</Text>
      </TouchableOpacity>

      <ProgressUpdateModal
        visible={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onSubmit={handleUpdateProgress}
        questTitle={currentQuest?.title || ''}
      />
    </ScrollView>
  );
};
```
## 5. Progressive Disclosure Wrappers for Frequency Mapper & Calibration Sliders (Requirement ⑬)

### Task Description
Implement progressive disclosure UI wrappers for the Frequency Mapper and Calibration sliders. Advanced options and detailed controls for these features should be hidden by default and only revealed when the user explicitly expands a section (e.g., via a "Show more" button or similar control). This improves clarity for new users while still providing power-user functionality.

### Technical Implementation
- For both Frequency Mapper and Calibration screens, wrap advanced controls or sections (e.g., non-essential sliders, detailed settings, or explanations) in a collapsible/expandable view.
- Use a standard component for collapsible sections (e.g., `Collapsible`, `Accordion`, or a custom implementation) to maintain consistency.
- By default, show only the most essential controls. All advanced options must be accessible via expansion.
- Ensure the expanded/collapsed state is managed per user session (does not need to persist app restarts).
- Maintain accessibility: all controls must be operable by screen readers and keyboard navigation.
- Follow existing code style and structure.

#### Example
```typescript
// Pseudocode for a collapsible section
<CollapsibleSection
  title="Advanced Options"
  initiallyCollapsed={true}
>
  {/* Advanced sliders/components go here */}
</CollapsibleSection>
```

#### Suggested Files to Modify/Create
- `src/screens/Main/FrequencyMapperScreen.tsx`
- `src/screens/Main/CalibrationToolScreen.tsx`
- `src/components/CollapsibleSection.tsx` (new, if one doesn't already exist)

### Acceptance Criteria
- [ ] By default, only core Frequency Mapper and Calibration controls are visible.
- [ ] Users can expand to reveal advanced options/sliders on each screen.
- [ ] Collapsible UI is consistent and accessible.
- [ ] No loss of existing functionality.
- [ ] All new code follows project style and is covered by tests.

---
### Acceptance Criteria
- [ ] "Update Progress" button opens modal
- [ ] Modal includes textarea and emoji picker options
- [ ] Progress entries saved to datastore
- [ ] Modal dismisses after saving
- [ ] Success feedback shown to user

### Files to Create/Modify
- `src/components/ProgressUpdateModal.tsx` (new)
- `src/screens/Main/OracleScreen.tsx`
- `src/types/quest.ts`

---

## Implementation Notes

### Testing Strategy
- Unit tests for all new components
- Integration tests for data saving flows
- UI tests for modal interactions
- E2E tests for complete user journeys

### Performance Considerations
- Implement optimistic UI updates for better perceived performance
- Cache frequently accessed data locally
- Use React.memo for expensive re-renders

### Error Handling
- Graceful degradation when offline
- Retry mechanisms for failed saves
- User-friendly error messages

### Accessibility
- Proper labels for all interactive elements
- Screen reader support for modals
- Keyboard navigation where applicable
