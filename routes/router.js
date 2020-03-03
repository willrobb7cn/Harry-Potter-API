const {Router} = require('express')
const router = Router()
const mongoose = require('mongoose')

const UserSchema = require('../models/user')
const hbs = require('express-handlebars');
const path = require('path');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const nanoID = require('nanoid')
const getHarryPotterData = require('../lib/getHarryPotter')
const getUsers = require('../lib/getUsers')
const getPassword = require('../lib/getPassword')
const getSession = require('../lib/getSession')

const {Router} = require('express');
const router = Router();

router.post('/login', async (req, res) => {

    let email = req.body.email
    let password = req.body.password
    let docs = await getUsers(email)
    let pass = await getPassword(password)
    console.log(docs,"here");


    if (docs.length > 0 && pass.length > 0) {
        console.log(req.session);
        
        req.session.userID = nanoID()
        req.session.email = req.body.email
        req.session.save()
        res.render('profile',{Welcome: email})
        return
    } else if (docs.length > 0 || pass.length > 0) {
        res.render('login', { err: `Email or Password is incorrect.` })
        return
    } else {
        res.render('/', { err: `You should create an account!` })
        return
    }

    //-------------------
    //Check login 
    //if true
    //-------------------

    // res.redirect('/profile')
})

router.get('/profile', async (req, res) => {
    // console.log("hi");



    let loggedIn = await getSession(req.session.userID)

    if (loggedIn) {
        res.render('profile')

    } else {
        res.render('login', { err: 'Please enter a valid login and password' })
    }
})

// router.engine('.hbs', hbs({
//     defaultLayout: 'layout',
//     extname: '.hbs'
// }));

// router.set('view engine', '.hbs');
// next, always require a app.get and an app.post (remember req,res)
router.get('/', (req, res) => {
    res.render('index')
})
router.get('/logIn', (req, res) => {
    res.render('logIn')
})

router.get('/account', async (req, res) => {
    // res.render('account')
    let loggedIn = await getSession(req.session.userID)
    console.log(loggedIn);
    
    if (loggedIn) {
        res.render('/account')

    } else {
        res.render('login', { err: 'Please log in' })
    }
})


router.get('/characters', async (req, res) => {
    // res.render('characters')
    let loggedIn = await getSession(req.session.userID)
    console.log(loggedIn);

    if (loggedIn) {
        res.render('characters')

    } else {
        console.log("hhhhhh");
        
        res.render('login', { err: 'Please log in' })
    }
})
router.get('/sortingHouse', async (req, res) => {
    console.log(req.session.userID);

    // res.render('sortingHouse')
    let loggedIn = await getSession(req.session.userID)
    console.log(loggedIn);

    if (loggedIn) {
        res.render('sortingHouse')
    } else {
        res.render('login', { err: 'Please log in' })
    }
})


router.post('/', async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    let docs = await getUsers(email)

    if (docs.length > 0) {
        res.render('index', { err: `A user with the email, ${email} already exists` })
        return
    }

    const user = new UserSchema({
        email: email,
        password: password
    });
    user.save()

    res.render('logIn')

})


router.post('/profile', async (req, res) => {
    let email = req.body.email
    res.render('profile',{email: email})
})

router.post('/account ', async (req, res) => {
    res.render('account')
})

router.post('/sortingHouse', async (req, res) => {
    let data = await getHarryPotterData.sortingHatData()
    console.log(data);
    res.render('sortingHouse', { data })
})

router.post('/characters', async (req, res) => {
    let characterChosen = encodeURIComponent(req.body.character)
    let data = await getHarryPotterData.harryPotterData(characterChosen);
    let name, role, school, house, alias, wand, bloodStatus, animagus, ministryOfMagic, dumbledoresArmy, deathEater
    if (data[0]) {
        name = data[0].name;
        role = data[0].role;
        house = data[0].house;
        school = data[0].school
        alias = data[0].alias;
        animagus = data[0].animagus;
        wand = data[0].wand;
        ministryOfMagic = data[0].ministryOfMagic;
        dumbledoresArmy = data[0].dumbledoresArmy;
        deathEater = data[0].deathEater;
        bloodStatus = data[0].bloodStatus;
        // console.log("yes");

        res.render("characters", { data: { name, role, school, house, wand, alias, bloodStatus, animagus, ministryOfMagic, dumbledoresArmy, deathEater } });

    } else {
        // console.log("no");

        res.render('characters', { err: `${characterChosen} does not exist. Please pick a character` })
    }
}
)


module.exports = router