const express = require('express')
const router = express.Router()
const { Manual, Live, Event, Ambassador, Gallery} = require('../models/user')
const bcrypt = require('bcrypt')


const ensureAuthenticated = require('../middlewares/authenticate')

router.get('/', ensureAuthenticated, async(req,res) => {
    const manuals = await Manual.find({})
    const lives = await Live.find({})
    const events = await Event.find({})
    const gallery = await Gallery.find({})
    const ambassadors= await Ambassador.find({role: {$ne: 'admin'}})
    const authUser = req.user.role
    res.render('dashboard', {authUser, gallery, manuals, ambassadors, lives, events})
})

router.get('/change-password', ensureAuthenticated, (req,res) => {
    res.render('change-password')
})


router.post('/manual', ensureAuthenticated, (req,res) => {
    const {title, writer, date, content} = req.body

    const myManual = new Manual({
        src: src,
        title: title,
        date: date,
        content: content
    })

    myManual.save()
    return res.redirect("/dashboard")
})

router.post('/live', ensureAuthenticated, (req,res) => {
    const {title, src, content, date } = req.body

    const myLive = new Live({
        title: title,
        src: src,
        content: content,
        date: date
    })

    myLive.save()
    return res.redirect("/dashboard")
})

router.post('/gallery', ensureAuthenticated, (req,res) => {
    const {title, src} = req.body

    const myGallery = new Gallery({
        title: title,
        src: src,
    })

    myGallery.save()
    return res.redirect("/dashboard")
})

router.post('/event', ensureAuthenticated, (req,res) => {
    const { event, date, src } = req.body

    const myEvent = new Event({
        title: event,
        date: date,
        src: src
    })

    myEvent.save().then(() => {
        console.log('new event saved successsfully')
    }).catch(()=> {
        console.log('unable to save event')
    })
    return res.redirect("/dashboard")
})

router.post('/change-password', ensureAuthenticated, async (req, res) => {

    const { oldpassword, newpassword } = req.body;

    await Ambassador.find({username: req.user.username}).then(user => {
        if(!user){
            return res.send('user not found')
        }

            bcrypt.hash(newpassword, 10, (err, hashedPassword) => {
                Role.replaceOne({username: user.username}, {$set: {password: hashedPassword}})
                return res.json(user)
            })
    })
})

router.get('/live/delete/:src', ensureAuthenticated, (req,res) => {
    const src = req.params.src

    Live.deleteOne({src: src}).then((data) => {
        if(!data){ return res.send('No encounter found!!!')}
        console.log(data)
    })
    res.send('Data deleted successfully')
})

router.get('/event/delete/:title', ensureAuthenticated, (req,res) => {
    const title = req.params.title

    Event.deleteOne({title: title}).then((data) => {
        if(!data){ return res.send('No Event found!!!')}
        console.log(data)
    })
    res.redirect('/dashboard')
})

router.get('manual/delete/:title', ensureAuthenticated, (req,res) => {
    const title = req.params.title

    Manual.deleteOne({title: title}).then((data) => {
        if(!data){ return res.send('No encounter found!!!')}
        console.log(data)
    })
    res.send('Data deleted successfully')
})

router.get('gallery/delete/:title', ensureAuthenticated, (req,res) => {
    const title = req.params.title

    Gallery.deleteOne({title: title}).then((data) => {
        if(!data){ return res.send('No encounter found!!!')}
        console.log(data)
    })
    res.send('Data deleted successfully')
})

router.get('/clear', ensureAuthenticated, (req,res) => {
    Manual.deleteMany({}).then(()=> {
        console.log('Posts cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Posts')
    })
    Live.deleteMany({}).then(()=> {
        console.log('Lives cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Lives')
    })
    Event.deleteMany({}).then(()=> {
        console.log('Users cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Users')
    })
    Ambassador.deleteMany({}).then(()=> {
        console.log('Users cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Users')
    })
    res.redirect('/dashboard')
})

router.get('/delete-ambassador/:username', (req,res) => {
    const username = req.params.username
    Ambassador.findOneAndDelete({username: username}).then(users => {
        res.redirect('/dashboard')
    }).catch(() => {
        console.log('Unable to delete user')
    })
})

module.exports = router