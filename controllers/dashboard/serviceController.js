const { IncomingForm } = require("formidable");
const { responseReturn } = require("../../utils/response");
const { Service } = require("../../models");
const { Op } = require("sequelize");

class serviceController {
  get_service = async (req, res) => {
    const { page, searchValue, perPage } = req.query;

    try {
      // Parse and validate parameters
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(perPage) || 10;
      const offset = (currentPage - 1) * itemsPerPage;

      // Build where clause for search
      let where = {};
      if (searchValue && searchValue.trim() !== "") {
        where = {
          [Op.or]: [{ name: { [Op.like]: `%${searchValue}%` } }],
        };
      }

      // Get paginated results
      const { count, rows: services } = await Service.findAndCountAll({
        where,
        limit: itemsPerPage,
        offset: offset,
        order: [["Id", "ASC"]],
      });

      responseReturn(res, 200, {
        services,
        totalService: count,
        totalPages: Math.ceil(count / itemsPerPage),
        currentPage,
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      responseReturn(res, 500, {
        error: "Server error while fetching services",
      });
    }
  };

  // end method

  add_service = async (req, res) => {
    try {
      const { name } = req.body;
      const service = await Service.create({
        name,
      });
      return responseReturn(res, 201, {
        service,
        message: "Service Added Successfully",
      });
    } catch (error) {
      console.error("DB create error:", error);
      return responseReturn(res, 500, {
        error: "Internal Server Error",
        detail: error.message,
      });
    }
  };
  // end method


  // hospitalController.js
  get_service_by_id = async (req, res) => {
    const { Id } = req.params;
    try {
      const service = await Service.findByPk(Id);
      if (!service) {
        return responseReturn(res, 404, { error: "Service not found" });
      }
      return responseReturn(res, 200, {
        service 
      });
    } catch (error) {
      console.error("Error fetching service by ID:", error);
      return responseReturn(res, 500, {
        error: "Server error while fetching service",
      });
    }
  };
  // end method


  update_service = async (req, res) => {
    const { Id } = req.params;
    try {
      const [updated] = await Service.update(req.body, {
        where: { id: Id }
      });

      if (!updated) {
        return responseReturn(res, 404, { error: "Service not found" });
      }

      const service = await Service.findByPk(Id);
      return responseReturn(res, 200, {
        service,
        message: "Service updated successfully"
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

  delete_service = async (req, res) => {
    const { Id } = req.params;
    
    // Validate ID format
    if (!Id || isNaN(Id)) {
      return responseReturn(res, 400, { error: "Invalid service ID" });
    }

    try {
      // First check if hospital exists
      const service = await Service.findByPk(Id);
      
      if (!service) {
        return responseReturn(res, 404, { error: "Service not found" });
      }
      
      // Then delete
      await service.destroy();
      
      return responseReturn(res, 200, {
        message: "Service deleted successfully"
      });
    } catch (error) {
      console.error("Delete error:", error);
      
      // Handle database constraint errors
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return responseReturn(res, 409, {
          error: "Cannot delete service with associated records",
          detail: "Please delete related service or appointments first"
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

module.exports = new serviceController();
