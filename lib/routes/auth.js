const router = require('express').Router();
const User = require('../models/User');
const tokenService = require('../utils/token-service');
const bcrypt = require('bcryptjs'); //eslint-disable-line

module.exports = router

    .post('/signup', (req, res, next) => {
        const { password, email } = req.body;
        delete req.body.password;

        if (!password) throw { code: 400, error: 'password is required'};

        User.emailExists(email)
            .then(exists => {
                if(exists) {
                    throw { code: 404, error: 'email already exists'};
                }
                
                const user = new User(req.body);
                user.generateHash(password);
                return user.save();
            })
            
            .then(user => {
                return tokenService.sign(user);
            })
            .then(token => {
                return res.json({token});
            })
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code: 400, error: 'password is required' };
        
        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw { code: 401, error: 'authentication failed' }; 
                }
                return tokenService.sign(user);
            })
            .then(token => res.send({ token }))
            .catch(next);

    });  