const router = require('express').Router()
const UserController = require('../controller/UserController')

router.get('/users',UserController.get_all_user);
router.post('/add',UserController.add_new_user);
router.post('/getuser',UserController.get_user);
router.get('/users/:username', UserController.findByUsername);
router.delete('/users/:username',UserController.deleteuser);
router.put('/users/:username',UserController.updateuser);

module.exports = router;