import { useState, useRef } from 'react'

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body { background: #F0F4F8; }

:root {
  --navy: #0A2540; --navy-mid: #1A3A5C;
  --red: #D63B3B; --red-light: #FDF0F0; --red-mid: #FAD5D5;
  --green: #1A7A4A; --green-light: #EAF6EF;
  --amber: #B86A00; --amber-light: #FFF4E0;
  --blue: #1557A0; --blue-light: #EBF3FF;
  --border: #D0DAE4; --text: #0A2540; --text-mid: #3D5A7A; --text-muted: #6B8AA8;
  --bg: #F0F4F8; --white: #FFFFFF;
  --radius: 12px; --radius-sm: 8px;
}

.tf-root { min-height: 100vh; width: 100%; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

.tf-header { background: var(--navy); width: 100%; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; min-height: 80px; border-bottom: 3px solid #1A7A4A; }
.tf-header-left { display: flex; align-items: center; gap: 20px; }
.tf-header-icon { width: 48px; height: 48px; background: #1A7A4A; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.tf-header-title { font-family: 'Libre Baskerville', serif; font-size: clamp(15px, 2vw, 21px); font-weight: 700; color: #fff; }
.tf-header-sub { font-size: 12px; color: #7A9EC0; margin-top: 3px; font-weight: 300; }
.tf-header-right { display: flex; align-items: center; gap: 16px; }
.tf-header-date { font-family: 'DM Mono', monospace; font-size: 12px; color: #7AB8E0; }
.tf-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #1A7A4A; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }

.tf-alert { background: var(--red); width: 100%; padding: 11px 40px; display: flex; align-items: center; gap: 10px; }
.tf-alert-text { font-size: 13px; font-weight: 600; color: #fff; letter-spacing: .04em; }
.tf-alert-sub { font-size: 12px; color: rgba(255,255,255,.7); margin-left: auto; }

.tf-body { max-width: 1100px; margin: 0 auto; padding: 36px 40px 120px; }

.tf-section { margin-bottom: 40px; }
.tf-section-head { display: flex; align-items: flex-start; gap: 0; margin-bottom: 20px; border-left: 4px solid var(--navy); padding-left: 14px; }
.tf-section-head.critical { border-left-color: var(--red); }
.tf-section-head.green { border-left-color: var(--green); }
.tf-section-head.amber { border-left-color: var(--amber); }
.tf-section-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: .1em; margin-right: 10px; padding-top: 5px; }
.tf-section-title { font-family: 'Libre Baskerville', serif; font-size: clamp(18px, 2.5vw, 24px); font-weight: 700; color: var(--navy); }
.tf-section-desc { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.tf-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 16px; }
.tf-card.critical { border-color: var(--red-mid); background: var(--red-light); }

.tf-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.tf-g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
.tf-g4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }
.tf-g6 { display: grid; grid-template-columns: repeat(6,1fr); gap: 12px; }

@media(max-width:1024px){ .tf-g4{grid-template-columns:1fr 1fr} .tf-g6{grid-template-columns:repeat(3,1fr)} .tf-header{padding:0 24px} .tf-alert{padding:10px 24px} .tf-body{padding:28px 24px 120px} }
@media(max-width:768px){ .tf-g2,.tf-g3{grid-template-columns:1fr} .tf-g4{grid-template-columns:1fr 1fr} .tf-g6{grid-template-columns:repeat(2,1fr)} .tf-header{padding:0 16px;min-height:64px} .tf-alert{padding:10px 16px} .tf-body{padding:20px 16px 120px} .tf-card{padding:18px 16px} .tf-header-right{display:none} .tf-facility-split{grid-template-columns:1fr} .tf-facility-col:first-child{border-right:none;border-bottom:1px solid var(--border)} }
@media(max-width:480px){ .tf-g4{grid-template-columns:1fr} .tf-g6{grid-template-columns:repeat(2,1fr)} }

.tf-field { display: flex; flex-direction: column; gap: 7px; }
.tf-label { font-size: 12px; font-weight: 600; color: var(--text-mid); letter-spacing: .08em; text-transform: uppercase; }
.tf-req { color: var(--red); margin-left: 2px; }
.tf-hint { font-size: 12px; color: var(--text-muted); }

.tf-input { width: 100%; background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 13px 16px; font-size: 16px; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; transition: border-color .15s, box-shadow .15s; appearance: none; -webkit-appearance: none; }
.tf-input::placeholder { color: #A8BDD0; }
.tf-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(21,87,160,.1); }
.tf-input:hover:not(:focus) { border-color: #9AB0C8; }
.tf-textarea { resize: vertical; min-height: 120px; line-height: 1.7; }
.tf-select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B8AA8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }

.tf-vital-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 18px 12px 14px; text-align: center; transition: border-color .15s, box-shadow .15s; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.tf-vital-card:focus-within { border-color: var(--green); box-shadow: 0 0 0 3px rgba(26,122,74,.08); }
.tf-vital-label { font-size: 11px; font-weight: 600; color: var(--text-muted); letter-spacing: .1em; text-transform: uppercase; }
.tf-vital-input { width: 100%; border: none; outline: none; font-size: clamp(20px,3vw,28px); font-weight: 600; color: var(--navy); font-family: 'DM Mono', monospace; text-align: center; background: transparent; padding: 0; }
.tf-vital-input::placeholder { color: #C8D8E8; font-size: 18px; }
.tf-vital-unit { font-size: 11px; color: var(--text-muted); font-family: 'DM Mono', monospace; letter-spacing: .08em; }

.tf-item { background: #F7FAFD; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 20px; margin-bottom: 12px; }
.tf-item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.tf-item-num { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--blue); font-weight: 500; letter-spacing: .06em; background: var(--blue-light); padding: 4px 10px; border-radius: 20px; }
.tf-remove { background: transparent; border: 1px solid var(--red-mid); border-radius: 6px; padding: 5px 12px; font-size: 12px; color: var(--red); cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all .15s; }
.tf-remove:hover { background: var(--red-light); }
.tf-add { width: 100%; background: transparent; border: 1.5px dashed var(--border); border-radius: var(--radius-sm); padding: 14px; font-size: 14px; font-weight: 500; color: var(--text-muted); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .18s; margin-top: 4px; }
.tf-add:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }

.tf-check-wrap { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--amber-light); border: 1px solid #F0D090; border-radius: var(--radius-sm); cursor: pointer; margin-top: 12px; transition: border-color .15s; }
.tf-check-wrap:hover { border-color: var(--amber); }
.tf-check-wrap input { accent-color: var(--amber); width: 17px; height: 17px; cursor: pointer; }
.tf-check-label { font-size: 14px; color: var(--amber); font-weight: 500; }

.tf-wc { font-family: 'DM Mono', monospace; font-size: 12px; text-align: right; margin-top: 8px; letter-spacing: .05em; }
.tf-list-item { display: flex; gap: 8px; margin-bottom: 10px; align-items: center; }
.tf-divider { height: 1px; background: var(--border); margin: 24px 0; }

.tf-tag { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: .04em; }
.tf-tag-red { background: var(--red-light); color: var(--red); border: 1px solid var(--red-mid); }
.tf-tag-blue { background: var(--blue-light); color: var(--blue); border: 1px solid #B0CCEE; }

.tf-error { background: var(--red-light); border: 1.5px solid var(--red); border-radius: var(--radius-sm); padding: 16px 20px; font-size: 14px; color: var(--red); line-height: 1.8; margin-bottom: 20px; font-weight: 500; }

.tf-facility-split { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.tf-facility-col { padding: 24px; }
.tf-facility-col:first-child { border-right: 1px solid var(--border); background: #F7FAFD; }
.tf-facility-col:last-child { background: var(--white); }
.tf-facility-col-head { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
.tf-facility-col:first-child .tf-facility-col-head { color: var(--text-muted); }
.tf-facility-col:last-child .tf-facility-col-head { color: var(--green); }

/* ── STICKY BOTTOM BAR ── */
.tf-bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #fff; border-top: 1px solid var(--border);
  padding: 14px 40px; z-index: 100;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  box-shadow: 0 -4px 24px rgba(10,37,64,.08);
}
.tf-bottom-info { font-size: 13px; color: var(--text-muted); }
.tf-bottom-info strong { color: var(--text); font-weight: 600; }
.tf-bottom-btns { display: flex; gap: 10px; align-items: center; }

.tf-btn-print {
  padding: 13px 28px; background: var(--white); color: var(--navy);
  border: 1.5px solid var(--navy); border-radius: var(--radius-sm);
  font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all .18s; display: flex; align-items: center; gap: 8px;
}
.tf-btn-print:hover { background: var(--navy-light); }

.tf-btn-save {
  padding: 13px 28px; background: var(--navy); color: #fff;
  border: none; border-radius: var(--radius-sm);
  font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all .18s; display: flex; align-items: center; gap: 8px;
}
.tf-btn-save:hover { background: var(--navy-mid); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(10,37,64,.2); }

@media(max-width:768px){
  .tf-bottom-bar { padding: 12px 16px; flex-direction: column; }
  .tf-bottom-btns { width: 100%; }
  .tf-btn-print, .tf-btn-save { flex: 1; justify-content: center; }
}

/* ── PRINT STYLES ── */
@media print {
  @page { size: A4; margin: 16mm 14mm; }

  body { background: #fff !important; }

  .tf-root { background: #fff !important; }
  .tf-header { background: #0A2540 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; min-height: 60px !important; padding: 0 20px !important; }
  .tf-header-right, .tf-alert, .tf-bottom-bar { display: none !important; }
  .tf-body { padding: 16px 0 0 !important; max-width: 100% !important; }
  .tf-section { margin-bottom: 20px !important; page-break-inside: avoid; }
  .tf-card { border: 1px solid #ccc !important; border-radius: 6px !important; padding: 16px !important; page-break-inside: avoid; box-shadow: none !important; }
  .tf-card.critical { background: #FFF5F5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .tf-input, .tf-vital-input { border: none !important; background: transparent !important; padding: 4px 0 !important; font-size: 14px !important; box-shadow: none !important; }
  .tf-vital-card { border: 1px solid #ddd !important; padding: 10px !important; }
  .tf-vital-input { font-size: 20px !important; }
  .tf-add, .tf-remove, .tf-check-wrap input { display: none !important; }
  .tf-section-title { font-size: 16px !important; }
  .tf-g6 { grid-template-columns: repeat(6,1fr) !important; }
  .tf-g4 { grid-template-columns: repeat(4,1fr) !important; }
  .tf-g3 { grid-template-columns: repeat(3,1fr) !important; }
  .tf-g2 { grid-template-columns: 1fr 1fr !important; }
  .tf-facility-split { grid-template-columns: 1fr 1fr !important; }

  .tf-print-header-bar {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #0A2540;
    padding-bottom: 10px;
    margin-bottom: 16px;
  }

  .tf-watermark {
    display: block !important;
    position: fixed; bottom: 10mm; right: 14mm;
    font-size: 9px; color: #aaa;
    font-family: 'DM Mono', monospace;
  }
}

@media screen {
  .tf-print-header-bar { display: none; }
  .tf-watermark { display: none; }
  .tf-navy-light { --navy-light: #E8F0F8; }
}
`

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length
}

function Field({ label, required, children, hint }) {
  return (
    <div className="tf-field">
      <label className="tf-label">{label}{required && <span className="tf-req">*</span>}</label>
      {children}
      {hint && <span className="tf-hint">{hint}</span>}
    </div>
  )
}

function VitalBox({ label, unit, value, onChange, placeholder }) {
  return (
    <div className="tf-vital-card">
      <div className="tf-vital-label">{label}</div>
      <input className="tf-vital-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      <div className="tf-vital-unit">{unit}</div>
    </div>
  )
}

function SectionHead({ num, title, desc, color }) {
  return (
    <div className={`tf-section-head ${color || ''}`}>
      <span className="tf-section-num">{num}</span>
      <div>
        <div className="tf-section-title">{title}</div>
        {desc && <div className="tf-section-desc">{desc}</div>}
      </div>
    </div>
  )
}

export default function TransferForm() {
  const [error, setError] = useState('')
  const formRef = useRef(null)

  const [patient, setPatient] = useState({ name: '', age: '', gender: 'Male', patientID: '' })
  const [vitals, setVitals] = useState({ bp: '', pulse: '', spo2: '', temp: '', rr: '', gcs: '' })
  const [critical, setCritical] = useState({
    primaryDiagnosis: '',
    transferReason: '',
    allergies: [{ name: '', severity: 'Moderate', reaction: '' }],
    activeMedications: [{ name: '', dose: '', route: 'Oral', frequency: '', mustNotStop: false }],
  })
  const [clinical, setClinical] = useState({
    clinicalSummary: '',
    recentInvestigations: [''],
    pastMedicalHistory: [''],
    surgicalHistory: [''],
  })
  const [facility, setFacility] = useState({
    sendingHospitalID: '', doctorName: '', doctorID: '',
    receivingHospitalName: '', receivingHospitalID: '', receivingDepartment: '',
  })

  const setVital = (k, v) => setVitals(p => ({ ...p, [k]: v }))
  const setP = (k, v) => setPatient(p => ({ ...p, [k]: v }))
  const setF = (k, v) => setFacility(p => ({ ...p, [k]: v }))

  const setAllergy = (i, k, v) => { const a = [...critical.allergies]; a[i] = { ...a[i], [k]: v }; setCritical(p => ({ ...p, allergies: a })) }
  const addAllergy = () => setCritical(p => ({ ...p, allergies: [...p.allergies, { name: '', severity: 'Moderate', reaction: '' }] }))
  const removeAllergy = (i) => setCritical(p => ({ ...p, allergies: p.allergies.filter((_, j) => j !== i) }))

  const setMed = (i, k, v) => { const a = [...critical.activeMedications]; a[i] = { ...a[i], [k]: v }; setCritical(p => ({ ...p, activeMedications: a })) }
  const addMed = () => setCritical(p => ({ ...p, activeMedications: [...p.activeMedications, { name: '', dose: '', route: 'Oral', frequency: '', mustNotStop: false }] }))
  const removeMed = (i) => setCritical(p => ({ ...p, activeMedications: p.activeMedications.filter((_, j) => j !== i) }))

  const setListItem = (field, i, v) => { const a = [...clinical[field]]; a[i] = v; setClinical(p => ({ ...p, [field]: a })) }
  const addListItem = (field) => setClinical(p => ({ ...p, [field]: [...p[field], ''] }))
  const removeListItem = (field, i) => setClinical(p => ({ ...p, [field]: p[field].filter((_, j) => j !== i) }))

  const wc = wordCount(clinical.clinicalSummary)

  function validate() {
    if (!patient.name.trim()) return 'Patient name is required'
    if (!patient.age) return 'Patient age is required'
    if (!patient.patientID.trim()) return 'Patient ID is required'
    if (!critical.primaryDiagnosis.trim()) return 'Primary diagnosis is required'
    if (!critical.transferReason.trim()) return 'Reason for transfer is required'
    if (critical.allergies.some(a => !a.name.trim())) return 'All allergy entries need a substance name'
    if (critical.activeMedications.some(m => !m.name.trim() || !m.dose.trim())) return 'All medications need name and dose'
    if (!clinical.clinicalSummary.trim()) return 'Clinical summary is required'
    if (!facility.sendingHospitalID.trim()) return 'Sending hospital ID is required'
    if (!facility.receivingHospitalName.trim()) return 'Receiving hospital name is required'
    if (!facility.receivingDepartment.trim()) return 'Receiving department is required'
    return null
  }

  function handlePrint() {
    const err = validate()
    if (err) { setError(err); window.scrollTo(0, 0); return }
    setError('')
    window.print()
  }

  function handleSave() {
    const err = validate()
    if (err) { setError(err); window.scrollTo(0, 0); return }
    setError('')
    // Save as PDF via print dialog with PDF destination
    window.print()
  }

  const printDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const printTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      <style>{css}</style>
      <div className="tf-root" ref={formRef}>

        {/* Watermark for print */}
        <div className="tf-watermark">
          Generated by MEDICO Transfer System · {printDate} {printTime} · Confidential Medical Record
        </div>

        {/* Header */}
        <header className="tf-header">
          <div className="tf-header-left">
            <div className="tf-header-icon">⚕</div>
            <div>
              <div className="tf-header-title">Emergency Patient Transfer Intake Form</div>
              <div className="tf-header-sub">MEDICO — Interhospital Handoff System</div>
            </div>
          </div>
          <div className="tf-header-right">
            <div className="tf-header-date">{printDate} · {printTime}</div>
            <div className="tf-live-dot" />
          </div>
        </header>

        {/* Print-only header bar */}
        <div className="tf-print-header-bar">
          <div>
            <div style={{ fontSize: 10, color: '#888', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Patient Transfer Record</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Libre Baskerville, serif', color: '#0A2540', marginTop: 2 }}>{patient.name || '________________________'}</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>ID: {patient.patientID || '—'} &nbsp;·&nbsp; Age: {patient.age || '—'} &nbsp;·&nbsp; {patient.gender}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#888', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>PRINTED</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0A2540', marginTop: 2 }}>{printDate}</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{printTime}</div>
          </div>
        </div>

        {/* Alert bar */}
        <div className="tf-alert">
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
          <span className="tf-alert-text">Mandatory fields marked * must be completed before printing</span>
          <span className="tf-alert-sub">This is a confidential medical document</span>
        </div>

        <div className="tf-body">

          {error && <div className="tf-error">⚠ {error}</div>}

          {/* 01 Patient */}
          <div className="tf-section">
            <SectionHead num="01" title="Patient Identifiers" desc="Core demographics — must match physical ID document" />
            <div className="tf-card">
              <div className="tf-g4">
                <Field label="Full Name" required>
                  <input className="tf-input" value={patient.name} onChange={e => setP('name', e.target.value)} placeholder="Full legal name" />
                </Field>
                <Field label="Age" required>
                  <input className="tf-input" type="number" min="0" max="120" value={patient.age} onChange={e => setP('age', e.target.value)} placeholder="Years" />
                </Field>
                <Field label="Gender">
                  <select className="tf-input tf-select" value={patient.gender} onChange={e => setP('gender', e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </Field>
                <Field label="Patient ID" required hint="MRN or hospital registration number">
                  <input className="tf-input" value={patient.patientID} onChange={e => setP('patientID', e.target.value)} placeholder="PTN-2024-101" />
                </Field>
              </div>
            </div>
          </div>

          {/* 02 Vitals */}
          <div className="tf-section">
            <SectionHead num="02" title="Last Recorded Vitals" desc="Most recent observations before transfer" color="green" />
            <div className="tf-card">
              <div className="tf-g6">
                <VitalBox label="Blood Pressure" unit="mmHg" value={vitals.bp} onChange={v => setVital('bp', v)} placeholder="120/80" />
                <VitalBox label="Pulse" unit="bpm" value={vitals.pulse} onChange={v => setVital('pulse', v)} placeholder="72" />
                <VitalBox label="SpO₂" unit="%" value={vitals.spo2} onChange={v => setVital('spo2', v)} placeholder="98" />
                <VitalBox label="Temperature" unit="°C" value={vitals.temp} onChange={v => setVital('temp', v)} placeholder="37.0" />
                <VitalBox label="Resp. Rate" unit="/min" value={vitals.rr} onChange={v => setVital('rr', v)} placeholder="16" />
                <VitalBox label="GCS" unit="/15" value={vitals.gcs} onChange={v => setVital('gcs', v)} placeholder="15" />
              </div>
            </div>
          </div>

          {/* 03 Critical */}
          <div className="tf-section">
            <SectionHead num="03" title="Critical Clinical Information" desc="Shown first and in large type when the QR is scanned" color="critical" />

            <div className="tf-card" style={{ marginBottom: 12 }}>
              <div className="tf-g2">
                <Field label="Primary Diagnosis" required>
                  <input className="tf-input" value={critical.primaryDiagnosis} onChange={e => setCritical(p => ({ ...p, primaryDiagnosis: e.target.value }))} placeholder="e.g. Acute STEMI" />
                </Field>
                <Field label="Reason for Transfer" required>
                  <input className="tf-input" value={critical.transferReason} onChange={e => setCritical(p => ({ ...p, transferReason: e.target.value }))} placeholder="e.g. Requires ICU cardiac monitoring" />
                </Field>
              </div>
            </div>

            <div className="tf-card critical" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#D63B3B' }}>Known Allergies <span className="tf-req">*</span></div>
                  <div style={{ fontSize: 13, color: '#B05A5A', marginTop: 3 }}>Incorrect allergy information causes transfer-related adverse events</div>
                </div>
                <span className="tf-tag tf-tag-red">HIGH RISK</span>
              </div>
              {critical.allergies.map((a, i) => (
                <div key={i} className="tf-item" style={{ background: '#fff', borderColor: '#F5C0C0' }}>
                  <div className="tf-item-head">
                    <span className="tf-item-num" style={{ background: '#FDF0F0', color: '#D63B3B' }}>Allergy {String(i + 1).padStart(2, '0')}</span>
                    {critical.allergies.length > 1 && <button type="button" className="tf-remove" onClick={() => removeAllergy(i)}>Remove</button>}
                  </div>
                  <div className="tf-g3">
                    <Field label="Substance" required>
                      <input className="tf-input" value={a.name} onChange={e => setAllergy(i, 'name', e.target.value)} placeholder="e.g. Penicillin" />
                    </Field>
                    <Field label="Severity">
                      <select className="tf-input tf-select" value={a.severity} onChange={e => setAllergy(i, 'severity', e.target.value)}>
                        <option>Mild</option><option>Moderate</option><option>Severe</option>
                      </select>
                    </Field>
                    <Field label="Reaction">
                      <input className="tf-input" value={a.reaction} onChange={e => setAllergy(i, 'reaction', e.target.value)} placeholder="e.g. Anaphylaxis" />
                    </Field>
                  </div>
                </div>
              ))}
              <button type="button" className="tf-add" onClick={addAllergy}>+ Add another allergy</button>
            </div>

            <div className="tf-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0A2540' }}>Active Medications <span className="tf-req">*</span></div>
                  <div style={{ fontSize: 13, color: '#6B8AA8', marginTop: 3 }}>Include dose, route and frequency for every medication</div>
                </div>
                <span className="tf-tag tf-tag-blue">REQUIRED</span>
              </div>
              {critical.activeMedications.map((m, i) => (
                <div key={i} className="tf-item">
                  <div className="tf-item-head">
                    <span className="tf-item-num">Medication {String(i + 1).padStart(2, '0')}</span>
                    {critical.activeMedications.length > 1 && <button type="button" className="tf-remove" onClick={() => removeMed(i)}>Remove</button>}
                  </div>
                  <div className="tf-g4">
                    <Field label="Drug Name" required>
                      <input className="tf-input" value={m.name} onChange={e => setMed(i, 'name', e.target.value)} placeholder="e.g. Metformin" />
                    </Field>
                    <Field label="Dose" required>
                      <input className="tf-input" value={m.dose} onChange={e => setMed(i, 'dose', e.target.value)} placeholder="e.g. 500mg" />
                    </Field>
                    <Field label="Route">
                      <select className="tf-input tf-select" value={m.route} onChange={e => setMed(i, 'route', e.target.value)}>
                        <option>Oral</option><option>IV</option><option>IM</option><option>Subcutaneous</option><option>Topical</option><option>Inhalation</option>
                      </select>
                    </Field>
                    <Field label="Frequency" required>
                      <input className="tf-input" value={m.frequency} onChange={e => setMed(i, 'frequency', e.target.value)} placeholder="e.g. Twice daily" />
                    </Field>
                  </div>
                  <label className="tf-check-wrap">
                    <input type="checkbox" checked={m.mustNotStop} onChange={e => setMed(i, 'mustNotStop', e.target.checked)} />
                    <span className="tf-check-label">Flag as "Must Not Stop" — receiving team will be alerted immediately on scan</span>
                  </label>
                </div>
              ))}
              <button type="button" className="tf-add" onClick={addMed}>+ Add another medication</button>
            </div>
          </div>

          {/* 04 Clinical */}
          <div className="tf-section">
            <SectionHead num="04" title="Clinical Notes" desc="Supporting information for the receiving team" />
            <div className="tf-card">
              <Field label="Clinical Summary" required hint="Limited to 200 words — be concise and clinically precise">
                <textarea
                  className="tf-input tf-textarea"
                  value={clinical.clinicalSummary}
                  onChange={e => { if (wordCount(e.target.value) <= 200) setClinical(p => ({ ...p, clinicalSummary: e.target.value })) }}
                  placeholder="Presenting complaint, clinical course, key findings, interventions performed, and immediate concerns for the receiving team..."
                />
                <div className="tf-wc" style={{ color: wc > 190 ? '#D63B3B' : wc > 150 ? '#B86A00' : '#6B8AA8' }}>
                  {wc} / 200 words
                </div>
              </Field>

              <div className="tf-divider" />

              <div style={{ marginBottom: 20 }}>
                <div className="tf-label" style={{ marginBottom: 12 }}>Recent Investigations</div>
                {clinical.recentInvestigations.map((item, i) => (
                  <div key={i} className="tf-list-item">
                    <input className="tf-input" style={{ flex: 1 }} value={item} onChange={e => setListItem('recentInvestigations', i, e.target.value)} placeholder="e.g. ECG — ST elevation in leads II, III, aVF" />
                    {clinical.recentInvestigations.length > 1 && <button type="button" className="tf-remove" onClick={() => removeListItem('recentInvestigations', i)}>×</button>}
                  </div>
                ))}
                <button type="button" className="tf-add" onClick={() => addListItem('recentInvestigations')}>+ Add investigation</button>
              </div>

              <div className="tf-g2">
                <div>
                  <div className="tf-label" style={{ marginBottom: 12 }}>Past Medical History</div>
                  {clinical.pastMedicalHistory.map((item, i) => (
                    <div key={i} className="tf-list-item">
                      <input className="tf-input" style={{ flex: 1 }} value={item} onChange={e => setListItem('pastMedicalHistory', i, e.target.value)} placeholder="e.g. Type 2 Diabetes Mellitus" />
                      {clinical.pastMedicalHistory.length > 1 && <button type="button" className="tf-remove" onClick={() => removeListItem('pastMedicalHistory', i)}>×</button>}
                    </div>
                  ))}
                  <button type="button" className="tf-add" onClick={() => addListItem('pastMedicalHistory')}>+ Add history</button>
                </div>
                <div>
                  <div className="tf-label" style={{ marginBottom: 12 }}>Surgical History</div>
                  {clinical.surgicalHistory.map((item, i) => (
                    <div key={i} className="tf-list-item">
                      <input className="tf-input" style={{ flex: 1 }} value={item} onChange={e => setListItem('surgicalHistory', i, e.target.value)} placeholder="e.g. Appendectomy 2018" />
                      {clinical.surgicalHistory.length > 1 && <button type="button" className="tf-remove" onClick={() => removeListItem('surgicalHistory', i)}>×</button>}
                    </div>
                  ))}
                  <button type="button" className="tf-add" onClick={() => addListItem('surgicalHistory')}>+ Add surgery</button>
                </div>
              </div>
            </div>
          </div>

          {/* 05 Facility */}
          <div className="tf-section">
            <SectionHead num="05" title="Facility Handover" desc="Sending and receiving hospital details" color="amber" />
            <div className="tf-facility-split">
              <div className="tf-facility-col">
                <div className="tf-facility-col-head"><span>↑</span> Sending Facility</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Field label="Hospital ID" required>
                    <input className="tf-input" value={facility.sendingHospitalID} onChange={e => setF('sendingHospitalID', e.target.value)} placeholder="e.g. HOSP-DL-001" />
                  </Field>
                  <Field label="Doctor Name">
                    <input className="tf-input" value={facility.doctorName} onChange={e => setF('doctorName', e.target.value)} placeholder="e.g. Dr. Anil Mehta" />
                  </Field>
                  <Field label="Doctor ID">
                    <input className="tf-input" value={facility.doctorID} onChange={e => setF('doctorID', e.target.value)} placeholder="e.g. USR001" />
                  </Field>
                </div>
              </div>
              <div className="tf-facility-col">
                <div className="tf-facility-col-head"><span>↓</span> Receiving Facility</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Field label="Hospital Name" required>
                    <input className="tf-input" value={facility.receivingHospitalName} onChange={e => setF('receivingHospitalName', e.target.value)} placeholder="e.g. BHU Hospital, Varanasi" />
                  </Field>
                  <Field label="Hospital ID">
                    <input className="tf-input" value={facility.receivingHospitalID} onChange={e => setF('receivingHospitalID', e.target.value)} placeholder="e.g. HOSP-BHU-001" />
                  </Field>
                  <Field label="Department" required>
                    <input className="tf-input" value={facility.receivingDepartment} onChange={e => setF('receivingDepartment', e.target.value)} placeholder="e.g. Cardiology ICU" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Signature row — shows on print */}
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              {['Sending Doctor Signature', 'Receiving Doctor Signature', 'Witness / Nurse'].map(label => (
                <div key={label} style={{ borderTop: '1px solid #D0DAE4', paddingTop: 8 }}>
                  <div style={{ height: 40 }} />
                  <div style={{ fontSize: 11, color: '#6B8AA8', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="tf-bottom-bar">
          <div className="tf-bottom-info">
            Fill all required fields, then <strong>Print</strong> or <strong>Save as PDF</strong>
          </div>
          <div className="tf-bottom-btns">
            <button className="tf-btn-print" onClick={handlePrint}>
              🖨 Print Report
            </button>
            <button className="tf-btn-save" onClick={handleSave}>
              ↓ Save as PDF
            </button>
          </div>
        </div>

      </div>
    </>
  )
}