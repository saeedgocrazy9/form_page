import { useState } from 'react'

const API = 'http://192.168.0.124:5000/api'

const STEPS = [
  'Patient Details',
  'Critical Info',
  'Clinical Details',
  'Hospital Selection',
  'Confirm & Submit',
]

const initialState = {
  patient: { name: '', age: '', patientID: '', gender: 'Male' },
  critical: {
    allergies: [{ name: '', severity: 'Moderate', reaction: '' }],
    activeMedications: [{ name: '', dose: '', route: 'Oral', frequency: '', mustNotStop: false }],
    transferReason: '',
    primaryDiagnosis: '',           // ✅ CHANGE 3: added back
  },
  clinical: {
    clinicalSummary: '',
    recentInvestigations: [''],
    pastMedicalHistory: [''],
    surgicalHistory: [''],
  },
  vitals: { bp: '', pulse: '', spo2: '', temp: '', rr: '', gcs: '' },
  sendingFacility: { hospitalID: '', doctorID: '' },   // ✅ CHANGE 2: added
  receivingFacility: { hospitalName: '', hospitalID: '', department: '' },
}

// ─── Styles ────────────────────────────────────────────────────────────────

const c = {
  page: {
    minHeight: '100vh', width: '100%',
    background: '#F8F7F4', fontFamily: 'DM Sans, sans-serif',
  },
  topbar: {
    background: '#1A1A18', padding: '14px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 100,
  },
  topbarTitle: {
    fontFamily: 'Fraunces, serif', fontSize: 17,
    fontWeight: 600, color: '#fff', margin: 0,
  },
  topbarSub: { fontSize: 11, color: '#888780', marginTop: 2 },
  stepper: {
    background: '#fff', borderBottom: '0.5px solid #DDDBD4',
    padding: '12px 20px', display: 'flex', gap: 6,
    overflowX: 'auto', position: 'sticky', top: 52, zIndex: 99,
  },
  stepBtn: (active, done) => ({
    padding: '5px 12px', borderRadius: 20, border: 'none',
    fontSize: 12, fontWeight: 500, cursor: done ? 'pointer' : 'default',
    whiteSpace: 'nowrap', flexShrink: 0,
    background: active ? '#1A1A18' : done ? '#E1F5EE' : '#EEECEA',
    color: active ? '#fff' : done ? '#085041' : '#888780',
  }),
  body: { maxWidth: 720, margin: '0 auto', padding: '24px 16px 100px' },
  card: {
    background: '#fff', border: '0.5px solid #DDDBD4',
    borderRadius: 16, padding: '20px', marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 600,
    color: '#1A1A18', marginBottom: 16, paddingBottom: 10,
    borderBottom: '0.5px solid #EEECEA',
  },
  label: {
    fontSize: 13, fontWeight: 500, color: '#444441',
    display: 'block', marginBottom: 6,
  },
  required: { color: '#E24B4A', marginLeft: 2 },
  input: {
    width: '100%', border: '0.5px solid #DDDBD4', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    color: '#1A1A18', background: '#F8F7F4', outline: 'none',
    display: 'block', marginBottom: 14,
  },
  select: {
    width: '100%', border: '0.5px solid #DDDBD4', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    color: '#1A1A18', background: '#F8F7F4', outline: 'none',
    display: 'block', marginBottom: 14, appearance: 'none',
  },
  textarea: {
    width: '100%', border: '0.5px solid #DDDBD4', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    color: '#1A1A18', background: '#F8F7F4', outline: 'none',
    display: 'block', marginBottom: 4, resize: 'vertical', minHeight: 100,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  subCard: {
    background: '#F8F7F4', border: '0.5px solid #DDDBD4',
    borderRadius: 12, padding: '14px', marginBottom: 10,
  },
  addBtn: {
    background: 'transparent', border: '0.5px dashed #C4C2BA',
    borderRadius: 10, padding: '9px 16px', fontSize: 13,
    color: '#888780', cursor: 'pointer', width: '100%',
    fontFamily: 'DM Sans, sans-serif', marginBottom: 4,
  },
  removeBtn: {
    background: '#FCEBEB', border: 'none', borderRadius: 8,
    padding: '4px 10px', fontSize: 11, color: '#791F1F',
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  },
  errorBox: {
    background: '#FCEBEB', border: '1px solid #E24B4A',
    borderRadius: 10, padding: '12px 16px', marginBottom: 16,
    fontSize: 13, color: '#791F1F',
  },
  navRow: {
    display: 'flex', gap: 10, marginTop: 8,
  },
  btnPrimary: {
    flex: 1, padding: '14px', background: '#1A1A18', color: '#fff',
    border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500,
    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
  },
  btnSecondary: {
    padding: '14px 20px', background: '#fff',
    border: '0.5px solid #DDDBD4', borderRadius: 10, fontSize: 15,
    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', color: '#1A1A18',
  },
  badge: (color) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 500,
    background: color === 'red' ? '#FCEBEB' : color === 'amber' ? '#FAEEDA' : '#E1F5EE',
    color: color === 'red' ? '#791F1F' : color === 'amber' ? '#633806' : '#085041',
  }),
  successPage: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#F8F7F4', padding: 24, textAlign: 'center',
  },
  checkCircle: {
    width: 72, height: 72, borderRadius: '50%', background: '#E1F5EE',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 32, marginBottom: 20,
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={c.label}>{label}{required && <span style={c.required}>*</span>}</label>
      {children}
    </div>
  )
}

function ListInput({ items, onChange, placeholder }) {
  const update = (i, val) => { const a = [...items]; a[i] = val; onChange(a) }
  const add = () => onChange([...items, ''])
  const remove = (i) => onChange(items.filter((_, j) => j !== i))
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <input
            style={{ ...c.input, marginBottom: 0, flex: 1 }}
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
          />
          {items.length > 1 && (
            <button style={c.removeBtn} onClick={() => remove(i)}>remove</button>
          )}
        </div>
      ))}
      <button style={c.addBtn} onClick={add}>+ Add another</button>
    </div>
  )
}

// ─── Step Components ───────────────────────────────────────────────────────

function StepPatient({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v })
  return (
    <div style={c.card}>
      <div style={c.cardTitle}>Patient Identifiers</div>
      <Field label="Full Name" required>
        <input style={c.input} value={data.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rahul Sharma" />
      </Field>
      <div style={c.grid2}>
        <Field label="Age" required>
          <input style={c.input} type="number" value={data.age} onChange={e => set('age', e.target.value)} placeholder="Years" />
        </Field>
        <Field label="Gender">
          <select style={c.select} value={data.gender} onChange={e => set('gender', e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </Field>
      </div>
      <Field label="Patient ID" required>
        <input style={c.input} value={data.patientID} onChange={e => set('patientID', e.target.value)} placeholder="e.g. PTN-2024-101" />
      </Field>
    </div>
  )
}

function StepCritical({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v })

  const setAllergy = (i, k, v) => {
    const a = [...data.allergies]; a[i] = { ...a[i], [k]: v }; set('allergies', a)
  }
  const addAllergy = () => set('allergies', [...data.allergies, { name: '', severity: 'Moderate', reaction: '' }])
  const removeAllergy = (i) => set('allergies', data.allergies.filter((_, j) => j !== i))

  const setMed = (i, k, v) => {
    const a = [...data.activeMedications]; a[i] = { ...a[i], [k]: v }; set('activeMedications', a)
  }
  const addMed = () => set('activeMedications', [...data.activeMedications, { name: '', dose: '', route: 'Oral', frequency: '', mustNotStop: false }])
  const removeMed = (i) => set('activeMedications', data.activeMedications.filter((_, j) => j !== i))

  return (
    <>
      <div style={c.card}>
        <div style={c.cardTitle}>Primary Diagnosis</div>
        {/* ✅ CHANGE 3: primaryDiagnosis restored */}
        <Field label="Diagnosis" required>
          <input style={c.input} value={data.primaryDiagnosis} onChange={e => set('primaryDiagnosis', e.target.value)} placeholder="e.g. Acute STEMI" />
        </Field>
        <Field label="Reason for Transfer" required>
          <input style={c.input} value={data.transferReason} onChange={e => set('transferReason', e.target.value)} placeholder="e.g. Requires ICU-level cardiac monitoring" />
        </Field>
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Known Allergies</div>
        {data.allergies.map((a, i) => (
          <div key={i} style={c.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#444441' }}>Allergy {i + 1}</span>
              {data.allergies.length > 1 && <button style={c.removeBtn} onClick={() => removeAllergy(i)}>remove</button>}
            </div>
            <div style={c.grid3}>
              <div>
                <label style={{ ...c.label, fontSize: 11 }}>Substance<span style={c.required}>*</span></label>
                <input style={{ ...c.input, marginBottom: 0 }} value={a.name} onChange={e => setAllergy(i, 'name', e.target.value)} placeholder="e.g. Penicillin" />
              </div>
              <div>
                <label style={{ ...c.label, fontSize: 11 }}>Severity</label>
                <select style={{ ...c.select, marginBottom: 0 }} value={a.severity} onChange={e => setAllergy(i, 'severity', e.target.value)}>
                  <option>Mild</option><option>Moderate</option><option>Severe</option>
                </select>
              </div>
              <div>
                <label style={{ ...c.label, fontSize: 11 }}>Reaction</label>
                <input style={{ ...c.input, marginBottom: 0 }} value={a.reaction} onChange={e => setAllergy(i, 'reaction', e.target.value)} placeholder="e.g. Anaphylaxis" />
              </div>
            </div>
          </div>
        ))}
        <button style={c.addBtn} onClick={addAllergy}>+ Add allergy</button>
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Active Medications</div>
        {data.activeMedications.map((m, i) => (
          <div key={i} style={c.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#444441' }}>Medication {i + 1}</span>
              {data.activeMedications.length > 1 && <button style={c.removeBtn} onClick={() => removeMed(i)}>remove</button>}
            </div>
            <div style={c.grid2}>
              <div>
                <label style={{ ...c.label, fontSize: 11 }}>Name<span style={c.required}>*</span></label>
                <input style={{ ...c.input, marginBottom: 0 }} value={m.name} onChange={e => setMed(i, 'name', e.target.value)} placeholder="e.g. Metformin" />
              </div>
              <div>
                <label style={{ ...c.label, fontSize: 11 }}>Dose<span style={c.required}>*</span></label>
                <input style={{ ...c.input, marginBottom: 0 }} value={m.dose} onChange={e => setMed(i, 'dose', e.target.value)} placeholder="e.g. 500mg" />
              </div>
              <div>
                <label style={{ ...c.label, fontSize: 11 }}>Route</label>
                <select style={{ ...c.select, marginBottom: 0 }} value={m.route} onChange={e => setMed(i, 'route', e.target.value)}>
                  <option>Oral</option><option>IV</option><option>IM</option><option>Subcutaneous</option><option>Topical</option><option>Inhalation</option>
                </select>
              </div>
              <div>
                <label style={{ ...c.label, fontSize: 11 }}>Frequency<span style={c.required}>*</span></label>
                <input style={{ ...c.input, marginBottom: 0 }} value={m.frequency} onChange={e => setMed(i, 'frequency', e.target.value)} placeholder="e.g. Twice daily" />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444441', marginTop: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={m.mustNotStop} onChange={e => setMed(i, 'mustNotStop', e.target.checked)} />
              Must not stop during transfer
            </label>
          </div>
        ))}
        <button style={c.addBtn} onClick={addMed}>+ Add medication</button>
      </div>
    </>
  )
}

function StepClinical({ data, onChange, vitals, onVitalsChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v })
  const setVital = (k, v) => onVitalsChange({ ...vitals, [k]: v })
  const wc = wordCount(data.clinicalSummary)

  return (
    <>
      <div style={c.card}>
        <div style={c.cardTitle}>Last Recorded Vitals</div>
        <div style={c.grid3}>
          {[
            { key: 'bp', label: 'Blood Pressure', ph: '120/80 mmHg' },
            { key: 'pulse', label: 'Pulse', ph: '72 bpm' },
            { key: 'spo2', label: 'SpO₂', ph: '98%' },
            { key: 'temp', label: 'Temperature', ph: '37.0°C' },
            { key: 'rr', label: 'Resp. Rate', ph: '16/min' },
            { key: 'gcs', label: 'GCS', ph: '15' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label style={{ ...c.label, fontSize: 12 }}>{label}<span style={c.required}>*</span></label>
              <input style={{ ...c.input, marginBottom: 0 }} value={vitals[key]} onChange={e => setVital(key, e.target.value)} placeholder={ph} />
            </div>
          ))}
        </div>
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Clinical Summary</div>
        <Field label="Summary (max 200 words)" required>
          <textarea
            style={c.textarea}
            value={data.clinicalSummary}
            onChange={e => {
              if (wordCount(e.target.value) <= 200) set('clinicalSummary', e.target.value)
            }}
            placeholder="Describe the patient's current condition, relevant history, and clinical course..."
          />
          <div style={{ fontSize: 12, color: wc > 190 ? '#E24B4A' : '#888780', textAlign: 'right', marginBottom: 14 }}>
            {wc} / 200 words
          </div>
        </Field>

        <Field label="Recent Investigations">
          <ListInput
            items={data.recentInvestigations}
            onChange={v => set('recentInvestigations', v)}
            placeholder="e.g. ECG — ST elevation noted"
          />
        </Field>

        <Field label="Past Medical History">
          <ListInput
            items={data.pastMedicalHistory}
            onChange={v => set('pastMedicalHistory', v)}
            placeholder="e.g. Type 2 Diabetes"
          />
        </Field>

        <Field label="Surgical History">
          <ListInput
            items={data.surgicalHistory}
            onChange={v => set('surgicalHistory', v)}
            placeholder="e.g. Appendectomy 2018"
          />
        </Field>
      </div>
    </>
  )
}

// ✅ CHANGE 2: StepHospital now also collects sendingFacility fields
function StepHospital({ data, onChange, sending, onSendingChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v })
  const setSending = (k, v) => onSendingChange({ ...sending, [k]: v })
  return (
    <>
      <div style={c.card}>
        <div style={c.cardTitle}>Sending Facility</div>
        <Field label="Hospital ID" required>
          <input
            style={c.input}
            value={sending.hospitalID}
            onChange={e => setSending('hospitalID', e.target.value)}
            placeholder="e.g. 69c7db91857aecc7c32ab6ee"
          />
        </Field>
        <Field label="Doctor ID" required>
          <input
            style={c.input}
            value={sending.doctorID}
            onChange={e => setSending('doctorID', e.target.value)}
            placeholder="e.g. USR001"
          />
        </Field>
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Receiving Hospital</div>
        <Field label="Hospital Name" required>
          <input style={c.input} value={data.hospitalName} onChange={e => set('hospitalName', e.target.value)} placeholder="e.g. Banaras Hindu University Hospital" />
        </Field>
        <Field label="Department" required>
          <input style={c.input} value={data.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Cardiology ICU" />
        </Field>
        <Field label="Hospital ID (if known)">
          <input style={c.input} value={data.hospitalID} onChange={e => set('hospitalID', e.target.value)} placeholder="e.g. HOSP-BHU-001" />
        </Field>
      </div>
    </>
  )
}

function StepConfirm({ form }) {
  const { patient, critical, clinical, vitals, receivingFacility, sendingFacility } = form
  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '0.5px solid #F8F7F4', gap: 12 }}>
      <span style={{ fontSize: 13, color: '#888780', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#1A1A18', fontWeight: 500, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  )
  return (
    <>
      <div style={{ ...c.card, border: '1.5px solid #E24B4A', background: '#FCEBEB' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#791F1F', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Review before submitting</div>
        <p style={{ fontSize: 13, color: '#A32D2D' }}>Check all fields carefully. Once submitted, a QR code will be generated and the transfer record will be locked.</p>
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Patient</div>
        <Row label="Name" value={patient.name} />
        <Row label="Age / Gender" value={`${patient.age} yrs · ${patient.gender}`} />
        <Row label="Patient ID" value={patient.patientID} />
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Critical</div>
        {/* ✅ CHANGE 3: primaryDiagnosis in confirm summary */}
        <Row label="Diagnosis" value={critical.primaryDiagnosis} />
        <Row label="Transfer reason" value={critical.transferReason} />
        <Row label="Allergies" value={critical.allergies.map(a => `${a.name} (${a.severity})`).join(', ')} />
        <Row label="Medications" value={critical.activeMedications.map(m => m.name).join(', ')} />
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Vitals</div>
        <Row label="BP" value={vitals.bp} />
        <Row label="Pulse" value={vitals.pulse} />
        <Row label="SpO₂" value={vitals.spo2} />
        <Row label="Temp" value={vitals.temp} />
        <Row label="RR" value={vitals.rr} />
        <Row label="GCS" value={vitals.gcs} />
      </div>

      {/* ✅ CHANGE 2: sendingFacility in confirm summary */}
      <div style={c.card}>
        <div style={c.cardTitle}>Sending Facility</div>
        <Row label="Hospital ID" value={sendingFacility.hospitalID} />
        <Row label="Doctor ID" value={sendingFacility.doctorID} />
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Receiving Hospital</div>
        <Row label="Hospital" value={receivingFacility.hospitalName} />
        <Row label="Department" value={receivingFacility.department} />
      </div>
    </>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function TransferRecord() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [transferID, setTransferID] = useState('')

  const setPatient = v => setForm(f => ({ ...f, patient: v }))
  const setCritical = v => setForm(f => ({ ...f, critical: v }))
  const setClinical = v => setForm(f => ({ ...f, clinical: v }))
  const setVitals = v => setForm(f => ({ ...f, vitals: v }))
  const setHospital = v => setForm(f => ({ ...f, receivingFacility: v }))
  const setSending = v => setForm(f => ({ ...f, sendingFacility: v }))  // ✅ CHANGE 2

  function validate() {
    const errs = []
    const { patient, critical, clinical, vitals, receivingFacility, sendingFacility } = form

    if (step === 0) {
      if (!patient.name.trim()) errs.push('Patient name is required')
      if (!patient.age) errs.push('Age is required')
      if (!patient.patientID.trim()) errs.push('Patient ID is required')
    }
    if (step === 1) {
      // ✅ CHANGE 3: validate primaryDiagnosis
      if (!critical.primaryDiagnosis.trim()) errs.push('Primary diagnosis is required')
      if (!critical.transferReason.trim()) errs.push('Reason for transfer is required')
      if (critical.allergies.some(a => !a.name.trim())) errs.push('All allergy entries must have a substance name')
      if (critical.activeMedications.some(m => !m.name.trim() || !m.dose.trim() || !m.frequency.trim())) errs.push('All medications must have name, dose, and frequency')
    }
    if (step === 2) {
      const vitalFields = ['bp', 'pulse', 'spo2', 'temp', 'rr', 'gcs']
      if (vitalFields.some(k => !vitals[k].trim())) errs.push('All vital signs are required')
      if (!clinical.clinicalSummary.trim()) errs.push('Clinical summary is required')
    }
    if (step === 3) {
      // ✅ CHANGE 2: validate sendingFacility
      if (!sendingFacility.hospitalID.trim()) errs.push('Sending hospital ID is required')
      if (!sendingFacility.doctorID.trim()) errs.push('Doctor ID is required')
      if (!receivingFacility.hospitalName.trim()) errs.push('Receiving hospital name is required')
      if (!receivingFacility.department.trim()) errs.push('Department is required')
    }
    return errs
  }

  function next() {
    const errs = validate()
    if (errs.length) { setErrors(errs); window.scrollTo(0, 0); return }
    setErrors([])
    setStep(s => s + 1)
    window.scrollTo(0, 0)
  }

  function back() {
    setErrors([])
    setStep(s => s - 1)
    window.scrollTo(0, 0)
  }

  async function submit() {
    setSubmitting(true)
    try {
      const payload = {
        patient: form.patient,
        critical: form.critical,
        clinical: form.clinical,
        vitals: form.vitals,
        sendingFacility: form.sendingFacility,      // ✅ CHANGE 2
        receivingFacility: form.receivingFacility,
      }
      const res = await fetch(`${API}/transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      // ✅ CHANGE 1: read transfer.transferID correctly per DB schema
      const tid = json?.transfer?.transferID || json?.transferID || json?._id || 'SUBMITTED'
      setTransferID(tid)
      setSubmitted(true)
    } catch (err) {
      setErrors([`API error: ${err.message}. Check that your backend is running at ${API}`])
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div style={c.successPage}>
        <div style={c.checkCircle}>✓</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, marginBottom: 8 }}>Transfer record created</h2>
        <p style={{ color: '#888780', fontSize: 14, marginBottom: 4 }}>Transfer ID</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#1A1A18', background: '#EEECEA', padding: '6px 14px', borderRadius: 8, marginBottom: 24 }}>{transferID}</p>
        <p style={{ fontSize: 14, color: '#888780', maxWidth: 320 }}>The QR code has been generated in your Expo app. The receiving team can scan it to view this record.</p>
        <button
          style={{ ...c.btnPrimary, marginTop: 24, maxWidth: 280 }}
          onClick={() => { setForm(initialState); setStep(0); setSubmitted(false); setTransferID('') }}
        >
          Create another transfer
        </button>
      </div>
    )
  }

  return (
    <div style={c.page}>
      <div style={c.topbar}>
        <div>
          <div style={c.topbarTitle}>New Transfer Record</div>
          <div style={c.topbarSub}>Step {step + 1} of {STEPS.length}</div>
        </div>
        <div style={{ fontSize: 12, color: '#888780' }}>MEDICO</div>
      </div>

      <div style={c.stepper}>
        {STEPS.map((s, i) => (
          <button key={i} style={c.stepBtn(i === step, i < step)} onClick={() => i < step && setStep(i)}>
            {i < step ? '✓ ' : ''}{s}
          </button>
        ))}
      </div>

      <div style={c.body}>
        {errors.length > 0 && (
          <div style={c.errorBox}>
            {errors.map((e, i) => <div key={i}>• {e}</div>)}
          </div>
        )}

        {step === 0 && <StepPatient data={form.patient} onChange={setPatient} />}
        {step === 1 && <StepCritical data={form.critical} onChange={setCritical} />}
        {step === 2 && <StepClinical data={form.clinical} onChange={setClinical} vitals={form.vitals} onVitalsChange={setVitals} />}
        {/* ✅ CHANGE 2: pass sending props to StepHospital */}
        {step === 3 && <StepHospital data={form.receivingFacility} onChange={setHospital} sending={form.sendingFacility} onSendingChange={setSending} />}
        {step === 4 && <StepConfirm form={form} />}

        <div style={c.navRow}>
          {step > 0 && <button style={c.btnSecondary} onClick={back}>Back</button>}
          {step < STEPS.length - 1 && <button style={c.btnPrimary} onClick={next}>Continue</button>}
          {step === STEPS.length - 1 && (
            <button
              style={{ ...c.btnPrimary, background: submitting ? '#888780' : '#1D9E75', cursor: submitting ? 'not-allowed' : 'pointer' }}
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Transfer Record'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}