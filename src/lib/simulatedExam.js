function emptyAllocations(subjects) {
  return Object.fromEntries(subjects.map((subject) => [subject.id, 0]));
}

function questionCount(subject) {
  return Array.isArray(subject?.questions) ? subject.questions.length : 0;
}

export function distributeEvenly(subjects, total, selectedDisciplineIds) {
  const allocations = emptyAllocations(subjects);
  const parsedTotal = Number(total);
  const selectedIds = [...new Set((selectedDisciplineIds || []).map(String))];
  const knownIds = new Set(subjects.map((subject) => String(subject.id)));
  const unknownIds = selectedIds.filter((id) => !knownIds.has(id));
  const selected = subjects.filter((subject) => selectedIds.includes(String(subject.id)));
  const available = selected.reduce((sum, subject) => sum + questionCount(subject), 0);

  if (!Number.isInteger(parsedTotal) || parsedTotal < 1) {
    return { valid: false, reason: 'invalid-total', allocations, available };
  }
  if (unknownIds.length > 0) {
    return { valid: false, reason: 'invalid-discipline', allocations, available };
  }
  if (selected.length === 0) {
    return { valid: false, reason: 'no-disciplines', allocations, available };
  }
  if (parsedTotal > available) {
    return { valid: false, reason: 'not-enough-questions', allocations, available };
  }

  let remaining = parsedTotal;
  let active = [...selected];

  while (remaining > 0 && active.length > 0) {
    const equalRound = Math.floor(remaining / active.length);
    if (equalRound === 0) {
      active.slice(0, remaining).forEach((subject) => { allocations[subject.id] += 1; });
      remaining = 0;
      break;
    }

    const smallestCapacity = Math.min(
      ...active.map((subject) => questionCount(subject) - allocations[subject.id]),
    );
    const amount = Math.min(equalRound, smallestCapacity);
    active.forEach((subject) => { allocations[subject.id] += amount; });
    remaining -= amount * active.length;
    active = active.filter((subject) => allocations[subject.id] < questionCount(subject));
  }

  return { valid: remaining === 0, reason: remaining === 0 ? null : 'not-enough-questions', allocations, available };
}

export function validateCustomQuotas(subjects, total, quotas) {
  const allocations = emptyAllocations(subjects);
  const parsedTotal = Number(total);
  const knownIds = new Set(subjects.map((subject) => String(subject.id)));
  const unknownIds = Object.keys(quotas || {}).filter((id) => !knownIds.has(String(id)));
  const values = subjects.map((subject) => {
    const value = Number(quotas?.[subject.id] ?? 0);
    allocations[subject.id] = value;
    return { subject, value };
  });
  const sum = values.reduce((acc, item) => acc + (Number.isFinite(item.value) ? item.value : 0), 0);
  const available = values.reduce((acc, item) => acc + (item.value > 0 ? questionCount(item.subject) : 0), 0);

  if (!Number.isInteger(parsedTotal) || parsedTotal < 1) {
    return { valid: false, reason: 'invalid-total', allocations, sum, available };
  }
  if (unknownIds.length > 0) {
    return { valid: false, reason: 'invalid-discipline', allocations, sum, available };
  }
  if (values.some(({ value }) => !Number.isInteger(value) || value < 0)) {
    return { valid: false, reason: 'invalid-quantity', allocations, sum, available };
  }
  if (values.some(({ subject, value }) => value > questionCount(subject))) {
    return { valid: false, reason: 'quantity-exceeds-availability', allocations, sum, available };
  }
  if (sum === 0) {
    return { valid: false, reason: 'no-questions', allocations, sum, available };
  }
  if (sum !== parsedTotal) {
    return { valid: false, reason: 'total-mismatch', allocations, sum, available };
  }

  return { valid: true, reason: null, allocations, sum, available };
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const draw = Number(random());
    const safeDraw = Number.isFinite(draw) ? Math.min(0.999999999, Math.max(0, draw)) : 0;
    const otherIndex = Math.floor(safeDraw * (index + 1));
    [result[index], result[otherIndex]] = [result[otherIndex], result[index]];
  }
  return result;
}

function isUsableQuestion(question) {
  return Boolean(
    question
    && question.id !== undefined
    && question.id !== null
    && question.options
    && typeof question.options === 'object'
    && Object.keys(question.options).length > 0
    && question.answer !== undefined
    && Object.prototype.hasOwnProperty.call(question.options, question.answer),
  );
}

export function generateSimulatedExam(subjects, quotas, random = Math.random) {
  const total = subjects.reduce((sum, subject) => sum + Number(quotas?.[subject.id] ?? 0), 0);
  const validation = validateCustomQuotas(subjects, total, quotas);
  if (!validation.valid) throw new RangeError(`Invalid simulated exam configuration: ${validation.reason}`);

  const selected = [];
  for (const subject of subjects) {
    const quota = validation.allocations[subject.id];
    if (quota === 0) continue;

    const usable = subject.questions.filter(isUsableQuestion);
    if (usable.length < quota) {
      throw new RangeError(`Not enough usable questions for ${subject.id}`);
    }

    shuffle(usable, random).slice(0, quota).forEach((question) => {
      selected.push({
        disciplineId: subject.id,
        disciplineName: subject.name,
        question,
      });
    });
  }

  return shuffle(selected, random);
}

export function resolveFinishTiming(completedAt, startedAt, durationMinutes, timed) {
  const finishTimestamp = Number(completedAt);
  const startTimestamp = Number(startedAt);
  const duration = Number(durationMinutes);
  const hasValidStart = startedAt !== null
    && startedAt !== undefined
    && Number.isFinite(startTimestamp);
  const deadline = timed && hasValidStart && Number.isInteger(duration) && duration > 0
    ? startTimestamp + duration * 60_000
    : null;

  if (deadline !== null && finishTimestamp >= deadline) {
    return { finishedAt: deadline, byTimer: true };
  }
  return { finishedAt: finishTimestamp, byTimer: false };
}

export function gradeSimulatedExam(examQuestions, answers) {
  const breakdown = new Map();
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  examQuestions.forEach((entry, index) => {
    const selectedOption = answers?.[index] || '';
    const isAnswered = selectedOption !== '';
    const isCorrect = isAnswered && selectedOption === entry.question.answer;
    if (!isAnswered) unanswered += 1;
    else if (isCorrect) correct += 1;
    else incorrect += 1;

    if (!breakdown.has(entry.disciplineId)) {
      breakdown.set(entry.disciplineId, {
        disciplineId: entry.disciplineId,
        disciplineName: entry.disciplineName,
        total: 0,
        answered: 0,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
      });
    }
    const item = breakdown.get(entry.disciplineId);
    item.total += 1;
    if (!isAnswered) item.unanswered += 1;
    else {
      item.answered += 1;
      if (isCorrect) item.correct += 1;
      else item.incorrect += 1;
    }
  });

  const total = examQuestions.length;
  const answered = total - unanswered;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  return {
    total,
    answered,
    correct,
    incorrect,
    unanswered,
    accuracy,
    grade: total > 0 ? (correct / total) * 10 : 0,
    byDiscipline: [...breakdown.values()].map((item) => ({
      ...item,
      accuracy: item.total > 0 ? (item.correct / item.total) * 100 : 0,
    })),
  };
}
