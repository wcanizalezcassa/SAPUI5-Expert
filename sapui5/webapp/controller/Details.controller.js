// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
  ],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller,History, UIComponent) {
        "use strict";
  
        return Controller.extend("logaligroup.sapui5.controller.Details", {
  
            _onObjetMatch: function (oEvent) {
                this.getView.bindElement({
                   path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
                    model: "northwind"
                });
            },
            onInit: function () {
              const oRouter= sap.ui.UIComponent.getRouterFor(this);
              oRouter.getRoute("Details").attachPatternMatched(this._onObjectMatch, this);
            },
            onNavBack : function () {
                const oHistory = History.getInstance();
                const sPreviousHash =oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                }else{
                    const oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteApp", {}, true);
                }
            }
  
        });
    });