
/**
 * Provides haptic feedback if available on the device
 * Falls back gracefully if not supported
 */
export const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  // Check if the vibration API is available
  if (!navigator.vibrate) {
    return false;
  }
  
  // Duration in ms based on intensity - more vintage mechanical feel
  const durations = {
    light: 15,
    medium: [20, 10, 10], // Subtle mechanical click pattern
    heavy: [25, 15, 40, 10, 20] // Simulates the winding of film
  };
  
  // Trigger the vibration
  navigator.vibrate(durations[intensity]);
  return true;
};

/**
 * Provides double haptic feedback pattern for special events
 * Simulates a film advance lever
 */
export const triggerSuccessHaptic = () => {
  if (!navigator.vibrate) return false;
  
  // Film advance lever feel
  navigator.vibrate([20, 80, 40, 20, 60]);
  return true;
};

/**
 * Provides error haptic feedback pattern
 * Simulates a jammed film advance
 */
export const triggerErrorHaptic = () => {
  if (!navigator.vibrate) return false;
  
  // More intense vibration for errors - feels like a jammed mechanism
  navigator.vibrate([40, 30, 70, 30, 40]);
  return true;
};
