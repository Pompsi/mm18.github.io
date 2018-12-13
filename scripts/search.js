/*
This code is in the public domain.
This software is provided "as is", no warranty of any kind.
*/
"use strict";

/* Function for leftsidebar dropdown*/
function dropdown() {
  let dropdown = document.getElementsByClassName("dropbtn");
  let i;

  for (i = 0; i < dropdown.length; i++) {
  	dropdown[i].addEventListener('click', function(e) {
      e.preventDefault();
  		this.classList.toggle("active");
  		let dropdownContent = this.nextElementSibling;
  		if (dropdownContent.style.display === "block") {
  			dropdownContent.style.display = "none";
  		} else {
  			dropdownContent.style.display = "block";
  		}
  	});
  }
}

function searchBtn() {
  document.getElementById("searchButton").addEventListener("click", fullSearch)
}

/* Function for searching movies by different parameters*/
function fullSearch(e) {

  let titleId = [];
	let movieInput = document.querySelector('#movieInput').value.toLowerCase();
  let actorInput = document.querySelector('#actorInput').value.toLowerCase();
  let minInput = document.getElementById("minYear").value;
  let maxInput = document.getElementById("maxYear").value;
  let minLengthInput = document.getElementById("minLength").value;
  let maxLengthInput = document.getElementById("maxLength").value;

  for (var movie of parsedmovies) {
    if (movieInput != "") {
      if (!movie.title.toString().toLowerCase().includes(movieInput)) {
        continue;
      }
    }


    if (actorInput != "") {
      let found = false;
      for (let n = 0; n < movie.leadacts.length; n++) {
        if (movie.leadacts[n].actor.toString().toLowerCase().includes(actorInput)) {
            found = true;
        }
      }
      if (!found) {continue;}
    }

    if (activeGenre != "") {
      if (!movie.genres.includes(activeGenre)) {
        continue;
      }
    }

    if (minInput != "" || maxInput != "") {
      if (maxInput == "") {maxInput = 2020}
      if (minInput == "") {minInput = 0}
      let release = movie.release;
      let year = release.split(".").reverse().join(".");
      let yearParse = parseInt(year);
      if(parseInt(minInput) > yearParse || yearParse > parseInt(maxInput)) {
          continue;
      }
    }

    let runtime = movie.runtime;

    if (minLengthInput != "" && minLengthInput > runtime) {
      continue;
    }

    if (maxLengthInput != "" && maxLengthInput < runtime) {
      continue;
    }


    titleId.push(movie.id)
  }
  showMovies(titleId);
}

var activeGenre = ""

function genreSearch() {

  $(".genresearch").on('click', function(event) {
    if (activeGenre == $(event.target).data('name')) {
      activeGenre = ""
    } else {
      activeGenre = $(event.target).data('name');
    }

    var genreElements = document.getElementsByClassName("genresearch");

    for (var elem of genreElements) {
      if (elem.getAttribute("data-name") == activeGenre) {
        elem.style.color = "white";
      } else {
        elem.style.color = null;
      }
    }
  });
}
