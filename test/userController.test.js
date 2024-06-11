const speakeasy = require('speakeasy');
const UserController = require('../controller/user.controller'); // Adjust the path according to your project structure
const UserServices = require('../services/user');
const OTPServices = require('../services/otp');
const { sendMessage } = require('../api/api');
const { statusCodes } = require('../constants/statusCode');

// Mocking the services
jest.mock('../services/user');
jest.mock('../services/otp');
jest.mock('../api/api');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setAuth', () => {
    it('should create an unregistered user and return 200 if user not found', async () => {
      UserServices.findByINN.mockResolvedValue(null);
      UserServices.CreateUserWithINN.mockResolvedValue({ user: { INN: '123456', ChatID: 'chat123' } });

      req.body = { INN: '123456', chatId: 'chat123' };

      await UserController.setAuth(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(UserServices.CreateUserWithINN).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: { INN: '123456', ChatID: 'chat123' } }));
    });

    it('should return 400 if user already registered on a different account', async () => {
      UserServices.findByINN.mockResolvedValue({ message: 'user already registered on a different account' });

      req.body = { INN: '123456', chatId: 'chat123' };

      await UserController.setAuth(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'user already registered on a diffrent account want to change that?' });
    });

    it('should update user and return 300 if ChatID matches', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { ChatID: 'chat123' } });
      UserServices.updateUserAndCreateOTP.mockResolvedValue({ user: { INN: '123456' } });

      req.body = { INN: '123456', chatId: 'chat123' };

      await UserController.setAuth(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(UserServices.updateUserAndCreateOTP).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(300);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: { INN: '123456' } }));
    });

    it('should update user and create OTP if ChatID does not match', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { ChatID: 'chat456' } });
      UserServices.updateUserAndCreateOTP.mockResolvedValue({ user: { INN: '123456' } });

      req.body = { INN: '123456', chatId: 'chat123' };

      await UserController.setAuth(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(UserServices.updateUserAndCreateOTP).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: { INN: '123456' } }));
    });

    it('should return 500 on error', async () => {
      UserServices.findByINN.mockRejectedValue(new Error('Server error'));

      req.body = { INN: '123456', chatId: 'chat123' };

      await UserController.setAuth(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('VerifyOTP_fromIshkerSide', () => {
    it('should verify OTP successfully and return 200', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1, ChatID: 'chat123' } });
      OTPServices.verifyOtp.mockResolvedValue('success');
      UserServices.verify_user.mockResolvedValue({});

      req.body = { INN: '123456', otp: '123456', Chat_ID: 'chat123' };

      await UserController.VerifyOTP_fromIshkerSide(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(OTPServices.verifyOtp).toHaveBeenCalledWith(1, '123456');
      expect(UserServices.verify_user).toHaveBeenCalled();
      expect(sendMessage).toHaveBeenCalledWith('chat123', '\u2705');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, status: 200 });
    });

    it('should return 400 if OTP is invalid', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1, ChatID: 'chat123' } });
      OTPServices.verifyOtp.mockResolvedValue('invalid');

      req.body = { INN: '123456', otp: '123456', Chat_ID: 'chat123' };

      await UserController.VerifyOTP_fromIshkerSide(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, isOtpValid: 'invalid', status: 400 });
    });

    it('should return 400 if Chat ID is invalid', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1, ChatID: 'chat456' } });

      req.body = { INN: '123456', otp: '123456', Chat_ID: 'chat123' };

      await UserController.VerifyOTP_fromIshkerSide(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, isOtpValid: 'Invalid Chat ID', status: 400 });
    });

    it('should return 500 on error', async () => {
      UserServices.findByINN.mockRejectedValue(new Error('Server error'));

      req.body = { INN: '123456', otp: '123456', Chat_ID: 'chat123' };

      await UserController.VerifyOTP_fromIshkerSide(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error', status: 500 });
    });
  });

  describe('createOTP', () => {
    it('should create OTP and send message', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1, ChatID: 'chat123', loggedIn: true } });
      OTPServices.createOTP.mockResolvedValue({});
      sendMessage.mockResolvedValue({});

      req.body = { INN: '123456', message: 'Your OTP' };

      await UserController.createOTP(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(OTPServices.createOTP).toHaveBeenCalled();
      expect(sendMessage).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ otp: expect.any(String), expiry: expect.any(Date) }));
    });

    it('should return 403 if user is not logged in', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { loggedIn: false } });

      req.body = { INN: '123456' };

      await UserController.createOTP(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(false);
    });

    it('should return 404 if user not found', async () => {
      UserServices.findByINN.mockResolvedValue(null);

      req.body = { INN: '123456' };

      await UserController.createOTP(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 on internal server error', async () => {
      UserServices.findByINN.mockRejectedValue(new Error('Server error'));

      req.body = { INN: '123456' };

      await UserController.createOTP(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('init', () => {
    it('should create a user and return 200', async () => {
      UserServices.createUser.mockResolvedValue({ user: { INN: '123456' } });

      req.body = { INN: '123456', pin: 'secretPin' };

      await UserController.init(req, res);

      expect(UserServices.createUser).toHaveBeenCalledWith(expect.objectContaining({ INN: '123456', Auth: 'secretPin' }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: 'User created successfully', status: 200 });
    });

    it('should return 400 if there is an error creating the user', async () => {
      UserServices.createUser.mockRejectedValue(new Error('User creation error'));

      req.body = { INN: '123456', pin: 'secretPin' };

      await UserController.init(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User creation error', status: 400 });
    });
  });

  describe('VerifyOTP', () => {
    it('should verify OTP successfully and return 200', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1 } });
      OTPServices.verifyOtp.mockResolvedValue('success');

      req.body = { INN: '123456', otp: '123456' };

      await UserController.VerifyOTP(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(OTPServices.verifyOtp).toHaveBeenCalledWith(1, '123456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, status: 200 });
    });

    it('should return 400 if OTP verification fails', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1 } });
      OTPServices.verifyOtp.mockResolvedValue('failure');

      req.body = { INN: '123456', otp: '123456' };

      await UserController.VerifyOTP(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'failure', status: 400 });
    });

    it('should return 500 on internal server error', async () => {
      UserServices.findByINN.mockRejectedValue(new Error('Server error'));

      req.body = { INN: '123456', otp: '123456' };

      await UserController.VerifyOTP(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('registerUser', () => {
    it('should register the user and return 200', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1, Auth: 'password', ChatID: 'chat123' } });
      UserServices.assignChatID.mockResolvedValue({});

      req.body = { INN: '123456', password: 'password', chatId: 'chat123', lang: 'en' };

      await UserController.registerUser(req, res);

      expect(UserServices.findByINN).toHaveBeenCalledWith('123456');
      expect(UserServices.assignChatID).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), 'chat123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: 'User registered successfully', status: 200 });
    });

    it('should return 401 if password is incorrect', async () => {
      UserServices.findByINN.mockResolvedValue({ user: { id: 1, Auth: 'wrong_password' } });

      req.body = { INN: '123456', password: 'password', chatId: 'chat123' };

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Incorrect Password', status: 401 });
    });

    it('should return 404 if user not found', async () => {
      UserServices.findByINN.mockResolvedValue(null);

      req.body = { INN: '123456', password: 'password', chatId: 'chat123' };

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found', status: 404 });
    });

    it('should return 500 on internal server error', async () => {
      UserServices.findByINN.mockRejectedValue(new Error('Server error'));

      req.body = { INN: '123456', password: 'password', chatId: 'chat123' };

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error', status: 500 });
    });
  });

  describe('checkIfUserHasRegisteredChat', () => {
    it('should return 200 if user has registered chat ID', async () => {
      UserServices.findByChatID.mockResolvedValue({ ChatID: 'chat123' });

      req.query = { chatId: 'chat123' };

      await UserController.checkIfUserHasRegisteredChat(req, res);

      expect(UserServices.findByChatID).toHaveBeenCalledWith('chat123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, status: 200 });
    });

    it('should return 404 if user not found', async () => {
      UserServices.findByChatID.mockResolvedValue(null);

      req.query = { chatId: 'chat123' };

      await UserController.checkIfUserHasRegisteredChat(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found', status: 404 });
    });

    it('should return 500 on internal server error', async () => {
      UserServices.findByChatID.mockRejectedValue(new Error('Server error'));

      req.query = { chatId: 'chat123' };

      await UserController.checkIfUserHasRegisteredChat(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error', status: 500 });
    });
  });

  describe('updatePassword', () => {
    it('should update the password and return 200', async () => {
      UserServices.updatePassword.mockResolvedValue(true);

      req.body = { INN: '123456', password: 'newPassword', repeatPassword: 'newPassword' };

      await UserController.updatePassword(req, res);

      expect(UserServices.updatePassword).toHaveBeenCalledWith('123456', 'newPassword', 'newPassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, status: 200 });
    });

    it('should return 404 if user not found', async () => {
      UserServices.updatePassword.mockResolvedValue(false);

      req.body = { INN: '123456', password: 'newPassword', repeatPassword: 'newPassword' };

      await UserController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found', status: 404 });
    });

    it('should return 500 on internal server error', async () => {
      UserServices.updatePassword.mockRejectedValue(new Error('Server error'));

      req.body = { INN: '123456', password: 'newPassword', repeatPassword: 'newPassword' };

      await UserController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error', status: 400 });
    });
  });
});
