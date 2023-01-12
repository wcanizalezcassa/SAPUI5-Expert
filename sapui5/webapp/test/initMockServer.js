
sap.ui.define([
"../localService/mockserver",
"sap/m/MessageBox"
],
/**
 * @param {typeof sap.m.MessageBox} MessageBox
 */ 
function(mockserver,MessageBox){
    "use strict";
    var amockserver = [];

    //initialize the mock server
    amockserver.push(mockserver.init());

Promise.all(amockserver).catch(function(oError){
    MessageBox.error(oError.message);
}).finally(function (){
    sap.ui.require(["sap/ui/core/ComponentSupport"]);
})
});