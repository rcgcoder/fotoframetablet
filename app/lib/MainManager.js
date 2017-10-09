'use strict';
const PlugManager = require('./PlugManager.js');
const KodiManager = require('./KodiManager.js');
const TabletManager = require('./TabletManager.js');

module.exports = class MainManager {
  constructor(config) {
	  var self=this;
	  self.config=config;
	  self.plug=new PlugManager(self);
	  self.kodi=new KodiManager(self);
	  self.tablet=new TabletManager(self);
	  self.running=false;
	  self.arrActionsRunning=[];
  };
  startAction(sActionName){
	  var self=this;
	  self.running=true;
	  self.arrInfoActions.push(sActionName);
  }
  stopAction(action){
	  var self=this;
	  for (var i=0;i<self.arrActionsRunning.length;i++){
		  if (self.arrActionsRunning[i]==action){
			  self.arrActionsRunning.splice(i, 1);
			  if (self.arrActionsRunning.length==0){
				  self.running=false;
				  return "";
			  }
		  }
	  }
	  return ""
  }
  run(){
	  var self=this;
	  var action=self.startAction("run");
	  mainManager.updateStatus(function(status){
			self.actuate();
	  });
	  self.stopAction(action);
  };
  
  actuateBattery(){
	var self=this;
	var action=self.startAction("actuateBattery");
	
	if (!status.tabletOn) return self.stopAction(action);
	
	if (status.battery<self.config.battery.charge.min){
		if (!status.plugOn){
			self.plug.on();
		}
	} else if (status.battery>self.config.battery.charge.max){
		if (status.plugOn){
			self.plug.off();
		}
	}
	self.stopAction(action);
  }
  
  actuatePlan(){
	var self=this;
	var action=self.startAction("actuatePlan");
	var status=self.status;
	if (!status.tabletOn) return self.stopAction(action);
	if (status.tabletDocked==0) return self.stopAction(action); // if not docked..... do nothing
	// control the screen....
	if (status.tabletDocked==1){ // if docked..... 
		var plans;
		if (typeof self.config.plan[status.today].slideshow!=="undefined"){
			plans=self.config.plan[status.today].slideshow;
		} else {
			plans=self.config.plan["default"].slideshow;
		}
		var plan;
		for (var j=0;j<plans.length;j++){
			plan=plans[j];
			if (!((status.now>=plan.min)&&(status.now<=plan.max))){ // suspend tablet planned
				if (status.tabletScreenOn){ //if screen is on..... 
					if(status.kodiOn||status.homeOn){  //if in home or kodi close and suspend
						self.kodi.suspend();
					}
				}
			} else {  // activate screensaver
				if (status.tabletScreenOn){ // the tablet screen is On
					if (!status.tabletScreenSaverOn){
						if(status.kodiOn){ // if kodi is on.... we can launch screensaver
							self.kodi.screenSaver();
						} else if (status.homeOn){ // if home is on.... we can launch kodi+screensaver
							self.kodi.on(true); // the parameter true says to start screensaver when load.
						} else { // another forget an app is in front when docked the tablet. 
							self.tablet.restart(); // now restarting.....to close all apps and in the next test start kodi+screensaver
						}
					}
				} else { // the tablet screen is OFF.... nobody is seeing anything... we have to ON+kodi+screensaver... 
					self.tablet.screenOn(true); // the parameter true says to start kodi and screensaver when load
				}
			}
		}
	} else { // not docked.... someone is using the tablet or forget to dock after use.
		// ¿how to know is someone is using the tablet?
	}
	self.stopAction(action);
  };
  
  actuate(){
	 var self=this;
	 var action=self.startAction("actuate");
	 // battery control....
	 actuateBattery();
	 actuatePlan();
	 self.stopAction(action);
  };
  
  updateStatus(callback,bForceAskDocked,iDockedStatusKnown){
		var action=self.startAction("updateStatus");
	    var bWithCallBack=false;
	    var fncCallback=callback;
	    if (typeof callback!=="undefined"){
	    	bWithCallBack=true;
	    }
	    var self=this;
	    var bForceDocked=false;
	    if (typeof bForceAskDocked!=="undefined"){
	    	bForceDocked=bForceAskDocked;
	    }
	    var iDockedKnown=2;
	    if (typeof iDockedStatusKnown!=="undefined"){
	    	iDockedKnown=iDockedStatusKnown;
	    }
	    
	    var arrConfigs=[];

	  	var status={
	  			manager:self,
  				plugOn:false,
  				tabletOn:false,
  				tabletScreenOn:false,
  				tabletCharging:false,
  				tabletOtherApp:false,
  				tabletDocked:2, // 0=no, 1=yes, 2=unknown
  				homeOn:false,
  				kodiOn:false,
  				kodiScreenSaverOn:false,
  				battery:0,
  				today:0,
  				now:""
  				};
	  	var d = new Date();
	  	status.today = ""+d.getDay();
	  	
	  	var sHours=d.getHours();
	  	if (sHours.length<2){
	  		sHours="0"+sHours;
	  	}
	  	var sMinutes=d.getMinutes();
	  	if (sMinutes.length<2){
	  		sMinutes="0"+sMinutes;
	  	}
	  	
	  	status.now=sHours+":"+sMinutes;
	  	
	  	status.plugOn=self.plug.isOn();
	  	status.tabletOn=self.tablet.isOn();
	  	if (status.tabletOn){  // if tablet is on....
	  		//get rest of status parameters
	  		status.tabletScreenOn=self.tablet.isScreenOn();
	  		status.tabletCharging=self.tablet.isCharging();
	  		status.tabletOtherApp=self.tablet.isOtherApp();
	  		status.kodiOn=self.tablet.isKodiOn();
	  		status.homeOn=self.tablet.isHomeOn();
	  		if (status.kodiOn){
	  			status.kodiScreenSaverOn=self.tablet.isScreenSaverOn();
	  		}
  			status.tabletDocked=iDockedKnown;
  			if (status.tabletDocked==2) {
  				status.tabletDocked=status.tabletCharging?1:2; //if is charging then sure is docked
  			}
  			if (status.tabletDocked==2) {
  				status.tabletDocked=(status.plugOn && (!status.tabletCharging))?0:2; //if plug is on and tablet is not charging then is not docked
  			}
	  		if ((status.tabletDocked==2)&&(bForceDocked)){
	  			var prevPlugStatus=status.plugOn;
	  			self.plug.on();
	  			var fncEndDockedCheck=function(newStatus){
	  				var auxIsDocked=newStatus.tabletDocked;
	  				if (!prevPlugStatus){
	  					self.plug.off();
	  					var action2=self.startAction("updateStatusInner1");
	  		  			setTimeout(function(){
	  		  				self.updateStatus(fncCallback,false,auxIsDocked);
		  					self.stopAction(action2);
	  		  			},5000);
	  				} else if (typeof fncCallback!==undefined){
		  				fncCallback(newStatus);
	  				}
	  			}
	  			bWithCallBack=false;
				var action2=self.startAction("updateStatusInner2");
	  			setTimeout(function(){
	  				self.updateStatus(fncEndDockedCheck);
  					self.stopAction(action2);
	  			},5000);
	  		}
	  	}
	  	self.status=status;
	  	if (bWithCallBack){
	  		if (typeof fncCallback!=="undefined"){
	  			fncCallback(status);
	  		}
	  	}
		self.stopAction(action);
  };
  
  
/*

  for (var i=0;i<arrConfigs.length;i++){
  	var config=arrConfigs[i];
  	// get the status of all variables.
  	
  		
  		// battery control....
  		
  		if (status.battery<config.battery.charge.min){
  			if (!status.plugOn){
  				plug.on();
  			}
  		} else if (status.battery>config.battery.charge.max){
  			if (status.plugOn){
  				plug.off();
  			}
  		}
  		// control the screen....
  		var plans;
  		if (typeof config.plan[status.today].slideshow!=="undefined"){
  			plans=config.plan[status.today].slideshow;
  		} else {
  			plans=config.plan["default"].slideshow;
  		}
  		var plan;
  		for (var j=0;j<plans.length;j++){
  			plan=plans[j];
  			if ((status.now>=plan.min)&&(status.now<=plan.max)){
  				
  			}
  		}
  	} else {
  		if (status.plugOn){
  			plug.off();
  		}
  	}
  }*/

}
