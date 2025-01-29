// this controller is only for rendering middlewares (GET) 

const Model = require('../../model/admin/admin')
const session = require('express-session')
const jalaali = require('jalaali-js'); // Adjust this if your Jalali module differs



exports.mainPageRendering = (req, res) => {
    
    const admin_id = parseInt(req.session.admin_id);
    req.session.isLoggedIn = true ;
    res.status(200).render('admin-main',{
        admin_id
    })

}






exports.loginPageRendering = (req, res) => {
    
    let error = req.flash('error')[0]; 
    
    error ? error : null; 
    res.status(200).render('admin-login',{
        error,
        csrfToken : req.csrfToken()
    })

}







exports.commentsPageRendering = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  
    const limit = 5;  
    const offset = (page - 1) * limit;

    
    const [comments] = await new Model().commentsPaginationList(limit, offset); 

   
    const totalComments= await new Model().countComments();
    const totalPages = Math.ceil(totalComments / limit);

    const admin_id = parseInt(req.session.admin_id);

    res.status(200).render('admin-comments', {
        comments,
        admin_id,
        currentPage: page,
        totalPages
    });
};






exports.ordersPageRendering = async(req, res) => {
    const [orders] = await new Model().ordersList()
    const admin_id = parseInt(req.session.admin_id);
    
    let message = req.flash('message')[0]; 
    

    if(message){
        message = req.flash('message')[0]; 
        
    }
 
    else{
        message = ""; 
    }    

    res.status(200).render('admin-orders',{
        orders, 
        admin_id,
        message
    })
}








 
function addDaysToJalaaliDate(jy, jm, jd, daysToAdd) {
    let date = new Date(jalaali.toGregorian(jy, jm, jd).gy, jalaali.toGregorian(jy, jm, jd).gm - 1, jalaali.toGregorian(jy, jm, jd).gd);
    date.setDate(date.getDate() + daysToAdd);

    const jalaliDate = jalaali.toJalaali(date);
    return `${jalaliDate.jy}/${jalaliDate.jm}/${jalaliDate.jd}`;
}




exports.uncompletedOrdersList = async (req, res) => {
    const today = jalaali.toJalaali(new Date());
    const formattedToday = `${today.jy}/${today.jm}/${today.jd}`;
    const formattedNextDay = addDaysToJalaaliDate(today.jy, today.jm, today.jd, 1);
    const formattedTwoDaysLater = addDaysToJalaaliDate(today.jy, today.jm, today.jd, 2);
    const [orders] = await new Model().uncompletedOrdersList(formattedNextDay, formattedTwoDaysLater);
    const admin_id = parseInt(req.session.admin_id);

    res.status(200).render('admin-undelivered-orders', {
        orders,
        admin_id
    });
};










exports.dormitoryOrders = async (req, res) => {
    const today = jalaali.toJalaali(new Date());
    const formattedToday = `${today.jy}/${today.jm}/${today.jd}`;
    const formattedNextDay = addDaysToJalaaliDate(today.jy, today.jm, today.jd, 1);
    const formattedTwoDaysLater = addDaysToJalaaliDate(today.jy, today.jm, today.jd, 2);
    const dormitory_name = req.body.dormitory;

    const [orders] = await new Model().dormitoryOrderList(formattedNextDay, formattedTwoDaysLater, dormitory_name);
    const [orderSummary] = await new Model().dormitoryOrderSummary(formattedNextDay, formattedTwoDaysLater, dormitory_name);

    res.status(200).render(`admin-${req.params.dormitory_name}-orders`, {
        orders,
        orderSummary,
        dormitory_name
    });
};








exports.usersRendering = async (req, res) => {
    const perPage = 5; // Set the number of items per page
    const page = parseInt(req.query.page) || 1; // Get the current page from query or default to 1

    const [userCount] = await new Model().userCount(); // Assuming a function that gets the total count
    const totalPages = Math.ceil(userCount[0].count / perPage);

    const [users] = await new Model().usersPageList((page - 1) * perPage, perPage);
    const admin_id = parseInt(req.session.admin_id);
   
    res.status(200).render('admin-users', {
        users,
        admin_id,
        perPage,
        currentPage: page,
        totalPages
    });
}







exports.dormitoriesRendering = async (req, res) => {
    const [dormitories] = await new Model().dormitoriesList();
    const admin_id = parseInt(req.session.admin_id);

    res.status(200).render('admin-dormitories', {
        dormitories,
        admin_id
    })

}






exports.addBreadForm = async (req, res) => {
    const [breads] = await new Model().breadsList();
    
    const admin_id = parseInt(req.session.admin_id)
    res.status(200).render('admin-add-bread', {
        breads,
        admin_id
    })
}






exports.deleteBreadForm = async(req, res) => {
    const [breads] = await new Model().breadsList();
    const admin_id = parseInt(req.session.admin_id);

    res.status(200).render('admin-delete-bread',{
        breads, 
        admin_id
    })

}

