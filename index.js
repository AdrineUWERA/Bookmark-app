// listen for the form submission event
var form = document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();

  //gets each user input
  title = document.getElementById("title").value;
  link = document.getElementById("link").value;
  description = document.getElementById("description").value;
  category = document.getElementById("category").value;

  var expression = "/[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
  var regex = new RegExp(expression);

  // checks if all fields are filled. If not, it i will fire an alert to tell the user to fill all fields
  if (!title || !link || !description || !category) {
    alert("Please fill all fields!");
  } 
  // checks if the url has a correct format i.e valid
  else if(!link.match(regex)){
    alert("Please provide a valid link!");
  } else {
    // otherwise, user input for each field will be stored in an object
    //generated a unique id using date.now() because it will always be unique
    var uniqueId = Date.now().toString();
    var newBookmark = {
      id: uniqueId,
      title: title,
      url: link,
      description: description,
      category: category,
    };

    // checks if there are some bookmarks stored previously in the local storage and retrieve them if any
    //If there no previously added bookmarks, the newly added bookmark will be added to the local storage
    if (localStorage.getItem("bookmarks") == null) {
      var bookmarks = [];
      bookmarks.push(newBookmark);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      title = "";
      clearForm();
    } else {
      // if there are some previously stored bookmarks, then they wil be retrieved, and the newly added
      // bookmark will be pushed to the bookmarks in the local storage
      var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

      bookmarks.push(newBookmark);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      clearForm();
    }
  }

  // Finally all bookmarks will be loaded using retrieveBookmarks() and displayed
  retrieveBookmarks();
});

// a function to clear the form
function clearForm(){
  //resets the form fields
  document.getElementById("title").value = "";
  document.getElementById("link").value = "";
  document.getElementById("description").value = ""; 
}

// function to delete a bookmark
function deleteBookmark(id) {
  // retrieves all the bookmarked
  var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  // iterates to get bookmark with matching id and remove it from the local storage
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].id == id) {
      bookmarks.splice(i, 1);
    }
  }
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  // reloads the bookmarks from localstorage, the deletebookmark will not be displayed since it was deleted
  retrieveBookmarks();
}

// function to get and display a single bookmark
function getBookmark(id) {
  var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  //iterates to check get the bookmark with matching id
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].id == id) {
      bookmarksList.innerHTML =
        "<div >" +
        '<h1 class="bookmark-title">Single bookmark</h1>' +
        '<div class="card-container2">' +
        '<div class="card-header">' +
        "<h5>" +
        bookmarks[i].title +
        "</h5>" +
        "<span><small>" +
        bookmarks[i].category +
        "</small></span>" +
        "</div>" +
        '<div class="card-body">' +
        "<p >" +
        bookmarks[i].description +
        "</p>" +
        "</div>" +
        '<div class="card-body">' +
        '<div onclick="retrieveBookmarks()"><a href="#">< Back</a></div>' +
        '<a href="' +
        url +
        '" target="__blank">Visit</a>' +
        '<div class="separator"></div>' +
        "<small + onclick=\"deleteBookmark('" +
        id +
        '\')"><i class="fa fa-trash"></i></small>' +
        "</div>" +
        "</div>" +
        "</div>";
    }
  }
}
// a function to load and display all the bookmarks in the local storage
function retrieveBookmarks() {
  //retrives all the bookmarks from local storage
  var bookmarks = JSON.parse(localStorage.getItem("bookmarks")); 

   //creates arrays for the available categories
  var favoriteBookmark = [];
  var otherBookmark = [];
 
  var bookmarksGrouped = [];
  // filters the bookmarks to group them
  bookmarks.filter((bookmark) => {
    if (bookmark.category == "Favorite bar") {
      favoriteBookmark.push(bookmark);
    } else if (bookmark.category == "Other bookmarks") {
      otherBookmark.push(bookmark);
    }
  });
  bookmarksGrouped.push(favoriteBookmark);
  bookmarksGrouped.push(otherBookmark); 
  var bookmarksList = document.getElementById("bookmarksList");
  bookmarksList.innerHTML = "";

  // iterates to display all the bookmarks in the local storage
  bookmarksGrouped.forEach((bookmarkCategory) => {
    // checks if there are bookmarks
    if (bookmarkCategory.length != 0) {
      //sets titles depending on the category
      if (bookmarksGrouped.indexOf(bookmarkCategory) == 0) {
        bookmarksList.innerHTML +=
          '<h1 style="width: 100%; padding-bottom: 1%; font-size: 25px;" class="bookmark-title">Favorite Bar</h1>';
      } else if (bookmarksGrouped.indexOf(bookmarkCategory) == 1) {
        bookmarksList.innerHTML +=
          '<h1 style="width: 100%; padding-bottom: 1%; font-size: 25px;" class="bookmark-title">Other bookmark</h1>';
      }

      // iterates to display the bookmarks in the current category
      for (var i = 0; i < bookmarkCategory.length; i++) {
        id = bookmarkCategory[i].id;
        title = bookmarkCategory[i].title;
        url = bookmarkCategory[i].url;
        description = bookmarkCategory[i].description;
        category = bookmarkCategory[i].category;
        bookmarksList.innerHTML +=
          '<div class="card-container">' +
          '<div class="card-header">' +
          "<h5 >" +
          title +
          "</h5>" +
          "<span><small>" +
          category +
          "</small></span>" +
          "</div>" +
          '<div class="card-body">' +
          "<div  onclick=\"getBookmark('" +
          id +
          '\')"><a href="#" >Details</a></div>' +
          '<a href="' +
          url +
          '" target="__blank">Visit site</a>' +
          '<div class="separator"></div>' +
          "<small + onclick=\"deleteBookmark('" +
          id +
          '\')"><i class="fa fa-trash"></i></small>' +
          "</div>" +
          "</div>";
      }
    }
  });
}