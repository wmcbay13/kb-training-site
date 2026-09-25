const STORAGE_KEY = 'iron-and-ease-profile-v1';
const COMPLETION_KEY = 'iron-and-ease-completed-v1';
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
const GOAL_LABELS = { strength: 'Build strength', fitness: 'General fitness', mobility: 'Move with ease' };
const EXPERIENCE_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

const SESSION_TEMPLATES = [
  { name: 'The foundation', focus: 'Full body fundamentals', moves: ['halo', 'squat', 'hinge', 'press', 'carry'] },
  { name: 'Steady strength', focus: 'Hinge, pull & carry', moves: ['halo', 'deadlift', 'lunge', 'row', 'curl'] },
  { name: 'Find your rhythm', focus: 'Full body conditioning', moves: ['hinge', 'squat', 'row', 'press', 'curl'] },
  { name: 'Strong & mobile', focus: 'Control & balance', moves: ['halo', 'lunge', 'press', 'deadlift', 'carry'] },
  { name: 'Finish well', focus: 'Strength in motion', moves: ['hinge', 'squat', 'press', 'row', 'carry'] },
];

const EXERCISES = {
  halo: { base: 'Kettlebell halo', alternate: 'Slow kettlebell halo', kind: 'sides' },
  squat: { base: 'Goblet squat', alternate: 'Pause goblet squat', kind: 'reps' },
  hinge: { base: 'Two-hand swing', alternate: 'Dead-stop swing', kind: 'reps' },
  press: { base: 'Single-arm press', alternate: 'Half-kneeling press', kind: 'sides' },
  carry: { base: 'Suitcase carry', alternate: 'Front-rack carry', kind: 'time' },
  deadlift: { base: 'Kettlebell deadlift', alternate: 'Staggered-stance deadlift', kind: 'reps' },
  lunge: { base: 'Reverse lunge', alternate: 'Goblet reverse lunge', kind: 'sides' },
  row: { base: 'Single-arm row', alternate: 'Pause single-arm row', kind: 'sides' },
  curl: { base: 'Kettlebell curl', alternate: 'Hammer-grip curl', kind: 'reps' },
};

function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function utcDate(iso) { return new Date(`${iso}T00:00:00Z`); }
function addDays(iso, days) { return new Date(utcDate(iso).getTime() + days * 86400000); }
function dateLabel(date) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date); }

const DEFAULT_PROFILE = { experience: 'beginner', goal: 'fitness', days: 3, units: 'imperial', heightCm: null, weightKg: null, startDate: localDateString() };

function validNumber(value, min, max) { return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max; }
function normalizeProfile(input) {
  if (!input || typeof input !== 'object') return { ...DEFAULT_PROFILE };
  const startDate = typeof input.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input.startDate) && !Number.isNaN(utcDate(input.startDate).getTime()) ? input.startDate : DEFAULT_PROFILE.startDate;
  return {
    experience: EXPERIENCE_LABELS[input.experience] ? input.experience : DEFAULT_PROFILE.experience,
    goal: GOAL_LABELS[input.goal] ? input.goal : DEFAULT_PROFILE.goal,
    days: [2, 3, 4, 5].includes(Number(input.days)) ? Number(input.days) : DEFAULT_PROFILE.days,
    units: ['imperial', 'metric'].includes(input.units) ? input.units : DEFAULT_PROFILE.units,
    heightCm: validNumber(input.heightCm, 90, 250) ? input.heightCm : null,
    weightKg: validNumber(input.weightKg, 25, 450) ? input.weightKg : null,
    startDate,
  };
}

function readJson(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
let profile = normalizeProfile(readJson(STORAGE_KEY));
let completed = readJson(COMPLETION_KEY);
if (!completed || typeof completed !== 'object' || Array.isArray(completed)) completed = {};
const currentWeek = () => Math.max(1, Math.floor((utcDate(localDateString()).getTime() - utcDate(profile.startDate).getTime()) / MS_PER_WEEK) + 1);
let shownWeek = currentWeek();
let selectedSession = 0;

function prescription(move, week) {
  const levelSets = { beginner: 2, intermediate: 3, advanced: 4 }[profile.experience];
  const recoveryWeek = week % 4 === 0;
  const sets = Math.max(2, Math.min(4, levelSets + (week % 4 === 3 ? 1 : 0) - (recoveryWeek ? 1 : 0)));
  const base = { strength: 6, fitness: 9, mobility: 7 }[profile.goal];
  const reps = recoveryWeek ? Math.max(4, base - 2) : base + (week % 4 === 2 ? 1 : 0);
  if (move.kind === 'time') return `${sets} × ${recoveryWeek ? 20 : profile.goal === 'mobility' ? 25 : 35} sec / side`;
  if (move.kind === 'sides') return `${sets} × ${move === EXERCISES.halo ? (recoveryWeek ? 4 : 5) : reps} / side`;
  return `${sets} × ${reps}`;
}

function movement(id, week, index, sessionIndex) {
  const exercise = EXERCISES[id];
  let name = exercise.base;
  if (index === (week + sessionIndex) % SESSION_TEMPLATES[sessionIndex].moves.length && week > 1) name = exercise.alternate;
  if (profile.experience === 'beginner') {
    if (id === 'hinge' && week <= 2) name = 'Kettlebell deadlift';
    if (id === 'press') name = 'Half-kneeling press';
    if (id === 'lunge') name = 'Supported reverse lunge';
    if (id === 'carry' && name === 'Front-rack carry') name = 'Suitcase carry';
  }
  if (profile.goal === 'mobility') {
    if (id === 'hinge') name = 'Kettlebell deadlift';
    if (id === 'squat') name = 'Pause goblet squat';
    if (id === 'press') name = 'Half-kneeling press';
  }
  if (profile.experience === 'advanced' && id === 'deadlift' && week > 2 && week % 3 === 0) name = 'Single-leg kettlebell deadlift';
  return { name, dose: prescription(exercise, week) };
}

function completedKey(week, index) { return `${profile.startDate}:${week}:${index}`; }
function makeElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent !== undefined) element.textContent = textContent;
  return element;
}

function renderSessions() {
  const container = document.getElementById('sessions');
  container.replaceChildren();
  for (let index = 0; index < profile.days; index++) {
    const session = SESSION_TEMPLATES[index];
    const button = makeElement('button', `session-card${index === selectedSession ? ' active' : ''}${completed[completedKey(shownWeek, index)] ? ' done' : ''}`);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(index === selectedSession));
    button.append(makeElement('span', 'session-number', completed[completedKey(shownWeek, index)] ? '✓' : String(index + 1).padStart(2, '0')));
    const copy = makeElement('span');
    copy.append(makeElement('strong', '', session.name), makeElement('small', '', session.focus));
    button.append(copy, makeElement('span', 'session-arrow', '↗'));
    button.addEventListener('click', () => { selectedSession = index; renderSessions(); renderDetail(); });
    container.append(button);
  }
}

function renderDetail() {
  const session = SESSION_TEMPLATES[selectedSession];
  const detail = document.getElementById('sessionDetail');
  detail.replaceChildren();
  const top = makeElement('div', 'detail-top');
  top.append(makeElement('span', '', `SESSION ${String(selectedSession + 1).padStart(2, '0')} / ${String(profile.days).padStart(2, '0')}`), makeElement('span', '', '25–35 MIN'));
  detail.append(top, makeElement('h3', '', session.name), makeElement('p', 'detail-description', `${session.focus}. Begin with 4 minutes of easy mobility; finish with a gentle cooldown. Rest ${profile.goal === 'strength' ? '75–90' : '45–60'} seconds between sets.`));
  const list = makeElement('ul', 'exercise-list');
  session.moves.forEach((id, index) => {
    const item = makeElement('li');
    const move = movement(id, shownWeek, index, selectedSession);
    item.append(makeElement('span', '', move.name), makeElement('span', '', move.dose));
    list.append(item);
  });
  detail.append(list);
  const note = shownWeek % 4 === 0 ? 'Recovery week: use a comfortable effort and focus on smooth movement.' : profile.experience === 'beginner' ? 'Choose a manageable bell. Learn the hinge before progressing to swings.' : 'Choose a bell that lets you finish every rep with control.';
  detail.append(makeElement('p', 'detail-note', note));
  const button = makeElement('button', 'complete-button', completed[completedKey(shownWeek, selectedSession)] ? '✓ Session complete · undo' : 'Mark session complete');
  button.type = 'button';
  button.addEventListener('click', () => {
    const key = completedKey(shownWeek, selectedSession);
    if (completed[key]) delete completed[key]; else completed[key] = true;
    try { localStorage.setItem(COMPLETION_KEY, JSON.stringify(completed)); } catch { /* Session still updates when storage is unavailable. */ }
    renderSessions(); renderDetail();
  });
  detail.append(button);
}

function renderPlan() {
  selectedSession = Math.min(selectedSession, profile.days - 1);
  const weekStart = addDays(profile.startDate, (shownWeek - 1) * 7);
  const weekEnd = addDays(profile.startDate, shownWeek * 7 - 1);
  document.getElementById('weekLabel').textContent = `WEEK ${String(shownWeek).padStart(2, '0')}`;
  document.getElementById('weekDates').textContent = `${dateLabel(weekStart)} – ${dateLabel(weekEnd)}`;
  document.getElementById('prevWeek').disabled = shownWeek <= 1;
  document.getElementById('planSummary').textContent = `${profile.days} days / week · ${EXPERIENCE_LABELS[profile.experience]} · ${GOAL_LABELS[profile.goal]}`;
  renderSessions(); renderDetail();
}

function writeMeasurements() {
  const units = document.getElementById('units').value;
  document.getElementById('imperialFields').hidden = units !== 'imperial';
  document.getElementById('metricFields').hidden = units !== 'metric';
  if (profile.heightCm !== null) {
    document.getElementById('centimeters').value = Number(profile.heightCm.toFixed(1));
    const totalInches = Math.round(profile.heightCm / 2.54);
    document.getElementById('feet').value = Math.floor(totalInches / 12);
    document.getElementById('inches').value = totalInches % 12;
  }
  if (profile.weightKg !== null) {
    document.getElementById('kilograms').value = Number(profile.weightKg.toFixed(1));
    document.getElementById('pounds').value = Number((profile.weightKg * 2.20462262).toFixed(1));
  }
}

function measurementFromForm() {
  const units = document.getElementById('units').value;
  if (units === 'metric') {
    const cm = document.getElementById('centimeters').value;
    const kg = document.getElementById('kilograms').value;
    return { heightCm: cm === '' ? null : Number(cm), weightKg: kg === '' ? null : Number(kg) };
  }
  const feet = document.getElementById('feet').value;
  const inches = document.getElementById('inches').value;
  const pounds = document.getElementById('pounds').value;
  return { heightCm: feet === '' && inches === '' ? null : ((Number(feet || 0) * 12) + Number(inches || 0)) * 2.54, weightKg: pounds === '' ? null : Number(pounds) / 2.20462262 };
}

function initializeProfileForm() {
  document.getElementById('experience').value = profile.experience;
  document.getElementById('goal').value = profile.goal;
  document.getElementById('days').value = String(profile.days);
  document.getElementById('units').value = profile.units;
  writeMeasurements();
  document.getElementById('units').addEventListener('change', () => {
    const previousUnits = profile.units;
    document.getElementById('units').value = previousUnits;
    const values = measurementFromForm();
    profile = { ...profile, ...values };
    document.getElementById('units').value = previousUnits === 'metric' ? 'imperial' : 'metric';
    profile.units = document.getElementById('units').value;
    writeMeasurements();
  });
  document.getElementById('profileForm').addEventListener('submit', event => {
    event.preventDefault();
    const values = measurementFromForm();
    if ((values.heightCm !== null && !validNumber(values.heightCm, 90, 250)) || (values.weightKg !== null && !validNumber(values.weightKg, 25, 450))) {
      document.getElementById('formMessage').textContent = 'Please check your height and weight entries.';
      return;
    }
    profile = normalizeProfile({ ...profile, ...values, experience: document.getElementById('experience').value, goal: document.getElementById('goal').value, days: Number(document.getElementById('days').value), units: document.getElementById('units').value });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); document.getElementById('formMessage').textContent = 'Saved. Your plan is ready above.'; }
    catch { document.getElementById('formMessage').textContent = 'Plan updated for this visit. Browser storage is unavailable.'; }
    shownWeek = currentWeek(); selectedSession = 0; renderPlan();
  });
}

document.getElementById('prevWeek').addEventListener('click', () => { if (shownWeek > 1) { shownWeek--; selectedSession = 0; renderPlan(); } });
document.getElementById('nextWeek').addEventListener('click', () => { shownWeek++; selectedSession = 0; renderPlan(); });
document.querySelectorAll('.flow-toggle').forEach(button => button.addEventListener('click', () => {
  const list = document.getElementById(button.getAttribute('aria-controls'));
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  list.hidden = expanded;
  button.firstChild.textContent = expanded ? 'View the flow ' : 'Hide the flow ';
}));
document.getElementById('year').textContent = String(new Date().getFullYear());
initializeProfileForm();
renderPlan();
