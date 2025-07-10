import express from 'express'
import { addDoctors, adminDashboard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin ,  } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { checkAvailabilty } from '../controllers/doctorController.js'

const adminRouter = express.Router()
adminRouter.post('/add-doctors',authAdmin,upload.single('image'), addDoctors)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability', authAdmin, checkAvailabilty)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)


export default adminRouter