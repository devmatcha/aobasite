console.log('hello world :o');

let comments = [];

// define variables that reference elements on the page
const list = document.getElementById('comments');
const form = document.forms[0];
const name = form.elements['name'];
const rating = form.elements['rating'];
const comment = form.elements['comment'];  

let ratings = [];
const getListener = function() {
  // parse response to convert to JSON
  comments = JSON.parse(this.responseText);

  // iterate through every dream and add it to the page
  comments.forEach( function(row) {
    console.log(row.name, row.rating, row.comment);
    appendNewComment(row.name, row.rating, row.comment);
    ratings.push(row.rating);
  });
  console.log(ratings);
  addRating(ratings);
}

// request the dreams from our app's sqlite database
const request = new XMLHttpRequest();
request.onload = getListener;
request.open('get', '/getComments');
request.send();

const addRating = function(rating) {
  var sum = 0;
  for (var i = 0; i < rating.length; i++) {
    sum += rating[i];
  }
  var final = sum / rating.length
  document.getElementById('rated').innerHTML = "Aoba currently has a rating of " + final.toFixed(1) + " out of 5!";
}

// a helper function that creates a list item for a given dream
const appendNewComment = function(name, rating, comment) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = "<h2>" + name + "</h2><b>Rating:</b>  " + rating + "<br><br><b>Comment:</b> " + comment;
  list.appendChild(newListItem);
}

// listen for the form to be submitted and add a new dream when it is
form.onsubmit = function(event) {
  event.preventDefault();

  // get dream value and add it to the list
  console.log(name.value, rating.value, comment.value);
  comments.push(name.value + "," + rating.value + "," + comment.value);
  appendNewComment(name.value, rating.value, comment.value);
  
  fetch('/', {
    method: 'POST',
    body: new FormData(form)
  })
  
  // reset form 
  name.value = '';
  rating.value = '';
  comment.value = '';
  name.focus();
};
