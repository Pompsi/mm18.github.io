"use strict";

/* Function for leftsidebar dropdown*/
function dropdown() {
  var dropdown = document.getElementsByClassName("dropbtn");
  var i;

  for (i = 0; i < dropdown.length; i++) {
  	dropdown[i].addEventListener("click", function() {
  		this.classList.toggle("active");
  		var dropdownContent = this.nextElementSibling;
  		if (dropdownContent.style.display === "block") {
  			dropdownContent.style.display = "none";
  		} else {
  			dropdownContent.style.display = "block";
  		}
  	});
  }
}

/* Function for searching by movies name */
function searchByMovie() {
	var form = document.getElementById("movies");
	form.addEventListener('submit', movieSearch);
}
function movieSearch(event) {
	event.preventDefault();
	var input = document.querySelector('#movieInput');
	var movieInput = input.value;
	getMovies(movieInput);
}

function getMovies(movieInput) {
	var titleId = [];
    for (let i = 0; i < parsedmovies.length; i++) {
		var title = parsedmovies[i].title.toString().toLowerCase();
		if (title.includes(movieInput.toLowerCase())) {
			titleId.push(parsedmovies[i].id)
		}
	}
	console.log(titleId);
    showMovies(titleId);
}


/* Function for searching by actors name */
function searchByActor() {
	var form = document.getElementById("actors");
	form.addEventListener('submit', actorSearch);
}
function actorSearch(event) {
	event.preventDefault();
	var input = document.querySelector('#actorInput');
	var actorInput = input.value;
	getActorsMovies(actorInput);
}

function getActorsMovies(actorInput) {
	var titleId = [];
    for (let i = 0; i < parsedmovies.length; i++) {
		for (let n = 0; n < parsedmovies[i].leadacts.length; n++) {
			var actor = parsedmovies[i].leadacts[n].actor.toString().toLowerCase();
			if (actor.includes(actorInput.toLowerCase())) {
				titleId.push(parsedmovies[i].id)
			}
		}
	}
	console.log(titleId);
    showMovies(titleId);
}

function clickSearch() {
  let search = document.getElementById("searchBtn");
  search.addEventListener('submit', movieLengthSearch);
}

function movieLengthSearch() {
  let min = document.getElementById("minLength");
  let max = document.getElementById("maxLength");
  let minInput = min.value;
  let maxInput = max.value;

  let titleId = [];
  for (let i = 0; i < parsedmovies.length; i++) {
    let runtime = parsedmovies[i].runtime;
      if(minInput <= runtime && runtime <= maxInput) {
        titleId.push(parsedmovies[i].id);
      }
  }
  console.log(titleId);
  showMovies(titleId);
}

function clickSearch() {
  let search = document.getElementById("searchButton");
  search.addEventListener('submit', movieYearSearch);

  $('#genre').on('click', 'a', function(event) {
    var titleId = [];
    var clicked = $(event.target).data('name');
    for (let i = 0; i < parsedmovies.length; i++) {
      var genre = parsedmovies[i].genres;
      if (genre.includes(clicked)) {
        titleId.push(parsedmovies[i].id)
      }
    }
    showMovies(titleId);
  });
}

function movieYearSearch() {
  let min = document.getElementById("minYear");
  let max = document.getElementById("maxYear");


  let minInput = min.value;
  let maxInput = max.value;

  if (minInput == "" ) {
    minInput = "0";
  }

  if (maxInput == "") {
    maxInput = "2020"
  }

  let titleId = [];
  for (let i = 0; i < parsedmovies.length; i++) {
    let release = parsedmovies[i].release;
    var year = release.split(".").reverse().join(".");
    var yearParse = parseInt(year);
      if(minInput <= yearParse && yearParse <= maxInput) {
        titleId.push(parsedmovies[i].id);
      }
  }
  console.log(titleId);
  showMovies(titleId);
}
