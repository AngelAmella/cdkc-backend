const express  = require('express')
const { 
    postAdmin, 
    loginAdmin, 
    updateAdmin, 
    deltAdmin, 
    getOneAdmin, 
    getAdmin, 
    deltMultiAdmin, 
    getMultiAdmin 
} = require('../controllers/AdminController')
const router = express.Router()

router.route('/').get(getAdmin).post(postAdmin)

router.route('/login').post(loginAdmin)

router.route('/:id').put(updateAdmin).delete(deltAdmin).get(getOneAdmin)

router.route('/:ids').delete(deltMultiAdmin).get(getMultiAdmin)

module.exports = router