const bcrypt = require('bcryptjs');
const config = require('config');
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/auth');
const User = require('../../models/User');
const router = express.Router();

//@route    GET api/auth
//@desc     Test route
//@access   Public
router.get('/',
    authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            console.log(error.message);
            res.status(400).send('server error');
        }
    });

//@route    POST api/auth
//@desc     Authenticate user and get token
//@access   Public
router.post('/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            //check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: 'invalid credentials', }]
                })
            }

            //match user and password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: 'invalid credentials', }]
                })
            }

            //return jsonwebtoken
            const payload = {
                user: {
                    id: user.id,
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '12h', },
                (error, token) => {
                    if (error) throw error;
                    res.json({ token });
                }
            );

        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
);
module.exports = router;