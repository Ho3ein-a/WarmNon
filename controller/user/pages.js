const adminModel = require("../../model/admin/admin"), userModel = require("../../model/user/user"), jalaali = require("jalaali-js"); exports.signInPage = async (e, s) => { s.status(200).render("user-signin", { reqBody: { user_id: "", password: "", confirmedPassword: "", phone: "", name: "", dormitory: "" }, errorMessage: null }) }, exports.userLogin = async (e, s) => { s.status(200).render("user-login", { error: null }) }, exports.mainPage = async (e, s) => { let r = e.session.user_id, [a] = await new adminModel().breadsStoreList(), t = e.flash("message")[0] || null; s.status(200).render("user-main", { breads: a, user_id: r, errorMessage: t ? t.text : "", messageType: t ? t.type : "" }) }, exports.userOrders = async (e, s) => { let r = parseInt(e.session.user_id); new userModel().userOrders(r).then(([e]) => { s.status(200).render("user-orders", { orders: e }) }).catch(() => { e.flash("error", "درخواست شما با خطا مواجه شد لطفا مجدا تلاش نمایید"), s.status(500).redirect("/main") }) }, exports.cancelOrders = async (e, s) => { let r = parseInt(e.session.user_id); new userModel().userNotCompletedOrders(r).then(([r]) => { function a(e) { return 1e4 * e.year + 100 * e.month + e.day } let t = new Date, n = jalaali.toJalaali(t.getFullYear(), t.getMonth() + 1, t.getDate()), l = a({ year: n.jy, month: n.jm, day: n.jd }), d = []; r.forEach(e => { let [s, r, t] = e.date.split("/").map(Number), n = a({ year: s, month: r, day: t }); n >= l && "لغو" !== e.order_type && d.push(e) }); let u = e.flash("success"), o = e.flash("error"); s.status(200).render("user-cancel-order", { correntOrders: d, message: u, errorMessage: o }) }).catch(() => { e.flash("error", "درخواست شما با خطا مواجه شد لطفا مجدا تلاش نمایید"), s.status(500).redirect("/main") }) }, exports.cartPage = async (e, s) => { let r = e.flash("message")[0]; new userModel().userCart(parseInt(e.session.user_id)).then(([e]) => { let a = 0; 0 != e.length ? (e.forEach(e => { a += e.total_price }), s.status(200).render("user-cart", { cart: e, sum: a, errorMessage: r ? r.text : "", messageType: r ? r.type : "" })) : s.status(200).render("user-cart", { message: "سبد خرید شما خالی است", cart: null, sum: null }) }) }, exports.commentsPage = async (e, s) => { let [r] = await new adminModel().breadsList(), a = e.flash("message"), t = null; a.length > 0 && (t = a[0]), s.status(200).render("user-comment", { breads: r, message: t }) }, exports.expressGET = async (e, s) => { s.status(200).render("user-express") };
exports.userInformation = async(req, res)=>{
    new userModel().userInformation(req.session.user_id).then(([user])=>{
        // res.status(200).render('user-information',{
        //     user
        // })
        res.json(user)
    })
    .catch(()=>{
        req.flash('message', "اطلاعات شما دریافت نشد")
        res.status(500).redirect('/main')
    })
}