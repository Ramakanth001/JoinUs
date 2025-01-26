var express =  require('express');
var app = express();

app.get("/", function(request, response) {
  response.send("Hi! You came to the root page.");
});

app.get("/joke", function(request, response) {
  response.send("It's indeed a joke");
});

app.get("/joke/serious", function(request, response) {
  response.send("It's not a joke. Be serious");
});

app.get("/random_num", function(request, response) {
  var rand_num = Math.floor(Math.random() * 10)+1;
  response.send("The Random number from 1-10 is : "  + rand_num)
});

app.listen(8080, function() {
  console.log("Listening on 8080 port!");
})

// app.listen(8080, function(){
//     console.log("Server running on 8080!");
// });