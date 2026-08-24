/**
 * bookingController.js — Booking API Controller
 * Manages database insertion into Supabase, duplicate validation checks, JWT session signing, and booking retrieval.
 */

const supabase = require('../config/supabaseClient');
const { signBookingToken } = require('../middleware/authMiddleware');
const { syncBookingToGoogleSheet } = require('../services/googleSheetsService');

const TABLE_NAME = process.env.SUPABASE_TABLE_NAME || 'demo_bookings';

function generateRegistrationId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ASP-${randomNum}`;
}

function generateUserPassword(fullName, mobile) {
  const firstName = (fullName || 'user').trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const last4 = (mobile || '0000').trim().slice(-4);
  return `${firstName}@${last4}`;
}

async function createBooking(req, res) {
  try {
    const { fullName, mobile, email, fieldOfStudy, yearOfStudy, demoSlot } = req.body;
    // Prefix +91 country code before storing (user inputs 10-digit number)
    const normalizedMobile = '91' + mobile.trim();
    const generatedPassword = generateUserPassword(fullName, normalizedMobile);

    const isSupabaseConfigured =
      process.env.SUPABASE_URL &&
      !process.env.SUPABASE_URL.includes('your-project-ref') &&
      process.env.SUPABASE_ANON_KEY &&
      !process.env.SUPABASE_ANON_KEY.includes('your-supabase');

    let registrationId = generateRegistrationId();
    let createdRecord = null;

    if (isSupabaseConfigured) {
      const { data: existingBookings, error: checkError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .or(`email.eq.${email},mobile.eq.${normalizedMobile}`);

      if (checkError) {
        console.warn('[Supabase Duplicate Check Warning]:', checkError.message);
      } else if (existingBookings && existingBookings.length > 0) {
        const isEmailDup = existingBookings.some((b) => b.email && b.email.toLowerCase() === email.toLowerCase());
        const isMobileDup = existingBookings.some((b) => b.mobile === normalizedMobile);

        if (isEmailDup && isMobileDup) {
          return res.status(409).json({
            success: false,
            message: 'Duplicate submission: A demo booking with this Email Address and Mobile Number already exists.',
            field: 'email',
          });
        }
        if (isEmailDup) {
          return res.status(409).json({
            success: false,
            message: 'Duplicate submission: A demo booking with this Email Address already exists.',
            field: 'email',
          });
        }
        if (isMobileDup) {
          return res.status(409).json({
            success: false,
            message: 'Duplicate submission: A demo booking with this Mobile Number already exists.',
            field: 'mobile',
          });
        }
      }

      const snakeCasePayload = {
        registration_id: registrationId,
        full_name: fullName,
        mobile: normalizedMobile,
        email: email,
        field_of_study: fieldOfStudy,
        year_of_study: yearOfStudy,
        demo_slot: demoSlot,
        generated_password: generatedPassword,
      };

      const camelCasePayload = {
        registrationId: registrationId,
        fullName: fullName,
        mobile: normalizedMobile,
        email: email,
        fieldOfStudy: fieldOfStudy,
        yearOfStudy: yearOfStudy,
        demoSlot: demoSlot,
        generatedPassword: generatedPassword,
      };

      let { data, error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert([snakeCasePayload])
        .select()
        .single();

      if (insertError && (insertError.message.includes('column') || insertError.code === 'PGRST204')) {
        const retryResult = await supabase
          .from(TABLE_NAME)
          .insert([camelCasePayload])
          .select()
          .single();

        data = retryResult.data;
        insertError = retryResult.error;
      }

      // If database table doesn't have generated_password column yet, fallback to base payload
      if (insertError && insertError.message.includes('column')) {
        const baseSnakePayload = {
          registration_id: registrationId,
          full_name: fullName,
          mobile: normalizedMobile,
          email: email,
          field_of_study: fieldOfStudy,
          year_of_study: yearOfStudy,
          demo_slot: demoSlot,
        };
        const fallbackResult = await supabase
          .from(TABLE_NAME)
          .insert([baseSnakePayload])
          .select()
          .single();

        data = fallbackResult.data;
        insertError = fallbackResult.error;
      }

      if (insertError) {
        console.error('[Supabase Insert Error]:', insertError);
        if (insertError.code === '23505') {
          return res.status(409).json({
            success: false,
            message: 'Duplicate submission detected in database. Email or Mobile already registered.',
          });
        }
        return res.status(500).json({
          success: false,
          message: 'Failed to save booking to Supabase database.',
          error: insertError.message,
        });
      }

      createdRecord = data;
      registrationId = data.registration_id || data.registrationId || registrationId;
    }

    const tokenPayload = {
      registrationId,
      fullName,
      mobile: normalizedMobile,
      email,
      fieldOfStudy,
      yearOfStudy,
      demoSlot,
      password: generatedPassword,
      generatedPassword,
      createdAt: createdRecord ? (createdRecord.created_at || createdRecord.createdAt) : new Date().toISOString(),
    };

    const token = signBookingToken(tokenPayload);

    // Await Google Sheets sync so Vercel Serverless container waits for execution
    await syncBookingToGoogleSheet(tokenPayload);

    return res.status(201).json({
      success: true,
      message: 'Demo booking registered successfully in Supabase and queued for Google Sheets sync!',
      token,
      data: tokenPayload,
    });
  } catch (error) {
    console.error('[Booking Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred while processing registration.',
      error: error.message,
    });
  }
}

async function verifySession(req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: 'Session token verified successfully.',
      booking: req.userBooking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying session token.',
      error: error.message,
    });
  }
}

async function getAllBookings(req, res) {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }

    return res.status(200).json({
      success: true,
      count: data ? data.length : 0,
      data: data || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
}

module.exports = {
  createBooking,
  verifySession,
  getAllBookings,
  getBookings: getAllBookings,
};
