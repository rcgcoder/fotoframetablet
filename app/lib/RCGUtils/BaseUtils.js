'use strict';

function isMethod(variable){
	return (typeof variable === 'function');
}
function isUndefined(variable){
	return (typeof variable==="undefined");
}
function isDefined(variable){
	return (typeof variable!=="undefined");
}

var undefinedValue;
function fncVacia(){
}
function fncEmpty(){
}

class BaseUtils{
	isMethod(variable){
		return isMethod(variable);
	}
	isUndefined(variable){
		return isUndefined(variable);
	}
	isDefined(variable){
		return isDefined(variable);
	}
	getUndefinedValue(){
		return undefinedValue;
	}
	getFncVacia(){
		return fncVacia;
	}
	getfncEmpty(){
		return fncEmpty;
	}
}
if (isUndefined(global.isUndefined)){
	global.isUndefined=isUndefined;
}
if (isUndefined(global.isDefined)){
	global.isDefined=isDefined;
}
if (isUndefined(global.isMethod)){
	global.isMethod=isMethod;
}
if (isUndefined(global.undefinedValue)){
	global.undefinedValue=undefinedValue;
}
if (isUndefined(global.fncEmpty)){
	global.fncEmpty=fncEmpty;
}
if (isUndefined(global.fncVacia)){
	global.fncVacia=fncVacia;
}

module.exports=BaseUtils;
