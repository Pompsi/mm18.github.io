"use strict";
var info;
var x = null;
var y = null;

/*window.onload = function() {
  var id = 1262;
  loadInfo(id);


}*/

$(document).on("click", "#iclose", closeOrOpen);
$(document).on("click", "#iopen", closeOrOpen);


function closeOrOpen(e) {
  e.preventDefault();
  var a = (document.getElementById("iright")).getAttribute("class");
  if (a == "ishow") {
    (document.getElementById("iclose")).setAttribute("id", "iopen");
    (document.getElementById("iopen")).textContent = "";
    (document.getElementById("iright")).setAttribute("class", "ihide");
  }
  else {
    (document.getElementById("iopen")).textContent = "»";
    (document.getElementById("iopen")).setAttribute("id", "iclose");
    (document.getElementById("iright")).setAttribute("class", "ishow");
  }
}

function openInfo() {
  (document.getElementById("iopen")).textContent = "»";
  (document.getElementById("iopen")).setAttribute("id", "iclose");
  (document.getElementById("iright")).setAttribute("class", "ishow");
}


function getCoord(e) {
  x = e.changedTouches[0].clientX;
  y = e.changedTouches[0].clientY;
}

function swipe(e) {
  if(x || x == 0) {
    var dx = e.changedTouches[0].clientX - x;
    var dy = e.changedTouches[0].clientY - y;
    if((dx > 75 || dx < -75) && (dy < 30 && dy > -30)) {
      closeOrOpen(e);
    }
    x = null;
  }
}


function loadInfo(id) {
  var right = document.getElementById("iright");
  right.addEventListener("touchstart", getCoord, false);
  right.addEventListener("touchend", swipe, false);

  if (document.getElementById("iopen") != null) {
    openInfo();
  }

  for (let i in parsedmovies) {
    if (id == parsedmovies[i]["id"]) {
      info = parsedmovies[i];
    }
  }

  var right = document.getElementById("iright");
  right.scrollTop = 0;

  var h1 = document.getElementById("iotsikko");
  h1.textContent = info["title"]

  setText("ilanguage");
  setText("irelease");
  setText("itagline");
  setText("ioverview");

  var runtime = document.getElementById("iruntime");
  var h = parseInt(info["runtime"]/60);
  var min = info["runtime"] - h * 60;
  if (min < 10) {
    min = "0" + min
  }
  runtime.textContent = h + ":" + min;

  setContent("iproducers");
  setContent("iwriters");
  setContent("idirectors");

  var ngenres = document.createElement("div");
  ngenres.setAttribute("id","igenres");
  var genres = document.getElementById("igenres");
  for (var i = 0; i < info["genres"].length; i++) {
    var span = document.createElement("span");
    if (i % 3 == 0) {
      span.setAttribute("class", "ig1");
    }
    else if (i % 2 == 0) {
      span.setAttribute("class", "ig2");
    }
    else {
      span.setAttribute("class", "ig3");
    }
    span.textContent = " " + info["genres"][i];
    ngenres.appendChild(span);
  }

  right.replaceChild(ngenres, genres);

  var nkeywords = document.createElement("div")
  nkeywords.setAttribute("id","ikeywords");

  var keywords = document.getElementById("ikeywords");
  for (var i = 0; i < info["keywords"].length; i++) {
    var span = document.createElement("span");
    if (i % 5 == 0) {
      span.setAttribute("class", "ik4");
    }
    else if (i % 3 == 0) {
      span.setAttribute("class", "ik1");
    }
    else if (i % 2 == 0) {
      span.setAttribute("class", "ik2");
    }
    else {
      span.setAttribute("class", "ik3");
    }
    span.textContent = " " + info["keywords"][i] + " ";
    nkeywords.appendChild(span);
  }
  right.replaceChild(nkeywords, keywords);

  var nleadacts = document.createElement("table");
  nleadacts.setAttribute("id","ileadacts");

  var tr1 = document.createElement("tr");
  var th1 = document.createElement("th");
  var th2 = document.createElement("th");
  th1.textContent = "Actor";
  th2.textContent = "Character";
  tr1.appendChild(th1);
  tr1.appendChild(th2);
  nleadacts.appendChild(tr1);

  var leadacts = document.getElementById("ileadacts");
  for (let i in info["leadacts"]) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var td2 = document.createElement("td");
    td.textContent = info["leadacts"][i]["actor"];
    td2.textContent = info["leadacts"][i]["character"];
    tr.appendChild(td);
    tr.appendChild(td2);
    nleadacts.appendChild(tr);
  }
  right.replaceChild(nleadacts, leadacts);

  var page = document.getElementById("ipage");
  var homepage = document.getElementById("ihomepage");
  if (info["homepage"] == "") {
    page.setAttribute("class","ihide2");
  }
  else {
    page.setAttribute("class","ishow2");
    homepage.setAttribute("href", info["homepage"])
  }
}


function setText(text) {
  var element = document.getElementById(text);
  var t = text.slice(1);
  element.textContent = info[t];
}


function setContent(text) {
  var element = document.getElementById(text);

  var t = text.slice(1);

  var p = info[t][0];
  for (var i = 1; i < info[t].length; i++) {
    p = p + ", " + info[t][i];
  }
  element.textContent = p;
}
