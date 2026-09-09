"use client";

import { useCallback, useReducer } from "react";

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Action<T> =
  | { type: "set"; payload: T; replace?: boolean }
  | { type: "undo" }
  | { type: "redo" };

function reducer<T>(state: HistoryState<T>, action: Action<T>): HistoryState<T> {
  switch (action.type) {
    case "set": {
      if (action.replace) {
        return { ...state, present: action.payload };
      }
      return {
        past: [...state.past, state.present].slice(-50),
        present: action.payload,
        future: [],
      };
    }
    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    default:
      return state;
  }
}

export function useEditorHistory<T>(initial: T) {
  const [state, dispatch] = useReducer(reducer<T>, {
    past: [],
    present: initial,
    future: [],
  });

  const set = useCallback((value: T, replace = false) => {
    dispatch({ type: "set", payload: value, replace });
  }, []);

  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    dirty: state.past.length > 0,
  };
}
