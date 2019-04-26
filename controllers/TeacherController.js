const db = require('../db');

const registerCar = async (req, res) => {
    res.render('registerCar', { user_id: req.query.user_id });
};

const editCar = async (req, res) => {
    try {
        const car = await db.query(`SELECT * FROM car WHERE serial_no='${req.query.serial_no}'`);
        console.log(car.rows);
        res.render('editCar', { car: car.rows.map(r => r) });
    } catch (error) {
        console.log(error)
        res.status(400).render('error', { error_message: error.message })
    }
};

module.exports = {
    registerCar,
    editCar,
};