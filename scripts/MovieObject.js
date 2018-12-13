/*
This code is in the public domain.
This software is provided "as is", no warranty of any kind.
*/

// Creates markers from data
function createObjects() {
  var objects = [];

  for (var movie of movies) {
    movie.r = movie.size * 50;

    objects.push(new MovieObject(movie.title, movie.id, movie.x, movie.y, movie.r, movie.col))

  }
  return objects;
}

class MovieObject {
  constructor(title, id, x, y, r, color) {
    this.title = title;
    this.id    = id;
    this.x     = x/scale;
    this.y     = y/scale;
    this.r     = r/scale;
    this.color = color;

    this.oldscale = scale;
    this.oldzoom = zoomlevel;

    this.active = true;
    this.fontsize = this.fontSize();
  }

  update() {
    if (this.oldscale != scale) {
      this.x = this.x/scale;
      this.y = this.y/scale;
      this.r = this.r/scale;
      this.oldscale = scale;
    }

    if (this.oldzoom != zoomlevel) {
      this.x = (this.x*zoomlevel)/this.oldzoom;
      this.y = (this.y*zoomlevel)/this.oldzoom;
      this.r = (this.r*zoomlevel)/this.oldzoom;
      this.oldzoom = zoomlevel;
      this.fontsize = this.fontSize();
    }
  }

  fontSize() {
    ctx.font = '30pt Arial';
    return 30*((this.r*2*0.9)/ctx.measureText(this.title).width)
  }

  outOfBounds() {
    if (this.x+this.r < -trf.e) {
      return true;
    }

    if (this.y+this.r < -trf.f) {
      return true;
    }

    if (this.x-this.r > canvas.width-trf.e) {
      return true;
    }

    if (this.y-this.r > canvas.height - trf.f) {
      return true;
    }

    return false;
  }

  draw() {
    if (this.outOfBounds()) {return;}

    ctx.save();

    ctx.fillStyle = this.color;

    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI*2, true);
    if (this.active) {
      ctx.globalAlpha = 0.6;
    } else {
      ctx.globalAlpha = 0.2;
    }

    ctx.fill();

    ctx.restore();
    if ((this.fontsize > 7 || this.r*2 > 0.4*width || this.r*2 > 0.4*height) && this.active) {
      this.drawTitle();
    }
  }

  drawTitle () {
    ctx.save();

    ctx.font = this.fontsize + 'pt Arial';

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(this.title, this.x, this.y);

    ctx.restore();
  }
}
