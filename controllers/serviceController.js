const { Service } = require('../models');


class serviceController {

  createService = async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: 'Service name is required' });
      }

      const newService = await Service.create({ name });
      res.status(201).json({ success: true, data: newService });
    } catch (error) {
      console.error('Error in createService:', error);
      res.status(500).json({ success: false, message: 'Failed to create service' });
    }
  };

  getAllServices = async (req, res) => {
    try {
      const services = await Service.findAll();
      res.status(200).json({ success: true, data: services });
    } catch (error) {
      console.error('Error in getAllServices:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch services' });
    }
  };
}

module.exports = new serviceController()
