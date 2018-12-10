/*
  genreSort()
  param movies: list of movies.
  returns: object where movies are organized according to genres
*/

function genreSort(movies, gs) {
  var genres =
  ["science-fiction",
   "fantasy",
   "action-adventure",
   "crime-thriller",
   "family-animation",
   "family-movie","western",
   "action-comedy",
   "romantic-drama",
   "action-thriller",
   "action",
   "animation",
   "romance",
   "history",
   "mystery-thriller",
   "adventure",
   "horror",
   "comedy",
   "drama-comedy",
   "drama",
   "mystery",
   "romantic-comedy",
   "crime-drama",
   "musical",
   "thriller",
   "documentary"]

  var genresort = {};

  for (var g of genres) {
    genresort[g] = []
  }

  for (var movie of movies) {
    var g = movie.genre;

    genresort[g].push(movie);
  }

  for(var g in genresort) {
    genresort[g].sort(function(a,b) {
      return a.size - b.size;
    });
  }

  if (gs) {
    return genresort;
  }

  var ret = []
  for(var g in genresort) {
    genresort[g].sort(function(a,b) {
      return a.size - b.size;
    });
    for (var m of genresort[g]) {
      ret.push(m);
    }
  }

  return ret;
};
