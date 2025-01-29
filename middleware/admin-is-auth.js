module.exports =  (req, res, next) =>{
    if(!req.session.adminIsLoggedIn){
        res.status(404).send("NOT FOUND")

    }
    else{
        next()

    }
}