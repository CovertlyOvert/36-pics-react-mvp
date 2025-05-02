
/**
 * Provides haptic feedback if available on the device
 * Falls back gracefully if not supported
 */
export const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  // Check if the vibration API is available
  if (!navigator.vibrate) {
    return false;
  }
  
  // Duration in ms based on intensity
  const durations = {
    light: 10,
    medium: 20,
    heavy: [20, 30, 50] // Pattern for heavier feedback
  };
  
  // Trigger the vibration
  navigator.vibrate(durations[intensity]);
  return true;
};

/**
 * Provides double haptic feedback pattern for special events
 */
export const triggerSuccessHaptic = () => {
  if (!navigator.vibrate) return false;
  
  // Short pause between vibrations
  navigator.vibrate([20, 100, 40]);
  return true;
};

/**
 * Provides error haptic feedback pattern
 */
export const triggerErrorHaptic = () => {
  if (!navigator.vibrate) return false;
  
  // More intense vibration for errors
  navigator.vibrate([40, 30, 40, 30, 40]);
  return true;
};
