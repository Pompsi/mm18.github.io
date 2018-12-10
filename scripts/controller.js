
/* ---------- GLOBAL VARIABLES ---------- */
// #region variables
var objects = [];       // markers
/* for scaling markers */
var width = 4000;       // width of canvas
var height = 4000;      // height of canvas
/* ------------------- */
var canvas = undefined; // canvas elements
var ctx = undefined;    // ctx of canvas
var scale = undefined;  // scale
var zoomdelta = 1.3;    // Zoomdelta
var zoomlevel = 1;      // current zoom level
var hover = undefined;  // hovered marker
var minzoom = 1;

var pointers = []
var pointerD = undefined;
var dragX = undefined;
var dragY = undefined;
var dragSX = undefined;
var dragSY = undefined;
var moved = false;

// #endregion


/* ---------- INITIALIZATION ---------- */
// #region INIT
function init() {

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.webkitImageSmoothingEnabled=true;

  resize();

  objects = createObjects();

  addHandlers();

  if (width > height) {
    ctx.translate((width-height)/2,0)
  } else {
    ctx.translate(0,(height-width)/2)
  }

  minzoom = zoomlevel;
  updateMap();

}
// #endregion


/* ---------- MAP FUNCTIONS ---------- */
// #region MAP

function updateMap() {
  clearMap();

  for (var movie of objects) {
    movie.draw();
  }
}

function clearMap() {
  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.restore();
}

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

  // clears canvas
  clearMap();

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // resizing if necessary
  resize();


  // creating markers
  objects = createObjects();

  addHandlers();

  centerMap();

  minzoom = zoomlevel;

  // update and add markers
  updateMovies();
  updateMap();

}

function centerMap() {
  // centering content in canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (width > height) {
    ctx.translate((width-height)/2,0)
  } else {
    ctx.translate(0,(height-width)/2)
  }
}

function focusOn(movie) {
  loadInfo(movie.id)

  /* centering marker */
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  zoomlevel = 1;
  movie.update();

  if (width < height) {
    zoomlevel = (width*0.5)/(movie.r*2);
  } else {
    zoomlevel = (height*0.5)/(movie.r*2);
  }

  updateMovies();

  ctx.translate(-(movie.x)+width/2,-(movie.y)+height/2)

  // updating canvas
  updateMap();
}

function updateMovies() {
  for (var movie of objects) {
    movie.update();
  }
}

function resize() {
  /* when window resizes */
  var trf = ctx.getTransform();
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

function zoom(e) {
  if (e.wheelDelta != undefined) {
    zoomdelta = e.wheelDelta/100;
  } else {
    zoomdelta = e.delta
  }

  var pos = getMapCoordinates(e.x,e.y);

  if (zoomdelta > 0) {
    zoomlevel = zoomlevel*zoomdelta;
    var x = -(pos.x*zoomdelta-e.x)
    var y = -(pos.y*zoomdelta-e.y)
  } else {
    zoomdelta = Math.abs(zoomdelta)
    zoomlevel = zoomlevel/zoomdelta;
    var x = -(pos.x/zoomdelta-e.x)
    var y = -(pos.y/zoomdelta-e.y)
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(x,y);

  updateMovies();
  updateMap();
}

function delta(A,B) {
  return Math.sqrt((A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y));
}

function getMapCoordinates(x,y) {

  var trf = ctx.getTransform();

  var mapx = (x-trf.e)-canvas.offsetLeft;
  var mapy = (y-trf.f)-canvas.offsetTop;

  return {x:mapx,y:mapy}
}

// #endregion


/* ---------- HANDLERS ---------- */
// #region HANDLERS

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

window.onload = function() {
  init();
  dropdown();
  searchByMovie();
  searchByActor();
  clickSearch()
  console.log("ver2")
}

function addHandlers() {

  canvas.addEventListener('pointerdown', startDrag)
  canvas.addEventListener('pointermove', updateCursor)
  canvas.addEventListener('mousewheel', zoom)

  window.addEventListener('resize', resize);
  document.getElementById('button').addEventListener('click',resetMap)
}

function startDrag(e) {

  if (pointers.length == 0) {
    moved = false;
    canvas.removeEventListener("pointermove", updateCursor);
    canvas.addEventListener("pointermove", updatePointers)
    document.addEventListener("pointerup", endDrag)
    //dragX = e.x;
    //dragY = e.y;
    dragSX = e.x;
    dragSY = e.y;
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

    if (dragX != undefined || dragY != undefined || dragSY != undefined || dragSX != undefined) {
      dragX = undefined;
      dragY = undefined;
      dragSX = undefined;
      dragSY = undefined;
    }
  }

  if (pointers.length == 1) {
    if (dragX == undefined || dragY == undefined || dragSY == undefined || dragSX == undefined) {
      dragX = e.x;
      dragY = e.y;
      dragSX = e.x;
      dragSY = e.y;
    } else {
      updatePos(pointers[0]);
    }

    pointerD = undefined;
  }

  //console.log(pointers.length)
}

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
      getClickedElement({x:dragSX,y:dragSY})
      //console.log(dragSX)
    }

    pointers = []
    pointerD = undefined;
    dragX = undefined;
    dragY = undefined;
    dragSX = undefined;
    dragSY = undefined;
  }

  setTimeout(function() {
      canvas.addEventListener("pointerdown", startDrag);
  },300)
}

function updatePos(e) {
  moved = true;

  let x = e.x;
  let y = e.y;


  ctx.translate(x-dragX,y-dragY);

  dragX = x;
  dragY = y;

  updateMap();
}

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

function showMovies(ids) {

  if (ids.length == 0) {
    return;
  }

  resetMap();

  if (ids.length == 1) {
    var mov = undefined;
    for (var movie of objects ) {
      if (movie.id == ids[0]) {
        focusOn(movie);
        return;
      }
    }
  }

  for (var movie of objects) {
    movie.active = ids.includes(movie.id)
  }
  updateMap();
}

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

// #endregion
