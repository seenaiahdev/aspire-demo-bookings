const supabase = require('../config/supabaseClient');
const { signBookingToken } = require('../middleware/authMiddleware');

const TABLE_NAME = process.env.SUPABASE_TABLE_NAME || 'demo_bookings';

/**
 * Generate a unique registration ID (e.g., ASP-784291)
 */
function generateRegistrationId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ASP-${randomNum}`;
}

/**
 * Controller: Register a new demo booking in Supabase
 */
async function createBooking(req, res) {
  try {
    const { fullName, mobile, email, fieldOfStudy, yearOfStudy, demoSlot } = req.body;

    const isSupabaseConfigured =
      process.env.SUPABASE_URL &&
      !process.env.SUPABASE_URL.includes('your-project-ref') &&
      process.env.SUPABASE_ANON_KEY &&
      !process.env.SUPABASE_ANON_KEY.includes('your-supabase');

    let registrationId = generateRegistrationId();
    let createdRecord = null;

    if (isSupabaseConfigured) {
      // 1. Duplicate check by email or mobile in Supabase target table
      const { data: existingBookings, error: checkError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .or(`email.eq.${email},mobile.eq.${mobile}`);

      if (checkError) {
        console.warn('[Supabase Duplicate Check Warning]:', checkError.message);
      } else if (existingBookings && existingBookings.length > 0) {
        const isEmailDup = existingBookings.some((b) => b.email && b.email.toLowerCase() === email.toLowerCase());
        const isMobileDup = existingBookings.some((b) => b.mobile === mobile);

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

      // 2. Insert into `demo_bookings` table (supports both snake_case and camelCase schema)
      const snakeCasePayload = {
        registration_id: registrationId,
        full_name: fullName,
        mobile: mobile,
        email: email,
        field_of_study: fieldOfStudy,
        year_of_study: yearOfStudy,
        demo_slot: demoSlot,
      };

      const camelCasePayload = {
        registrationId: registrationId,
        fullName: fullName,
        mobile: mobile,
        email: email,
        fieldOfStudy: fieldOfStudy,
        yearOfStudy: yearOfStudy,
        demoSlot: demoSlot,
      };

      // Try snake_case insertion first (standard PostgreSQL)
      let { data, error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert([snakeCasePayload])
        .select()
        .single();

      // If column error occurs, fallback to camelCase insertion
      if (insertError && (insertError.message.includes('column') || insertError.code === 'PGRST204')) {
        console.log(`[Supabase Retry] Trying camelCase column names for ${TABLE_NAME} table...`);
        const retryResult = await supabase
          .from(TABLE_NAME)
          .insert([camelCasePayload])
          .select()
          .single();

        data = retryResult.data;
        insertError = retryResult.error;
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

    // 3. Prepare payload for JWT token
    const tokenPayload = {
      registrationId,
      fullName,
      mobile,
      email,
      fieldOfStudy,
      yearOfStudy,
      demoSlot,
      createdAt: createdRecord ? (createdRecord.created_at || createdRecord.createdAt) : new Date().toISOString(),
    };

    // 4. Sign JWT token
    const token = signBookingToken(tokenPayload);

    return res.status(201).json({
      success: true,
      message: 'Demo booking registered successfully in Supabase!',
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

/**
 * Controller: Verify session JWT token and return booking details
 */
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

/**
 * Controller: Get all demo bookings from Supabase
 */
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


