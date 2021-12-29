
//full code in index.js available at 8:44
//https://www.youtube.com/watch?v=dVvgLUHdS_E&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP&index=4



const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const config ={…

};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/customers', (req, res) => {
db
  .collection('customers')
  .orderBy('createdAt', 'desc')
  .get()
  .then((data) => {
    let customers =[];
    data.forEach((doc) => {
        customers.push ({
            customerID: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt,
            accBalance: doc.data().accBalance
        });
    });
    return res.json(customers);
  })
  .catch((err) => {
      console.err(err);
      res.status(500).json({  error: err.code })
  });

});

//post one customer
app.post('/customer', (req, res) => {
    if (req.body.body.trim() === ''){
        return res.status(400).json({ body: 'Body must have stuff in it'});
    }

    const newCustomer = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString(),
        accBalance: req.body.accBalance
    };

    db
      .collection('customers')
      .add(newCustomer)
      .then((doc) => {

        res.json({  message: `document ${doc.id} created successfully`  });
        })
      .catch((err) => {
          res.status(500).json({ error: 'opps... something went wrong' });
          console.error(err);
      });

firebase
    .auth()
    .createUserWithEmailAndPassword(newCustomer.email, newCustomer.password)
    .then((data) => {
        return res
          .status(201)
          .json({ message: `user ${data.user.uid} signed up successfully`});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({  error: err.code  });
    });
});

exports.api = functions.region('asia-southeast1').https.onRequest(app);



//go to next video on validation to continue: 
//https://www.youtube.com/watch?v=uK9EneE8G1M&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP&index=5