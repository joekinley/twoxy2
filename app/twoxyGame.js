/*
TODO:
- add three enemies
- make start thingy like twoxy1 and let enemy appear after 15 seconds
- new background and icon graphics
- sprites (blinking) for arrow icon
*/

var twoxyGame = {
  i: 0, // global itterator variable for loops
  gameHeight: 0, // height of the current devices screen
  random: 0, // holds randomly created numbers

  sceneAssistant: null, // game scene assistant for stuff
  running: false, // wether game is currently running
  context: null, // canvas 2d context
  twoxyDot: null, // holds the players vehicle

  twoxyDotCollisionWidth: null, // width of collision box of vehicle
  twoxyDotCollisionHeight: null, // height of collision box of vehicle
  collisionTolerance: null, // tolerance of collision

  directions: ['up','right','down','left'], // all possible directions
  currentDirection: 0, // id of directions array that the game is currently heading

  score: 0, // will be calculated every second
  scoreNextIn: 0, // interval after which the score will be added
  scoreInterval: 0,
  scorePositions: [4], // holds positions for score for each orientation

  choices: null, // for game over dialog
  highscoreArgs: null, // arguments for highscore scene coming from game over dialog

  // global moving paces, depending on orientation
  slowMoveX: [4],
  slowMoveY: [4],
  mediumMoveX: [4],
  mediumMoveY: [4],
  fastMoveX: [4],
  fastMoveY: [4],
  moveAddX: [4],
  moveAddY: [4],

  movePaceAdd: null,
  movePaceAddIn: null,
  movePaceAddStart: null,

  setCurrentDirection: function( direction ) {
    this.currentDirection = direction;
    this.obstacles.slowMoveX = this.slowMoveX[ direction ];
    this.obstacles.slowMoveY = this.slowMoveY[ direction ];
    this.obstacles.mediumMoveX = this.mediumMoveX[ direction ];
    this.obstacles.mediumMoveY = this.mediumMoveY[ direction ];
    this.obstacles.fastMoveX = this.fastMoveX[ direction ];
    this.obstacles.fastMoveY = this.fastMoveY[ direction ];
  },

  ///////////////////////////////////////////////////////////
  // Things that just simply move horizontally or diagonally
  // Do not shoot
  ///////////////////////////////////////////////////////////
  obstacles: {
    types: ['obstacle1','obstacle2','obstacle3','obstacle4'], // holds all types of obstacles that can be generated randomly
    box:[25], // holds obstacle objects
    count: 0, // obstacle counter
    nextIn: 0, // ms when the next obstacle is being introduced
    startIn: 0, // start time for when the next obstacle is introduced
    minusIn: 0, // substract value for nextIn for introducing
    distanceX: null, // holds current distance of current iterations object to twoxyDot
    distanceY: null, // holds current distance of current iterations object to twoxyDot

    twoxyX: null, // will hold current twoxyDots X position
    twoxyY: null, // current twoxyDots Y position
    images: {}, // in initialize( ) will get all images of available obstacles

    initialize: function( ) {
      this.images.obstacle1 = [];
      this.images.obstacle1[ 0 ] = new Image( );
      this.images.obstacle1[ 0 ].src = 'images/obstacle1.gif';
      this.images.obstacle1[ 0 ].width = 45;
      this.images.obstacle1[ 0 ].height = 26;
      this.images.obstacle1[ 1 ] = new Image( );
      this.images.obstacle1[ 1 ].src = 'images/obstacle1_left.gif';
      this.images.obstacle1[ 1 ].width = 26;
      this.images.obstacle1[ 1 ].height = 45;
      this.images.obstacle1[ 2 ] = new Image( );
      this.images.obstacle1[ 2 ].src = 'images/obstacle1_up.gif';
      this.images.obstacle1[ 2 ].width = 45;
      this.images.obstacle1[ 2 ].height = 26;
      this.images.obstacle1[ 3 ] = new Image( );
      this.images.obstacle1[ 3 ].src = 'images/obstacle1_right.gif';
      this.images.obstacle1[ 3 ].width = 26;
      this.images.obstacle1[ 3 ].height = 45;

      this.images.obstacle2 = [];
      this.images.obstacle2[ 0 ] = new Image( );
      this.images.obstacle2[ 0 ].src = 'images/obstacle2.gif';
      this.images.obstacle2[ 0 ].width = 42;
      this.images.obstacle2[ 0 ].height = 46;
      for( var i = 1; i <=3; i++ ) {
        this.images.obstacle2[ i ] = this.images.obstacle2[ 0 ];
      }

      this.images.obstacle3 = [];
      this.images.obstacle3[ 0 ] = new Image( );
      this.images.obstacle3[ 0 ].src = 'images/obstacle3.gif';
      this.images.obstacle3[ 0 ].width = 23;
      this.images.obstacle3[ 0 ].height = 23;
      for( var i = 1; i <=3; i++ ) {
        this.images.obstacle3[ i ] = this.images.obstacle3[ 0 ];
      }

      this.images.obstacle4 = [];
      this.images.obstacle4[ 0 ] = new Image( );
      this.images.obstacle4[ 0 ].src = 'images/obstacle4.gif';
      this.images.obstacle4[ 0 ].width = 69;
      this.images.obstacle4[ 0 ].height = 75;
      for( var i = 1; i <=3; i++ ) {
        this.images.obstacle4[ i ] = this.images.obstacle4[ 0 ];
      }

      this.images.wall1_horizontal = [];
      this.images.wall1_horizontal[ 0 ] = new Image( );
      this.images.wall1_horizontal[ 0 ].src = 'images/wall1_horizontal.gif';
      this.images.wall1_horizontal[ 0 ].width = 320;
      this.images.wall1_horizontal[ 0 ].height = 12;
      for( var i = 1; i <=3; i++ ) {
        this.images.wall1_horizontal[ i ] = this.images.wall1_horizontal[ 0 ];
      }

      this.images.wall1_vertical = [];
      this.images.wall1_vertical[ 0 ] = new Image( );
      this.images.wall1_vertical[ 0 ].src = 'images/wall1_vertical.gif';
      this.images.wall1_vertical[ 0 ].width = 12;
      this.images.wall1_vertical[ 0 ].height = 480;
      for( var i = 1; i <=3; i++ ) {
        this.images.wall1_vertical[ i ] = this.images.wall1_vertical[ 0 ];
      }

      this.images.missile2 = [];
      this.images.missile2[ 0 ] = new Image( );
      this.images.missile2[ 0 ].src = 'images/missile2.gif';
      this.images.missile2[ 0 ].width = 17;
      this.images.missile2[ 0 ].height = 54;
      for( var i = 1; i <=3; i++ ) {
        this.images.missile2[ i ] = this.images.missile2[ 0 ];
      }
    },
    start: function( ) { // stuff to be done every time the game restarts
      this.box = [ 25 ];
      this.count = 0;
      this.nextIn = 0; // 5 seconds
      this.startIn = 5050;
      this.minusIn = 50; // makes obstacles appear faster
    },
    createObstacle: function( type, startX, startY ) { // create a new obstacle
      // type either a special type or 'random'
      if( type == 'random' ) {
        this.random = Math.floor( Math.random( )*4 );
        if( this.random == 0 ) {
          type = 'obstacle1';
        } else if( this.random == 1 ) {
          type = 'obstacle2';
        } else if( this.random == 2 ) {
          type = 'obstacle3';
        } else if( this.random == 3 ) {
          type = 'obstacle4';
        }
      }

      // final obstacle object
      var newObstacle = {};

      // now introducing all types of static obstacles
      if( type == 'obstacle1' ) { // small fire blast
        newObstacle.moveType = 'medium';
        newObstacle.image = this.images.obstacle1;
      } else if( type == 'obstacle2' ) { // middle sized rock
        newObstacle.moveType = 'medium';
        newObstacle.image = this.images.obstacle2;
      } else if( type == 'obstacle3' ) { // small sized rock
        newObstacle.moveType = 'fast';
        newObstacle.image = this.images.obstacle3;
      } else if( type == 'obstacle4' ) { // big sized rock
        newObstacle.moveType = 'slow';
        newObstacle.image = this.images.obstacle4;
      } else if( type == 'wall1_horizontal' ) {
        newObstacle.moveType = 'fast';
        newObstacle.image = this.images.wall1_horizontal;
      } else if( type == 'wall1_vertical' ) {
        newObstacle.moveType = 'fast';
        newObstacle.image = this.images.wall1_vertical;
      }

      newObstacle.width = newObstacle.image[ twoxyGame.currentDirection ].width;
      newObstacle.height = newObstacle.image[ twoxyGame.currentDirection ].height;

      // set starting positions
      if( twoxyGame.currentDirection == 0 ) {
        newObstacle.x = startX;
        newObstacle.y = startY-newObstacle.height;
      } else if( twoxyGame.currentDirection == 1 ) {
        newObstacle.x = startX+newObstacle.width;
        newObstacle.y = startY;
      } else if( twoxyGame.currentDirection == 2 ) {
        newObstacle.x = startX;
        newObstacle.y = startY+newObstacle.height;
      } else {
        newObstacle.x = startX-newObstacle.width;
        newObstacle.y = startY;
      }

      // push new obstacle to box
      this.box[ this.count++ ] = newObstacle;
    },
    render: function( ) {
      this.twoxyX = parseInt( twoxyGame.twoxyDot.style.left );
      this.twoxyY = parseInt( twoxyGame.twoxyDot.style.top );

      for( twoxyGame.i = 0; twoxyGame.i < this.count; twoxyGame.i++ ) {
        // handle itterations first
        if( this.box[ twoxyGame.i ].moveType == 'slow' ) {
          this.box[ twoxyGame.i ].x += twoxyGame.slowMoveX[ twoxyGame.currentDirection ];
          this.box[ twoxyGame.i ].y += twoxyGame.slowMoveY[ twoxyGame.currentDirection ];
        } else if( this.box[ twoxyGame.i ].moveType == 'medium' ) {
          this.box[ twoxyGame.i ].x += twoxyGame.mediumMoveX[ twoxyGame.currentDirection ];
          this.box[ twoxyGame.i ].y += twoxyGame.mediumMoveY[ twoxyGame.currentDirection ];
        } else if( this.box[ twoxyGame.i ].moveType == 'fast' ) {
          this.box[ twoxyGame.i ].x += twoxyGame.fastMoveX[ twoxyGame.currentDirection ];
          this.box[ twoxyGame.i ].y += twoxyGame.fastMoveY[ twoxyGame.currentDirection ];
        }

        // check for destruction
        if( this.box[ twoxyGame.i ].y > twoxyGame.gameHeight+this.box[ twoxyGame.i ].height // gone below
        || this.box[ twoxyGame.i ].x > 320+this.box[ twoxyGame.i ].width // gone right
        || this.box[ twoxyGame.i ].y < 0-this.box[ twoxyGame.i ].height // gone top
        || this.box[ twoxyGame.i ].x < 0-this.box[ twoxyGame.i ].width // gone left
        ) {
          this.box.splice( twoxyGame.i, 1 );
          twoxyGame.i--;
          this.count--;
          continue;
        }

        // draw obstacle
        twoxyGame.context.drawImage( this.box[ twoxyGame.i ].image[ twoxyGame.currentDirection ], this.box[ twoxyGame.i ].x, this.box[ twoxyGame.i ].y, this.box[ twoxyGame.i ].width, this.box[ twoxyGame.i ].height )

        // check for collision
        this.distanceX = this.box[ twoxyGame.i ].x - this.twoxyX;
        this.distanceY = this.box[ twoxyGame.i ].y - this.twoxyY;

        // if > -obstacleWidth (-17) && < twoxyWidth (42) && > -obstacleHeight (-54) && < twoxyHeight (52)
        if( ( this.distanceX > (this.box[ twoxyGame.i ].width * -1) && this.distanceX < twoxyGame.twoxyDotCollisionWidth ) && ( this.distanceY > (this.box[ twoxyGame.i ].height * -1) && this.distanceY < twoxyGame.twoxyDotCollisionHeight ) ) {
          return false; // return collision
        }

      }

      return true; // return everything fine
    }
  },

  ////////////////////////////////////////////////
  // Things that move on a path and shoot
  ////////////////////////////////////////////////
  /*
  TODOS:
  - create path array for enemy objects
    - each element is one point in the path
    - x and y values for path position for current point
    - time the vehicle stays there after reaching this spot (0 means, immediately take next dot)
    - use usual movement speeds
  */
  enemies: {
    box: [25], // max 25 enemies at a time
    count: 0,
    images: {}, // holds enemy images

    // stuff that has to be done once
    initialize: function( ) {
      this.images.enemy1 = new Image( );
      this.images.enemy1.src = 'images/enemy1.gif';
      this.images.enemy1.width = 9;
      this.images.enemy1.height = 13;

      this.images.enemy2 = new Image( );
      this.images.enemy2.src = 'images/enemy2.gif';
      this.images.enemy2.width = 69;
      this.images.enemy2.height = 27;

      this.images.enemy3 = new Image( );
      this.images.enemy3.src = 'images/enemy3.gif';
      this.images.enemy3.width = 23;
      this.images.enemy3.height = 27;
    },

    // stuff that has to be done every time the game starts
    start: function( ) {
      this.count = 0;
      this.box = [25];
    },

    createEnemy: function( type, startX, startY ) {

      if( this.count < 25 ) {
        var newObstacle = {};

        if( type == 'enemy1' ) {
          newObstacle.image = this.images.enemy1;
          //newObstacle.moveX = twoxyGame.fastMoveX[ twoxyGame.currentDirection ];
          //newObstacle.moveY = twoxyGame.fastMoveY[ twoxyGame.currentDirection ];
          newObstacle.moveX = 10;
          newObstacle.moveY = 10;

          // build path array [{x,y,speed,wait}]
          newObstacle.path = [];
          var lastY = -15;
          while( lastY < twoxyGame.gameHeight ) {
            // calculate next y (between 150 and 75)
            lastY += Math.floor((150-74)*Math.random( )+75 );
            var currentPathPoint = {};
            currentPathPoint.x = Math.floor( Math.random( )*320 ); // random position on x axis
            currentPathPoint.y = lastY;
            newObstacle.path.push( currentPathPoint );
          }
        }

        // basic stuff
        // set starting positions
        //newObstacle.width = newObstacle.image.width;
        //newObstacle.height = newObstacle.image.height;

        if( twoxyGame.currentDirection == 0 ) {
          newObstacle.x = startX;
          newObstacle.y = startY-newObstacle.image.height;
        } else if( twoxyGame.currentDirection == 1 ) {
          newObstacle.x = startX+newObstacle.image.width;
          newObstacle.y = startY;
        } else if( twoxyGame.currentDirection == 2 ) {
          newObstacle.x = startX;
          newObstacle.y = startY+newObstacle.image.height;
        } else {
          newObstacle.x = startX-newObstacle.image.width;
          newObstacle.y = startY;
        }

        // push new obstacle to box
        this.box[ this.count++ ] = newObstacle;
      }
    },

    // rendering function
    /*
    TODO:
    - check collision
    */
    render: function( ) {
      for( twoxyGame.i = 0; twoxyGame.i < this.count; twoxyGame.i++ ) {

        if( Math.abs(this.box[ twoxyGame.i ].path[ 0 ].x-this.box[ twoxyGame.i ].x) < this.box[ twoxyGame.i ].moveX ) {
          this.box[ twoxyGame.i ].x = this.box[ twoxyGame.i ].path[ 0 ].x;
        }
        //if ( Math.abs(this.box[ twoxyGame.i ].path[ 0 ].y-this.box[ twoxyGame.i ].y) < this.box[ twoxyGame.i ].moveY ) {
        if( this.box[ twoxyGame.i ].path[ 0 ].y <= this.box[ twoxyGame.i ].y ) {
          this.box[ twoxyGame.i ].y = this.box[ twoxyGame.i ].path[ 0 ].y;
        }

        // check for jumping to next path
        if( this.box[ twoxyGame.i ].path[ 0 ].x == this.box[ twoxyGame.i ].x
         && this.box[ twoxyGame.i ].path[ 0 ].y == this.box[ twoxyGame.i ].y ) {
          this.box[ twoxyGame.i ].path.shift( );
        }

        // check for destruction of object
        if( this.box[ twoxyGame.i ].path.length == 0
         || this.box[ twoxyGame.i ].y > twoxyGame.gameHeight+this.box[ twoxyGame.i ].image.height ) {
           this.box.splice( twoxyGame.i, 1 );
          twoxyGame.i--;
          this.count--;
          continue;
        }

        // handle movement - x axis
        if( this.box[ twoxyGame.i ].path[ 0 ].x < this.box[ twoxyGame.i ].x ) {
          this.box[ twoxyGame.i ].x -= this.box[ twoxyGame.i ].moveX;
        } else if( this.box[ twoxyGame.i ].path[ 0 ].x > this.box[ twoxyGame.i ].x ) {
          this.box[ twoxyGame.i ].x += this.box[ twoxyGame.i ].moveX;
        }

        // handle movement - y axis
        //if( this.box[ twoxyGame.i ].path[ 0 ].y < this.box[ twoxyGame.i ].y ) {
          //this.box[ twoxyGame.i ].y -= this.box[ twoxyGame.i ].moveY;
          //this.box[ twoxyGame.i ].y = this.box[ twoxyGame.i ].path[ 0 ].y;
        //} else if( this.box[ twoxyGame.i ].path[ 0 ].y > this.box[ twoxyGame.i ].y ) {
          this.box[ twoxyGame.i ].y += this.box[ twoxyGame.i ].moveY;
        //}

        // render this enemy
        twoxyGame.context.drawImage( this.box[ twoxyGame.i ].image, this.box[ twoxyGame.i ].x, this.box[ twoxyGame.i ].y, this.box[ twoxyGame.i ].image.width, this.box[ twoxyGame.i ].image.height )
      }

      return true;
    }
  },

  ////////////////////////////////////////////////
  // Scripted events
  // current: direction change
  ////////////////////////////////////////////////
  events: {
    showDirectionChange: {type:null,time:null,frame:null,showAtX:null,showAtY:null},
    nextDirectionChange: 0, // game second where next direction change will occur
    directionImages: [ 4 ],
    initialize: function( ) { // initializes events
      this.directionImages[ 0 ] = [];
      this.directionImages[ 1 ] = [];
      this.directionImages[ 2 ] = [];
      this.directionImages[ 3 ] = [];

      var image = new Image( );
      image.src = 'images/location_left_1.gif';
      this.directionImages[ 3 ].push( image );
      var image = new Image( );
      image.src = 'images/location_left_2.gif';
      this.directionImages[ 3 ].push( image );
      var image = new Image( );
      image.src = 'images/location_left_3.gif';
      this.directionImages[ 3 ].push( image );
      this.directionImages[ 3 ].width = 12;
      this.directionImages[ 3 ].height = 7;

      var image = new Image( );
      image.src = 'images/location_right_1.gif';
      this.directionImages[ 1 ].push( image );
      var image = new Image( );
      image.src = 'images/location_right_2.gif';
      this.directionImages[ 1 ].push( image );
      var image = new Image( );
      image.src = 'images/location_right_3.gif';
      this.directionImages[ 1 ].push( image );
      this.directionImages[ 1 ].width = 12;
      this.directionImages[ 1 ].height = 7;

      var image = new Image( );
      image.src = 'images/location_top_1.gif';
      this.directionImages[ 0 ].push( image );
      var image = new Image( );
      image.src = 'images/location_top_2.gif';
      this.directionImages[ 0 ].push( image );
      var image = new Image( );
      image.src = 'images/location_top_3.gif';
      this.directionImages[ 0 ].push( image );
      this.directionImages[ 0 ].width = 7;
      this.directionImages[ 0 ].height = 12;

      var image = new Image( );
      image.src = 'images/location_down_1.gif';
      this.directionImages[ 2 ].push( image );
      var image = new Image( );
      image.src = 'images/location_down_2.gif';
      this.directionImages[ 2 ].push( image );
      var image = new Image( );
      image.src = 'images/location_down_3.gif';
      this.directionImages[ 2 ].push( image );
      this.directionImages[ 2 ].width = 7;
      this.directionImages[ 2 ].height = 12;

    },
    start: function( ) {
      // calculate next direction change time (between 15 and 30 seconds)
      this.nextDirectionChange = Math.floor((30-14)*Math.random()) + 15;
      this.showDirectionChange = {type:null,time:null,frame:null,showAtX:null,showAtY:null};
    },
    render: function( ) { // renders events

      // handle direction change event
      if( twoxyGame.time == this.nextDirectionChange && this.showDirectionChange.time == null ) {
        // initialize current direction change
        if( Math.ceil(10*Math.random()) > 5 ) { // change direction left
          if( twoxyGame.currentDirection >= 1 ) this.showDirectionChange.type = twoxyGame.currentDirection-1;
          else this.showDirectionChange.type = 3;
        } else { // change direction right
          if( twoxyGame.currentDirection <=2 ) this.showDirectionChange.type = twoxyGame.currentDirection+1;
          else this.showDirectionChange.type = 0;
        }
        this.showDirectionChange.time = 3; // 3 seconds for change
        this.showDirectionChange.frame = 0;

        if( twoxyGame.currentDirection == 0 ) {
          this.showDirectionChange.showAtX = 160-this.directionImages[ this.showDirectionChange.type ].width/2;
          this.showDirectionChange.showAtY = 80;
        } else if( twoxyGame.currentDirection == 1 ) {
          this.showDirectionChange.showAtX = 240;
          this.showDirectionChange.showAtY = twoxyGame.gameHeight/2-this.directionImages[ this.showDirectionChange.type ].width/2;
        } else if( twoxyGame.currentDirection == 2 ) {
          this.showDirectionChange.showAtX = 160-this.directionImages[ this.showDirectionChange.type ].width/2;
          this.showDirectionChange.showAtY = twoxyGame.gameHeight - twoxyGame.gameHeight/3/2;
        } else {
          this.showDirectionChange.showAtX = 80-this.directionImages[ this.showDirectionChange.type ].width/2;
          this.showDirectionChange.showAtY = twoxyGame.gameHeight/2;
        }
      }

      if( this.showDirectionChange.time > 0 ) {
        // show current frame
        twoxyGame.context.drawImage( this.directionImages[ this.showDirectionChange.type ][ this.showDirectionChange.frame ], this.showDirectionChange.showAtX, this.showDirectionChange.showAtY, this.directionImages[ this.showDirectionChange.type ].width, this.directionImages[ this.showDirectionChange.type ].height );
        this.showDirectionChange.time -= Math.floor((twoxyGame.time - this.nextDirectionChange)/3);
      } else if( this.showDirectionChange.time == 0 ) {
        this.nextDirectionChange = twoxyGame.time + Math.floor((30-12)*Math.random()) + 13; // at least 3 seconds for current direction

        // if direction not changed, create wall of death
        if( this.showDirectionChange.type != twoxyGame.currentDirection ) {
          if( twoxyGame.currentDirection == 0 ) {
            twoxyGame.obstacles.createObstacle( 'wall1_horizontal', 0, 0 );
          } else if( twoxyGame.currentDirection == 1 ) {
            twoxyGame.obstacles.createObstacle( 'wall1_vertical', 320, 0 );
          } else if( twoxyGame.currentDirection == 2 ) {
            twoxyGame.obstacles.createObstacle( 'wall1_horizontal', 0, twoxyGame.gameHeight );
          } else if( twoxyGame.currentDirection == 3 ) {
            twoxyGame.obstacles.createObstacle( 'wall1_vertical', 0, 0 );
          }
        }

        this.showDirectionChange = {type:null,time:null,frame:null,showAtX:null,showAtY:null};
      }
    }
  },

  // explosion of the ship
  explosion: {
    img: null,
    width: 65,
    height: 75
  },

  // function bindings
  gameLoopInterval: null,
  gameLoopBind: null,

  // initializes the game and do stuff only to be done once
  initialize: function() {
    this.i = 0;
    this.gameHeight = Mojo.Environment.DeviceInfo.screenHeight; // currently either 480 for pre or 400 for pixi
    this.collisionTolerance = 2;

    this.twoxyDotCollisionWidth = 40;
    this.twoxyDotCollisionHeight = 50;

    // standard font size for text in context
    this.context.font = "normal 15px sans-serif";

    // bind gameloop
    this.gameLoopBind = this.gameLoop.bind( this );

    // initialize twoxy dot
    this.twoxyDot.style.position = 'absolute';
    this.twoxyDot.style.width = '42px';
    this.twoxyDot.style.height = '52px';

    this.scorePositions[ 0 ] = {x:10,y:15,rotation:0}; // up
    this.scorePositions[ 1 ] = {x:305,y:10,rotation:90 * Math.PI / 180}; // right
    this.scorePositions[ 2 ] = {x:305,y:this.gameHeight-15,rotation:180 * Math.PI / 180}; // down
    this.scorePositions[ 3 ] = {x:10, y:this.gameHeight-15, rotation: 270 * Math.PI / 180}; // left

    // initialize obstacle images
    this.obstacles.initialize( );

    // initialize events
    this.events.initialize( );

    // initialize enemies
    this.enemies.initialize( );

    // initialize explosion images
    this.explosion.img = new Image( );
    this.explosion.img.src = 'images/explosion.gif';

    // draw initial start screen
    this.startScreen( );
  },

  // starts a brand new game and do stuff that has to be done before every game, like resets
  start: function() {

    this.running = true;
    this.sceneAssistant.orientationHandler( {position: 2}, true );

    // game objects
    this.obstacles.start( );
    this.events.start( );
    this.enemies.start( );

    // reset move paces, are being itterated throughout game
    this.slowMoveX[ 0 ] = 0;
    this.slowMoveY[ 0 ] = 2;
    this.slowMoveX[ 1 ] = -2;
    this.slowMoveY[ 1 ] = 0;
    this.slowMoveX[ 2 ] = 0;
    this.slowMoveY[ 2 ] = -2;
    this.slowMoveX[ 3 ] = 2;
    this.slowMoveY[ 3 ] = 0;

    this.mediumMoveX[ 0 ] = 0;
    this.mediumMoveY[ 0 ] = 5;
    this.mediumMoveX[ 1 ] = -5;
    this.mediumMoveY[ 1 ] = 0;
    this.mediumMoveX[ 2 ] = 0;
    this.mediumMoveY[ 2 ] = -5;
    this.mediumMoveX[ 3 ] = 5;
    this.mediumMoveY[ 3 ] = 0;

    this.fastMoveX[ 0 ] = 0;
    this.fastMoveY[ 0 ] = 10;
    this.fastMoveX[ 1 ] = -10;
    this.fastMoveY[ 1 ] = 0;
    this.fastMoveX[ 2 ] = 0;
    this.fastMoveY[ 2 ] = -10;
    this.fastMoveX[ 3 ] = 10;
    this.fastMoveY[ 3 ] = 0;

    this.moveAddX[ 0 ] = 0;
    this.moveAddY[ 0 ] = 1;
    this.moveAddX[ 1 ] = -1;
    this.moveAddY[ 1 ] = 0;
    this.moveAddX[ 2 ] = 0;
    this.moveAddY[ 2 ] = -1;
    this.moveAddX[ 3 ] = 1;
    this.moveAddY[ 3 ] = 0;

    //this.movePaceAdd = 2;
    this.movePaceAddIn = 5000;
    this.movePaceAddStart = 5000;

    // score
    this.score = 0;
    this.scoreNextIn = 1000;
    this.scoreInterval = 1000;

    // time, for handling timed events, scripted stuff, levels...
    this.time = 0;
    this.timeAddIn = 1000;
    this.timeAdd = 1000;

    this.setCurrentDirection( 0 );

    // start interval loop
    this.gameLoopInterval = setInterval( this.gameLoopBind, 33 ); // 30 fps
  },

  stop: function( ) {
    this.running = false;
    clearInterval( this.gameLoopInterval );

    // stop holding
    this.sceneAssistant.html1HoldEnd( );

    // draw explosion
    var twoxyX = parseInt( this.twoxyDot.style.left );
    var twoxyY = parseInt( this.twoxyDot.style.top );
    this.context.drawImage( this.explosion.img, twoxyX-10, twoxyY-12, this.explosion.width, this.explosion.height );

    Mojo.Controller.getAppController().playSoundNotification("vibrate", "",250);

    var highscore = this.sceneAssistant.controller.stageController.assistant.highscore;
    var lowestScore = highscore[ highscore.length-1 ].value;

    // show highscore
    if( this.score > lowestScore ) {
      this.choices = [{label: $L('Continue Game'), value: 'continue' },{label: $L('Submit Highscore'), value: 'submit'}];
      this.highscoreArgs = {addHighscore: true, score: twoxyGame.score};
    } else {
      this.choices = [{label: $L('Continue Game'), value: 'continue' },{label: $L('Show Highscore'), value: 'show'}];
      this.highscoreArgs = {addHighscore: false};
    }
    this.sceneAssistant.controller.showAlertDialog( {
      onChoose: function( value ) {
        if( value == 'submit' || value == 'show' ) {
          this.controller.stageController.pushScene( {name: "highscore", disableSceneScroller: true}, twoxyGame.highscoreArgs );
        } else {
          twoxyGame.startScreen( );
        }
      },
      title: $L('Game Over'),
      message: '',
      choices: twoxyGame.choices
    } );
  },

  startScreen: function( ) {
    this.twoxyDot.style.left = '140px';
    this.twoxyDot.style.top = '330px';
    this.context.fillStyle = "rgb(0,0,0)";
    this.context.fillRect( 0, 0, 320, 480 );
    this.context.fillStyle = "rgb(0,200,0)";
    //this.context.fillText( $L('Score')+': 0', this.scorePositions[ this.currentDirection ].x, this.scorePositions[ this.currentDirection ].y );
    this.context.fillText( $L('Score')+': 0', 10, 15 );

    var startText = $L('Pick up your ship');
    var textMetrics = this.context.measureText(startText);
    this.context.fillStyle = "rgb(0,200,0)";
    this.context.fillText( startText, 160-textMetrics.width/2, 200 );

    this.sceneAssistant.orientationHandler( {position: 2}, true );
  },

  gameLoop: function() {
    var startTime = new Date().getTime();

    // empty screen
    this.context.fillStyle = "rgb(0,0,0)";
    this.context.fillRect( 0, 0, 320, 480 );

    // itterations
    this.obstacles.nextIn -= 150;
    this.scoreNextIn -= 33;
    this.movePaceAddIn -= 33;
    this.timeAddIn -= 33;

    // draw obstacles
    if( this.obstacles.render( ) /*&& this.enemies.render( )*/ ) { // no enemies yet

      // draw new obstacle
      if( this.obstacles.nextIn <= 0 && this.obstacles.count < 25 ) {
        if( twoxyGame.currentDirection == 0 ) {
          this.obstacles.createObstacle( 'random', Math.floor( Math.random( )*320 ), 0 );
        } else if( twoxyGame.currentDirection == 1 ) {
          this.obstacles.createObstacle( 'random', 320, Math.floor( Math.random( )*twoxyGame.gameHeight ) );
        } else if( twoxyGame.currentDirection == 2 ) {
          this.obstacles.createObstacle( 'random', Math.floor( Math.random( )*twoxyGame.gameHeight ), twoxyGame.gameHeight );
        } else {
          this.obstacles.createObstacle( 'random', 0, Math.floor( Math.random( )*twoxyGame.gameHeight ) );
        }
        if( this.time%3 == 0 ) {
          this.obstacles.startIn -= this.obstacles.minusIn;
        }
        this.obstacles.nextIn = this.obstacles.startIn;

        if( this.obstacles.startIn < 0 ) {
          this.obstacles.startIn = 5000-(this.score*10);
        }
      }

      // draw new enemy
      /*if( this.time > 0 && this.time % 5 == 0 && this.timeAddIn > 950 ) {
        this.enemies.createEnemy( 'enemy1', 140, -20 );
      }*/ // no enemies yet

      // update moving pace
      if( this.movePaceAddIn <= 0 && this.slowMoveX[ this.currentDirection ] <= 20 ) {
        this.slowMoveX[ this.currentDirection ] += this.moveAddX[ this.currentDirection ];
        this.slowMoveY[ this.currentDirection ] += this.moveAddY[ this.currentDirection ];
        this.mediumMoveX[ this.currentDirection ] += this.moveAddX[ this.currentDirection ];
        this.mediumMoveY[ this.currentDirection ] += this.moveAddY[ this.currentDirection ];
        this.fastMoveX[ this.currentDirection ] += this.moveAddX[ this.currentDirection ];
        this.fastMoveY[ this.currentDirection ] += this.moveAddY[ this.currentDirection ];
        this.movePaceAddIn = this.movePaceAddStart;
      }

      // draw highscore
      this.context.fillStyle = "rgb(0,200,0)";
      //this.context.fillText( $L('Score')+': '+this.score.toString( ), this.scorePositions[ this.currentDirection ].x, this.scorePositions[ this.currentDirection ].y );
      this.context.fillText( $L('Score')+': '+this.score.toString( ), 10, 15 );

      // update score
      if( this.scoreNextIn <= 0 ) {
        this.score++;
        this.scoreNextIn = this.scoreInterval;
      }

      // update time
      if( this.timeAddIn <= 0 ) {
        this.time++;
        this.timeAddIn = this.timeAdd;
      }

      // scripted events
      this.events.render( );

    } else {
      // stop game
      if( this.running ) {
        this.stop( );
      }
    }

    var endTime = new Date().getTime();
    //Mojo.Log.info("#### Frame Time : " + (endTime - startTime));
  }
};
