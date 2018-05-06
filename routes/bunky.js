// //route
// var express = require('express');
// var router = express.Router();
// const { User } = require('../models/users');

// //Display all of Bunky
// router.get('/total', (req, res) => {
//    try {
//         User.find({}).then(allusers => {
//             res.json({total:allusers.reduce(function(total,user){
//                 if (user && typeof user.RentPayment === 'number') {
//                     return total + user.RentPayment;
//                 }
//                 return total;
//             },0)
//             })
//         })
//    } catch(err) {
//        res.json({err})
//    }
// });

// module.exports = router;