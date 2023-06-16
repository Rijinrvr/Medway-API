const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

var cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/medway");
let db = mongoose.connection;
db.on("error", function (err) {
  console.log(err);
});
db.once("open", function () {
  console.log("Connected to mongodb");
});

const app = express();

var corsOptions = {
  origin: ["http://example.com"], 
  optionsSuccessStatus: 200, 
};
app.use(cors(corsOptions));

let Medway = require("./models/medicine");
let User = require("./models/users");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(function (req, res, next) {

//     if (req.path != '/user/login' && req.path != '/user/signup' ) {
//         res.json({message:"kk"})
//         return;
//     }
//     next();
// })

app.get("/medicine", function (req, res) {
  Medway.find({}, function (err, medicines) {
    if (err) {
      res.json({ message: "Someting went wrong", err });
    } else {
      res.json(medicines);
    }
  });
});

app.get("/medicine/:id", function (req, res) {
  let medid = req.params.id;
  Medway.findById(medid, function (err, medicines) {
    if (err) {
      console.log(err);
      res.json({ message: "Someting went wrong", err });
    } else {
      res.json(medicines);
    }
  });
});

//--------------Adding medicine--------------------------------------------------------

app.post("/medicine/add", function (req, res) {
  let addmed = new Medway();
  addmed.medicine = req.body.medicine;
  addmed.doctorname = req.body.doctorname;
  addmed.discription = req.body.discription;
  addmed.save(function (err) {
    if (err) {
      res.json({ message: "Something went wrong", err });
    } else {
      res.json({ message: "Medicine Added" });
    }
  });
});

//----------Edit-----------------------------------------------------------------

app.put("/medicine/edit/:id", function (req, res) {
  let editmed = {};
  editmed.medicine = req.body.medicine;
  editmed.doctorname = req.body.doctorname;
  editmed.discription = req.body.discription;

  let editid = { _id: req.params.id };

  Medway.updateOne(editid, editmed, function (err) {
    if (err) {
      res.json({ message: "Something went wrong", err });
    } else {
      res.json({ message: "Medicine Edited" });
    }
  });
});

//--------------Delete----------------------------------------------------------

app.delete("/medicine/delete/:id", function (req, res) {
  let medid = { _id: req.params.id };
  Medway.deleteOne(medid, function (err) {
    if (err) {
      res.json({ message: "Something went wrong", err });
    } else {
      res.json({ message: "Medicine deleted" });
    }
  });
});

//------------Login------------------------------------------------------------



app.post("/user/login", function (req, res) {
  console.log(req.body);
  let query = { username: req.body.username };

  User.findOne(query, function (err, user) {
    if (err) {
      res.json({ message: "Something went wrong", err });
      return;
    }

    if (!user) {
      res.json({ message: "Invalid Username" });
      return;
    }

    if (user.password != req.body.password) {
      res.json({ message: "Login failed" });
      return;
    }

    res.json({ message: "Login Sucesfully" });
  });
});

//----------Signup-------------------------------------------------------------

app.post("/user/signup", function (req, res) {
  console.log(req.body);

  const newUser = new User();
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.email = req.body.email;
  newUser.confirm_password = req.body.confirm_password;

  let query = { username: newUser.username };

  User.findOne(query, function (err, user) {
    if (err) {
      res.json({ message: "Something went wrong", err });
      return;
    }
    if (user) {
      res.json({ message: "This username is already taken" });
      return;
    }

    newUser.save(function (err, result) {
      console.log(err);
      console.log(result);
      if (err) {
        res.json({ message: "Something went wrong", err });
      } else {
        res.json({ message: "User created" });
      }
    });
  });
});

app.listen(3001);
