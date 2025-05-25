const formidable = require("formidable")
const { responseReturn } = require("../../utiles/response")
const cloudinary = require('cloudinary').v2
const { Hospital } = require('../models');
 
class hospitalController{


    get_hospital = async (req, res) => {
       const {page,searchValue, perPage} = req.query 
 
       try {
            let skipPage = ''
            if (perPage && page) {
                skipPage = parseInt(perPage) * (parseInt(page) - 1)
            }
 
        if (searchValue && page && perPage) {
            const hospitals = await Hospital.find({
                $text: { $search: searchValue }
            }).skip(skipPage).limit(perPage).sort({ createdAt: -1})
            const totalHospital = await Hospital.find({
                $text: { $search: searchValue }
            }).countDocuments()
            responseReturn(res, 200,{hospitals,totalHospital})
        } 
        else if(searchValue === '' && page && perPage) {

            const hospitals = await Hospital.find({ }).skip(skipPage).limit(perPage).sort({ createdAt: -1})
            const totalHospital = await Hospital.find({ }).countDocuments()
            responseReturn(res, 200,{hospitals,totalHospital}) 
        } 
        
        else {

            const hospitals = await Hospital.find({ }).sort({ createdAt: -1})
            const totalHospital = await Hospital.find({ }).countDocuments()
            responseReturn(res, 200,{hospitals,totalHospital})
            
        }
        
       } catch (error) {
            console.log(error.message)
       }


    }

    // end method 





}
 

module.exports = new hospitalController()