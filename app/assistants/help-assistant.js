function HelpAssistant(argFromPusher) {
}

HelpAssistant.prototype = {
	setup: function() {
		
		this.controller.setupWidget(Mojo.Menu.appMenu, this.attributes = {
			omitDefaultItems: true
			}, this.model = {
			visible: false	
			}
		)
		
		this.controller.get( 'appname' ).innerHTML = _APP_Name;
		this.controller.get( 'appdetails' ).innerHTML = _APP_VersionNumber + $L(' by') + _APP_PublisherName;
	
		var supportitems = [];
		var i = 0;
		if(typeof _APP_Publisher_URL !== "undefined" && _APP_Publisher_URL)
			supportitems[i++] = {text: _APP_PublisherName + ' Website', detail:$L(_APP_Publisher_URL), Class:$L('img_web'),type:'web'}
		if(typeof _APP_Support_URL !== "undefined" && _APP_Support_URL)
			supportitems[i++] = {text: $L('Support Website'),detail:$L(_APP_Support_URL), Class:$L("img_web"),type:'web'}
		if(typeof _APP_Support_Email !== "undefined" && _APP_Support_Email)
			supportitems[i++] = {text: $L('Send Email'),address:_APP_Support_Email.address,subject:_APP_Support_Email.subject, Class:$L("img_email"),type:'email'}
		if(typeof _APP_Support_Phone !== "undefined" && _APP_Support_Phone)		            
			supportitems[i++] = {text: $L(_APP_Support_Phone),detail:$L(_APP_Support_Phone), Class:$L("img_phone"),type:'phone'}
	
		try {
			var helpitems = [];
			i = 0;
			for (j = 0; j < _APP_Help_Resource.length; j++) {
				if (_APP_Help_Resource[j].type == 'web') 
					helpitems[i++] = {
						text: _APP_Help_Resource[j].label,
						detail: _APP_Help_Resource[j].url,
						Class: $L("img_web"),
						type: 'web'
					}
				else 
					if (_APP_Help_Resource[j].type == 'scene') 
						helpitems[i++] = {
							text: _APP_Help_Resource[j].label,
							detail: _APP_Help_Resource[j].sceneName,
							Class: $L("list_scene"),
							type: 'scene'
						}
			}
			if (_APP_Help_Resource.length > 0) {
				this.controller.setupWidget('AppHelp_list', {
					itemTemplate: 'support/listitem',
					listTemplate: 'support/listcontainer',
					emptyTemplate:'support/emptylist',
					swipeToDelete: false			
				}, {
					listTitle: $L('Help'),
					items: helpitems
				});
			}
		}catch(e){Mojo.Log.error(e)}
		this.controller.setupWidget('AppSupport_list', 
					    {
							itemTemplate:'help/listitem', 
							listTemplate:'help/listcontainer',
							emptyTemplate:'help/emptylist',
							swipeToDelete: false						
						},
					    {
							listTitle: $L('Support'),
				            items : supportitems
				         }
		  );
		this.handleListTap = this.handleListTap.bind(this);  
		Mojo.Event.listen(this.controller.get('AppHelp_list'),Mojo.Event.listTap,this.handleListTap)
		Mojo.Event.listen(this.controller.get('AppSupport_list'),Mojo.Event.listTap,this.handleListTap)
		this.controller.get( 'copywrite' ).innerHTML = _APP_Copyright;
	},
	handleListTap: function( event ) {

	  if(event.item.type == 'web'){
	  	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		  method: "open",
		  parameters:  {
		      id: 'com.palm.app.browser',
		      params: {
		          target: event.item.detail
		      }
		  }
		});
	  }	  
	  else if(event.item.type == 'email'){
	  	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		    method:'open',
		    parameters:{ target: 'mailto:' + event.item.address + "?subject="  + Mojo.appInfo.title + " " + event.item.subject}
		});	
	  }
	  else if(event.item.type == 'phone'){
	  	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		    method:'open',
		    parameters: {
		       target: "tel://" + event.item.detail
		       }
		    });	
	  }
	  else if(event.item.type == 'scene'){
	  	this.controller.stageController.pushScene(event.item.detail);	
	  }
	},
	cleanup: function() {
		Mojo.Event.stopListening(this.controller.get('AppHelp_list'),Mojo.Event.listTap,this.handleListTap);
		Mojo.Event.stopListening(this.controller.get('AppSupport_list'),Mojo.Event.listTap,this.handleListTap);
	}
};