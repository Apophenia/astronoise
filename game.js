// A template for an action game

;(function() {
  var Game = function() {
    var screen = document.getElementById("screen").getContext('2d');

    screen.circle = function(x, y, r) {
      screen.beginPath();
      screen.arc(x,y,r,0,2*Math.PI);
      screen.stroke();
    }

    this.size = { x: screen.canvas.width, y: screen.canvas.height };
    this.center = { x: this.size.x / 2, y: this.size.y / 2 };

    this.bodies = []; // TODO: create initial bodies

    this.bodies.push(new Player(this));

    var self = this;
    var tick = function() {
      self.update();
      self.draw(screen);
      requestAnimationFrame(tick);
    };

    tick();
  };

  Game.prototype = {
    update: function() {
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].update !== undefined) {
          this.bodies[i].update();
        }
      }

      reportCollisions(this.bodies);
    },

    draw: function(screen) {
      screen.clearRect(0, 0, this.size.x, this.size.y);
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].draw !== undefined) {
          this.bodies[i].draw(screen);
        }
      }
    },

    addBody: function(body) {
      this.bodies.push(body);
    },

    removeBody: function(body) {
      var bodyIndex = this.bodies.indexOf(body);
      if (bodyIndex !== -1) {
        this.bodies.splice(bodyIndex, 1);
      }
    }
  };

  var Player = function(game) {
    this.game = game;
    this.angle = 0;
    this.scale = {x: 0, y: 0};
    this.velocity = {x: 0, y: 0};
    this.speed = 0;
    this.acceleration = .025;
    this.radius = 20; // TODO: set to player size
    this.center = { x: game.center.x, y: game.center.y }; // TODO: set to initial player center
    this.keyboarder = new Keyboarder();
  };

  Player.prototype = {
    update: function() {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.angle -= .1;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.angle += .1;
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) ||
          this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
          this.scale.x = Math.cos(this.angle);
          this.scale.y = Math.sin(this.angle);
          this.speed += this.acceleration;
        }

        this.velocity.x = this.speed * this.scale.x;
        this.velocity.y = this.speed * this.scale.y;
        this.center.x += this.speed * this.scale.x;
        this.center.y += this.speed * this.scale.y;
      },

    draw: function(screen) {
      // circle
      screen.circle(this.center.x, this.center.y, this.radius);

      // triangle
      screen.save();
      screen.translate(this.center.x, this.center.y);
      screen.rotate(this.angle);
      screen.beginPath();
      screen.arc(0, 0, this.radius, 0, 2.5, false);
      screen.closePath();
      screen.stroke();
      screen.beginPath();
      screen.arc(0, 0, this.radius, 0, -2.5, true);
      screen.stroke();
      screen.closePath();
      screen.restore();
      screen.stroke();
    },

    collision: function(otherBody) {
      // implement me
    }
  };

  var Keyboarder = function() {
    var keyState = {};

    window.addEventListener('keydown', function(e) {
      keyState[e.keyCode] = true;
    });

    window.addEventListener('keyup', function(e) {
      keyState[e.keyCode] = false;
    });

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, SPACE: 32 };
  };

  var isColliding = function(b1, b2) {
    // only works with circles, for now
    var distance = Math.sqrt((Math.pow(b1.center.x-b2.center.x), 2) - (Math.pow(y1-y2), 2));
    console.log(distance);
  };

  var reportCollisions = function(bodies) {
    var bodyPairs = [];
    for (var i = 0; i < bodies.length; i++) {
      for (var j = i + 1; j < bodies.length; j++) {
        if (isColliding(bodies[i], bodies[j])) {
          bodyPairs.push([bodies[i], bodies[j]]);
        }
      }
    }

    for (var i = 0; i < bodyPairs.length; i++) {
      if (bodyPairs[i][0].collision !== undefined) {
        bodyPairs[i][0].collision(bodyPairs[i][1]);
      }

      if (bodyPairs[i][1].collision !== undefined) {
        bodyPairs[i][1].collision(bodyPairs[i][0]);
      }
    }
  };

  window.addEventListener('load', function() {
    new Game();
  });
})();
