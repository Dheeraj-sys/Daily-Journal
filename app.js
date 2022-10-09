const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

const username= process.env.DB_USERNAME;
const password= process.env.DB_PASSWORD;
const cluster= process.env.DB_CLUSTER;

mongoose.connect("mongodb+srv://"+username+":"+password+"@"+cluster+"/journalDB");

const homeStartingContent = "This is a online daily journal to create a memory note of day in a life. For composing new articles click on the compose button present in navigation bar. The newly added article will be visible in home page";

const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vulputate feugiat turpis vel sodales. Nam efficitur, erat eget commodo vehicula, purus massa lobortis sem, at ullamcorper risus augue nec odio. Nulla pellentesque massa urna, et aliquet tortor tincidunt vel. Praesent purus felis, iaculis sed imperdiet porta, suscipit eu urna. In tristique viverra nisl ut convallis. Donec faucibus lorem mi, id consectetur nibh tempus et. Sed cursus turpis non auctor placerat. Vivamus ac aliquam lectus, eget elementum lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque dapibus leo est, sit amet aliquam mi auctor id. Pellentesque bibendum sapien pulvinar, eleifend quam in, condimentum sapien. Ut porta dolor ac lorem cursus pellentesque. In eget blandit ex, at sodales est. Suspendisse tincidunt neque sem, ut varius dolor pulvinar vel. Mauris lacinia, velit vitae placerat mattis, diam risus posuere risus, quis volutpat nisi velit sed velit. Ut fermentum, justo at fringilla gravida, felis neque laoreet magna, id lacinia sem nisi eget odio.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const journalSchema = new mongoose.Schema({
  title: String,
  content: String
});

const journalHome = mongoose.model("journalHome",journalSchema);

var posts=[];

app.get("/",function(req,res){

  journalHome.find({}, function(err, posts){

   res.render("home", {
     First: homeStartingContent,
     posts: posts
     });
 })
});

app.get("/about",function(req,res){
  res.render("about",{aboutPage: aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactPage: contactContent});
});

app.get("/compose",function(req,res){
    res.render("compose");
});

app.get("/posts/:postId",function(req,res){
  const requestedPostId = req.params.postId;

    journalHome.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
});

app.post("/compose",function(req,res){
  const contentItem = req.body.composed;
  const contentBody = req.body.postContent;

  const object = new journalHome({
    title: contentItem,
    content: contentBody
  });

  object.save(function(err){

  if (!err){
    res.redirect("/");
  }
});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port "+port);
});
