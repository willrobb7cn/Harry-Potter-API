// All default things to be put in straight away

// const mongoose = require('mongoose')
const UserSchema = require('./models/user')
const hbs = require('express-handlebars');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const nanoID = require('nanoid')
const getHarryPotterData = require('./lib/getHarryPotter')
const app = express()
const getUsers = require('./lib/getUsers')
const getPassword = require('./lib/getPassword')
// const fs = require('fs');
// const content = JSON.stringify(output);
// const routes =require('./routes/router')

const getSession = require('./lib/getSession')

mongoose.connect('mongodb+srv://WillRob:codenation@usersignup-lqnk3.mongodb.net/userdb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})



app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use('/',routes)


//config session
app.use(session({
    store: new MongoStore({
        url: `mongodb+srv://WillRob:${process.env.PASS}@usersignup-lqnk3.mongodb.net/userdb?retryWrites=true&w=majority`
    }),
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        //Two hour max cookie 
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true
    }
}));



app.engine('.hbs', hbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');
// next, always require a app.get and an app.post (remember req,res)
    app.post('/login', async (req, res) => {
    
        let email = req.body.email
        let password = req.body.password
        let docs = await getUsers(email)
        let pass = await getPassword(password)
    
    
        if (docs.length > 0 && pass.length > 0) {
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
    
    app.get('/profile', async (req, res) => {
        // console.log("hi");
    
    
    
        let loggedIn = await getSession(req.session.userID)
    
        if (loggedIn) {
            res.render('profile')
    
        } else {
            res.render('login', { err: 'Please enter a valid login and password' })
        }
    })
app.get('/', (req, res) => {
        res.render('index')
    })
    app.get('/logIn', (req, res) => {
            res.render('logIn')
        })
        
        app.get('/account', async (req, res) => {
                // res.render('account')
                let loggedIn = await getSession(req.session.userID)
                console.log(loggedIn);
            
                if (loggedIn) {
                        res.render('/account')
                
                    } else {
                            res.render('login', { err: 'Please log in' })
                        }
                    })


app.get('/characters', async (req, res) => {
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
app.get('/sortingHouse', async (req, res) => {
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


app.post('/', async (req, res) => {
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


app.post('/profile', async (req, res) => {
    res.render('profile')
})

app.post('/account ', async (req, res) => {
    res.render('account')
})

app.post('/sortingHouse', async (req, res) => {
    let data = await getHarryPotterData.sortingHatData()
    console.log(data);
    res.render('sortingHouse', { data })
})

app.post('/characters', async (req, res) => {
    let characterChosen = encodeURIComponent(req.body.character)
    let aliasChosen = encodeURIComponent(req.body.character)
    let aliasData = await getHarryPotterData.aliasData(aliasChosen)
    let data = await getHarryPotterData.harryPotterData(characterChosen);
    console.log(`this is my ${aliasData}`);
    console.log(characterChosen);
    
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
        console.log("yes");

        res.render("characters", { data: { name, role, school, house, wand, alias, bloodStatus, animagus, ministryOfMagic, dumbledoresArmy, deathEater } });

    } else if (aliasData[0]){
        console.log('Alias')
        name = aliasData[0].name;
        role = aliasData[0].role;
        house = aliasData[0].house;
        school = aliasData[0].school
        alias = aliasData[0].alias;
        animagus = aliasData[0].animagus;
        wand = aliasData[0].wand;
        ministryOfMagic = aliasData[0].ministryOfMagic;
        dumbledoresArmy = aliasData[0].dumbledoresArmy;
        deathEater = aliasData[0].deathEater;
        bloodStatus = aliasData[0].bloodStatus;
        // console.log("yes");

        res.render("characters", { data: { name, role, school, house, wand, alias, bloodStatus, animagus, ministryOfMagic, dumbledoresArmy, deathEater } });

    }
    else {
        // console.log("no");

        res.render('characters', { err: `${characterChosen} does not exist. Please pick a character` })
    }
}
)












// always need an app.listen to set the localhost port
app.listen(4567)

