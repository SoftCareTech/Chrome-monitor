chrome.runtime.onInstalled.addListener(function() {

    console.log("Loaded" + new Date())


    chrome.runtime.onMessage.addListener(
        function(message, callback) {
            if (message == "changeColor") {
                chrome.tabs.executeScript({
                    code: 'document.body.style.backgroundColor="green"'
                });
            }

        });

});

/*
    



How to Create a Chrome Extension in 10 Minutes Flat - SitePoint
https://www.sitepoint.com/create-chrome-extension-10-minutes-flat/

Content scripts 
https://developer.chrome.com/docs/extensions/mv2/content_scripts/


Listening to all scroll events on a page
https://stackoverflow.com/questions/14814841/chrome-extension-have-an-extension-listen-for-an-event-on-a-page

Cross-origin XMLHttpRequest---------------related
https://developer.chrome.com/docs/extensions/mv2/xhr/#requesting-permission

JavaScript getTime() Method
https://www.w3schools.com/jsref/jsref_gettime.asp

HTML DOM Events
https://www.w3schools.com/jsref/dom_obj_event.asp


Detect If Browser Tab Has Focus
https://stackoverflow.com/questions/7389328/detect-if-browser-tab-has-focus


How to get base url with jquery or javascript?
https://stackoverflow.com/questions/25203124/how-to-get-base-url-with-jquery-or-javascript


MongoDB Field Update Operator - $inc
https://www.w3resource.com/mongodb/mongodb-field-update-operator-$inc.php#:~:text=In%20MongoDB%2C%20the%20%24inc%20operator,value%20as%20an%20incremental%20amount.


Pure JavaScript Send POST Data Without a Form
https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form




     */

