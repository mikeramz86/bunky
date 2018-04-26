'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// this makes the Should and expect syntax available throughout
// this module
const should = chai.should();
const expect = chai.expect;

const { User } = require('./models/users');
const { closeServer, runServer, app } = require('./app');
const { TEST_DATABASE_URL } = require('./config');
console.log(TEST_DATABASE_URL)

chai.use(chaiHttp);

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  data from one test does not stick
// around for next one
// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}
// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for Email Address, Password, first name, last name
// and then we insert that data into mongo
function seedUserData() {
  console.info('seeding bunky users data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
        EmailAddress: `${faker.name.firstName()}@asdf.com`,
        FirstName: faker.name.firstName(),
        LastName: faker.name.lastName(),
        RentPayment: '1222',
        password: 'asdf'
    });
  }
  // this will return a promise
  return User.insertMany(seedData);
}

describe('bunky posts API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedUserData();
  });

  afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });
  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function () {

    it('should return all existing users', function () {
      // strategy:
      //    1. get back all posts returned by by GET request to `/posts`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      let res;
      return chai.request(app)
        .get('/users/for_tests')
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.allusers).to.have.length.of.at.least(1);
          return User.count();
        })
        .then(count => {
          expect(res.body.allusers).to.have.length(count);
        });
    });
  })

  describe('POST endpoint', function createNewUser() {

    it('should create a new user', function () {
      // strategy:
      //    1. get back all posts returned by by GET request to `/users`
      //    2. prove res has right status 201, data type
      //    3. prove the new user was created
      let res;
      let newUser = {
        password: 'asdfjkl',
        FirstName: faker.name.firstName(),
        LastName: faker.name.lastName(),
        EmailAddress: `${faker.name.firstName()}@asdf.com`,
        RentPayment: 1400
      }
      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);
          console.log(res.body);
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(
            'id','FirstName','LastName','EmailAddress','numRoomates','budget','culture');
          expect(res.body.EmailAddress).to.equal(newUser.EmailAddress);
          // cause Mongo should have created 4`id on insertion
          expect(res.body.id).should.not.be.null;
          expect(res.body.RentPayment).to.equal(newUser.RentPayment);
          console.log('this is the res+',res.body);
          return User.findById(res.body.id);
        })
        .then(user => {
          expect(user.EmailAddress).to.equal(newUser.EmailAddress);
          expect(user.FirstName).to.equal(newUser.FirstName);
          expect(user.LastName).to.equal(newUser.LastName);
          expect(user.numRoomates).to.equal(newUser.numRoomates);
          expect(user.budget).to.equal(newUser.budget);
          expect(user.culture).to.equal(newUser.culture);
        })      
    });
  })
  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a bunky User by id', function() {

      let user;

      return User
        .findOne()
        .then(function(_user) {
          user = _user;
          return chai.request(app).delete(`/logged_in/for_tests/${user._id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return User.findById(user.id);
        })
        .then(function(user) {
          expect(user).to.be.null;
        });
    });
  });
    describe('PUT endpoint', function () {
      it('should return user data with right fields updated', function () {
      // Strategy: It should update a users' account info
      //
       let res;
              // strategy:
              //  1. Get an existing user from db
              //  2. Make a PUT request to update that user
              //  3. Prove updated user returned by request contains data we sent
              //  4. Prove user in db is correctly updated
                const updateUser = {
                  EmailAddress: 'test@bunky.com',
                  FirstName: 'Tom',
                  LastName: 'Sawyer',
                  RentPayment: 1500
                };
                return User 
                  .findOne()
                  .then(function(randomUser) {
                    updateUser.id = randomUser.id;
                    console.log(updateUser.id, randomUser.id);
                    // make request then inspect it to make sure it reflects
                    // data we sent
                    return chai.request(app)
                      .put(`/logged_in/for_tests/${randomUser.id}`)
                      .send(updateUser);
                  })
                  .then(function(res) {
                    expect(res).to.have.status(204);
                    return User.findById(updateUser.id);
                  })
                  .then(function(user) {
                    expect(user.EmailAddress).to.equal(updateUser.EmailAddress);
                    expect(user.FirstName).to.equal(updateUser.FirstName);
                    expect(user.LastName).to.equal(updateUser.LastName);
                    expect(user.numRoomates).to.equal(newUser.numRoomates);
                    expect(user.budget).to.equal(newUser.budget);
                    expect(user.culture).to.equal(newUser.culture);
                  })
              })
            })
  });