export const USER_PROFILE_KEY = 'nexus-academy:user-profile:v1';

const defaultProfile = {
  displayName: '',
  targetExam: '',
  preferredBoard: '',
  dailyQuestionGoal: 20,
  studyNotes: '',
  photoDataUrl: '',
};

function normalizeProfile(value = {}) {
  const dailyQuestionGoal = Number.parseInt(value.dailyQuestionGoal, 10);
  const photoDataUrl = typeof value.photoDataUrl === 'string'
    && /^data:image\/jpeg;base64,/i.test(value.photoDataUrl)
    && value.photoDataUrl.length <= 1_200_000
    ? value.photoDataUrl
    : '';

  return {
    displayName: typeof value.displayName === 'string' ? value.displayName.slice(0, 80) : '',
    targetExam: typeof value.targetExam === 'string' ? value.targetExam.slice(0, 100) : '',
    preferredBoard: typeof value.preferredBoard === 'string' ? value.preferredBoard.slice(0, 80) : '',
    dailyQuestionGoal: Number.isFinite(dailyQuestionGoal) ? Math.min(300, Math.max(1, dailyQuestionGoal)) : defaultProfile.dailyQuestionGoal,
    studyNotes: typeof value.studyNotes === 'string' ? value.studyNotes.slice(0, 280) : '',
    photoDataUrl,
  };
}

export function readUserProfile() {
  if (typeof window === 'undefined') return { ...defaultProfile };
  try {
    const stored = JSON.parse(window.localStorage.getItem(USER_PROFILE_KEY) || '{}');
    return normalizeProfile(stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {});
  } catch {
    return { ...defaultProfile };
  }
}

export function saveUserProfile(profile) {
  const normalized = normalizeProfile(profile);
  window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent('nexus-profile-updated'));
  return normalized;
}

export function getUserInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'N';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
