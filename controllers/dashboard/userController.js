const { IncomingForm } = require("formidable");
const { responseReturn } = require("../../utils/response");
const { User } = require('../../models');
const { Op } = require('sequelize');
const moment = require('moment'); // Add moment.js

class userController {
    get_user = async (req, res) => {
        const { page, searchValue, perPage } = req.query;

        try {
            const currentPage = parseInt(page) || 1;
            const itemsPerPage = parseInt(perPage) || 10;
            const offset = (currentPage - 1) * itemsPerPage;

            let where = {
                role_id: 2 // Filter for patients only
            };

            if (searchValue && searchValue.trim() !== '') {
                where[Op.or] = [
                    { name: { [Op.like]: `%${searchValue}%` } },
                    { email: { [Op.like]: `%${searchValue}%` } },
                    { phone: { [Op.like]: `%${searchValue}%` } }
                ];
            }

            const { count, rows: users } = await User.findAndCountAll({
                where,
                limit: itemsPerPage,
                offset: offset,
                order: [['created_at', 'DESC']],
                attributes: [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'role_id',
                    'status',
                    'created_at'
                ]
            });

            // Format dates using moment
            const formattedUsers = users.map(user => ({
                ...user.get({ plain: true }),
                created_at: user.created_at
                    ? moment(user.created_at).format('MMM D, YYYY h:mm A')
                    : '—'
            }));

            responseReturn(res, 200, {
                users: formattedUsers,
                totalUser: count,
                totalPages: Math.ceil(count / itemsPerPage),
                currentPage
            });

        } catch (error) {
            console.error('Error fetching users:', error);
            responseReturn(res, 500, { error: 'Server error while fetching users' });
        }
    }//end of function



    // userController.js
    get_user_by_id = async (req, res) => {
        const { Id } = req.params;
        try {
            const user = await User.findByPk(Id);
            if (!user) {
                return responseReturn(res, 404, { error: "User not found" });
            }
            return responseReturn(res, 200, {
                user
            });
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return responseReturn(res, 500, {
                error: "Server error while fetching user",
            });
        }
    };
    // end method


    update_user = async (req, res) => {
        const { Id } = req.params;
        try {
            const [updated] = await User.update(req.body, {
                where: { id: Id }
            });

            if (!updated) {
                return responseReturn(res, 404, { error: "User not found" });
            }

            const user = await User.findByPk(Id);
            return responseReturn(res, 200, {
                user,
                message: "User updated successfully"
            });
            
        } catch (error) {
            return responseReturn(res, 500, {
                error: "Internal Server Error",
                detail: error.message
            });
        }
    };
    // end method
}

module.exports = new userController();