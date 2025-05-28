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





}


module.exports = new hospitalController()