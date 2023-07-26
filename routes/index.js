const express = require('express')
const router = express.Router()
const ensureAuthenticated = require('../middlewares/authenticate')
const passport = require('../passport-config.js')
const flash = require('connect-flash')
const bcrypt = require('bcrypt')
const {Gallery, Manual, Live, Event, Ambassador} = require('../models/user')

const app = express()
app.use(flash())


router.get('/', async (req,res) => {
   const gallery = await Gallery.find({})
   const lives = await Live.find({})
   const events = await Event.find({})
   const manuals = await Manual.find({})
   console.log(req.user)
    res.render('index', {gallery, manuals, lives, events})
})

router.get('/manual', async(req,res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;

    const offset = (currentPage - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const manuals = await Manual.find({}).skip(offset).limit(limit)
    const totalPosts = await Manual.countDocuments();

    const totalPages = Math.ceil(totalPosts / itemsPerPage)
    
    res.render('pages/encounters_posts', {manuals, totalPages: totalPages, pageNum: req.query.page})
    console.log(posts)
})

router.get('/manual/:title', async (req,res) => {
    const title = req.params.title

    const manuals = await Manual.find({title: title})
    return res.render('pages/manual', {manuals: manuals})
})

router.get('/login', (req,res) => {
    const error = req.flash('error')
    res.render('login', {error: error})
}) 
  
router.post('/login', passport.authenticate('ambassadorstrategy', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}))

 
router.get('/video', async(req,res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;

    const offset = (currentPage - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const lives = await Live.find({}).sort({date: 1}).skip(offset).limit(limit)
    const totalPosts = await Live.countDocuments();

    const totalPages = Math.ceil(totalPosts / itemsPerPage)
    res.render('pages/live', {lives: lives, totalPages, pageNum: req.query.page})
})
 
router.get('/events', async (req,res) => {
    const events = await Event.find({})
    res.render('pages/events', {events})
})
 
router.get('/manuals', async (req,res) => {
    const manuals = await Manual.find({})
    res.render('pages/manual', {manuals})
})

router.get('/gallery', async (req,res) => {
    const pictures = await Gallery.find({})
    res.render('pages/gallery', {pictures})
})

router.get('/signup', (req,res) => {
    const error = req.flash('error')
    console.log(Ambassador.find({name: 'fikayo'}))
    res.render('signup', {error})
})

router.post('/signup',  (req,res) => {
    var {firstname,age,church,rank,surname,username,phone,email,password,repassword} = req.body

    if(password !== repassword){
        req.flash('error', 'Password does not match')
        return res.redirect('/signup')
    }

       
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if(err){
            req.flash('error', "An error Occured")
            return res.redirect('login')
        }
        const newAmbassador = new Ambassador({
            firstname: firstname,
            surname: surname,
            username: username,
            age: age,
            church: church,
            rank: rank,
            phone: phone,
            email: email,
            password: hashedPassword
        })

        newAmbassador.save().then(() => {
            req.flash('error', "signed up successfully")
            console.log(newAmbassador)
            return res.redirect('/login')
        }).catch(err => {
            req.flash('error', "Log in failed")
            return res.redirect('signup')
        })
    })
})

router.get('/start/journey',  (req,res) => {

    bcrypt.hash('bunmisegun', 10, (err, hashedPassword) => {
        if(err){
            req.flash('error', "An error Occured")
            return res.redirect('login')
        }
        const newAmbassador = new Ambassador({
            firstname: 'fikayo',
            surname: 'ajala',
            username: 'fikkyart',
            age: '20',
            church: 'canaan baptist church',
            rank: 'ambassador',
            phone: '08132332408',
            email: 'ajalafikayo@gmail.com',
            password: hashedPassword,
            role: 'admin'
        })

        newAmbassador.save().then(() => {
            req.flash('error', "signed up successfully")
            return res.redirect('/login')
        }).catch(err => {
            req.flash('error', "Sign up failed")
            return res.redirect('signup')
        })
    })
})

module.exports = router
