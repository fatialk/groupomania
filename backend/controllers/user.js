const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                pseudo: req.body.pseudo,
                isAdmin: false,
                hasApprouved: false,
            });
            user.save()
                .then(() => res.status(201).json({message: 'Félicitation! Votre compte est créé.'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};


exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({message: 'Paire login/mot de passe incorrecte'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        pseudo: user.pseudo,
                        isAdmin: user.isAdmin,
                        hasApprouved: user.hasApprouved,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.hasApprouved = (req, res, next) => {
    console.log(req.auth.userId);
    User.updateOne({ _id: req.auth.userId}, { hasApprouved : true})
        .then(() => res.status(200).json({message : 'User modifié!'}))
        .catch(error => res.status(400).json({ error }));
};
