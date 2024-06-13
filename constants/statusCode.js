// constants/statusCode.js
const statusCodes = {
  OK: { code: 0, message: "OK", success: 0 },
  USER_NOT_FOUND: { code: 1, message: "User not found" },
  USER_ALREADY_REGISTERED: { code: 2, message: "User already registered" },
  INVALID_PASSWORD: { code: 3, message: "Incorrect Password" },
  INVALID_CHAT_ID: { code: 4, message: "Invalid Chat ID" },
  OTP_VERIFICATION_FAILED: { code: 5, message: "OTP Verification Failed" },
  INTERNAL_SERVER_ERROR: { code: 6, message: "Internal Server Error" },
  UNREGISTERED_USER_CREATED: { code: 7, message: "Unregistered user created", success: 0 },
  OTP_SENT: { code: 8, message: "OTP sent", success: 0 },
  PASSWORD_UPDATED: { code: 9, message: "Password updated successfully", success: 0 },
  USER_REGISTERED: { code: 10, message: "User registered successfully", success: 0 },
  USER_LOGGED_IN: { code: 11, message: "User logged in successfully", success: 0 },
  USER_ALREADY_LOGGED_IN: { code: 12, message: "User already logged in" },
  FAILED_TO_SEND_OTP: { code: 13, message: "Failed to send OTP" },
  FORBIDDEN: { code: 14, message: "User is not logged in" },
  UNAUTHORIZED: { code: 15, message: "Unauthorized: No authorization header provided" },
  UNAUTHORIZED_KEY: { code: 16, message: "Unauthorized: INVALID KEY" },
  USER_DELETED: { code: 17, message: "User deleted", success: 0 },
  USER_ACTIVATED: { code: 18, message: "User activated", success: 0 },
  USER_ALREADY_ACTIVATED: { code: 19, message: "User already activated" },
  USER_IS_NOT_REGISTERED: { code: 20, message: "User is not registered" },
  USER_DEACTIVATED: { code: 21, message: "User deactivated", success: 0 },
  USER_ALREADY_DEACTIVATED: { code: 22, message: "User already deactivated" },
  INVALID_INPUT: { code: 23, message: "INNs should be a non-empty array" },
};

module.exports = { statusCodes };
