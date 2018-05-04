//route CRUD

var express = require('express');
var router = express.Router();
const { User } = require('../models/users');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth,(req, res) => {

   console.log('GET THE USER DATA AND SEND IT TO THE PAGE',req.query)
   try {
        User.findOne({EmailAddress: req.query.EmailAddress}).then(user => {
            res.json({user:user.serialize()})
        })
   } catch(err) {
       res.json({err})
   }

});

//--------------------------------------DELETE USER ACCOUNT -------------------------------------
router.delete('/', jwtAuth, (req, res) => {
    console.log(req);
    try {
        User.deleteOne({EmailAddress: req.body.EmailAddress}).then(users => {
        res.status(200).json({ message: "Your Account was deleted!" })
    }) 
    } catch (e) {
        res.status(500).json({ message: 'Internal server error, account cannot deleted' });
    }
});
router.delete('/for_tests/:id', (req, res) => {
        User
          .findByIdAndRemove(req.params.id)
          .then(user => res.status(204).end())
          .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//--------------------------------------UPDATE USER ACCOUNT -------------------------------------
router.put('/', jwtAuth,(req, res) =>{
    try {
        User.findOneAndUpdate(
          {EmailAddress: req.body.EmailAddress},
          req.body,
          {new: true},
          (err, newUser) => {
            if (err) return res.status(500).send(err);
            res.send(newUser);
          })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error, account cannot be updated' });
    }
});
router.put('/for_tests/:id', (req, res) =>{
        console.log(req.body);
        // ensure that the id in the request path and the one in request body match
        if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
          const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
          console.error(message);
          return res.status(400).json({ message: message });
        }
      
        // we only support a subset of fields being updateable.
        // if the user sent over any of the updatableFields, we udpate those values
        // in document
        const toUpdate = {};
        const updateableFields = [ 'FirstName', 'LastName','username','EmailAddress','password','budget', 'numRoomates','culture'];
      
        updateableFields.forEach(field => {
          if (field in req.body) {
            toUpdate[field] = req.body[field];
          }
        });
        User
          // all key/value pairs in toUpdate will be updated -- that's what `$set` does
          .findByIdAndUpdate(req.params.id, { $set: toUpdate })
          .then(user => res.status(204).end())
          .catch(err => res.status(500).json({ message: 'Internal server error' }));
      });
module.exports = router;