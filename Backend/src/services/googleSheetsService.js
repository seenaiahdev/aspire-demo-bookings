/**
 * googleSheetsService.js — Google Sheets Sync Service
 * Sends new registration data asynchronously to Google Apps Script Webhook.
 */

async function syncBookingToGoogleSheet(bookingData) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes('your-google-script-url') || !webhookUrl.startsWith('http')) {
    console.log('[Google Sheets Sync]: GOOGLE_SHEETS_WEBHOOK_URL not configured. Skipping Google Sheet sync.');
    return false;
  }

  try {
    const payload = {
      registrationId: bookingData.registrationId || bookingData.registration_id,
      fullName: bookingData.fullName || bookingData.full_name,
      mobile: bookingData.mobile,
      email: bookingData.email,
      fieldOfStudy: bookingData.fieldOfStudy || bookingData.field_of_study,
      yearOfStudy: bookingData.yearOfStudy || bookingData.year_of_study,
      demoSlot: bookingData.demoSlot || bookingData.demo_slot,
      password: bookingData.password || bookingData.generated_password,
      createdAt: bookingData.createdAt || bookingData.created_at || new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`[Google Sheets Sync]: Successfully pushed registration ${payload.registrationId} to Google Sheet (Status: ${response.status})`);
    return true;
  } catch (error) {
    console.error('[Google Sheets Sync Error]: Failed to push data to Google Sheet:', error.message);
    return false;
  }
}

module.exports = {
  syncBookingToGoogleSheet,
};
