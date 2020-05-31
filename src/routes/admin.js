const express = require('express')
const Product = require('../models/product')
const Category = require('../models/category')
const bodyparser = require('body-parser');


const router = new express.Router()

router.get('/admin',(req,res)=>{
    
    Product.find((err, docs) => {
        res.render('admin/dash',{
            list:docs,
            strList:JSON.stringify(docs)
        }) 
    });


})

router.post('/admin', (req, res) => {
   
    if (req.body.id == '' || req.body.id == undefined)
       insertProduct(req, res);
    else
     updateProduct(req, res);
      
});


router.get('/admin/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
     if(!err){
        res.redirect('../../admin');
     }
            
      
    });
});




function insertProduct(req,res){
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.category = req.body.category;
    product.description = req.body.description;
    product.imageUrl = "req.body.imageUrl";

    
    product.save();
    res.redirect('/admin');
}



function updateProduct(req, res) {
    Product.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, doc) => {
        if (!err) { 
             res.redirect('/admin'); 
             
            
    }
    });
}


// make route accessible to other files
module.exports = router;