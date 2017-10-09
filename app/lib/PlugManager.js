'use strict';
exports.PlugManager=class PlugManager {
  constructor(mainManager) {
    var self = this;
    self.mainManager=mainManager;
    self.Hs100Api = require('hs100-api');
    self.client = new self.Hs100Api.Client();
    self.ip=ip;
    self.plug=client.getPlug({host: mainManager.config.plug.ip});
  }
  
  
  on(){
	  var self=this;
	  var action=self.mainManager.startAction("plugOn");
	  var fncSetPowerOn=function(){
		  if (!self.isOn()){
			  self.plug.setPowerState(true);
			  setTimeout(fncSetPowerOn,3000);
		  } else {
			  self.mainManager.stopAction(action);
		  }
	  }
  }

  off(ip){
	  var self=this;
	  var action=self.mainManager.startAction("plugOn");
	  var fncSetPowerOff=function(){
		  if (!self.isOff()){
			  self.plug.setPowerState(false);
			  setTimeout(fncSetPowerOn,3000);
		  } else {
			  self.mainManager.stopAction(action);
		  }
	  }
  }
  
  isOn(){
	  var action=self.mainManager.startAction("plugIsOn");
	  var bIsOn=this.plug.getPowerState();
	  self.mainManager.stopAction(action);
	  return bIsOn; 
  }

  isOff(){
	  var action=self.mainManager.startAction("plugIsOff");
	  var bIsOff=!this.plug.getPowerState();
	  self.mainManager.stopAction(action);
	  return bIsOff;
  }
  
  info(ip){
	  var action=self.mainManager.startAction("plugIsOff");
	  var info=this.plug.getSysInfo();
	  self.mainManager.stopAction(action);
	  return info
  }
  
};

