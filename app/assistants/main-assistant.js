function MainAssistant(argFromPusher) {
}

MainAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
		this.$.header1.setLabel( $L( 'Twoxy 2' ) );
		this.$.button2.setLabel( $L( 'Start Game' ) );
		this.$.button1.setLabel( $L( 'Show Highscore' ) );
	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
	},
	button2Tap: function(event, inSender) {
		this.controller.stageController.pushScene({name: "game", disableSceneScroller: true});
	},
	button1Tap: function(inSender, event) {
		this.controller.stageController.pushScene({name: 'highscore', disableSceneScroller: true}, {addHighscore: false});
	},
	handleCommand: function(event) {
		if (event.type == Mojo.Event.commandEnable &&
	    (event.command == Mojo.Menu.helpCmd)) {
         event.stopPropagation(); // enable help. now we have to handle it
    }

		if (event.type == Mojo.Event.command) {
			switch (event.command) {
				case Mojo.Menu.helpCmd:
					Mojo.Controller.stageController.pushScene('help');
					break;
			}
		}	
	}
};
