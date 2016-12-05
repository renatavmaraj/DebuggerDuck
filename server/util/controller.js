const db = require('../db/schemas.js');

// Returns an object with a key of data
const buildResObj = function (data) {
  return {
    data: data
  }
}

module.exports = {

  login: {
    // Login controller functions for GET
    get: (req, res) => {
      passport.authenticate('facebook')
      console.log('Login GET');
      //res.send(200);
    },

    //Login controller function for oath
    oauth: (req,res) => {
      passport.authenticate('facebook', { failureRedirect: '/login' })
      res.redirect('/');
    },

  // Login controller functions for GET
    profile: (req, res) => {
      require('connect-ensure-login').ensureLoggedIn()
      res.render('profile', { user: req.user })
      console.log("This is user: ", req.user)
    }
  },
  group: {
    // Group controller functions for GET
    get: (req, res) => {
      db.Group.find().exec()
        .then((groups) => {
          let response = buildResObj(groups);
          res.status(200).send(response);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(400);
        })
    },
    // Group controller functions for GET
    post: (req, res) => {
      // Look in the database to see if there is a Group with the given name already
      db.Group.findOne({'name': req.body.data.groupName}).exec()
      .then((data) => {
        console.log(data)
        // If we don't get any data, add the request body into the database
        if(!data) {
          new db.Group({name: req.body.data.groupName}).save()
          .then((data) => {
            console.log(data);
            // Send a 201 status that it was completed
            res.sendStatus(201);
          })
          // Catch the error and log it in the server console
          .catch((err) => {
            console.error(err);
            res.sendStatus(400);
          })
        }
        else {
          // Send a 401 status and a message that the group is already added the database
          res.status(401).send('Group is already in the database.')
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  },
  volunteer: {
    // Volunteer controller functions for GET
    get: (req, res) => {
      db.Order.find().exec()
        .then((volunteers) => {
          let response = buildResObj(volunteers);
          res.status(200).send(response);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(400);
        })
    },
    // Volunteer controller functions for POST
    post: (req, res) => {
      req.body.data = {
        username: 'wschwanke',
        location: 'Chipotle',
        time: 'Eleventee PM',
        groupId: 'f329j023dkwdk0w',
        requests: []
      }
      new db.Order({
        order_user: req.body.data.username,
        location: req.body.data.location,
        time: req.body.data.time,
        group_id: req.body.data.groupId,
        requests: req.body.data.requests
      }).save()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.sendStatus(400)
      })
    }
  },
  request: {
    // Request controller functions for POST
    post: (req, res) => {
      console.log('Request POST');
      res.send(200);
    }
  }
}