const { IncomingForm } = require("formidable");
const { responseReturn } = require("../../utils/response")
const { Hospital } = require('../../models');
const { Op } = require('sequelize');

class hospitalController {


  get_hospital = async (req, res) => {
    const { page, searchValue, perPage } = req.query;

    try {
      // Parse and validate parameters
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(perPage) || 10;
      const offset = (currentPage - 1) * itemsPerPage;

      // Build where clause for search
      let where = {};
      if (searchValue && searchValue.trim() !== '') {
        where = {
          [Op.or]: [
            { name: { [Op.like]: `%${searchValue}%` } },
            { city: { [Op.like]: `%${searchValue}%` } },
            { address: { [Op.like]: `%${searchValue}%` } }
          ]
        };
      }

      // Get paginated results
      const { count, rows: hospitals } = await Hospital.findAndCountAll({
        where,
        limit: itemsPerPage,
        offset: offset,
        order: [['createdAt', 'DESC']]
      });

      responseReturn(res, 200, {
        hospitals,
        totalHospital: count,
        totalPages: Math.ceil(count / itemsPerPage),
        currentPage
      });

    } catch (error) {
      console.error('Error fetching hospitals:', error);
      responseReturn(res, 500, { error: 'Server error while fetching hospitals' });
    }
  }

  // end method 



  add_hospital = async (req, res) => {
    try {
      const { name, city, address, phone, is_approved, latitude, longitude } = req.body;
      const hospital = await Hospital.create({
        name, city, address, phone, is_approved, latitude, longitude
      });
      return responseReturn(res, 201, {
        hospital,
        message: "Hospital Added Successfully"
      });
    } catch (error) {
      console.error("DB create error:", error);
      return responseReturn(res, 500, {
        error: "Internal Server Error",
        detail: error.message
      });
    }
  };

  // end method


  // hospitalController.js
  get_hospital_by_id = async (req, res) => {
    const { Id } = req.params;
    try {
      const hospital = await Hospital.findByPk(Id);
      if (!hospital) {
        return responseReturn(res, 404, { error: "Hospital not found" });
      }
      return responseReturn(res, 200, {
        hospital // Ensure it's returned as { hospital: {...} }
      });
    } catch (error) {
      console.error("Error fetching hospital by ID:", error);
      return responseReturn(res, 500, {
        error: "Server error while fetching hospital",
      });
    }
  };
  // end method



  update_hospital = async (req, res) => {
    const { Id } = req.params;
    try {
      const [updated] = await Hospital.update(req.body, {
        where: { id: Id }
      });

      if (!updated) {
        return responseReturn(res, 404, { error: "Hospital not found" });
      }

      const hospital = await Hospital.findByPk(Id);
      return responseReturn(res, 200, {
        hospital,
        message: "Hospital updated successfully"
      });
    } catch (error) {
      return responseReturn(res, 500, {
        error: "Internal Server Error",
        detail: error.message
      });
    }
  };
  // end method



  // DELETE HOSPITAL

  delete_hospital = async (req, res) => {
    const { Id } = req.params;
    
    // Validate ID format
    if (!Id || isNaN(Id)) {
      return responseReturn(res, 400, { error: "Invalid hospital ID" });
    }

    try {
      // First check if hospital exists
      const hospital = await Hospital.findByPk(Id);
      
      if (!hospital) {
        return responseReturn(res, 404, { error: "Hospital not found" });
      }
      
      // Then delete
      await hospital.destroy();
      
      return responseReturn(res, 200, {
        message: "Hospital deleted successfully"
      });
    } catch (error) {
      console.error("Delete error:", error);
      
      // Handle database constraint errors
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return responseReturn(res, 409, {
          error: "Cannot delete hospital with associated records",
          detail: "Please delete related doctors or appointments first"
        });
      }
      
      return responseReturn(res, 500, {
        error: "Internal Server Error",
        detail: error.message
      });
    }
  };
  // end method


}


module.exports = new hospitalController()