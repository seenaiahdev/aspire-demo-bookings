/**
 * RegistrationPage.jsx — Demo Booking Form
 * Centered card: left logo+title panel, right compact form with floating date/time popup.
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import logoImg from '../../assets/Logo_f8hqc0.jpg';
import heroImg from '../../assets/hero_illustration.jpg';
import { registerDemoBooking } from '../../services/api';
import './RegistrationPage.css';

const FIELD_OPTIONS = [
  'B.Tech / B.E',
  'M.Tech / M.E',
  'BCA / MCA',
  'Degree (B.Sc, B.Com)',
  'Others'
];

const YEAR_OPTIONS_MAP = {
  'B.Tech / B.E':          ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Completed'],
  'M.Tech / M.E':          ['1st Year', '2nd Year', 'Completed'],
  'BCA / MCA':             ['1st Year', '2nd Year', '3rd Year', 'Completed'],
  'Degree (B.Sc, B.Com)':  ['1st Year', '2nd Year', '3rd Year', 'Completed'],
  'Others':                ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Completed'],
};
const DEMO_HOURS   = ['09', '10', '11', '12', '01', '02', '03', '04'];
const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const ITEM_HEIGHT  = 44;

function getUpcomingSlot(now = new Date()) {
  const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const hours = now.getHours();
  const minutes = now.getMinutes();

  let targetDay; // 3 = Wed, 0 = Sun

  const isAfterSun5PM = (day === 0 && (hours > 17 || (hours === 17 && minutes >= 0)));
  const isBeforeWed5PM = (day === 3 && (hours < 17 || (hours === 17 && minutes === 0)));
  const isMonOrTue = (day === 1 || day === 2);

  if (isAfterSun5PM || isMonOrTue || isBeforeWed5PM) {
    targetDay = 3; // Wednesday
  } else {
    targetDay = 0; // Sunday
  }

  const targetDate = new Date(now);
  let daysToAdd = (targetDay - day + 7) % 7;

  targetDate.setDate(now.getDate() + daysToAdd);
  targetDate.setHours(17, 0, 0, 0);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = weekdays[targetDate.getDay()];
  const dayNum = targetDate.getDate();
  const monthName = months[targetDate.getMonth()];
  const yearNum = targetDate.getFullYear();

  return `${dayName}, ${dayNum} ${monthName} ${yearNum} — 5:00 PM`;
}


/* ── Searchable Dropdown ── */
function SearchableSelect({ id, name, value, onChange, onBlur, options, placeholder, icon, disabled, openUp }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef  = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() =>
    options.filter(o => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    onBlur && onBlur({ target: { name, value: opt } });
    setOpen(false); setQuery('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setOpen(v => !v);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  return (
    <div className="ss-wrapper" ref={wrapRef}>
      <div
        className={`ss-trigger ${open ? 'ss-open' : ''} ${value ? 'ss-has-value' : ''} ${disabled ? 'ss-disabled' : ''}`}
        onClick={handleToggle} tabIndex={0}
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
      <div className={`ss-dropdown ${open ? 'ss-dropdown-open' : ''} ${openUp ? 'ss-dropdown-up' : ''}`}>
        <div className="ss-search-bar">
          <svg className="ss-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input ref={inputRef} type="text" className="ss-search-input" placeholder="Search..."
            value={query} onChange={e => setQuery(e.target.value)} onClick={e => e.stopPropagation()}
          />
          {query && (
            <button className="ss-clear-search" onClick={() => setQuery('')} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        <div className="ss-options-list">
          {filtered.length === 0
            ? <div className="ss-no-results">No results found</div>
            : filtered.map(opt => (
              <div key={opt} className={`ss-option ${value === opt ? 'ss-option-selected' : ''}`} onClick={() => handleSelect(opt)}>
                <span>{opt}</span>
                {value === opt && (
                  <svg className="ss-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

/* ── Custom Simple Dropdown for Demo Slot ── */
function SlotDropdown({ value, onChange, slotOption }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  return (
    <div className="ss-wrapper" ref={ref}>
      <div
        className={`ss-trigger ${open ? 'ss-open' : ''} ${value ? 'ss-has-value' : ''}`}
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
      >
        <span className="ss-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </span>
        <span className={`ss-value-text ${value ? 'filled' : 'placeholder'}`} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
          {value || 'Select a slot...'}
        </span>
        <svg className={`ss-chevron ${open ? 'rotate' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className={`ss-dropdown ${open ? 'ss-dropdown-open' : ''} ss-dropdown-up`}>
        <div className="ss-options-list" style={{ padding: '4px 0' }}>
          <div
            className={`ss-option ${value === slotOption ? 'ss-option-selected' : ''}`}
            onClick={() => {
              onChange({ target: { name: 'demoSlot', value: slotOption } });
              setOpen(false);
            }}
            style={{ padding: '10px 12px', fontSize: '0.82rem', whiteSpace: 'normal', wordBreak: 'break-word', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
          >
            <span style={{ flex: 1, whiteSpace: 'normal' }}>{slotOption}</span>
            {value === slotOption && (
              <svg className="ss-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginLeft: '8px' }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Scroll Drum ── */
function ScrollDrum({ items, selected, onSelect }) {
  const containerRef = useRef(null);
  const scrollTimer  = useRef(null);
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = items.indexOf(selected); return idx !== -1 ? idx : 0;
  });

  useEffect(() => {
    const idx = items.indexOf(selected);
    if (idx !== -1) { setActiveIndex(idx); if (containerRef.current) containerRef.current.scrollTop = idx * ITEM_HEIGHT; }
  }, [selected, items]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const idx = Math.round(containerRef.current.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    setActiveIndex(clamped);
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => onSelect(items[clamped]), 80);
  }, [items, onSelect]);

  return (
    <div className="drum-column">
      <div className="drum-wrapper">
        <div className="drum-fade drum-fade-top"/>
        <div className="drum-highlight-band"/>
        <div className="drum-fade drum-fade-bottom"/>
        <div className="drum-scroll-track" ref={containerRef} onScroll={handleScroll}>
          <div className="drum-spacer"/>
          {items.map((item, idx) => (
            <div key={item}
              className={`drum-item ${activeIndex === idx ? 'drum-item-selected' : ''}`}
              onClick={() => { setActiveIndex(idx); onSelect(item); containerRef.current?.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' }); }}
            >{item}</div>
          ))}
          <div className="drum-spacer"/>
        </div>
      </div>
    </div>
  );
}

/* ── Floating Date+Time Popup ── */
function SlotPopup({ onClose, onConfirm }) {
  const overlayRef = useRef(null);

  const dateOptions = useMemo(() => {
    const now = new Date();
    const isAfter4PM = now.getHours() >= 16;
    const startOffset = isAfter4PM ? 1 : 0;
    
    return [0, 1].map(i => {
       const d = new Date();
       d.setDate(d.getDate() + startOffset + i);
       
       let prefix = '';
       const offset = startOffset + i;
       if (offset === 0) prefix = 'Today, ';
       else if (offset === 1) prefix = 'Tomorrow, ';
       
       return { 
         dateObj: d, 
         label: prefix + d.toLocaleDateString('en-IN', { day:'numeric', month:'short' })
       };
    });
  }, []);

  const [selectedDateObj, setSelectedDateObj] = useState(dateOptions[0].dateObj);
  const [selectedHour, setSelectedHour] = useState('10');

  const availableHours = useMemo(() => {
    const isToday = selectedDateObj.getDate() === new Date().getDate() && selectedDateObj.getMonth() === new Date().getMonth();
    const currentHour = new Date().getHours();
    
    const all = [
      { val: '09', hr24: 9 }, { val: '10', hr24: 10 }, { val: '11', hr24: 11 },
      { val: '12', hr24: 12 }, { val: '01', hr24: 13 }, { val: '02', hr24: 14 },
      { val: '03', hr24: 15 }, { val: '04', hr24: 16 }
    ];

    if (isToday && currentHour >= 8) { // if it's 8:30 AM, 9 AM is available
      return all.filter(h => h.hr24 > currentHour).map(h => h.val);
    }
    return all.map(h => h.val);
  }, [selectedDateObj]);

  useEffect(() => {
    if (availableHours.length > 0 && !availableHours.includes(selectedHour)) {
      setSelectedHour(availableHours[0]);
    }
  }, [availableHours, selectedHour]);

  // Auto-calculate AM/PM based on restricted hours
  const isAM = ['09', '10', '11'].includes(selectedHour);
  const selectedPeriod = isAM ? 'AM' : 'PM';

  const handleConfirm = () => {
    const dateStr = selectedDateObj.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
    const slot = `${dateStr} @ ${selectedHour}:00 ${selectedPeriod}`;
    onConfirm(slot);
  };

  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) onClose(); };

  return (
    <div className="slot-popup-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="slot-popup-card">
        <div className="slot-popup-header">
          <div className="slot-popup-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Pick Date & Time
          </div>
          <button className="slot-popup-close" onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="slot-popup-body" style={{ padding: '1.25rem' }}>
          
          <div className="sp-date-chips" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {dateOptions.map((opt, i) => {
              const isSel = selectedDateObj.getTime() === opt.dateObj.getTime();
              return (
                <button 
                  key={i} type="button" 
                  onClick={() => setSelectedDateObj(opt.dateObj)}
                  className={`sp-date-btn ${isSel ? 'selected' : ''}`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          <div className="drum-labels-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <span className="drum-col-label">Hour</span>
            <span className="drum-col-label">AM/PM</span>
          </div>
          <div className="drum-scrollers-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <ScrollDrum items={availableHours} selected={selectedHour} onSelect={setSelectedHour}/>
            
            {/* Read-only period block for visual balance */}
            <div className="drum-column drum-readonly" style={{ cursor: 'default' }}>
              <div className="drum-wrapper">
                 <div className="drum-scroll-track" style={{ overflow: 'hidden' }}>
                    <div className="drum-spacer"/>
                    <div className="drum-item drum-item-selected" style={{ color: 'var(--blue-600)', transform: 'none' }}>{selectedPeriod}</div>
                    <div className="drum-spacer"/>
                 </div>
              </div>
            </div>
          </div>

          <div className="drum-picker-footer" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-100)' }}>
            <div className="drum-time-preview">
              <span className="preview-time">{selectedHour}:00</span>
              <span className="preview-period">{selectedPeriod}</span>
            </div>
            <button type="button" className="drum-confirm-btn" onClick={handleConfirm}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Confirm Slot
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function RegistrationPage({ onSuccess }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const [formData, setFormData]             = useState(() => ({
    fullName: '',
    mobile: '',
    email: '',
    fieldOfStudy: '',
    yearOfStudy: '',
    demoSlot: getUpcomingSlot()
  }));
  const [errors, setErrors]                 = useState({});
  const [touched, setTouched]               = useState({});
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const [isShaking, setIsShaking]           = useState(false);
  const [showSlotPopup, setShowSlotPopup]   = useState(false);
  const [termsAccepted, setTermsAccepted]   = useState(false);
  const [termsError, setTermsError]         = useState(false);

  const triggerShake = () => { setIsShaking(true); setTimeout(() => setIsShaking(false), 500); };

  // Dynamic year options based on selected stream
  const yearOptions = useMemo(() => {
    return YEAR_OPTIONS_MAP[formData.fieldOfStudy] || [];
  }, [formData.fieldOfStudy]);

  // Auto-reset yearOfStudy when stream changes and current selection is no longer valid
  useEffect(() => {
    const isOtherStream = formData.fieldOfStudy === 'Others';
    if (!isOtherStream && formData.yearOfStudy && yearOptions.length > 0 && !yearOptions.includes(formData.yearOfStudy)) {
      setFormData(p => ({ ...p, yearOfStudy: '' }));
      setErrors(p => ({ ...p, yearOfStudy: '' }));
      setTouched(p => ({ ...p, yearOfStudy: false }));
    }
  }, [yearOptions, formData.yearOfStudy, formData.fieldOfStudy]);

  const validateField = (name, value) => {
    if (!value || value.trim() === '') return 'Required';
    if (name === 'email'  && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Invalid email';
    if (name === 'mobile') {
      const val = value.trim();
      if (!/^\d+$/.test(val)) return 'Numbers only';
      if (val.length !== 10) return 'Must be 10 digits';
      if (!/^[6-9]/.test(val)) return 'Enter valid mobile number';
    }
    return '';
  };

  const isFieldValid = n => Boolean(formData[n]) && !errors[n] && !validateField(n, formData[n]);

  const handleBlur   = e => { const {name,value}=e.target; setTouched(p=>({...p,[name]:true})); setErrors(p=>({...p,[name]:validateField(name,value)})); };
  const handleChange = e => {
    const {name,value}=e.target;
    // When stream changes, if it is changed to Others, clear the yearOfStudy so they can type
    if (name === 'fieldOfStudy') {
      setFormData(p=>({...p, fieldOfStudy: value, yearOfStudy: ''}));
      setErrors(p=>({...p, fieldOfStudy: validateField(name, value), yearOfStudy: ''}));
      setTouched(p=>({...p, fieldOfStudy: true, yearOfStudy: false}));
      return;
    }
    setFormData(p=>({...p,[name]:value})); setDuplicateError(''); setTouched(p=>({...p,[name]:true})); setErrors(p=>({...p,[name]:validateField(name,value)}));
  };

  const handleSlotConfirm = (slot) => {
    setFormData(p => ({...p, demoSlot: slot}));
    setTouched(p => ({...p, demoSlot: true}));
    setErrors(p => ({...p, demoSlot: ''}));
    setShowSlotPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {}; 
    let hasErrors = false; 
    let firstErrorField = null;

    // Define correct sequential order of fields
    const fieldOrder = ['fullName', 'mobile', 'email', 'fieldOfStudy', 'yearOfStudy', 'demoSlot'];
    
    fieldOrder.forEach(k => {
      const err = validateField(k, formData[k]);
      if (err) { 
        newErrors[k] = err; 
        hasErrors = true; 
        if (!firstErrorField) firstErrorField = k;
      }
    });

    if (!termsAccepted) { 
      hasErrors = true; 
      if (!firstErrorField) setTermsError(true);
    }
    
    setErrors(newErrors);
    
    if (hasErrors) { 
      triggerShake(); 
      if (firstErrorField) {
        setTouched(prev => ({ ...prev, [firstErrorField]: true }));
      }
      return; 
    }
    setDuplicateError(''); setIsSubmitting(true);
    try {
      const result = await registerDemoBooking(formData);
      if (result.token) sessionStorage.setItem('aspire_booking_jwt', result.token);
      setIsSubmitting(false);
      if (onSuccess) onSuccess(result.data || formData);
    } catch (err) {
      setIsSubmitting(false); triggerShake();
      if (err.status === 409) {
        const msg = err.message || 'Duplicate submission.';
        const low = msg.toLowerCase(); 
        const dup = {};
        if (low.includes('email'))  dup.email  = 'Email already registered.';
        if (low.includes('mobile') || low.includes('phone')) dup.mobile = 'Mobile already registered.';
        
        if (Object.keys(dup).length > 0) {
          setErrors(p => ({...p,...dup})); 
          setTouched(p => ({...p,email:true,mobile:true}));
        } else {
          setDuplicateError(msg);
        }
      } else if (err.errors) {
        setErrors(p=>({...p,...err.errors}));
        setTouched(p=>({...p,...Object.keys(err.errors).reduce((a,k)=>({...a,[k]:true}),{})}));
      } else { setDuplicateError(err.message || 'Server error. Please try again.'); }
    }
  };

  const iconUser = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const iconCal  = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

  const FieldErr = ({ name }) => errors[name] && touched[name] ? (
    <div className="field-error">
      <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>{errors[name]}</span>
    </div>
  ) : null;

  return (
    <div className="rp-bg">
      {/* Floating Slot Popup */}
      {showSlotPopup && (
        <SlotPopup
          onClose={() => setShowSlotPopup(false)}
          onConfirm={handleSlotConfirm}
        />
      )}

      {/* ── Centered Card ── */}
      <div className={`rp-card ${isShaking ? 'is-shaking' : ''}`}>

        {/* LEFT: Hero Illustration & Logo */}
        <div className="rp-left has-illustration">
          <img src={heroImg} alt="EdTech Startup" className="rp-hero-bg" />
          <div className="rp-logo-overlay">
            <img src={logoImg} alt="AspireNext Logo" className="rp-logo-img" />
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="rp-right">
          <div className="rp-right-header">
            <h1 className="rp-form-title">Register for Demo</h1>
            <p className="rp-form-sub">Fill in your details to confirm your free session slot instantly.</p>
          </div>

          {duplicateError && (
            <div className="alert-banner alert-warning">
              <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{duplicateError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rp-form" noValidate>

            {/* Row 1: Full Name + Mobile */}
            <div className="rp-row-2">
              <div className={`fg ${errors.fullName&&touched.fullName?'has-error':''} ${isFieldValid('fullName')?'is-valid':''}`}>
                <label htmlFor="fullName" className="form-label">Full Name <span className="req">*</span></label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" id="fullName" name="fullName" className="form-input" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="Rahul Sharma"/>
                  {isFieldValid('fullName') && <svg className="valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <FieldErr name="fullName"/>
              </div>

              <div className={`fg ${errors.mobile&&touched.mobile?'has-error':''} ${isFieldValid('mobile')?'is-valid':''}`}>
                <label htmlFor="mobile" className="form-label">Mobile Number <span className="req">*</span></label>
                <div className="input-wrapper">
                  {/* Clear phone-call icon */}
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.84 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input type="tel" id="mobile" name="mobile" className="form-input" value={formData.mobile} onChange={handleChange} onBlur={handleBlur} placeholder="10-digit number" maxLength={10}/>
                  {isFieldValid('mobile') && <svg className="valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <FieldErr name="mobile"/>
              </div>
            </div>

            {/* Row 2: Email (wider) + Stream (wider) — 2 even columns */}
            <div className="rp-row-2">
              <div className={`fg ${errors.email&&touched.email?'has-error':''} ${isFieldValid('email')?'is-valid':''}`}>
                <label htmlFor="email" className="form-label">Email <span className="req">*</span></label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" id="email" name="email" className="form-input" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="name@example.com"/>
                  {isFieldValid('email') && <svg className="valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <FieldErr name="email"/>
              </div>

              <div className={`fg ${errors.fieldOfStudy&&touched.fieldOfStudy?'has-error':''} ${isFieldValid('fieldOfStudy')?'is-valid':''}`}>
                <label htmlFor="fieldOfStudy" className="form-label">Stream <span className="req">*</span></label>
                <SearchableSelect id="fieldOfStudy" name="fieldOfStudy" value={formData.fieldOfStudy}
                  onChange={handleChange} onBlur={handleBlur} options={FIELD_OPTIONS} placeholder="Select stream..." icon={iconUser} openUp/>
                <FieldErr name="fieldOfStudy"/>
              </div>
            </div>

            {/* Row 3: Year of Study + Demo Session Slot — side by side */}
            <div className="rp-row-2">
              <div className={`fg ${errors.yearOfStudy&&touched.yearOfStudy?'has-error':''} ${isFieldValid('yearOfStudy')?'is-valid':''}`}>
                <label htmlFor="yearOfStudy" className="form-label">Year of Study <span className="req">*</span></label>
                {formData.fieldOfStudy === 'Others' ? (
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <input type="text" id="yearOfStudy" name="yearOfStudy" className="form-input" value={formData.yearOfStudy} onChange={handleChange} onBlur={handleBlur} placeholder="Type year of study..." autoFocus/>
                    {isFieldValid('yearOfStudy') && <svg className="valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                ) : (
                  <SearchableSelect id="yearOfStudy" name="yearOfStudy" value={formData.yearOfStudy}
                    onChange={handleChange} onBlur={handleBlur} options={yearOptions} placeholder={formData.fieldOfStudy ? 'Select year...' : 'Select stream first...'} icon={iconCal} disabled={!formData.fieldOfStudy} openUp/>
                )}
                <FieldErr name="yearOfStudy"/>
              </div>

              <div className={`fg ${errors.demoSlot&&touched.demoSlot?'has-error':''}`}>
                <label className="form-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Demo Slot <span className="req">*</span>
                </label>
                <SlotDropdown
                  value={formData.demoSlot}
                  onChange={handleChange}
                  slotOption={getUpcomingSlot()}
                />
                <FieldErr name="demoSlot"/>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              <div className="btn-shimmer-sweep"/>
              {isSubmitting
                ? <div className="btn-loading-content">
                    <svg className="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10"/></svg>
                    <span>Saving...</span>
                  </div>
                : <div className="btn-content">
                    <span>Confirm Demo Booking</span>
                    <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
              }
            </button>

            {/* Terms and Conditions */}
            <div className={`rp-terms ${termsError ? 'has-error' : ''}`} style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input 
                type="checkbox" 
                id="terms" 
                className="rp-terms-checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (e.target.checked) setTermsError(false);
                }}
                style={{ marginTop: '0.2rem', cursor: 'pointer' }}
              />
              <label htmlFor="terms" className="rp-terms-label" style={{ fontSize: '0.82rem', color: termsError ? 'var(--error)' : 'var(--slate-500)', lineHeight: '1.4', cursor: 'pointer', flex: 1 }}>
                I agree to the Terms & Conditions and understand that my data will be used to schedule and manage the demo session.
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
