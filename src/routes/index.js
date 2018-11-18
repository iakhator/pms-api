var express = require('express')
var router = express.Router()

const locationController = require('../controllers').location

router.post('/location', locationController.createLocation)
router.get('/locations', locationController.getAllLocations)
router.put('/location/:id', locationController.updateLocation)
router.delete('/location/:id', locationController.deleteLocation)

module.exports = router
