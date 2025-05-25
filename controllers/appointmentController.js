const axios = require('axios');
const { getDistanceMeters } = require('../utils/distance');
const { Appointment, Hospital, User, AppointmentTicket, HospitalQueue  } = require('../models');


class appointmentController {

  // GET USER ALL CONFIRMED APPOINTMENTS
  getUserAppointments = async (req, res) => {
    try {
      const userId = req.id;

      const appointments = await Appointment.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Hospital,
            attributes: ['name', 'city', 'address', 'phone']
          }
        ],
        order: [['slot_date', 'ASC'], ['slot_time', 'ASC']]
      });

      return res.status(200).json({
        success: true,
        appointments
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  };


  // GET USER APPOINTMENTS + OTHER HOSPITALS WITHIN 5KM RADIUS FROM GOOGLE API
  getUserAppointmentsWithNearby = async (req, res) => {
    try {
      const userId = req.id;
      const { lat, lng, radius = 5000 } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: 'lat and lng are required'
        });
      }

      // 1. Get user's appointments from DB
      const appointments = await Appointment.findAll({
        where: { user_id: userId },
        include: [{
          model: Hospital,
          attributes: ['id', 'name', 'city', 'address', 'phone', 'latitude', 'longitude']
        }],
        order: [['slot_date', 'ASC'], ['slot_time', 'ASC']]
      });

      // 2. Fetch nearby hospitals from Google Places
      const googleRes = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          key: process.env.GOOGLE_PLACES_API_KEY,
          location: `${lat},${lng}`,
          radius, // Google will return results *within this radius*, but not always strictly
          type: 'hospital',
          keyword: 'hospital'
        }
      });

      // 3. Extract and reshape data from Google response
      const googleHospitalsRaw = googleRes.data.results.map(item => ({
        placeId: item.place_id,
        name: item.name,
        latitude: item.geometry.location.lat,
        longitude: item.geometry.location.lng,
        address: item.vicinity,
        photoReference: item.photos?.[0]?.photo_reference || null
      }));

      // 4. Add distance manually and strictly filter by distance <= radius
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusMeters = Number(radius);

      const filteredHospitals = googleHospitalsRaw
        .map(h => {
          const distance = getDistanceMeters(userLat, userLng, h.latitude, h.longitude);
          return { ...h, distance };
        })
        .filter(h => h.distance <= radiusMeters) // strict check
        .sort((a, b) => a.distance - b.distance); // sort by nearest first

      // 5. Return response
      return res.status(200).json({
        success: true,
        appointments,
        nearbyHospitals: filteredHospitals
      });

    } catch (error) {
      console.error('Error in getUserAppointmentsWithNearby:', error);
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  };



  // GET USER APPOINTMENT COUNTDOWN
  getAppointmentCountdown = async (req, res) => {
    try {
      const userId = req.id;
      const appointmentId = req.params.id;

      // Fetch appointment with hospital info, ensure status is 'confirmed'
      const appointment = await Appointment.findOne({
        where: {
          id: appointmentId,
          user_id: userId,
          status: 'confirmed'
        },
        include: [
          {
            model: Hospital,
            attributes: ['id', 'name', 'city', 'address', 'phone']
          },
          {
            model: User,
            attributes: ['id', 'name', 'email', 'phone']
          }
        ]
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Confirmed appointment not found for this user.'
        });
      }

      // Combine slot_date and slot_time into a single Date object
      const slotDateTime = new Date(`${appointment.slot_date}T${appointment.slot_time}`);
      const now = new Date();

      // Calculate remaining time in seconds
      let msRemaining = slotDateTime - now;
      if (msRemaining < 0) msRemaining = 0;

      const totalSeconds = Math.floor(msRemaining / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return res.json({
        success: true,
        appointment: {
          id: appointment.id,
          slot_date: appointment.slot_date,
          slot_time: appointment.slot_time,
          doctor_name: appointment.doctor_name,
          specialty: appointment.specialty,
          expected_queue_number: appointment.expected_queue_number,
          status: appointment.status,
          notes: appointment.notes
        },
        hospital: appointment.Hospital,
        user: appointment.User,
        countdown: {
          totalSeconds,
          hours,
          minutes,
          seconds
        }
      });
    } catch (err) {
      console.error('Error fetching countdown:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching appointment countdown.'
      });
    }
  };


  // GET USER LEAVE/CANCEL APPOINTMENT
  cancelAppointment = async (req, res) => {
    try {
      const userId = req.id; // comes from authMiddleware
      const appointmentId = req.params.id;

      const appointment = await Appointment.findOne({
        where: {
          id: appointmentId,
          user_id: userId
        }
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found for this user.'
        });
      }

      // Optional: Prevent cancellation if appointment already completed or cancelled
      if (['cancelled', 'completed'].includes(appointment.status)) {
        return res.status(400).json({
          success: false,
          message: `Appointment already ${appointment.status}.`
        });
      }

      // Optional: Prevent cancelling past or ongoing appointments
      const slotDateTime = new Date(`${appointment.slot_date}T${appointment.slot_time}`);
      if (new Date() >= slotDateTime) {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel an appointment that has already started or passed.'
        });
      }

      // Update status to cancelled
      appointment.status = 'cancelled';
      await appointment.save();

      return res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully.'
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while cancelling appointment.'
      });
    }
  };


  // CHECK DISTANCE, CURRENT QUEUE, TICKET CREATION
  checkProximityAndGenerateTicket = async (req, res) => {
    try {
      const userId       = req.id;
      const appointmentId = req.params.id;
      const { lat, lng } = req.body;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ success: false, message: 'lat and lng required' });
      }

      // 1) Load appointment + hospital
      const appointment = await Appointment.findOne({
        where: { id: appointmentId, user_id: userId, status: 'confirmed' },
        include: [{ model: Hospital }]
      });
      if (!appointment || !appointment.Hospital) {
        return res
          .status(404)
          .json({ success: false, message: 'Appointment or hospital not found' });
      }

      // 2) Check distance
      const distance = getDistanceMeters(
        parseFloat(lat),
        parseFloat(lng),
        appointment.Hospital.latitude,
        appointment.Hospital.longitude
      );
      if (distance > 5) {
        return res
          .status(400)
          .json({ success: false, message: 'User not close enough to hospital' });
      }

      // 3) Return existing ticket
      const existing = await AppointmentTicket.findOne({
        where: { appointment_id: appointmentId }
      });
      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'Ticket already generated',
          ticket_number: existing.ticket_number
        });
      }

      // 4) Ensure a queue row exists
      let queue = await HospitalQueue.findOne({
        where: { hospital_id: appointment.Hospital.id }
      });
      if (!queue) {
        queue = await HospitalQueue.create({
          hospital_id: appointment.Hospital.id,
          current_number: 0
        });
      }

      // 5) New ticket number
      const ticketNumber = queue.current_number + 1;

      // 6) Create ticket & bump queue
      await AppointmentTicket.create({
        appointment_id: appointmentId,
        ticket_number: ticketNumber
      });
      await HospitalQueue.update(
        { current_number: ticketNumber },
        { where: { hospital_id: appointment.Hospital.id } }
      );

      // 7) **Directly update** the appointment’s status to ‘completed’
      await appointment.update({ status: 'completed' });

      // 8) Respond
      return res.status(201).json({
        success: true,
        message: 'Ticket generated and appointment marked completed',
        ticket_number: ticketNumber
      });

    } catch (err) {
      console.error('Ticket generation error:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Server error' });
    }
  }



}

module.exports = new appointmentController()