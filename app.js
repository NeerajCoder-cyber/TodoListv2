//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose= require("mongoose");
require('dotenv').config();
mongoose.set('useFindAndModify', false);
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.link,{useNewUrlParser:true, useUnifiedTopology:true});

const itemSchema={
  name:String
};

const Item=mongoose.model("Item",itemSchema);

const item1= new Item({
  name: "welcome to ToDO List"
});


const item2= new Item({
  name: "Add Items In The List"
});


const item3= new Item({
  name: "Delete Item"
});

const defaultitem=[item1,item2,item3];

const listSchema={
  name: String,
  items: [itemSchema]
};
const List= mongoose.model("List",listSchema);

const workItems = [];


const day = date.getDate();

// dynamic route
app.get("/", function(req, res) {
  //here condition is empty because we find to display all the data
  // Item.find({},function(err,foundItems){
  //   if(foundItems.length===0){
  //      Item.insertMany(defaultitem,function(err){
  //       if(err){
  //         console.log(err);
  //       }else{
  //         console.log("successfully saved");
  //       }
  //     });
  //     res.redirect("/");
  //   }else{
      res.render("main", {listTitle: "Today"});
    //  console.log(foundItems);
//   }
// });
});



app.get("/:customListName",function(req,res){
    var listNames= req.params.customListName;
    const neeraj=(listNames).toLowerCase();
    console.log(neeraj);
   List.findOne({name:listNames},function(err,foundList){
      if(!err){
         if(!foundList){
          // create a new list
          const list=new List({
            name: listNames,
            items: defaultitem
          });
          list.save();
          res.redirect("/"+ listNames);
        }else{
          // show existing list
          res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
        }
      }
    })
  });

app.post("/delete",function(req,res){
  const checkedItemId= req.body.checkbox;
  const listName= req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("successfully deleted");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
    if(!err){
      res.redirect("/"+ listName);
    }});
  }
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  console.log(listName);

  const item = new Item({
    name: itemName
  });

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
}


  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
