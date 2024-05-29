const { OTP } = require('../db/models'); // Import your OTP model

class OTPServices {
  // Function to create a new OTP
  static async createOTP(data) {
    try {
      const otp = await OTP.create(data);
      return otp;
    } catch (error) {
      throw new Error('Could not create OTP');
    }
  }

  // Function to get all OTPs
  static async getAllOTPs() {
    try {
      const otps = await OTP.findAll();
      return otps;
    } catch (error) {
      throw new Error('Could not retrieve OTPs');
    }
  }

  // Function to get an OTP by ID
  static async getOTPById(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error('OTP not found');
      }
      return otp;
    } catch (error) {
      throw new Error('Could not retrieve OTP');
    }
  }

  // Function to update an OTP
  static async updateOTP(id, data) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error('OTP not found');
      }
      await otp.update(data);
      return otp;
    } catch (error) {
      throw new Error('Could not update OTP');
    }
  }

  // Function to delete an OTP
  static async deleteOTP(id) {
    try {
      const otp = await OTP.findByPk(id);
      if (!otp) {
        throw new Error('OTP not found');
      }
      await otp.destroy();
      return otp;
    } catch (error) {
      throw new Error('Could not delete OTP');
    }
  }
}

module.exports = OTPServices;
