// this controller is only for login business operations

const Model = require('../../model/admin/admin')
const session = require('express-session')
const jalali = require('jalaali-js')



exports.adminLogin = async (req, res) => {

    const admin_id = parseInt(req.body.admin_id);
    const password = parseInt(req.body.password);
    const admin_ids = [];
    const [admins] = await new Model().adminsList();

    admins.map(item => {
        admin_ids.push(item.admin_id)
    })

    if (admin_ids.includes(admin_id)) {

        for (let item = 0; item < admins.length; item++) {

            if (admins[item].admin_id == admin_id) {
                if (admins[item].password == password) {
                    req.session.admin_id = admin_id;
                    req.session.adminIsLoggedIn = true;
                    req.session.save(() => {
                        res.status(200).redirect('/admin-main')
                        // console.log("LOGIN")

                    })
                    break
                }
                else {
                    req.flash('error', "اطلاعات وارد شده نادرست می باشند")
                    res.status(301).redirect('/admin-login')
                    break
                }

            }
            continue

        }

    }
    else {
        req.flash('error', "اطلاعات وارد شده نادرست می باشند")
        res.status(301).redirect('/admin-login')

    }




}





exports.addBread = async (req, res) => {

    const admin_id = parseInt(req.session.admin_id)
    const bread_id = parseInt(req.body.bread_id)
    const bread_name = req.body.bread_name
    const price = parseInt(req.body.price)
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const jalaliDate = jalali.toJalaali(year, month, day);
    const date = `${jalaliDate.jy}/${jalaliDate.jm}/${jalaliDate.jd}`;
    const type = req.body.type;
    const avalability = 1;

    const [breads] = await new Model().breadsList();
    const bread_ids = [];

    breads.map(item => {
        bread_ids.push(parseInt(item.bread_id))
    })

    if (!bread_ids.includes(bread_id)) {
        new Model().addBread(bread_id, bread_name, price, date, type, avalability, admin_id)
            .then(result => {
                res.status(201).redirect(`/add-bread`)
                // console.log("ADDED")
            })
            .catch(() => {
                req.flash("error", "فرایند اضافه کردن نان با خطا مواجه شد مجدد تلاش کن")
                res.status(500).redirect('/main')
            })

    }
    else {
        res.status(301).redirect(`/add-bread`)
        // console.log("WRONG BREAD NUMBER")
    }

}






exports.deleteBread = async (req, res) => {
    const bread_id = parseInt(req.body.bread_id);



    await new Model().deleteBread(bread_id)
        .then(result => {
            res.status(200).redirect(`/delete-bread`);
            // console.log("DELETED")
        })
        .catch(() => {
            req.flash("error", "فرایند حذف کردن نان با خطا مواجه شد مجدد تلاش کن")
            res.status(500).redirect('/main')
        })
}



exports.addAgainBread = async (req, res) => {
    const bread_id = parseInt(req.body.bread_id);
    const admin_id = parseInt(req.session.admin_id);


    await new Model().addAgainBread(bread_id)
        .then(result => {
            res.status(201).redirect(`/delete-bread`);
            // console.log("ADDED AGAIN")
        })
        .catch(() => {
            req.flash("error", "فرایند اضافه کردن نان با خطا مواجه شد مجدد تلاش کن")
            res.status(500).redirect('/main')
        })
}






exports.deliveredOrderPost = (req, res) => {
    const order_ids = req.body.order_ids;

    
    Promise.all(order_ids.map(item => new Model().updateOrderDelivered(parseInt(item))))
        .then(() => {
            req.flash('message', "سفارشات به عنوان تحویل داده شده علامت گذاری شدند")

            req.session.save(()=>{
                res.status(200).redirect('/orders')

            })
        })
        .catch(error => {
            req.flash('message', "خطا در سرور، مجدد تلاش کن")
            req.session.save(()=>{
            res.status(500).redirect('/orders');
        })

        });
}




exports.removeUser = async(req, res)=>{
    const user_id = parseInt(req.body.user_id);
    new Model().deleteUser(user_id).then(()=>{
        res.status(200).redirect('/users')

    })
    .catch(()=>{
        res.status(500).redirect('/users')

    })
}
