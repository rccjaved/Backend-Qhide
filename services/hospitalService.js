// const hospitalModel = require('../models/hospitalModel');
const { Hospital } = require('../models');


exports.createHospital = async (hospitalData) => {
    return await Hospital.create(hospitalData);
};

exports.listHospitals = async () => {
    return await Hospital.findAll();
};

