import React from 'react';

// Debugging utility for dialog issues
export const debugDialog = {
  logRender: (componentName: string, reason?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔄 [${timestamp}] ${componentName} rendered${reason ? ` - ${reason}` : ''}`);
  },
  
  logStateChange: (componentName: string, stateName: string, oldValue: any, newValue: any) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📝 [${timestamp}] ${componentName} - ${stateName} changed:`, { from: oldValue, to: newValue });
  },
  
  logDialogOpen: (dialogName: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📖 [${timestamp}] Dialog opened: ${dialogName}`);
  },
  
  logDialogClose: (dialogName: string, reason?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📕 [${timestamp}] Dialog closed: ${dialogName}${reason ? ` - ${reason}` : ''}`);
  },
  
  logEffect: (componentName: string, effectName: string, dependencies: any[]) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`⚡ [${timestamp}] ${componentName} - ${effectName} effect triggered:`, dependencies);
  },
  
  logHookCall: (hookName: string, componentName: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🪝 [${timestamp}] ${hookName} called in ${componentName}`);
  }
};

// Hook to track re-renders
export const useRenderTracker = (componentName: string) => {
  const renderCount = React.useRef(0);
  const lastRenderTime = React.useRef(Date.now());
  
  React.useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;
    
    if (renderCount.current > 1) {
      debugDialog.logRender(componentName, `Render #${renderCount.current} (${timeSinceLastRender}ms since last)`);
    }
  });
  
  return renderCount.current;
};

// Check for any running intervals or timeouts
export const checkForTimers = () => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`⏰ [${timestamp}] Checking for active timers...`);
  
  // Check if there are any active intervals
  const highestTimeoutId = setTimeout(() => {}, 0);
  clearTimeout(highestTimeoutId);
  
  if (highestTimeoutId > 100) {
    console.warn(`⚠️ [${timestamp}] Many active timers detected (highest ID: ${highestTimeoutId})`);
  }
  
  // Check for React DevTools if available
  if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log(`🔧 [${timestamp}] React DevTools detected`);
  }
};

export default debugDialog;
