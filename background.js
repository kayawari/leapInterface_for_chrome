//jquery 2.x.x not supporting IE 6,7,8
var takeLinksList   = 0;
var takeHTagList    = 0;
var takeDomSortList_1 = 0;
var takeDomSortList_2 = 0;
var formsObjects = {
    links       :[],
    imgAlt      :[],
    imgNotAlt   :[]
};
var hTagFormsObjects = {
    headTags    :[]
};
var domSortFormsObjects_1 = {
    DOMObjects :[],
    maxDomLayer:0
};
var domSortFormsObjects_2 = {
    DOMObjects :[],
    maxDomLayer:0
};
//var formsObjectsLinksLength = 0;
var clickFlag = true;
var clickSwitcher = 1;
var selectedDomLayerNum = 1;
var maxDomLayerNum = 0;

chrome.browserAction.onClicked.addListener(function() {
    executeScript('console.log("プログラム開始");');
    chrome.browserAction.setBadgeText({ text: connected ? "on" : "off" });
});

chrome.runtime.onMessage.addListener(function(req,sen,sendRes){
    if(req.keycode == 49){//type '1'
        clickSwitcher = 1;
        chrome.storage.local.get(formsObjects,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            //formsObjectsLinksLength = items.links.length;
        });
        speechText_links(takeLinksList);
    }
    if(req.keycode == 50){//type '2'
        clickSwitcher = 2
        chrome.storage.local.get(hTagFormsObjects,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            //formsObjectsLinksLength = items.links.length;
        });
        speechText_hTags(takeHTagList);
    }
    if(req.keycode == 51){//type '3'
        clickSwitcher = 3;
        chrome.storage.local.get(domSortFormsObjects_1,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            //formsObjectsLinksLength = items.links.length;
            maxDomLayerNum = items.maxDomLayer;
        });
        speechText_domSort(takeDomSortList_1);
    }
    if(req.keycode == 52){//type '4'
        clickSwitcher = 4;
        chrome.storage.local.get(domSortFormsObjects_2,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            //formsObjectsLinksLength = items.links.length;
            maxDomLayerNum = items.maxDomLayer;
        });
        speechText_domSort(takeDomSortList_2);
    }
    if(req.keycode == 53){//type '5'
        minusDomLayerNum();
    }
    if(req.keycode == 54){//type '6'
        plusDomLayerNum();
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

function plusDomLayerNum(){
    if(selectedDomLayerNum < maxDomLayerNum) {
        selectedDomLayerNum++;
        executeScript('console.log("現在の階層は、' + selectedDomLayerNum + '番目です");');
    }else{
        executeScript('console.log("これ以上、深い階層はありません。");');
    }

    //音声案内も必要だろう。

}

function minusDomLayerNum(){
    if(selectedDomLayerNum > 1) {
        selectedDomLayerNum--;
        executeScript('console.log("現在の階層は、' + selectedDomLayerNum + '番目です");');
    }else{
        executeScript('console.log("最浅層です。");');
    }

    //音声案内も
}

function nextLinkSelecting(){
    executeScript('console.log("Refresh next link.");');
    switchSpeechText(1);
}

function previousLinkSelecting(){
    executeScript('console.log("Refresh previous link.");');
    if(takeLinksList > 0 || takeHTagList > 0 || takeDomSortList_1 > 0 || takeDomSortList_2 > 0){
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
        speechText_domSort(takeDomSortList_1);
        //executeScript('console.log('+ clickSwitcher +');');
        takeDomSortList_1 = takeDomSortList_1 + num;
    }
    if(clickSwitcher === 4){
        speechText_domSort(takeDomSortList_2);
        //executeScript('console.log('+ clickSwitcher +');');
        takeDomSortList_2 = takeDomSortList_2 + num;
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



//発声させるためのキーボードキーを入れてない。
function speechText_domSort(num){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(domSortFormsObjects,function(items){
        for (var i = 0; i < items.length; i++){
            if(items[i].key === selectedDomLayerNum){

//
//
//ホワイトボード参照
//
//


            }
        }
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

