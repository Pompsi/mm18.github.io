/*
This code is in the public domain.
This software is provided "as is", no warranty of any kind.
*/

/* ---------- GLOBAL VARIABLES ---------- */

var objects = [];       // i.e. markers on canvas

var width = 4000;       // width of canvas  -default map width in data
var height = 4000;      // height of canvas -default map height in data
var canvas = undefined; // canvas
var ctx = undefined;    // 2D rendering context for canvas
var trf = {e:0, f:0}    // tracks ctx;s transform

var scale = undefined;  // for scaling objects
var zoomlevel = 1;      // zoomlevel
var hover = undefined;  // marker below mouse
var minzoom = 1;        // minimum zoomlevel

/* ---------- INITIALIZATION ---------- */
window.onload = function() {
  init();
  dropdown();
  //searchByMovie();
  //searchByActor();
  genreSearch()
  searchBtn();
}

// Initializes canvas, objects and variables
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.webkitImageSmoothingEnabled=true;
  trf = {e:0, f:0}

  resize();

  objects = createObjects();

  addHandlers();

  if (width > height) {
    ctx.translate((width-height)/2,0)
    trf.e = (width-height)/2;
  } else {
    ctx.translate(0,(height-width)/2)
    trf.f = (height-width)/2;
  }

  minzoom = zoomlevel-1;
  updateMap();


}

/* ---------- MAP ---------- */

// Clears canvas and draws objects
function updateMap() {
  clearMap();

  for (var movie of objects) {
    movie.draw();
  }
}

// Clears canvas
function clearMap() {
  ctx.save();
  ctx.resetTransform()
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// Reloads canvas to its default state
function resetMap() {
  objects = [];
  dragX = undefined;
  dragY = undefined;
  dragSX = undefined;
  dragSY = undefined;
  pointerD = undefined;
  hover = undefined;
  width = 4000;
  height = 4000;

  if (document.getElementById("iright").getAttribute("class") == "ishow") {
    closeOrOpen();
  }

  clearMap();
  ctx.resetTransform()
  trf.e = 0;
  trf.f = 0;
  zoomlevel = 1;
  resize();

  objects = createObjects();

  addHandlers();
  centerMap();
  minzoom = zoomlevel - 1;
  updateMovies();
  updateMap();

}

// centers objects in canvas
function centerMap() {
  ctx.resetTransform()
  trf.e = 0;
  trf.f = 0;
  if (width > height) {
    ctx.translate((width-height)/2,0)
    trf.e = (width-height)/2;
  } else {
    ctx.translate(0,(height-width)/2)
    trf.f = 0;
  }
}

// centers clicked object
function focusOn(movie) {
  loadInfo(movie.id)

  ctx.resetTransform()
  trf.e = 0;
  trf.f = 0;
  zoomlevel = 1;
  movie.update();

  if (width < height) {
    zoomlevel = (width*0.5)/(movie.r*2);
  } else {
    zoomlevel = (height*0.5)/(movie.r*2);
  }

  updateMovies();

  trf.e = -(movie.x)+width/2;
  trf.f = -(movie.y)+height/2;
  ctx.translate(trf.e,trf.f)

  updateMap();
}

// Updates movies coordinates
function updateMovies() {
  for (var movie of objects) {
    movie.update();
  }
}

// resizes canvas to width and height of its container
function resize() {
  var map = document.getElementById("map").getBoundingClientRect()
  canvas.width = map.width;
  canvas.height = map.height;

  if (canvas.width > canvas.height) {
    scale = (height/canvas.height);
  } else {
    scale = (width/canvas.width);
  }

  zoomlevel = zoomlevel*scale;

  ctx.translate(trf.e,trf.f)

  width = canvas.width;
  height = canvas.height;
  canvas.style.width = width;
  canvas.style.height = height;
  updateMovies();
  updateMap();
}

// changing zoomlevel
function zoom(e) {

  if (e.deltaY != undefined) {
    if (e.deltaY >= 0) {
      e = {
        x: e.x,
        y: e.y,
        delta: -(1+Math.abs(e.deltaY/100))
      }
    } else {
      e = {
        x: e.x,
        y: e.y,
        delta: (1+Math.abs(e.deltaY/100))
      }
    }
  }

  var pos = getMapCoordinates(e.x,e.y);

  if (e.delta > 0) {
    zoomlevel = zoomlevel*e.delta;
    var x = -(pos.x*e.delta-e.x)
    var y = -(pos.y*e.delta-e.y)
  } else {
    e.delta = Math.abs(e.delta)
    if (zoomlevel/e.delta < minzoom) {
      return;
    } else {
      zoomlevel = zoomlevel/e.delta;
      var x = -(pos.x/e.delta-e.x)
      var y = -(pos.y/e.delta-e.y)
    }
  }

  ctx.resetTransform()
  trf.e = x;
  trf.f = y;
  ctx.translate(x,y);

  updateMovies();
  updateMap();
}

// Calculates distance between two points
function delta(A,B) {
  return Math.sqrt((A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y));
}

// Returns position in "map" for the position in canvas element
function getMapCoordinates(x,y) {

  var mapx = (x-trf.e)-canvas.offsetLeft;
  var mapy = (y-trf.f)-canvas.offsetTop;

  return {x:mapx,y:mapy}
}

/* ---------- HANDLERS ---------- */

var pointers = []         // Tracks active pointers here i.e. mouse and touch
var pointerD = undefined; // Distance between two active pointers
var dragX = undefined;    // Pointers X.coordinate
var dragY = undefined;    // Pointers Y.coordinate
var moved = false;        // if pointer has been dragged or just clicked

// Returns distance between two active pointers
function pointerDelta() {
  try {
    var pointer1 = pointers[0];
    var pointer2 = pointers[1];
  } catch(e) {
    return undefined;
  }

  return Math.sqrt(
    ((pointer1.x-pointer2.x)*(pointer1.x-pointer2.x))+
    ((pointer1.y-pointer2.y)*(pointer1.y-pointer2.y))
  );
}

// Adds default handlers to page
function addHandlers() {

  canvas.addEventListener('pointerdown', startDrag)
  canvas.addEventListener('pointermove', updateCursor)
  canvas.addEventListener('wheel', zoom)

  window.addEventListener('resize', resize);
  document.getElementById('button').addEventListener('click',resetMap)
}

// Fires when pointer (i.e. mouse or touch)  is down
function startDrag(e) {
  e.preventDefault();

  if (pointers.length == 0) {
    moved = false;
    canvas.removeEventListener("pointermove", updateCursor);
    canvas.addEventListener("pointermove", updatePointers)
    document.addEventListener("pointerup", endDrag)
    dragX = e.x;
    dragY = e.y;
  }

  if (pointers.length >= 2) {
    return;
  }

  for (var i in pointers) {
    if (pointers[i].pointerId == e.pointerId) {
      return;
    }
  }

  pointers.push(e);
}

// Fires when pointer moves on screen
function updatePointers(e) {

  let update = false;
  for (var i in pointers) {
    if (pointers[i].pointerId == e.pointerId) {
      pointers[i] = e;
      update = true;
    }
  }

  if (!update) {return;}

  if (pointers.length == 2) {
    if (pointerD != undefined) {
      pinchZoom()
    } else {
      pointerD = pointerDelta();
    }

    if (dragX != undefined || dragY != undefined) {
      dragX = undefined;
      dragY = undefined;
    }
  }

  if (pointers.length == 1) {
    if (dragX == undefined || dragY == undefined) {
      dragX = e.x;
      dragY = e.y;
    } else {
      updatePos(pointers[0]);
    }

    pointerD = undefined;
  }
}

// Fires when user releases pointer
function endDrag(e) {
  for(var i in pointers) {
    if (pointers[i].pointerId == e.pointerId) {
      pointers.splice(i,1);
    }
  }

  if (pointers.length == 0) {
    canvas.removeEventListener("pointermove", updatePointers)
    document.removeEventListener("pointerup", endDrag)
    canvas.addEventListener("pointermove", updateCursor)

    if (!moved) {
      getClickedElement({x:dragX,y:dragY})
    }

    pointers = []
    pointerD = undefined;
    dragX = undefined;
    dragY = undefined;
  }

  setTimeout(function() {
      canvas.addEventListener("pointerdown", startDrag);
  },300)
}

// Updates "Maps" position
function updatePos(e) {
  let x = e.x;
  let y = e.y;

  let dx = x-dragX;
  let dy = y-dragY;

  if (dx != 0 || dy != 0) {
    moved = true;

    trf.e += dx;
    trf.f += dy;
    ctx.translate(dx,dy);

    dragX = x;
    dragY = y;

    updateMap();
  }
}

// Handles zoom on touchscreen
function pinchZoom() {
  try {
    var pointer1 = pointers[0];
    var pointer2 = pointers[1];
  } catch(e) {
    return;
  }

  if (pointerD == undefined) {
    pointerD = pointerDelta();
    return;
  }

  moved = true;

  newD = pointerDelta();

  if (newD == pointerD) {
    return;
  }

  var d = (newD-pointerD);
  if (d > 10) {
    d = 10;
  }

  var setup = {
    x: (pointer1.x+pointer2.x)/2,
    y: (pointer1.y+pointer2.y)/2,
    delta: 1+(d/100)
  };

  zoom(setup);

  pointerD = newD;
}

// Handles when user clicks active marker
function getClickedElement(e) {

  if (hover != undefined) {
    focusOn(hover);
    hover = undefined;
    return;
  }

  updateCursor(e);
  if (hover != undefined) {
    getClickedElement(e);
  }
}

// Sets movie active if its id is in params
function showMovies(param) {

  resetMap();


  if (param.length == 1) {
    var mov = undefined;
    for (var movie of objects ) {
      if (movie.id == param[0]) {
        movie.active = true;
        mov = movie;
      }
    }
    focusOn(mov);
  }


  for (var movie of objects) {
    movie.active = param.includes(movie.id)
  }


  updateMap();
}

// Fires when non-pressed pointer moves on canvas
function updateCursor(e) {
  var pos = getMapCoordinates(e.x,e.y)

  if (hover != undefined && delta(hover,pos) <= hover.r) {
    return;
  }

  for (var movie of objects) {
    if (delta(movie,pos) <= movie.r && movie.active) {
      document.body.style.cursor = "pointer";
      hover = movie;
      return;
      }
    }

  hover = undefined;
  document.body.style.cursor = "grab";
}
