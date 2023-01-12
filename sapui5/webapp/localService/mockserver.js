
sap.ui.define([
    "sap/ui/core/util/Mockserver",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
    ],
    /**
     * @param {typeof sap.ui.core.util.MockServer} Mockserver
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.base.util.UriParameters} UriParameters
     * @param {typeof sap.base.Log} Log
     */ 
    function(Mockserver,JSONModel,UriParameters,Log){
        "use strict";
        var oMockserver,
            _sAppPath = "logaligroup.sapui5/",
            _sJsonFilesPath = _sAppPath + "localService/mockdata";

        /**
         * Initializes the mock server asynchronously
         * @protected
         * @param {object} oOptionsParameter
         * @returns{Promise} a promise that is resolven when the mock server has been started
         */
        var oMockServerInterface = {

            init: function (oOptionsParameter) {
                
                var oOption = oOptionsParameter || {};

                return new Promise (function(fnResolve, fnReject){
                    var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function (){
                        var oUriParameters = new UriParameters(window.location.href);

                        //parse manifest for local metada URI
                        var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        var oMainDataSource = oManifestModel.getPropert("/sap.app/dataSources/mainService");
                        var sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                        //ensure there is a trailing slash
                        var sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();
                        
                        //create a mock server instance os stop the existing one to reinitialize
                        if (!oMockServer) {
                            oMockserver = new Mockserver({
                                rootUri : sMockServerUrl
                            })
                        } else {
                            oMockserver.stop();
                        }

                        //configure mock server with the given options or a default delay of 0.5s
                        Mockserver.config({
                            autoRespond: true,
                            autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                        });

                        //simulate all request using mock data
                        oMockServer.simulate(sMetadataUrl, {
                            sMockdataBaseUrl : sJsonFilesUrl,
                            bgenerateMissingMockData: true
                        });
                        var aRequests = oMockserver.getRequests();

                        //compose an error response for each request
                        var fnResponse = function (iErrCode,sMessage, aRequest) {
                            aRequest.response = function(oXhr){
                                oXhr.respond(iErrCode,{"Content-Type": "text/plain;charset=utf-8",sMessage});
                            };
                            
                        };

                        //simulate metada errors
                        if (oOption.metadataError || oUriParameters.get("metadaError")) {
                            aRequests.forEach(function(aEntry){
                                if (aEntry.path.toString().indexof("$metadata")) {
                                    fnResponse(500, "metadata Error", aEntry);
                                }
                            });
                        };

                        //simulate request error
                        var sErrorParam = oOptions.errorType || oUriParameters.get("errorType");
                        var iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

                        if (sErrorParam) {
                            aRequests.forEach(function (aEntry) {
                                fnResponse(iErrorCode,sErrorParam, aEntry);
                                
                            });
                        };

                        //set request and start the server
                        oMockserver.setRequests(aRequests);
                        oMockserver.start();

                        Log.info("Running the app with mock data");
                        fnResolve();
                    });

                    oManifestModel.attachRequestFailed(function(){
                        var sError ="Failed to load the application manifest";

                        Log.error(sError);
                        fnReject(new Error(sError));
                    });
                });
            }
        };

        return oMockServerInterface;


    });