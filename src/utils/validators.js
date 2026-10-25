/**
 * validators.js
 * 
 * Production validation helpers with regular expressions and comments for
 * cybercrime complaint drafting. Designed for Indian scam incidents (UPI handles,
 * Indian mobile numbers, Banking UTRs, and Incident timelines).
 */

// Indian Mobile Number: 10 digits starting with 6-9, with optional +91 or +91- prefix
export const INDIAN_PHONE_REGEX = /^(?:\+91[\s\-]?)?[6-9]\d{9}$/;

// UPI ID / VPA (Virtual Payment Address): handle@bank (e.g. victim88@okhdfcbank, scammer@paytm)
export const UPI_ID_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

// Alphanumeric Transaction UTR / Ref Number (typically 6 to 30 characters for IMPS/NEFT/RTGS/UPI)
export const UTR_REGEX = /^[a-zA-Z0-9]{6,30}$/;

export const SCAM_CATEGORIES = [
  'Digital Arrest',
  'Electricity SMS',
  'OLX Reverse UPI QR',
  'Phishing KYC',
  'Telegram Job',
  'Fake Stock Trading',
  'Lottery',
  'Other',
];

/**
 * Validates whether an input is a valid Indian mobile number OR a valid UPI ID.
 * @param {string} value 
 * @returns {boolean}
 */
export const isValidPhoneOrUpi = (value) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  return INDIAN_PHONE_REGEX.test(trimmed) || UPI_ID_REGEX.test(trimmed);
};

/**
 * Validates an Indian mobile number.
 * @param {string} value 
 * @returns {boolean}
 */
export const isValidIndianPhone = (value) => {
  if (!value || typeof value !== 'string') return false;
  return INDIAN_PHONE_REGEX.test(value.trim());
};

/**
 * Validates that an incident date is present and not in the future.
 * Uses local calendar date comparison to prevent timezone parsing discrepancies.
 * @param {string} dateString - YYYY-MM-DD
 * @returns {string|null} Error message or null
 */
export const validateIncidentDate = (dateString) => {
  if (!dateString) {
    return 'Incident date is required';
  }
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return 'Please select a valid date';
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const selectedDate = new Date(year, month, day, 0, 0, 0, 0);
  if (isNaN(selectedDate.getTime())) {
    return 'Please select a valid date';
  }

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  if (selectedDate > todayDateOnly) {
    return 'Incident date cannot be in the future';
  }
  return null;
};

/**
 * Validates the full complaint draft form values according to cybercrime.gov.in requirements.
 * Returns an object with field keys mapped to error strings.
 * @param {Object} values 
 * @returns {Object} errors
 */
export const validateComplaintForm = (values = {}) => {
  const errors = {};

  // 1. Complainant Information
  // Full Legal Name (Required)
  const fullName = values.fullName || values.victimName;
  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Full legal name is required';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Please enter your complete legal name (at least 2 characters)';
  }

  // Contact Mobile Number (Required, 10-digit Indian phone validation)
  const contactPhone = values.contactPhone || values.victimPhone;
  if (!contactPhone || !contactPhone.trim()) {
    errors.contactPhone = 'Contact mobile number is required';
  } else if (!isValidIndianPhone(contactPhone)) {
    errors.contactPhone = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
  }

  // 2. Financial & Incident Particulars
  // Scam Category (Dropdown: Required)
  const scamCategory = values.scamCategory || values.scamType;
  if (!scamCategory || !scamCategory.trim()) {
    errors.scamCategory = 'Please select a scam category';
  } else if (!SCAM_CATEGORIES.includes(scamCategory) && scamCategory !== 'Other') {
    // In case legacy value was used
    if (!SCAM_CATEGORIES.some((c) => c.toLowerCase() === scamCategory.toLowerCase())) {
      errors.scamCategory = 'Please select a valid scam category from the options';
    }
  }

  // Incident Date (Required, cannot be in future)
  const dateError = validateIncidentDate(values.incidentDate);
  if (dateError) {
    errors.incidentDate = dateError;
  }

  // Amount Lost in ₹ (Required, numeric, enter 0 if blocked in time)
  if (values.amountLost === undefined || values.amountLost === null || values.amountLost === '') {
    errors.amountLost = 'Amount lost is required (enter 0 if funds were blocked in time)';
  } else {
    const num = Number(values.amountLost);
    if (isNaN(num) || num < 0) {
      errors.amountLost = 'Amount lost must be a valid number (0 or greater)';
    }
  }

  // Transaction Reference / 12-digit UTR Number (Required)
  const transactionId = values.transactionId || values.transactionReference;
  if (!transactionId || !transactionId.trim()) {
    errors.transactionId = 'Transaction Reference or 12-digit UTR Number is required';
  } else if (transactionId.trim().length < 4) {
    errors.transactionId = 'Transaction Reference / UTR must be at least 4 characters';
  }

  // 3. Attacker Coordinates & Narrative
  // Scammer's Phone / UPI ID / URL (Required)
  const scammerIdentifier = values.scammerIdentifier || values.scammerContact;
  if (!scammerIdentifier || !scammerIdentifier.trim()) {
    errors.scammerIdentifier = "Scammer's Phone, UPI ID, or URL is required";
  }

  // Victim's Bank Name & Card/Account Ending 4 digits (Required)
  const victimBankDetails = values.victimBankDetails || values.bankName;
  if (!victimBankDetails || !victimBankDetails.trim()) {
    errors.victimBankDetails = "Victim's Bank Name and Card/Account Ending 4 digits are required";
  }

  // Chronological Description of Incident (Required, textarea, min 20 characters)
  const description = values.incidentDescription || values.description;
  if (!description || !description.trim()) {
    errors.incidentDescription = 'Chronological description of the incident is required';
  } else if (description.trim().length < 20) {
    const len = description.trim().length;
    errors.incidentDescription = `Description must be at least 20 characters (${len}/20 provided)`;
  }

  return errors;
};
