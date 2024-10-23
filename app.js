const express = require('express')
const app = express()
const conn = require("./db/conn")
const path = require('path')
const hbs = require('hbs')
const Joi = require('joi')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const SECRETKEY = "Login"
app.use(cookieParser())

// Models
const registration = require('./models/account')
const product = require('./models/Products')

// Routers
const addingProductsRouter = require('./routers/addingProducts');
const necklaceRouter = require('./routers/Necklace');
const braceletsRouter = require('./routers/Bracelets');
const earingRouter = require('./routers/Earing')
const ringsRouter = require('./routers/Rings')
const chainRouter = require('./routers/chain')
const mycartRouter = require('./routers/mycart')

// routerMiddlewares
app.use('/', addingProductsRouter)
app.use('/Necklace', necklaceRouter)
app.use('/bracelets', braceletsRouter)
app.use('/earings', earingRouter)
app.use('/Rings', ringsRouter)
app.use('/Chains', chainRouter)
app.use('/mycart', mycartRouter)

app.use('/uploads', express.static('uploads'))

// Importing Templates
const port = process.env.PORT || 3000
const templatePath = path.join(__dirname, "./templates/views")
const templatePartialPath = path.join(__dirname, "./templates/partials")

// middleware
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan('tiny'))
app.use(bodyParser.json())
const getuser = require('./middlewares/getuser')
const authenticateToken = require('./middlewares/authenticateToken')

// Templates middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "hbs")
app.set("views", templatePath)
hbs.registerPartials(templatePartialPath)

// main page router
app.get('/', getuser, (req, res) => {
    res.render("index", { user: { username: req.account.username } })
})

// RegistrationPage Routes
app.get('/accountPage', getuser, (req, res) => {
    res.render("accountPage", { user: { username: req.account.username } })
})
//  for registering data
app.post('/accountPage', getuser, async (req, res) => {
    const { username, Register_email, Register_password, conf_password } = req.body;

    // Validation for client side
    const schema = Joi.object({
        username: Joi.string().required(),
        Register_email: Joi.string().email().required(),
        Register_password: Joi.string().required(),
        conf_password: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        console.error('Validation error:', error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    try {
        const existingUser = await registration.find({
            Register_email: Register_email,
            username: username
        });

        if (existingUser.length > 0) {
            console.error('User already exists');
            return res.status(409).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(Register_password, 10);

        if (conf_password !== Register_password) {
            console.error('Passwords do not match');
            return res.status(400)
        }

        const registered = await registration.create({
            username: username,
            Register_email: Register_email,
            Register_password: hashedPassword,
            conf_password: hashedPassword
        })

        return res.status(201).render('login', { user: { username: req.account.username } });
    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).send("Internal Server Error");
    }
})

app.get('/login', getuser, (req, res) => {
    res.render('login', { user: { username: req.account.username } });
})

// fetching data
app.post('/login', getuser, async (req, res) => {
    try {
        const { username, Register_email, Register_password } = req.body;

        const existingUser = await registration.findOne({ Register_email: Register_email, username: username });

        if (!existingUser) {
            return res.status(404).send("User not found");
        }

        const matchedPassword = await bcrypt.compare(Register_password, existingUser.Register_password);

        if (matchedPassword) {
            const token = jwt.sign({
                username: existingUser.username,
                Register_email: existingUser.Register_email,
                id: existingUser._id
            }, SECRETKEY, { expiresIn: '1h' });

            res.cookie('token', token, { maxAge: 3600000, httpOnly: true, secure: true });

            res.cookie('existingUser', existingUser)
            return res.redirect(`/`);

        } else {
            return res.status(401).send("Invalid login details");
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Something went wrong");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie('token')
    res.clearCookie('existingUser')
    res.send("logged out successfully")
})

app.get('*', getuser, (req, res) => {
    res.render("404page", { user: { username: req.account.username } })
})

app.listen(port, (req, res) => {
    console.log("server is running on port no : ", port)
})