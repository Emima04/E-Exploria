export const DSA_CASES = ["Stack", "Queue", "Hashing", "Recursion", "Searching"] as const;

export type DsaCaseTitle = (typeof DSA_CASES)[number];
export type MissionProgress = Record<DsaCaseTitle, number>;

const STORAGE_KEY = "dsaMissionProgress";
const PROGRESS_EVENT = "dsa-mission-progress-updated";

const EMPTY_PROGRESS: MissionProgress = {
  Stack: 0,
  Queue: 0,
  Hashing: 0,
  Recursion: 0,
  Searching: 0,
};

export function getMissionProgress(): MissionProgress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return { ...EMPTY_PROGRESS, ...(stored || {}) };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function setMissionProgress(title: DsaCaseTitle, progress: number) {
  const next = { ...getMissionProgress(), [title]: Math.max(0, Math.min(100, progress)) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function missionProgressEventName() {
  return PROGRESS_EVENT;
}