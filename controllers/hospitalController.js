// controllers/hospitalController.js

const hospitalService = require('../services/hospitalService');
const { Hospital } = require('../models');

class hospitalController {
  // Create a hospital
  async createHospital(req, res) {
    try {
      const newHospital = await hospitalService.createHospital(req.body);
      return res.status(201).json({ success: true, data: newHospital });
    } catch (error) {
      console.error('Error in createHospital:', error);
      return res.status(500).json({ success: false, message: 'Failed to create hospital' });
    }
  }

  // List all hospitals
  async listHospitals(req, res) {
    try {
      const hospitals = await hospitalService.listHospitals();
      return res.status(200).json({ success: true, data: hospitals });
    } catch (error) {
      console.error('Error in listHospitals:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch hospitals' });
    }
  }

  // Helper to calculate distance
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI/180;
    const dLon = (lon2 - lon1) * Math.PI/180;
    const a =
      Math.sin(dLat/2)**2 +
      Math.cos(lat1 * Math.PI/180) *
      Math.cos(lat2 * Math.PI/180) *
      Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Get nearby hospitals
  async getNearbyHospitals(req, res) {
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    try {
      const hospitals = await Hospital.findAll();
      const nearby = hospitals.filter(h => {
        const dist = this.getDistanceFromLatLonInKm(
          latitude, longitude,
          h.latitude, h.longitude
        );
        return dist <= 5;
      });
      return res.status(200).json({ success: true, data: nearby });
    } catch (error) {
      console.error('Error in getNearbyHospitals:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }


  async getAllHospitals(req, res) {
    try {
      
    } catch (error) {
      
    }
  }

  
}

module.exports = new hospitalController();
