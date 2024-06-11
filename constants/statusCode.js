// constants/statusCode.js
const statusCodes = {
  OK: { code: 0, message: "OK" },
  USER_NOT_FOUND: { code: 1, message: "User not found" },
  USER_ALREADY_REGISTERED: { code: 2, message: "User already registered" },
  INVALID_PASSWORD: { code: 3, message: "Incorrect Password" },
  INVALID_CHAT_ID: { code: 4, message: "Invalid Chat ID" },
  OTP_VERIFICATION_FAILED: { code: 5, message: "OTP Verification Failed" },
  INTERNAL_SERVER_ERROR: { code: 6, message: "Internal Server Error" },
  UNREGISTERED_USER_CREATED: { code: 7, message: "Unregistered user created" },
  OTP_SENT: { code: 8, message: "OTP sent" },
  PASSWORD_UPDATED: { code: 9, message: "Password updated successfully" },
  USER_REGISTERED: { code: 10, message: "User registered successfully" },
  USER_LOGGED_IN: { code: 11, message: "User logged in successfully" },
  USER_ALREADY_LOGGED_IN: { code: 12, message: "User already logged in" },
  FAILED_TO_SEND_OTP: { code: 13, message: "Failed to send OTP" },
  FORBIDDEN: { code: 14, message: "User is not logged in" },
};

module.exports = { statusCodes };
