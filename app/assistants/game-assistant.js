function GameAssistant(argFromPusher) {
this.fingerOffsetX = -21;
this.fingerOffsetY = -80;
}

GameAssistant.prototype = {
  setup: function() {
    Ares.setupSceneAssistant(this);
    this.controller.enableFullScreenMode(true);

    // get needed objects
    this.twoxyDot = this.controller.get( 'twoxyDot' );
    this.gameField = this.controller.get( 'gameField480' );

    // initialize game
    twoxyGame.context = this.gameField.getContext( '2d' );
    twoxyGame.twoxyDot = this.twoxyDot;
    twoxyGame.sceneAssistant = this;

    twoxyGame.initialize( );

    // event handler for twoxydot
    this.dragStartHandler = this.html1Hold.bindAsEventListener( this );
    this.draggingHandler = this.html1Drag.bindAsEventListener( this );
    this.dragEndHandler = this.html1HoldEnd.bindAsEventListener( this );
    this.orientationChangeHandler = this.orientationHandler.bindAsEventListener( this );

    // install event handler for twoxydot movement
    Element.observe( this.twoxyDot, Mojo.Event.dragStart, this.dragStartHandler );
    this.controller.listen(this.controller.document, Mojo.Event.stageDeactivate,this.html1HoldEnd.bind( this ), true );

    // orientation handler
    this.controller.listen(document, 'orientationchange', this.orientationChangeHandler );
  },
  cleanup: function() {
    Ares.cleanupSceneAssistant(this);
    Element.stopObserving( this.twoxyDot, Mojo.Event.dragging, this.draggingHandler );
    Element.stopObserving( this.twoxyDot, Mojo.Event.dragEnd, this.dragEndHandler );
    Element.stopObserving( this.twoxyDot, Mojo.Event.dragStart, this.dragStartHandler );
    this.controller.stopListening( document, 'orientationchange', this.orientationChangeHandler );
    this.controller.stopListening( this.controller.document, Mojo.Event.stageDeactivate,this.html1HoldEnd.bind( this ), true );
  },
  html1Hold: function(event) { // dragStartHandler

    twoxyGame.start( );

    Element.observe( this.twoxyDot, Mojo.Event.dragging, this.draggingHandler );
    Element.observe( this.twoxyDot, Mojo.Event.dragEnd, this.dragEndHandler );

    Event.stop( event );
  },
  html1Drag: function( event ) {

    this.twoxyDot.style.left = (Event.pointerX( event.move )+this.fingerOffsetX).toString()+'px';
    this.twoxyDot.style.top = (Event.pointerY( event.move )+this.fingerOffsetY).toString()+'px';
    Event.stop( event );
  },
  html1HoldEnd: function(event) {
    if( twoxyGame.running ) {
      twoxyGame.stop( );
    }
    Element.stopObserving( this.twoxyDot, Mojo.Event.dragging, this.draggingHandler );
    Element.stopObserving( this.twoxyDot, Mojo.Event.dragEnd, this.dragEndHandler );
  },
  html1Tap: function(inSender, event) {
    this.twoxyDot.style.left = (Event.pointerX( event.down )-21).toString()+'px';
    this.twoxyDot.style.top = (Event.pointerY( event.down )-26).toString()+'px';

    twoxyGame.startScreen( );
  },
  orientationHandler: function( event, force ) {
    if( typeof( force ) == 'undefined' ) var force = false;

    // handle screen orientation changes
    if( twoxyGame.events.showDirectionChange.type != null || force ) {
      if( event.position == 2 ) { // up
        this.twoxyDot.className = 'twoxyDot';
        this.fingerOffsetX = -21;
        this.fingerOffsetY = -80;
        twoxyGame.setCurrentDirection( 0 );
      } else if( event.position == 3 ) { // down
        this.twoxyDot.className = 'twoxyDot_down';
        this.fingerOffsetX = -11;
        this.fingerOffsetY = 40;
        twoxyGame.setCurrentDirection( 2 );
      } else if( event.position == 4 ) { // flip left
        this.twoxyDot.className = 'twoxyDot_right';
        this.fingerOffsetX = 38;
        this.fingerOffsetY = -21;
        twoxyGame.setCurrentDirection( 1 );
      } else if( event.position == 5 ) { // flip right
        this.twoxyDot.className = 'twoxyDot_left';
        this.fingerOffsetX = -80;
        this.fingerOffsetY = -11;
        twoxyGame.setCurrentDirection( 3 );
      }
    }
  }
};