const express = require('express');
const router = express.Router();
const path = require('path');

let Medway = require('../models/medicine');


//--------------Adding medicine----------------------------------------------------------------------------


router.get('/add', function(req, res){
   return  res.render('add', {
        title: 'Add Medicine'
    })
});

const { body, validationResult } = require('express-validator');

router.post('/add', 
    [
        body('medicine').notEmpty().withMessage('Medicine is required'),
        body('doctorname').notEmpty().withMessage('Doctor Name is required'),
        body('discription').notEmpty().withMessage('Discription is required'),
    ],
    function(req, res){
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
           return res.render('add', {
               title: 'Add Article',
               errors: errors.array()
            })
        } 
        else {
             let addmed = new Medway();
             addmed.medicine = req.body.medicine;
             addmed.doctorname = req.body.doctorname;
             addmed.discription = req.body.discription;
             addmed.save(function(err){
        if(err) {
            console.log(err);
            return;
        } else {
             req.flash('success', 'Medicine Added')
          return  res.redirect('/');
        }
            });
        }
    });
//----------Edit------------------------------------------------------------------------------------

router.get('/:id', function(req, res){
    Medway.findById(req.params.id, function (err, medicine) {  //----------------------To view the details--------------------------
        if (err) {
            console.log(err)
        } else {
            return res.render("article", {
                medicine:medicine
            })
        }
       
    });
});

router.get('/edit/:id', function(req, res){
    Medway.findById(req.params.id, function(err, medicine){
       return res.render('edit',{
            title: "Edit Medicine",
            medicine: medicine
        })
    })
});

router.post('/edit/:id', function(req, res){
    let editmed = {};
    editmed.medicine = req.body.medicine;
    editmed.doctorname = req.body.doctorname;
    editmed.discription = req.body.discription;

    let editid = {_id:req.params.id}

    Medway.updateOne(editid, editmed, function (err) {
        if(err) {
            return console.log(err);
           
        } else {
            req.flash('success', 'Medicine Edited')
            res.redirect('/');
            return; 
        }
    });
});

//--------------Delete----------------------------------------------------------------

router.delete('/delete/:id', function(req, res){

    let medid = { _id: req.params.id };

    Medway.deleteOne(medid,function(err){
        if (err) {
            console.log(err);    
        }
    })
    req.flash('success', 'Medicine Deleted')
    res.send("Success")
});


module.exports = router;