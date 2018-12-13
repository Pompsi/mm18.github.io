/*
This code is in the public domain.
This software is provided "as is", no warranty of any kind.
*/

function helpOK(){
    hideHelp();
}

function hideHelp(){
    var bg = document.getElementById("dlg-background");
    var dlg = document.getElementById("helpbox");
    bg.style.display = "none";
    dlg.style.display = "none";
}

function showHelp(){
    var bg = document.getElementById("dlg-background");
    var dlg = document.getElementById("helpbox");

    bg.style.display = "block";
    dlg.style.display = "block";
}

function dlgOK(){
    hideDialog();
}

function hideDialog(){
    var bg = document.getElementById("dlg-background");
    var dlg = document.getElementById("dlgbox");
    bg.style.display = "none";
    dlg.style.display = "none";
}

function showAbout(){
    var bg = document.getElementById("dlg-background");
    var dlg = document.getElementById("dlgbox");
	  var txt = document.getElementById("dlgtext");

    bg.style.display = "block";
    dlg.style.display = "block";
}

function genresOK(){
    hideGenres();
}

function hideGenres(){
    var bg = document.getElementById("dlg-background");
    var dlg = document.getElementById("genrebox");
    bg.style.display = "none";
    dlg.style.display = "none";
}

function showGenres(){
    var bg = document.getElementById("dlg-background");
    var dlg = document.getElementById("genrebox");

    bg.style.display = "block";
    dlg.style.display = "block";
}
