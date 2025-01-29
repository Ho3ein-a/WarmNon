module.exports = (req, res, next)=>{
    if(!req.session.isLoggedIn){
        res.status(404).send("NOT FOUND")
    }
    else{
        next()

    }
}