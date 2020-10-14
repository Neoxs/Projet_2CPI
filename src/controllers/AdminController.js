const async = require('async');
const express = require('express')
const Product = require('../models/product')
const Order = require('../models/order')
const User = require('../models/user')
const Category = require('../models/category')
const bcrypt = require('bcrypt');
const moment = require('moment');


exports.getOrder = (req,res)=>{
    var allData = getAllData()
    allData.push( (clb)=>{
        Order.find({ orderId: req.body.OrderId}).exec((err, docs)=>{
            if (err) {
                throw clb(err);
            }
            clb(null, docs);
        });
    }) 
    async.parallel(allData, (err, docs)=>{
        if (err) {
            throw err;
        }
    res.render('admin/test',{
        productInfo :docs[0],
        strList:JSON.stringify(docs[0]),
        allOrders :docs[1] ,
        userInfo :docs[2],
        categoryList :docs[3],
        nmbrUsers :docs[4],
        orderSearch :docs[5], 
     })
    })
 }   




exports.register = (req,res)=>{
	var personInfo = req.body;
  if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
          res.send();
      } else {
	    	if (personInfo.password == personInfo.passwordConf) {

		    	User.findOne({email:personInfo.email},function(err,data){
			    	if(!data){
				    	User.findOne({username:personInfo.username},function(err2,data){
  
                          if(!data){	
	     					var newPerson = new User({
							 email:personInfo.email,
							 username: personInfo.username,
							password: personInfo.password,
						 });

                          newPerson.save()

                    }else
					     res.send({"Success":"Username is already used."});
				    })
				      res.send({"Success":"You are regestered,You can login now."});
				    }else{
					     res.send({"Success":"Email is already used."});
			    	}

			   });
		   }else{
			  res.send({"Success":"password is not matched"});
		  }
      }}





    exports.login =  (req, res, next)=>{
        User.findOne({email:req.body.email},function(err,data){
            if(data){
                
               bcrypt.compare(req.body.password, data.password, function(err, results){
                if(err){
                    throw new Error(err)
                }
                if (results) {
                    req.session.userId = data.username;
                    req.session.email = data.email;
                    res.send({"Success":"Success!"});
                } else {
                    res.send({"Success":"Wrong password!"});
                }
             })
             }else{
               res.send({"Success":"This Email Is not regestered!"});
            }
        });
    };




    exports.access = (req, res)=>{
        User.findOne({username:req.session.userId},(err,data)=>{
            if(data){
                var data = getAllData();            //get all data from database and put it into docs[product,product(String),orders,users,category]
                async.parallel(data, (err, docs)=>{
                    if (err) {
                        throw err;
                    }
                    const ordersList = docs[1].map(element => {
                        const date = new Date(element.createdAt)
                        element.date = moment(date).format('h:mma ,MMMM d ,YYYY')
                        return element
                    });
                 res.render('admin/test',{
                     productInfo :docs[0],            
                     strList:JSON.stringify(docs[0]),
                     allOrders : ordersList ,
                     userInfo :docs[2],
                     categoryList :docs[3],
                     nmbrUsers :docs[4],
                     adminName:req.session.userId,
                     adminEmail:req.session.email
                 })
                
                })
            }else{
                res.redirect('/admin_login');
    
            }
        });
    };




    exports.delete = (req, res)=>{
       
        if(req.query.item == "product"){  
           Product.findByIdAndRemove(req.params.id, (err, doc) => {
               if(!err){
                  res.redirect('../../admin');
               }
               else
                 console.log(err);
             });
         }
        else if(req.query.item == "order"){  
            Order.findByIdAndRemove(req.params.id, (err, doc) => {
                if(!err){
                   res.redirect('../../admin');
                }
                else
                  console.log(err);
              });
          }
         else
            User.findByIdAndRemove(req.params.id, (err, doc) => {
                if(!err){
                   res.redirect('../../admin');
                }
                else
                  console.log(err);
              });
     };




     exports.productsChange = (req, res)=>{
        var bool = req.body.id == '' || req.body.id == undefined
          if ( bool && req.params.prms ==":addPr")
             insertProduct(req,res);
         else if(!bool && req.params.prms ==":addPr")
             updateProduct(req, res);
          else if (bool && req.params.prms==":catDel")      
             insertCategory(req,res);       
     };




     exports.logout = (req, res, next)=>{
         if (req.session) {
         // delete session object
         req.session.destroy(function (err) {
             if (err) {
                  return next(err);
             } else {
                  return res.redirect('/admin_login');
             }
         });
     }
    };


    ///Functions***

  function getAllData(){
      var queries=[];
      queries.push( (clb)=>{
          Product.find().exec((err, docs)=>{
              if (err) {
                  throw clb(err);
              }
              clb(null, docs);
          });
      })    
      queries.push((clb)=>{
          Order.find({}).exec((err, docs)=>{
              if (err) {
                  throw clb(err);
              }
              clb(null, docs);
          });
      })

      queries.push( (clb)=>{
          User.find({}).exec((err, docs)=>{
              if (err) {
                  throw clb(err);
              }
              clb(null, docs);
          });
      })
      queries.push( (clb)=>{
          Category.find({}).exec((err, docs)=>{
              if (err) {
                  throw clb(err);
              }
              clb(null, docs);
          }); 
      })
      queries.push( (clb)=>{
        User.count({},function(err,count){
            if(err){
                throw clb(err);
            }
            clb(null,count)
        });
    }) 
     return queries
    }




     function insertProduct(req,res){
        var product1 = new Product();
        product1.title = req.body.title;
        product1.price = req.body.price;
        product1.category = req.body.category;
        product1.description = req.body.description;
        product1.imageURL ="/img/products/" + req.body.imagePath ;
        product1.save();
    
        res.redirect('/admin'); 
    }
    


 
     function updateProduct(req, res) {
        Product.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, doc) => {
            if (!err) {res.redirect('/admin')}
             else
                console.log(err)
        });
     }
    


     
     function insertCategory(req,res){
        var category = new Category();
        category.title = req.body.CatTitle
        category.save();
        res.redirect('/admin'); 
     }
    