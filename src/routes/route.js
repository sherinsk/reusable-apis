const router=require('express').Router();
const controller=require('../controllers/controller')

router.get('/excel',controller.downloadExcel)
router.get('/data',controller.getData)

module.exports=router;