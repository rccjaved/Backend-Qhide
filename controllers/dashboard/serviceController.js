const { IncomingForm } = require("formidable");
const { responseReturn } = require("../../utils/response")
const { Service } = require('../../models');
const { Op } = require('sequelize');

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
      if (searchValue && searchValue.trim() !== '') {
        where = {
          [Op.or]: [
            { name: { [Op.like]: `%${searchValue}%` } },
        
          ]
        };
      }

      // Get paginated results
      const { count, rows: services } = await Service.findAndCountAll({
        where,
        limit: itemsPerPage,
        offset: offset,
        order: [['Id', 'ASC']]
      });

      responseReturn(res, 200, {
        services,
        totalService: count,
        totalPages: Math.ceil(count / itemsPerPage),
        currentPage
      });

    } catch (error) {
      console.error('Error fetching services:', error);
      responseReturn(res, 500, { error: 'Server error while fetching services' });
    }
  }

  // end method 


}


module.exports = new serviceController()