import { useRef, useEffect } from 'react';
import { useStore } from 'react-redux';
import castArray from 'lodash/castarray';

// Subscribes to redux store events.
export function useReduxAction(effect: (action: any) => void, type: any, deps = []) {
  const currentValue = useRef(null);
  const store = useStore();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState() as any;
      const { action } = state;
      const previousValue = currentValue.current;
      currentValue.current = action.type;

      if (previousValue !== action.type && castArray(type).includes(action.type)) {
        effect(action);
      }
    });
    return () => unsubscribe();
  }, [...deps, effect, type, store]);
}
