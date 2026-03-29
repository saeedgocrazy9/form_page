import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import { sendAcknowledgementNotification, sendTestEmail, verifyEmailConfig } from './emailService.js'

const app = express()
const PORT = process.env.PORT || 3000

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://amankhan:aman@expensetracker.wyvfc2h.mongodb.net/'
const DB_NAME = 'medico'
const COLLECTION_NAME = 'transfers'

let db
let client

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(MONGO_URI)
    await client.connect()
    db = client.db(DB_NAME)
    console.log('✓ Connected to MongoDB')
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error)
    process.exit(1)
  }
}

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running' })
})

function listFromInput(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeAllergies(value) {
  if (!value) return []
  if (!Array.isArray(value)) {
    return listFromInput(value).map((name) => ({ name }))
  }

  return value
    .map((item) => {
      if (!item) return null
      if (typeof item === 'string') {
        const name = item.trim()
        return name ? { name } : null
      }

      const name = String(item.name || '').trim()
      if (!name) return null
      return {
        name,
        severity: item.severity || 'Moderate',
        reaction: item.reaction || '',
      }
    })
    .filter(Boolean)
}

function normalizeMedications(value) {
  if (!value) return []
  if (!Array.isArray(value)) {
    return listFromInput(value).map((name) => ({ name }))
  }

  return value
    .map((item) => {
      if (!item) return null
      if (typeof item === 'string') {
        const name = item.trim()
        return name ? { name } : null
      }

      const name = String(item.name || '').trim()
      if (!name) return null
      return {
        name,
        dose: item.dose || '',
        route: item.route || 'Oral',
        frequency: item.frequency || '',
        mustNotStop: Boolean(item.mustNotStop),
      }
    })
    .filter(Boolean)
}

function buildQrPayload(transferID, payload) {
  const allergies = normalizeAllergies(payload.allergies)
  const activeMedications = normalizeMedications(payload.activeMedications)
  return JSON.stringify({
    transferID,
    patient: {
      patientID: payload.patientID,
      name: payload.patientName,
      age: Number(payload.age) || null,
    },
    critical: {
      transferReason: payload.transferReason,
      primaryDiagnosis: payload.primaryDiagnosis || '',
      allergies,
      activeMedications,
    },
    vitals: payload.vitals || {},
    sendingFacility: {
      hospitalID: payload.sendingHospitalID,
      hospitalName: payload.receivingHospitalName || '',
    },
  })
}

// Create transfer record
app.post('/api/transfers', async (req, res) => {
  try {
    const payload = req.body || {}

    if (!payload.patientName || !payload.patientID || !payload.transferReason || !payload.sendingHospitalID) {
      return res.status(400).json({
        error: 'patientName, patientID, transferReason and sendingHospitalID are required',
      })
    }

    const now = new Date()
    const transferID = payload.transferID || `TXF_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    const document = {
      patient: {
        name: payload.patientName,
        age: Number(payload.age) || null,
        patientID: payload.patientID,
        gender: payload.gender || '',
      },
      vitals: payload.vitals || {},
      critical: {
        primaryDiagnosis: payload.primaryDiagnosis || '',
        allergies: normalizeAllergies(payload.allergies),
        activeMedications: normalizeMedications(payload.activeMedications),
        transferReason: payload.transferReason,
      },
      clinical: {
        recentInvestigations: listFromInput(payload.recentInvestigations),
        pastMedicalHistory: listFromInput(payload.pastMedicalHistory),
        surgicalHistory: listFromInput(payload.surgicalHistory),
        clinicalSummary: payload.clinicalSummary || '',
        clinicalSummaryVoice: false,
      },
      sendingFacility: {
        hospitalID: payload.sendingHospitalID,
        doctorName: payload.doctorName || '',
        doctorID: payload.doctorID || '',
        doctorEmail: payload.doctorEmail || '',
        hospitalName: payload.sendingHospitalName || payload.sendingHospitalID || '',
        timestamp: now,
      },
      receivingFacility: {
        hospitalName: payload.receivingHospitalName || '',
        hospitalID: payload.receivingHospitalID || '',
        department: payload.receivingDepartment || '',
      },
      transfer: {
        transferID,
        status: payload.status || 'Pending',
      },
      acknowledgement: {
        flaggedIssues: [],
        immediateActions: [],
        synced: false,
        discrepancies: [],
      },
      interactionCheck: {
        status: 'Pending',
        conflicts: [],
      },
      sharing: {
        qrCodeData: buildQrPayload(transferID, payload),
        shareToken: Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
        readonlyLink: true,
        linkedRecords: [],
      },
      sync: {
        createdLocally: false,
        syncedToServer: true,
        syncedAt: now,
        lastModified: now,
        version: 1,
      },
      audit: {
        deleted: false,
        editHistory: [],
      },
      relatedTransfers: [],
      createdAt: now,
      updatedAt: now,
      __v: 0,
    }

    const result = await db.collection(COLLECTION_NAME).insertOne(document)

    return res.status(201).json({
      message: 'Transfer record created',
      transferID,
      id: result.insertedId,
      data: document,
    })
  } catch (error) {
    console.error('Error creating transfer:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Fetch transfer by ID
app.get('/api/transfers/:transferID', async (req, res) => {
  try {
    const { transferID } = req.params

    // Query by transferID (string field)
    const transfer = await db.collection(COLLECTION_NAME).findOne({
      'transfer.transferID': transferID
    })

    if (!transfer) {
      return res.status(404).json({ error: 'Transfer record not found' })
    }

    res.json(transfer)
  } catch (error) {
    console.error('Error fetching transfer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Fetch latest transfer
app.get('/api/transfers-latest', async (req, res) => {
  try {
    const latestTransfer = await db.collection(COLLECTION_NAME).find({}).sort({ createdAt: -1 }).limit(1).next()

    if (!latestTransfer) {
      return res.status(404).json({ error: 'No transfer records found' })
    }

    res.json(latestTransfer)
  } catch (error) {
    console.error('Error fetching latest transfer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Acknowledge transfer and optionally send discrepancy notification email
app.post('/api/transfers/:transferID/acknowledge', async (req, res) => {
  try {
    const { transferID } = req.params
    const payload = req.body || {}
    const now = new Date()

    const discrepancies = Array.isArray(payload.discrepancies)
      ? payload.discrepancies
      : []

    const acknowledgement = {
      reviewed: true,
      reviewedBy: {
        name: payload.reviewedByName || 'Receiving Doctor',
        role: payload.reviewedByRole || 'Doctor',
        timestamp: now,
      },
      arrivalNotes: payload.arrivalNotes || '',
      discrepancies,
      flaggedIssues: Array.isArray(payload.flaggedIssues) ? payload.flaggedIssues : [],
      immediateActions: Array.isArray(payload.immediateActions) ? payload.immediateActions : [],
      acknowledgementTime: now,
      synced: true,
      syncedAt: now,
    }

    const updatedDoc = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { 'transfer.transferID': transferID },
      {
        $set: {
          acknowledgement,
          'transfer.status': 'Received',
          'transfer.actualArrivalTime': now,
          updatedAt: now,
        },
      },
      { returnDocument: 'after' }
    )

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Transfer record not found' })
    }

    const transferData = {
      patient: updatedDoc.patient,
      sendingDoctor: {
        email:
          payload.sendingDoctorEmail ||
          updatedDoc.sendingFacility?.doctorEmail ||
          '',
      },
      sendingFacility: updatedDoc.sendingFacility,
      receivingFacility: updatedDoc.receivingFacility,
      acknowledgement,
      transfer: updatedDoc.transfer,
    }

    const emailResult = await sendAcknowledgementNotification(transferData)

    return res.json({
      message: 'Acknowledgement saved',
      transferID,
      email: emailResult,
      data: updatedDoc,
    })
  } catch (error) {
    console.error('Error acknowledging transfer:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Verify email configuration
app.get('/api/email/verify', async (req, res) => {
  const result = await verifyEmailConfig()
  if (!result.success) {
    return res.status(400).json(result)
  }
  return res.json(result)
})

// Send test email
app.post('/api/email/test', async (req, res) => {
  const { recipientEmail } = req.body || {}

  if (!recipientEmail) {
    return res.status(400).json({ success: false, error: 'recipientEmail is required' })
  }

  const result = await sendTestEmail(recipientEmail)
  if (!result.success) {
    return res.status(400).json(result)
  }
  return res.json(result)
})

// Start server
async function start() {
  await connectDB()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Backend running at http://localhost:${PORT}`)
    console.log(`✓ API: GET http://localhost:${PORT}/api/transfers/{transferID}`)
    console.log(`✓ API: GET http://localhost:${PORT}/api/transfers-latest`)
    console.log(`✓ API: POST http://localhost:${PORT}/api/transfers`)
    console.log(`✓ API: POST http://localhost:${PORT}/api/transfers/{transferID}/acknowledge`)
    console.log(`✓ API: GET http://localhost:${PORT}/api/email/verify`)
    console.log(`✓ API: POST http://localhost:${PORT}/api/email/test`)
  })
}

start()

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) await client.close()
  process.exit(0)
})
