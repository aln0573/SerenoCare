import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'

const registerUser = async (req, res) => {
    try {
        const {name , email , password} = req.body

        if(!name || !email || !password){
           return res.json({success: false, message: "Missing Details"})
        }

        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Enter a valid Email!"})
        }

        if(password.length < 8){
            return res.json({success: false, message: "Enter a Strong password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.json({success: true, token})
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}


const loginUser = async (req, res) => {
    try {
        const {email , password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User does not exist!"})
        }

        const isMatch  = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else{
            res.json({success: false, message: "Inavlid Credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}


const getProfile = async (req, res) => {
    try {

        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')

        res.json({success: true, userData})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing!" });
        }

        const updatedData = { name, phone, dob, gender };

        if (address) {
            try {
                updatedData.address = JSON.parse(address);
            } catch (e) {
                return res.json({ success: false, message: "Invalid address format" });
            }
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updatedData.image = imageUpload.secure_url;
        }

        await userModel.findByIdAndUpdate(userId, updatedData);

        const updatedUser = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData: updatedUser, message: "Profile Updated!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const bookAppointment = async (req, res) => {
    try {

        const userId = req.userId
        const {docId, slotDate , slotTime} = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({success: false, message: "Doctor not available!"})
        }
        
        const slots_booked = docData.slots_booked

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success: false, message: "Slots not available!"})
            }else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success: true, message: "Appointment Booked!"})


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


const listAppointment = async (req,res) => {

    try {

        const userId = req.userId
        const appointments = await appointmentModel.find({userId})
        res.json({success: true, appointments})


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


const cancelAppointments = async (req, res)  => {

    try {

        const userId = req.userId
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData.userId !== userId){
            return res.json({success: false, message: "Unauthorized action!"})
        }
        
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

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const razorpayPayment = async (req, res) => {
    try {

        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled){
            return res.json({success: false, message: "Appointment cancelled! or Not found!"})
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId
        }

        const order = await razorpayInstance.orders.create(options)
        res.json({success: true, order})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message }) 
    }
}

const verifyPayment = async (req,res) => {
    try {

        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            res.json({success: true, message: "Payment Successfull"})
        } else {
             res.json({success: false, message: "Payment failed!"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointments , razorpayPayment , verifyPayment}