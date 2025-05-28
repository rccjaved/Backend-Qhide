const bcrypt = require('bcrypt')
const { createToken } = require('../../utils/tokenCreate')
const { User, Role } = require('../../models');
const { responseReturn } = require('../../utils/response')



class authController {

    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await User.findOne({
                where: { email },
                attributes: ['id', 'email', 'password', 'role_id'],
            });

            if (!admin) {
                return responseReturn(res, 404, { error: "Email not found" });
            }

            // Enforce that only users with role_id = 1 (admins) can proceed
            if (admin.role_id !== 1) {
                return responseReturn(res, 403, { error: "Not authorized as admin" });
            }

            const match = await bcrypt.compare(password, admin.password);
            if (!match) {
                return responseReturn(res, 401, { error: "Password incorrect" });
            }

            // At this point we know it’s an admin, so create the token
            const token = await createToken({
                id: admin.id,
                role_id: admin.role_id,
            });

            // Set it as a cookie
            // controllers/dashboard/authController.js

            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Better for development
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })


            return responseReturn(res, 200, { token, message: "Login Success" });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };
    // End Method 


    // GET USER DATA FROM NODE
    getUser = async (req, res) => {
        const { id, role_id } = req

        try {
            if (role_id === 1) {
                const user = await User.findOne({ where: { id } })
                return responseReturn(res, 200, { userInfo: user })
            }
            return responseReturn(res, 403, { error: "Not authorized" })
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }
    // End getUser Method 


}

module.exports = new authController()