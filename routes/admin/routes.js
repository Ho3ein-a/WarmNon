const express = require('express');
const router = express.Router();
const pagesController = require('../../controller/admin/pages');
const businessController = require('../../controller/admin/business')
const isAuth = require('../../middleware/admin-is-auth');
const { check } = require('express-validator')




router.get('/admin-main',isAuth ,pagesController.mainPageRendering) ;

router.post('/admin-main',
    [ 
        check('admin_id')
        .notEmpty()
        .withMessage("لطفا نام کاربری رو وارد کن") ,

        check('password')
        .notEmpty()
        .withMessage("لطفا رمز عبور را وارد کن")        
    ] ,
    businessController.adminLogin);

router.get('/aa-a-login', pagesController.loginPageRendering);


// router.post('/admin', pagesController.adminMainPage)

router.get('/comments', isAuth, pagesController.commentsPageRendering);

router.get('/orders', isAuth, pagesController.ordersPageRendering);

router.get('/undelivered-orders', pagesController.uncompletedOrdersList);

router.get('/users', isAuth, pagesController.usersRendering);

router.post('/users', isAuth, businessController.removeUser);

router.get('/add-bread',isAuth, pagesController.addBreadForm);

router.post('/add-bread',isAuth,  businessController.addBread);

router.get('/delete-bread',isAuth, pagesController.deleteBreadForm);

router.post('/delete-bread',isAuth, businessController.deleteBread);

router.post('/add-again-bread',isAuth, businessController.addAgainBread);

router.get('/dormitories',isAuth, pagesController.dormitoriesRendering);

router.post('/dormitory/:dormitory_name', isAuth, pagesController.dormitoryOrders);

router.post('/delivered-order', businessController.deliveredOrderPost)



module.exports = router; 
