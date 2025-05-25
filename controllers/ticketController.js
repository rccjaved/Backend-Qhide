const { Ticket, Service } = require('../models');
const { generateTicketNumber, getCurrentDate, getCurrentTime } = require('../services/ticketService');

class ticketController {

  createTicket = async (req, res) => {
    try {
      const { user_id, hospital_id, service_id } = req.body;

      if (!user_id || !hospital_id || !service_id) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      // Get service name to generate ticket number
      const service = await Service.findByPk(service_id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      const ticketNumber = generateTicketNumber(service.name);
      const ticket = await Ticket.create({
        user_id,
        hospital_id,
        service_id,
        ticket_number: ticketNumber,
        status: 'pending',
        estimated_wait_time: null // or calculate based on logic
      });

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      });

    } catch (error) {
      console.error('Error in createTicket:', error);
      res.status(500).json({ success: false, message: 'Failed to create ticket' });
    }
  };

}

module.exports = new ticketController()