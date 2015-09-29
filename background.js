//jquery 2.x.x not supporting IE 6,7,8
var takeLinksList   = 0;
var takeHTagList    = 0;
var takeDomSortList = 0;
var formsObjects = {
    links       :[],
    imgAlt      :[],
    imgNotAlt   :[],
};
var hTagFormsObjects = {
    headTags    :[]
};
var domSortFormsObjects = [];
var formsObjectsLinksLength = 0;
var clickFlag = true;
var clickSwitcher = 1;

chrome.browserAction.onClicked.addListener(function() {
    executeScript('console.log("プログラム開始");');
    chrome.browserAction.setBadgeText({ text: connected ? "on" : "off" });
});

chrome.runtime.onMessage.addListener(function(req,sen,sendRes){
    if(req.keycode == 49){//type '1'
        clickSwitcher = 1;
        chrome.storage.local.get(formsObjects,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            formsObjectsLinksLength = items.links.length;
        });
        speechText_links(takeLinksList);
    }
    if(req.keycode == 50){//type '2'
        clickSwitcher = 2
        chrome.storage.local.get(hTagFormsObjects,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            formsObjectsLinksLength = items.links.length;
        });
        speechText_hTags(takeHTagList);
    }
    if(req.keycode == 51){//type '3'
        clickSwitcher = 3;
        chrome.storage.local.get(domSortFormsObjects,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            formsObjectsLinksLength = items.links.length;
        });
        speechText_domSort(takeDomSortList);
    }
    if(req.keycode == 69){//type 'E'
        previousLinkSelecting();
    }
    if(req.keycode == 82){//type 'R'
        nextLinkSelecting();
    }
    if(req.keycode == 90){//type 'Z'
        clickToLink();
    }
});

function clickToLink(){
    if(clickSwitcher != 1) return 0;
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

function nextLinkSelecting(){
    executeScript('console.log("Refresh next link.");');
    switchSpeechText(1);
}

function previousLinkSelecting(){
    executeScript('console.log("Refresh previous link.");');
    if(takeLinksList > 0 || takeHTagList > 0 || takeDomSortList > 0){
        switchSpeechText(-1);
    }
}

function switchSpeechText(num){
    if(clickSwitcher === 1) {
        speechText_links(takeLinksList);
        //executeScript('console.log('+ clickSwitcher +');');
        takeLinksList = takeLinksList + num;
    }
    if(clickSwitcher === 2) {
        speechText_hTags(takeHTagList);
        //executeScript('console.log('+ clickSwitcher +');');
        takeHTagList = takeHTagList + num;
    }
    if(clickSwitcher === 3){
        speechText_domSort(takeDomSortList);
        //executeScript('console.log('+ clickSwitcher +');');
        takeDomSortList = takeDomSortList + num;
    }
}

function speechText_links(num){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(formsObjects,function(items){
        var msg = new SpeechSynthesisUtterance();
        msg.text = items.links[num].text.toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    });
}
function speechText_hTags(num){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(hTagFormsObjects,function(items){
        var msg = new SpeechSynthesisUtterance(items.headTags[num].toString());
        msg.text = items.headTags[num].toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    });
}
function speechText_domSort(num){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(domSortFormsObjects,function(items){
    });
}

function confirmStausOfSpeechsynthesis(){
    if(!'SpeechSynthesisUtterance' in window){
        alert('web speech APIに未対応');
        return;
    }
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

