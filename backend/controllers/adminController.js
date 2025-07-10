import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import validator from 'validator';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


const addDoctors = async (req, res) => {
    try {
        const {name , email , password , image , speciality , degree , experience , about , available , fees , address } = req.body
        const imageFile = req.file

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({success: false, message: "Missing Details"})
        }

        if(!imageFile){
            return res.json({success: false, message: "Image not uploaded"})
        }


        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"})
        }

        if(password.length < 8){
            return res.json({success: false, message: "Please enter a strong password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            experience,
            degree,
            available: true,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData) 
        await newDoctor.save()

        res.json({success: true, message: "Doctor Added"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const loginAdmin = async (req, res) => {
    try {
        
        const {email , password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({success: true, token})
            console.log(res);
        }else{
            
            res.json({success: false, message: "Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success: true, doctors})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({success: true, appointments})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const appointmentCancel = async (req, res)  => {

    try {

        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        
        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

        const {docId , slotDate , slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})
        res.json({success: true, message: "Appointment Cancelled!"})

        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message }) 
    }

}


const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const appointments = await appointmentModel.find({})
        const users = await userModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            lastestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({success: true, dashData})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


export {addDoctors, loginAdmin, allDoctors , appointmentsAdmin, appointmentCancel, adminDashboard}