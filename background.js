//jquery 2.x.x not supporting IE 6,7,8
var takeLinksList = 0;
var formsObjects = {
    links       :[],
    imgAlt      :[],
    imgNotAlt   :[],
    headTags    :[]
};
var formsObjectsLinksLength = 0;
var clickFlag = true;

chrome.browserAction.onClicked.addListener(function() {
    executeScript('console.log("プログラム開始");');

    chrome.storage.local.get(formsObjects,function(items){
        executeScript('console.log('+JSON.stringify(items)+');');
        formsObjectsLinksLength = items.links.length;
    });
    speechText(takeLinksList);
    
    chrome.browserAction.setBadgeText({ text: connected ? "on" : "off" });
});

chrome.runtime.onMessage.addListener(function(req,sen,sendRes){
    if(req.keycode == 69){//type 'E'
        previousLinkSelecting(takeLinksList);
    }
    if(req.keycode == 82){//type 'R'
        nextLinkSelecting(takeLinksList);
    }
    if(req.keycode == 90){//type 'Z'
        clickToLink();
    }
});

function clickToLink(){
    if(clickFlag){
        clickFlag = false;
        var clickedURINumber = takeLinksList;
        var speechText = new SpeechSynthesisUtterance();
        speechText.lang = 'JP-ja';
        chrome.storage.local.get(formsObjects,function(items){
            var clickedURIText  = items.links[clickedURINumber].text;
            var clickedURI      = items.links[clickedURINumber].uri;
            speechText.text = clickedURIText.toString();
            speechSynthesis.speak(speechText);
            executeScript('location.href="' + clickedURI.toString() + '";');
        });
        speechText.onend = function(e){
            clickFlag = true;
        };
    }
}

function nextLinkSelecting( listNum ){
    executeScript('console.log("Refresh next link.");');
    takeLinksList = listNum + 1;
    speechText(takeLinksList);
}

function previousLinkSelecting( listNum ){
    executeScript('console.log("Refresh previous link.");');
    if(listNum > 0){ takeLinksList = listNum - 1; } 
    speechText(takeLinksList);
}

function speechText(num){
    chrome.storage.local.get(formsObjects,function(items){
        var msg = new SpeechSynthesisUtterance(items.links[num].text.toString());
        //var msg = new SpeechSynthesisUtterance(items.headTags[num].toString());
        msg.text = items.links[num].text.toString();
        //msg.text = items.headTags[num].toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);    
    });
}

function executeScript(code){
    chrome.tabs.executeScript(null, {
        code:code
    });
}

function recAPI(){
    var recog = new webkitSpeechRecongnition();
    recog.lang = 'ja-JP';
    var speechRecogText = new SpeechSynthesisUtterance();
    speechRecogText.lang = 'ja-JP';

    recog.onresult = function(e){
        var results = e.results;
        var searchResults = [];
        executeScript('console.log(' + results[i][0].transcript + ');');
        chrome.storage.local.get(formsObjects,function(items){
            for(var i = e.resultIndex;i < results.length;i++){
                for(var j=0; j<items.link.length; j++){
                    var recText = results[i][0].transcript.toString();//認識テキスト
                    console.log(recText);
                    var localStorageText = items.links[j].text.toString();
                    //下が検索
                    if( localStorageText.indexOf(recText,0) > 0 ){
                        searchResults.push(items.links[j].text);
                        console.log(searchResults);
                    }
                }
            }
        });

    };

    recog.onend = function(){ swipeFlag = true; };

    if(y > 200){
        speechRecogText.text = '検索開始。';
        speechSynthesis.speak(speechRecogText);
        this.recog.start();
    }
    if(y < 200){
        speechRecogText.text = '検索開始。';
        speechSynthesis.speak(speechRecogText);
        this.recog.stop();
    }
}

