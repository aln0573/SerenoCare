import express from 'express'
import { bookAppointment, cancelAppointments, getProfile, listAppointment, loginUser, razorpayPayment, registerUser, updateProfile, verifyPayment } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment',authUser, bookAppointment)
userRouter.get('/appointments',authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointments)
userRouter.post('/payment-razorpay',authUser,razorpayPayment)
userRouter.post('/verifyRazorpay', authUser, verifyPayment)

export default userRouter