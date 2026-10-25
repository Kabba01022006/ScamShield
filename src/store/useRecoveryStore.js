/**
 * useRecoveryStore.js
 * 
 * Zustand store with localStorage persistence for Emergency Cyber Fraud Recovery.
 * Tracks:
 * - Golden Hour checklist completed steps (1..6)
 * - Incident response start timestamp
 * - Complaint draft form state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecoveryStore = create(
  persist(
    (set) => ({
      // State
      startedAt: null, // timestamp in ms when recovery was started
      completedSteps: [], // array of step IDs (numbers: 1..6)
      draft: null, // last complaint form values

      // Actions
      startRecovery: () =>
        set((state) => {
          if (state.startedAt) return state;
          return { startedAt: Date.now() };
        }),

      toggleStep: (stepId) =>
        set((state) => {
          const exists = state.completedSteps.includes(stepId);
          const nextCompleted = exists
            ? state.completedSteps.filter((id) => id !== stepId)
            : [...state.completedSteps, stepId];
          
          const nextStartedAt = state.startedAt || Date.now();

          return {
            completedSteps: nextCompleted,
            startedAt: nextStartedAt,
          };
        }),

      resetProgress: () =>
        set(() => ({
          completedSteps: [],
        })),

      saveDraft: (values) =>
        set(() => ({
          draft: values,
        })),

      clearDraft: () =>
        set(() => ({
          draft: null,
        })),

      resetRecovery: () =>
        set(() => ({
          startedAt: null,
          completedSteps: [],
          draft: null,
        })),
    }),
    {
      name: 'scamshield_recovery_v2',
    }
  )
);
