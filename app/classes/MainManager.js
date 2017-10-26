'use strict';
/*const PlugManager = require('./PlugManager.js');
const KodiManager = require('./KodiManager.js');
const TabletManager = require('./TabletManager.js');
*/
class MainManager {
  constructor() {
	  var self=this;
	  self.plugs=newDynamicObjectFactoryFromFile("classes/PlugManager.js","PlugManager");
	  self.kodis=newDynamicObjectFactoryFromFile("classes/KodiManager.js","KodiManager");
	  self.tablets=newDynamicObjectFactoryFromFile("classes/TabletManager.js","TabletManager");
	  self.plans=newDynamicObjectFactoryFromFile("classes/PlanManager.js","PlanManager");
	  self.running=false;
	  self.arrActionsRunning=[];
  };
  readConfigs(){
	  var self=this;
	  self.startAction("Updating Config");
	  var fs = require('fs');
	  var cfgs = JSON.parse(fs.readFileSync('../../config/config.json', 'utf8'));
	  self.plugs.vaciar();
	  self.kodis.vaciar();
	  self.tablets.vaciar();
	  self.plans.vaciar();
	  for (var i=0;i<cfgs.length;i++){
		  var cfg=cfgs[i];
		  var nombre=cfg.nombre;
		  var newPlug=self.plugs.nuevo(nombre);
		  newPlug.initialize(cfg.plug,this);
		  var newKodi=self.kodis.nuevo(nombre);
		  newKodi.initialize(cfg.tablet,this);
		  var newTablet=self.tablets.nuevo(nombre);
		  newTablet.initialize(cfg.tablet,this);
		  var newPlan=self.plans.nuevo(nombre);
		  newPlan.initialize(cfg.plan,this);
		  newPlan.setKodi(newKodi);
		  newPlan.setTablet(newTablet);
		  newPlan.setPlug(newPlug);
	  }
	  self.stopAction("Updating Config");
  }
  
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
  actuate(){
	  var crono=chronoStartFunction();
	  var barrier=newBarrier();
	  var fncActuateEach=function(stepNode){
		  var plan=stepNode.valor;
		  plan.updateStatus(function(){
			  plan.actuate();
		  });
	  }
	  self.plans.recorrerAsync("Actuate each Plan"
			  ,fncActuateEach
			  ,undefined
			  ,undefined
			  ,undefined
			  ,undefined
			  ,undefined
			  ,barrier);
	  barrier.setCallback(function(){
		 	 chronoStop(crono.nombre);
		  });
  }
  run(){
	  var self=this;
	  self.getPlans
	  var action=self.startAction("run Manager Async");
	  self.readConfigs();
	  self.actuate();
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
module.exports = MainManager; 
