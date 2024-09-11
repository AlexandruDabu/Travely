const express = require('express');
const { travelsByUserId, createTravel, updateTravel, allTravels, allSharedTravels, travelsById, shareTravel, deleteTravel, travelsBySearchTerm, sharedTravelsByUserId } = require('../controllers/travelController');
const { authJWT } = require('../JWT-config');
const router = express.Router();


router.get('/allTravels', allTravels)

router.get('/travels/:id', travelsById)

router.get('/allSharedTravels', allSharedTravels)

router.get('/userTravels/:id', travelsByUserId)

router.get('/travel/search', travelsBySearchTerm)

router.get(`/recentTravels/:id`, sharedTravelsByUserId)

router.put('/travels/share/:id', authJWT, shareTravel)

router.post('/createTravel', authJWT, createTravel)

router.put('/updateTravel/:id', authJWT, updateTravel)

router.delete(`/travels/delete/:id`, authJWT, deleteTravel)



module.exports = router;