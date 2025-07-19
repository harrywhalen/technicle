// IGNORE THIS FOR NOW, THIS IS FOR CLOUD FUNCTIONS, BETTER WHEN SCALED ON BLAZE PLAN

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

exports.submitFeedback = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { feedback, timestamp, userAgent, url } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // Server-side rate limiting
    const today = new Date().toDateString();
    const rateLimitRef = admin.firestore().collection('rateLimits').doc(`${clientIP}-${today}`);
    const rateLimitDoc = await rateLimitRef.get();
    
    if (rateLimitDoc.exists && rateLimitDoc.data().count >= 3) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }

    // Store feedback in Firestore
    await admin.firestore().collection('feedback').add({
      feedback,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userAgent,
      url,
      ip: clientIP,
      processed: false
    });

    // Update rate limit
    await rateLimitRef.set({
      count: rateLimitDoc.exists ? rateLimitDoc.data().count + 1 : 1,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Send email notification
    await transporter.sendMail({
      from: functions.config().email.user,
      to: 'feedback@yourcompany.com',
      subject: 'New Feedback Received',
      html: `
        <h3>New Feedback</h3>
        <p><strong>Message:</strong> ${feedback}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
        <p><strong>Page:</strong> ${url}</p>
        <p><strong>IP:</strong> ${clientIP}</p>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing feedback:', error);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});