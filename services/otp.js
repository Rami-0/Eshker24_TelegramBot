const { OTP } = require('../db/models'); // Import your OTP model

class OTPServices {
	// Function to create a new OTP
	static async createOTP(data) {
		try {
			const otp = await OTP.create(data);
			return otp;
		} catch (error) {
			throw new Error('Could not create OTP: ' + error.message);
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
	static async verifyOtp(User_id, otp) {
		try {
			// Ensure User_id is a string if the database expects it as a string
			const userIdStr = String(User_id);
      const otpStr = String(otp);
			const _otp = await OTP.findOne({ where: { otp: otpStr, User_id: userIdStr } });
			if (!_otp) {
				throw new Error('OTP not found');
			}

			// Check if OTP has already been used
			if (_otp.status_flag) {
				return 'OTP has already been used';
			}

			// Check if OTP is expired
			if (new Date() > new Date(_otp.expiry)) {
				// Update the status_flag to true
				_otp.status_flag = true;
				await _otp.save();
				return 'OTP has expired';
			}

			// Update the status_flag to true
			_otp.status_flag = true;
			await _otp.save();
			return 'success';
		} catch (error) {
			return 'fail ' + error.message;
		}
	}
}

module.exports = OTPServices;
