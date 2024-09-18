
import { useEffect } from "react";

/**
 * Custom hook to handle the escape key press event to trigger actions.
 * @param {Array} handlers - An array of objects with `condition` and `action` properties.
 */
export const useEscapeKeyHandler = (handlers) => {
  useEffect(() => {
    
    console.log("Handlers passed to hook:", handlers);

    
    if (!Array.isArray(handlers)) {
      console.error("handlers must be an array");
      return;
    }

    
    handlers.forEach(handler => {
      if (typeof handler.condition !== 'function' || typeof handler.action !== 'function') {
        console.error("Each handler must have a `condition` and `action` function");
      }
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (Array.isArray(handlers)) {
          handlers.forEach(({ condition, action }) => {
            if (condition()) {
              action();
            }
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlers]);
};

