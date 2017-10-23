'use strict';
const RCGUtils=require('./lib/RCGUtils/RCGUtils.js');
var rcgutils=new RCGUtils();
//const express    = require('express');
//const bodyParser = require('body-parser');
//const morgan     = require('morgan');
const MainManager = require('./lib/MainManager.js');
var arrManagers=[];

function processAll(){
	const arrConfigs=[];
	var bIsOneRunning=false;
	for (var i=0;(i<arrManagers.length)&&(!bIsOneRunning);i++){
		if (arrManagers[i].isRunning){
			bIsOneRunning=true
		}
	}
	if (!bIsOneRunning){
		arrManagers=[];
		for (var i=0;i<arrConfigs.length;i++){
			var config=arrConfigs[i];
			// get the status of all variables.
			var mainManager=new MainManager(config);
			arrManagers.push(mainManager);
			mainManager.run();
		}
	}
	setTimeout(processAll,3000);
}
	
processAll();
