const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const express = require('express')
const {Ambassador, Role} = require('./models/user')

const app = express()

app.use(passport.initialize())
app.use(passport.session())

passport.use('ambassadorstrategy',new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      
      if(password.length < 8){
        return done(null, false, req.flash('error', "Password must be atleast 8 characters long"))
      }
  
      Ambassador.findOne({username: username})
        .then(user => {
          if(!user) {
            return done(null, false, req.flash('error', "Invalid user"))
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) {
              return done(err)
            }
            if(!isMatch) {
              return done(null, false,  req.flash('error', "Invalid password"))
            }
            return done(null, user)
          })
        }).catch(err => { return done(err)})
    }
  ))

  passport.use('rolestrategy', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      
      if(password.length < 8){
        return done(null, false, req.flash('error', "Password must be atleast 8 characters long"))
      }
  
      Role.findOne({username: username})
        .then(user => {
          if(!user) {
            return done(null, false, req.flash('error', "Invalid username or password"))
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) {
              return done(err)
            }
            if(!isMatch) {
              return done(null, false,  req.flash('error', "Invalid username or password"))
            }
            return done(null, user)
          })
        }).catch(err => { return done(err)})
    }
  ))
  
passport.serializeUser((user, done) => {
  const serializedUser = {
    id: user.id,
    username: user.username,
    role: user.role
  }
done(null, serializedUser)
})

passport.deserializeUser((serializedUser, done) => {
  const user = {
    id: serializedUser.id,
    username: serializedUser.username,
    role: serializedUser.role
  }
  done(null, user)
})


module.exports = passport