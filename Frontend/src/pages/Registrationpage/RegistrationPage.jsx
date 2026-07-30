import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import CompanyLogo from './CompanyLogo';
import './RegistrationPage.css';

/* ─── DATA ─── */
const FIELD_OPTIONS = [
  'Computer Science & Engineering',
  'Data Science & Artificial Intelligence',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration / Management',
  'Other'
];
const YEAR_OPTIONS = [
  '1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate / Alumni'
];
const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES_LIST = ['00', '15', '30', '45'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const ITEM_HEIGHT = 44;

/* ══════════════════════════════════════════════
   SearchableSelect — Custom dropdown with search
══════════════════════════════════════════════ */
function SearchableSelect({ id, name, value, onChange, onBlur, options, placeholder, icon, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() =>
    options.filter(o => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    onBlur && onBlur({ target: { name, value: opt } });
    setOpen(false);
    setQuery('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setOpen(v => !v);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  return (
    <div className="ss-wrapper" ref={wrapRef}>
      {/* Trigger */}
      <div
        className={`ss-trigger ${open ? 'ss-open' : ''} ${value ? 'ss-has-value' : ''} ${disabled ? 'ss-disabled' : ''}`}
        onClick={handleToggle}
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
      >
        {icon && <span className="ss-icon">{icon}</span>}
        <span className={`ss-value-text ${value ? 'filled' : 'placeholder'}`}>
          {value || placeholder}
        </span>
        <svg className={`ss-chevron ${open ? 'rotate' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Dropdown panel */}
      <div className={`ss-dropdown ${open ? 'ss-dropdown-open' : ''}`}>
        {/* Search bar */}
        <div className="ss-search-bar">
          <svg className="ss-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="ss-search-input"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
          {query && (
            <button className="ss-clear-search" onClick={() => setQuery('')} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Options list */}
        <div className="ss-options-list">
          {filtered.length === 0 ? (
            <div className="ss-no-results">No results found</div>
          ) : (
            filtered.map(opt => (
              <div
                key={opt}
                className={`ss-option ${value === opt ? 'ss-option-selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                <span>{opt}</span>
                {value === opt && (
                  <svg className="ss-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ScrollDrum — iOS-style scroll drum column
══════════════════════════════════════════════ */
function ScrollDrum({ items, selected, onSelect, label }) {
  const containerRef = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const idx = items.indexOf(selected);
    if (idx === -1 || !containerRef.current) return;
    containerRef.current.scrollTop = idx * ITEM_HEIGHT;
  }, [selected, items]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const scrollTop = containerRef.current.scrollTop;
      const idx = Math.round(scrollTop / ITEM_HEIGHT);
      const snappedIdx = Math.max(0, Math.min(idx, items.length - 1));
      containerRef.current.scrollTop = snappedIdx * ITEM_HEIGHT;
      onSelect(items[snappedIdx]);
    }, 120);
  }, [items, onSelect]);

  return (
    <div className="drum-column">
      <div className="drum-wrapper">
        <div className="drum-fade drum-fade-top" />
        <div className="drum-highlight-band" />
        <div className="drum-fade drum-fade-bottom" />
        <div className="drum-scroll-track" ref={containerRef} onScroll={handleScroll}>
          <div className="drum-spacer" />
          {items.map((item) => (
            <div
              key={item}
              className={`drum-item ${selected === item ? 'drum-item-selected' : ''}`}
              onClick={() => {
                onSelect(item);
                const idx = items.indexOf(item);
                if (containerRef.current)
                  containerRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
              }}
            >
              {item}
            </div>
          ))}
          <div className="drum-spacer" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Main Registration Page
══════════════════════════════════════════════ */
export default function RegistrationPage({ onSuccess }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [formData, setFormData] = useState({
    fullName: '', mobile: '', email: '',
    fieldOfStudy: '', yearOfStudy: '', demoSlot: ''
  });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');

  const [showCalendar, setShowCalendar]   = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [selectedDate, setSelectedDate]   = useState('');
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [selectedHour, setSelectedHour]   = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [timeConfirmed, setTimeConfirmed] = useState(false);

  /* Calendar grid */
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < firstDayIndex; i++) arr.push(null);
    for (let d = 1; d <= totalDays; d++) arr.push(d);
    return arr;
  }, [calYear, calMonth]);

  const isPastDay = (d) => {
    if (!d) return false;
    const date = new Date(calYear, calMonth, d);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  /* Prevent navigating to past months */
  const canGoPrev = !(calYear === today.getFullYear() && calMonth === today.getMonth());

  const validateField = (name, value) => {
    if (!value || value.trim() === '') return 'This field is required';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return 'Please enter a valid email address';
    if (name === 'mobile' && !/^[0-9]{10}$/.test(value.trim()))
      return 'Mobile number must be exactly 10 digits';
    return '';
  };


  const isFieldValid = (name) => formData[name] && !validateField(name, formData[name]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setDuplicateError('');
    if (touched[name]) setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleDayClick = (day) => {
    if (!day || isPastDay(day)) return;
    const dateObj = new Date(calYear, calMonth, day);
    const display = dateObj.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
    setSelectedDate(display);
    setSelectedDateObj(dateObj);
    setTimeConfirmed(false);
    setShowCalendar(false);
    setShowTimePicker(true);
    setFormData(p => ({ ...p, demoSlot: '' }));
    setTouched(p => ({ ...p, demoSlot: false }));
  };

  const confirmTime = () => {
    const slot = `${selectedDate} @ ${selectedHour}:${selectedMinute} hrs`;
    setFormData(p => ({ ...p, demoSlot: slot }));
    setTouched(p => ({ ...p, demoSlot: true }));
    setErrors(p => ({ ...p, demoSlot: '' }));
    setTimeConfirmed(true);
    setShowTimePicker(false);
  };

  const checkDuplicate = (email, mobile) => {
    try {
      const existing = JSON.parse(localStorage.getItem('aspire_registrations') || '[]');
      if (existing.some(r => r.email.toLowerCase() === email.toLowerCase()))
        return 'This email address is already registered.';
      if (existing.some(r => r.mobile === mobile))
        return 'This mobile number is already registered.';
    } catch (_) {}
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;
    const allTouched = {};
    Object.keys(formData).forEach(k => {
      allTouched[k] = true;
      const err = validateField(k, formData[k]);
      if (err) { newErrors[k] = err; hasErrors = true; }
    });
    setTouched(allTouched);
    setErrors(newErrors);
    if (hasErrors) return;
    const dupErr = checkDuplicate(formData.email.trim(), formData.mobile.trim());
    if (dupErr) { setDuplicateError(dupErr); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      const regId = 'ASP-' + Math.floor(100000 + Math.random() * 900000);
      const record = { ...formData, registrationId: regId, submittedAt: new Date().toISOString() };
      try {
        const existing = JSON.parse(localStorage.getItem('aspire_registrations') || '[]');
        existing.push(record);
        localStorage.setItem('aspire_registrations', JSON.stringify(existing));
      } catch (_) {}
      setIsSubmitting(false);
      if (onSuccess) onSuccess(record);
    }, 1500);
  };

  const prevMonth = () => {
    if (!canGoPrev) return;
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const resetSlot = () => {
    setSelectedDate(''); setSelectedDateObj(null);
    setSelectedHour('09'); setSelectedMinute('00');
    setTimeConfirmed(false);
    setFormData(p => ({ ...p, demoSlot: '' }));
    setShowCalendar(false); setShowTimePicker(false);
  };

  /* SVG icons for SearchableSelect */
  const iconUser  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const iconCal   = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

  return (
    <div className="registration-page-bg">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      <div className="registration-card-wrapper">
        {/* Brand Header */}
        <div className="form-brand-header">
          <div className="company-logo-container">
            <CompanyLogo width={72} height={72} />
          </div>
          <div className="company-brand-title">AspireNext Edu Tech</div>
          <h1 className="form-main-title">Reserve Your Free Demo</h1>
          <p className="form-main-subtitle">Pick a date and time below — your session slot is saved instantly.</p>
        </div>

        {duplicateError && (
          <div className="alert-banner alert-warning">
            <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{duplicateError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form" noValidate>

          {/* Full Name */}
          <div className={`form-group ${errors.fullName && touched.fullName ? 'has-error' : ''} ${isFieldValid('fullName') ? 'is-valid' : ''}`}>
            <label htmlFor="fullName" className="form-label">Full Name <span className="required-star">*</span></label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input type="text" id="fullName" name="fullName" value={formData.fullName}
                onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Rahul Sharma"
                disabled={isSubmitting} className="form-input" />
              {isFieldValid('fullName') && <svg className="valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            {errors.fullName && touched.fullName && <div className="field-error"><svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>{errors.fullName}</span></div>}
          </div>

          {/* Mobile & Email */}
          <div className="form-row">
            <div className={`form-group ${errors.mobile && touched.mobile ? 'has-error' : ''} ${isFieldValid('mobile') ? 'is-valid' : ''}`}>
              <label htmlFor="mobile" className="form-label">Mobile Number <span className="required-star">*</span></label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
                <input type="tel" id="mobile" name="mobile" value={formData.mobile}
                  onChange={handleChange} onBlur={handleBlur} maxLength={10}
                  placeholder="10-digit number" disabled={isSubmitting} className="form-input" />
                {isFieldValid('mobile') && <svg className="valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              {errors.mobile && touched.mobile && <div className="field-error"><svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>{errors.mobile}</span></div>}
            </div>
            <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''} ${isFieldValid('email') ? 'is-valid' : ''}`}>
              <label htmlFor="email" className="form-label">Email Address <span className="required-star">*</span></label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input type="email" id="email" name="email" value={formData.email}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="name@example.com" disabled={isSubmitting} className="form-input" />
                {isFieldValid('email') && <svg className="valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              {errors.email && touched.email && <div className="field-error"><svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>{errors.email}</span></div>}
            </div>
          </div>

          {/* Field & Year of Study — Searchable Dropdowns */}
          <div className="form-row">
            <div className={`form-group ${errors.fieldOfStudy && touched.fieldOfStudy ? 'has-error' : ''} ${isFieldValid('fieldOfStudy') ? 'is-valid' : ''}`}>
              <label className="form-label">Field of Study <span className="required-star">*</span></label>
              <SearchableSelect
                id="fieldOfStudy" name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange} onBlur={handleBlur}
                options={FIELD_OPTIONS}
                placeholder="Select your stream"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
                disabled={isSubmitting}
              />
              {errors.fieldOfStudy && touched.fieldOfStudy && <div className="field-error"><svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>{errors.fieldOfStudy}</span></div>}
            </div>
            <div className={`form-group ${errors.yearOfStudy && touched.yearOfStudy ? 'has-error' : ''} ${isFieldValid('yearOfStudy') ? 'is-valid' : ''}`}>
              <label className="form-label">Year of Study <span className="required-star">*</span></label>
              <SearchableSelect
                id="yearOfStudy" name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange} onBlur={handleBlur}
                options={YEAR_OPTIONS}
                placeholder="Select current year"
                icon={iconCal}
                disabled={isSubmitting}
              />
              {errors.yearOfStudy && touched.yearOfStudy && <div className="field-error"><svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>{errors.yearOfStudy}</span></div>}
            </div>
          </div>

          {/* ── DEMO SLOT SECTION ── */}
          <div className="slot-section-wrapper">
            <div className="slot-section-label">Demo Booking Slot <span className="required-star">*</span></div>

            {/* DATE TRIGGER */}
            <div
              className={`slot-input-field ${showCalendar ? 'is-focused' : ''} ${selectedDate ? 'has-value' : ''}`}
              onClick={() => { setShowCalendar(v => !v); setShowTimePicker(false); }}
            >
              <svg className="slot-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className={`slot-field-text ${selectedDate ? 'filled' : 'placeholder'}`}>
                {selectedDate || 'Select Date'}
              </span>
              {selectedDate
                ? <svg className="slot-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg className="slot-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={showCalendar ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
              }
            </div>

            {/* INLINE CALENDAR */}
            <div className={`inline-calendar ${showCalendar ? 'cal-open' : 'cal-closed'}`}>
              {/* Clean white header */}
              <div className="cal-month-nav">
                <button type="button"
                  className={`cal-nav-btn ${!canGoPrev ? 'cal-nav-disabled' : ''}`}
                  onClick={prevMonth} disabled={!canGoPrev}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <span className="cal-month-label">{MONTH_NAMES[calMonth]} {calYear}</span>
                <button type="button" className="cal-nav-btn" onClick={nextMonth}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
              <div className="cal-weekdays">
                {WEEKDAYS.map(w => <span key={w} className="cal-wd">{w}</span>)}
              </div>
              <div className="cal-days-grid">
                {calendarDays.map((d, i) => {
                  if (!d) return <div key={`e-${i}`} />;
                  const past = isPastDay(d);
                  const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  const isSel = selectedDateObj && d === selectedDateObj.getDate() && calMonth === selectedDateObj.getMonth() && calYear === selectedDateObj.getFullYear();
                  return (
                    <button key={d} type="button"
                      className={`cal-day ${past ? 'cal-day-past' : ''} ${isToday ? 'today' : ''} ${isSel ? 'selected' : ''}`}
                      onClick={() => handleDayClick(d)}
                      disabled={past}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* TIME TRIGGER */}
            {selectedDate && (
              <>
                <div
                  className={`slot-input-field slot-time-field ${showTimePicker ? 'is-focused' : ''} ${timeConfirmed ? 'has-value' : ''}`}
                  onClick={() => { setShowTimePicker(v => !v); setShowCalendar(false); }}
                >
                  <svg className="slot-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className={`slot-field-text ${timeConfirmed ? 'filled' : 'placeholder'}`}>
                    {timeConfirmed ? `${selectedHour}:${selectedMinute} hrs` : 'Select Time'}
                  </span>
                  {timeConfirmed
                    ? <svg className="slot-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg className="slot-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={showTimePicker ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
                  }
                </div>

                {/* SCROLL DRUM TIME PICKER */}
                <div className={`inline-time-picker ${showTimePicker ? 'time-open' : 'time-closed'}`}>
                  <div className="drum-picker-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Scroll to pick time</span>
                  </div>

                  {/* Labels row — outside the masked area */}
                  <div className="drum-labels-row">
                    <span className="drum-col-label">Hour (24h)</span>
                    <span className="drum-col-spacer" />
                    <span className="drum-col-label">Min</span>
                  </div>

                  {/* Drums row — masked + shared band here */}
                  <div className="drum-scrollers-row">
                    <ScrollDrum items={HOURS_24} selected={selectedHour} onSelect={setSelectedHour} label={null} />
                    <div className="drum-colon">:</div>
                    <ScrollDrum items={MINUTES_LIST} selected={selectedMinute} onSelect={setSelectedMinute} label={null} />
                  </div>

                  {/* Footer */}
                  <div className="drum-picker-footer">
                    <div className="drum-time-preview">
                      <span className="preview-time">{selectedHour}:{selectedMinute}</span>
                      <span className="preview-hrs">hrs</span>
                    </div>
                    <button type="button" className="drum-confirm-btn" onClick={confirmTime}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Confirm Time
                    </button>
                  </div>
                </div>
              </>
            )}

            {errors.demoSlot && touched.demoSlot && !formData.demoSlot && (
              <div className="field-error" style={{ marginTop: '0.35rem' }}>
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{errors.demoSlot}</span>
              </div>
            )}

            {formData.demoSlot && (
              <div className="slot-confirmed-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span><strong>Demo Slot:</strong> {formData.demoSlot}</span>
                <button type="button" className="slot-clear-btn" onClick={resetSlot}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            <div className="btn-shimmer-sweep" />
            {isSubmitting ? (
              <div className="btn-loading-content">
                <svg className="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10"/>
                </svg>
                <span>Securing Your Slot...</span>
              </div>
            ) : (
              <div className="btn-content">
                <span>Confirm Demo Booking</span>
                <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
