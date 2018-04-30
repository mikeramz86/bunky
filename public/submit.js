router.post('/', jsonParser, (req, res) => {
  // add fields
  //   const requiredFields = [ 'password', 'FirstName', 'LastName', 'EmailAddress','numRoomates', 'budget', 'culture' ];
  //   const missingField = requiredFields.find(field => !(field in req.body));
  //   if (missingField) {
  //     console.log('missing entity field')
  //     return res.status(422).json({
  //       code: 422,
  //       reason: 'ValidationError',
  //       message: 'Missing field',
  //       location: missingField
  //     });
  //   }
  // //check to see if datatypes are correct
  //   const stringFields = [ 'password', 'FirstName', 'LastName', 'EmailAddress', 'numRoomates', 'budget', 'culture'];
  //   const nonStringField = stringFields.find(
  //     field => field in req.body && typeof req.body[field] !== 'string'
  //   );
  //   if (nonStringField) {
  //     console.log('missing nonstring entity field')
  //     return res.status(422).json({
  //       code: 422,
  //       reason: 'ValidationError',
  //       message: 'Incorrect field type: expected string',
  //       location: nonStringField
  //     });
  //   }
  //   const explicityTrimmedFields = ['password'];
  //   const nonTrimmedField = explicityTrimmedFields.find(
  //     field => req.body[field].trim() !== req.body[field]
  //   );
  //   if (nonTrimmedField) {
  //     return res.status(422).json({
  //       code: 422,
  //       reason: 'ValidationError',
  //       message: 'Cannot start or end with whitespace',
  //       location: nonTrimmedField
  //     });
  //   }

  //   const sizedFields = {
  //     password: {
  //       min: 6,
  //       max: 20
  //     }
  //   };
  //   //making sure psword is correct length
  //   const tooSmallField = Object.keys(sizedFields).find(
  //     field =>
  //       'min' in sizedFields[field] &&
  //             req.body[field].trim().length < sizedFields[field].min
  //   );
  //   const tooLargeField = Object.keys(sizedFields).find(
  //     field =>
  //       'max' in sizedFields[field] &&
  //             req.body[field].trim().length > sizedFields[field].max
  //   );

  //   if (tooSmallField || tooLargeField) {
  //     return res.status(422).json({
  //       code: 422,
  //       reason: 'ValidationError',
  //       message: tooSmallField
  //         ? `Must be at least ${sizedFields[tooSmallField]
  //           .min} characters long`
  //         : `Must be at most ${sizedFields[tooLargeField]
  //           .max} characters long`,
  //       location: tooSmallField || tooLargeField
  //     });
  //   }

  //   let {password, FirstName = '', LastName = '', EmailAddress , } = req.body;
  //   //PROBLEM! Missing certain things
  //   // Username and password come in pre-trimmed, otherwise we throw an error
  //   // before this
  //   FirstName = FirstName.trim();
  //   LastName = LastName.trim();
  //   EmailAddress = EmailAddress.trim();
  //   password = password.trim();

  //   return User.find({EmailAddress})
  //     .count()
  //     .then(count => {
  //       if (count > 0) {
  //         // There is an existing user with the same username
  //         return Promise.reject({
  //           code: 422,
  //           reason: 'ValidationError',
  //           message: 'Email Address already taken',
  //           location: 'EmailAddress'
  //         });
  //       }
  //       // If there is no existing user, hash the password
  //       return User.hashPassword(password);
  //     })
  //     .then(hash => {
  User.create({
    EmailAddress: req.body.EmailAddress,
    password: req.body.password,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    budget: req.body.budget,
    numRoomates: req.body.numRoomates,
    culture: req.body.culture
    // });
  })

    .then(user => {
      return res.status(201).json(user.serialize());
    })

    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      console.log('here2', err)
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});