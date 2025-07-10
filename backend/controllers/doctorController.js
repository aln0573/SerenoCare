import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";


const checkAvailabilty = async (req,res) => {
    try {
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available})
        res.json({success: true, message: 'Availability changed'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const doctorsList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-email,-password'])
        res.json({success: true, doctors})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const loginDoctor = async (req, res) => {
    try {

        const {email , password} = req.body
        const doctor = await doctorModel.findOne({email})

        if (!doctor) {
            return res.json({success: false, message: "Invalid credential!"})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: "Invalid credential!"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const appointmentsDoctor = async (req ,res) => {
    try {
        const docId = req.docId  
        const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: "Appointment Completed!" });
        } else {
            return res.json({ success: false, message: "Mark Failed" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



const appointmentCancel = async (req, res) => {
    try {

        const docId = req.docId
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success: true, message: "Appointment Cancelled!"})
        } else {
            return res.json({success: false, message: "Cancellation Failed!"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const doctorDashboard = async (req, res) => {
  try {
    const doctId = req.docId;

    const appointments = await appointmentModel.find({ docId: doctId });

    let earnings = appointments.reduce((sum, item) => {
      return (item.isCompleted || item.payment) ? sum + item.amount : sum;
    }, 0);

    const patients = [...new Set(appointments.map(item => item.userId))];

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 6)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const doctorProfile = async (req, res) => {
    try {

        const docId = req.docId
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({success: true, profileData})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const updateDoctorProfile = async (req, res) => {
    try {

        const docId = req.docId
        const {fees , address, available , about} = req.body

        await doctorModel.findByIdAndUpdate(docId, {fees, address , available , about})
        res.json({success: true, message: "Profile Updated!" })
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {checkAvailabilty, doctorsList, loginDoctor , appointmentsDoctor , appointmentCancel , appointmentComplete, doctorDashboard , updateDoctorProfile , doctorProfile}