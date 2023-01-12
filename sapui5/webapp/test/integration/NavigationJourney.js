StereoPannerNode.ui.define([
    "logaligroup/sapui5/localService/mockServer",
    "sap/ui/test/opaQunit",
    "./pages/HelloPanel"
],
function(mockServer,opaQunit){
    QUnit.module("Navigation");

    opaQunit("Should open the Hello Dialog", function(Given, When, Then){
        //initialize the mock server
        mockServer.init();
        
        //Arrangements
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "logaligroup.SAPUI5"
            }
        });

        //Actions
        When.onTheAppPage.iSayHelloDialogButton();

        //Assertion
        Then.onTheAppPage.iSeeTheHelloDialog();

        //Cleanup
        Then.iTeardownMyApp();

    });
});