//jquery 2.x.x not supporting IE 6,7,8
var takeLinksList   = 0;
var takeHTagList    = 0;
var takeDomSortList_1 = 0;
var takeDomSortList_2 = 0;
var takeSortList_1 = 0;
var takeSortList_2 = 0;

var formsObjects = {
    links       :[]
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

//下二つのオブジェクト。なぜか形式を変えないと上書きされてしまうので、tmpNum,Numを無理やり追加
var sortWithDom = {
    sortWithDomObjects : [],
    tmpNum : 0
};
var sortWithDomAndTags = {
    Num : 0,
    sortWithDomAndTagsObjects : []
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
        takeLinksList = 0;
        chrome.storage.local.get(formsObjects,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            //formsObjectsLinksLength = items.links.length;
        });
        speechText_links(takeLinksList);
    }
    if(req.keycode == 50){//type '2'
        clickSwitcher = 2;
        takeHTagList = 0;
        chrome.storage.local.get(hTagFormsObjects,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            //formsObjectsLinksLength = items.links.length;
        });
        speechText_hTags(takeHTagList);
    }
    if(req.keycode == 51){//type '3'
        clickSwitcher = 3;
        takeDomSortList_1 = 0;
        selectedDomLayerNum = 0;
        chrome.storage.local.get(domSortFormsObjects_1,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            //formsObjectsLinksLength = items.links.length;
            maxDomLayerNum = items.maxDomLayer;
        });
        speechText_normal('階層を選択してください。');
        speechText_normal(maxDomLayerNum + '階層あります。');
    }
    if(req.keycode == 52){//type '4'
        clickSwitcher       = 4;
        //クリックされたキーを識別する変数
        takeDomSortList_2   = 0;
        //階層内のリンクを選ぶ変数をキーを押した段階でリセット
        selectedDomLayerNum = 0;
        //dom階層選択変数
        chrome.storage.local.get(domSortFormsObjects_2,function(items){
            executeScript('console.log('+JSON.stringify(items)+');');
            maxDomLayerNum = items.maxDomLayer;
            //DOM階層の最大値を格納
        })
        speechText_normal('階層を選択してください。');
        speechText_normal(maxDomLayerNum + '階層あります。');
    }

    if(req.keycode == 53){//type '5'
        clickSwitcher = 5;
        takeDomSortList_1 = 0;
        chrome.storage.local.get(sortWithDom,function(items){
            executeScript('console.log('+JSON.stringify(items.sortWithDomObjects)+');');
        });
        speechText_sortLinks_1(takeDomSortList_1);
    }
    if(req.keycode == 54){//type '6'
        clickSwitcher = 6;
        takeDomSortList_2 = 0;
        chrome.storage.local.get(sortWithDomAndTags,function(items){
            executeScript('console.log('+JSON.stringify(items.sortWithDomAndTagsObjects)+');');
        });
        speechText_sortLinks_2(takeDomSortList_2);
    }
    if(req.keycode == 55){//type '7'
        if(clickSwitcher == 3 || clickSwitcher == 4){
            minusDomLayerNum();
        }else{
            executeScript('console.log("DOM選択モードになっていません。");');
            speechText_normal('DOM選択モードになっていません');
        }
    }
    if(req.keycode == 56){//type '8'
        if(clickSwitcher == 3 || clickSwitcher == 4){
            plusDomLayerNum();
        }else{
            executeScript('console.log("DOM選択モードになっていません。");');
            speechText_normal('DOM選択モードになっていません');
        }
    }


    if(req.keycode == 69){//type 'E'
        previousLinkSelecting();
    }
    if(req.keycode == 82){//type 'R'
        nextLinkSelecting();
    }
    if(req.keycode == 90){//type 'Z'
        clickToLink();

        //これがまだできてない。
    }
});

function clickToLink(){
    if(clickSwitcher == 2) return 0;
    if(clickFlag){
       clickFlag = false;
       var speechText = new SpeechSynthesisUtterance();
       speechText.lang = 'JP-ja';

       if(clickSwitcher == 1){
                 var clickedURINumber = takeLinksList;
                 chrome.storage.local.get(formsObjects,function(items){
                    var clickedURIText  = items.links[clickedURINumber].text;
                    var clickedURI      = items.links[clickedURINumber].uri;
                    speechText.text = clickedURIText.toString();
                    speechSynthesis.speak(speechText);
                    executeScript('location.href="' + clickedURI.toString() + '";');
                 });
        }
 
       if(clickSwitcher == 3){
                 var clickedURINumber = takeSortList_1;
                 chrome.storage.local.get(takeSortList_1,function(items){
                    var clickedURIText  = items.DOMObjects[selectedDomLayerNum][clickedURINumber].text;
                    var clickedURI      = items.DOMObjects[selectedDomLayerNum][clickedURINumber].uri;
                    speechText.text = clickedURIText.toString();
                    speechSynthesis.speak(speechText);
                    executeScript('location.href="' + clickedURI.toString() + '";');
                 });
        }

         if(clickSwitcher == 4){
                 var clickedURINumber = takeSortList_2;
                 chrome.storage.local.get(takeSortList_2,function(items){
                    var clickedURIText  = items.DOMObjects[selectedDomLayerNum][clickedURINumber].text;
                    var clickedURI      = items.DOMObjects[selectedDomLayerNum][clickedURINumber].uri;
                    speechText.text = clickedURIText.toString();
                    speechSynthesis.speak(speechText);
                    executeScript('location.href="' + clickedURI.toString() + '";');
                 });
         }

         if(clickSwitcher == 5){
                 var clickedURINumber = takeDomSortList_1;
                 chrome.storage.local.get(takeDomSortList_1,function(items){
                    var clickedURIText  = items.sortWithDomObjects[selectedDomLayerNum][clickedURINumber].text;
                    var clickedURI      = items.sortWithDomObjects[selectedDomLayerNum][clickedURINumber].uri;
                    speechText.text = clickedURIText.toString();
                    speechSynthesis.speak(speechText);
                    executeScript('location.href="' + clickedURI.toString() + '";');
                 });
         }
         if(clickSwitcher == 6){
                 var clickedURINumber = takeDomSortList_2;
                 chrome.storage.local.get(takeDomSortList_2,function(items){
                    var clickedURIText  = items.sortWithDomAndTagsObjects[selectedDomLayerNum][clickedURINumber].text;
                    var clickedURI      = items.sortWithDomAndTagsObjects[selectedDomLayerNum][clickedURINumber].uri;
                    speechText.text = clickedURIText.toString();
                    speechSynthesis.speak(speechText);
                    executeScript('location.href="' + clickedURI.toString() + '";');
                 });
        }

        speechText.onend = function(e){
            clickFlag = true;
        };

    }

}

function plusDomLayerNum(){
    takeDomSortList_1 = 0;
    takeDomSortList_2 = 0;
    if(selectedDomLayerNum < maxDomLayerNum) {
        selectedDomLayerNum++;
        speechText_normal('現在の階層は'+selectedDomLayerNum+'番目です');
    }else{
        speechText_normal('これ以上、深い階層はありません。');
    }
}

function minusDomLayerNum(){
    takeDomSortList_1 = 0;
    takeDomSortList_2 = 0;
    if(selectedDomLayerNum > 0) {
        selectedDomLayerNum--;
        speechText_normal('現在の階層は'+selectedDomLayerNum+'番目です');
    }else{
        speechText_normal('一番浅い階層です。');
    }
}

function nextLinkSelecting(){
    //executeScript('console.log("next link or text.");');
    switchSpeechText(1);
}

function previousLinkSelecting(){
    //executeScript('console.log("previous link or text.");');
    if( takeLinksList       > 0 || 
        takeHTagList        > 0 || 
        takeDomSortList_1   > 0 || 
        takeDomSortList_2   > 0 || 
        takeSortList_1      > 0 || 
        takeSortList_2      > 0 ){ switchSpeechText(-1);}
}

function switchSpeechText(selectNum){
    //selectNumは、-1か+1のどちらか
    if(clickSwitcher === 1) { speechText_links(selectNum); }
    if(clickSwitcher === 2) { speechText_hTags(selectNum); }
    if(clickSwitcher === 3) { speechText_domSort_1(selectNum); }
    if(clickSwitcher === 4) { speechText_domSort_2(selectNum); }
    if(clickSwitcher === 5) { speechText_sortLinks_1(selectNum); }
    if(clickSwitcher === 6) { speechText_sortLinks_2(selectNum);}
}

function speechText_normal(str){
    var msg = new SpeechSynthesisUtterance();
    msg.text = str;
    msg.lang = 'ja-JP';
    executeScript('console.log("' + msg.text + '");');
    speechSynthesis.speak(msg);
}

function speechText_links(selectNum){
    confirmStausOfSpeechsynthesis();

    chrome.storage.local.get(formsObjects,function(items){
        if(takeLinksList < items.links.length && takeLinksList >= 0){
            takeLinksList = takeLinksList + selectNum;
        } else {
            executeScript('console.log("'+takeLinksList+'")');
            takeLinksList--;
        }
        var msg = new SpeechSynthesisUtterance();
        msg.text = items.links[takeLinksList].text.toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    });
}

function speechText_hTags(selectNum){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(hTagFormsObjects,function(items){
        if(takeHTagList < items.headTags.length && takeHTagList >= 0){
            takeHTagList = takeHTagList + selectNum;
        } else {
            executeScript('console.log("'+takeHTagList+'")');
            takeHTagList--;
        }
        var msg = new SpeechSynthesisUtterance();
        msg.text = items.headTags[takeHTagList].toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    });
}

function speechText_sortLinks_1(selectNum){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(sortWithDom,function(items){
        if(takeDomSortList_1 < items.sortWithDomObjects.length && takeDomSortList_1 >= 0){
            takeDomSortList_1 = takeDomSortList_1 + selectNum;
        } else {
            executeScript('console.log("'+takeDomSortList_1+'")');
            takeDomSortList_1--;
        }
        var msg = new SpeechSynthesisUtterance();
        msg.text = items.sortWithDomObjects[takeDomSortList_1].text.toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    });
}

function speechText_sortLinks_2(selectNum){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(sortWithDomAndTags,function(items){
        if(takeDomSortList_2 < items.sortWithDomAndTagsObjects.length && takeDomSortList_2 >= 0){
            takeDomSortList_2 = takeDomSortList_2 + selectNum;
        } else {
            executeScript('console.log("'+takeDomSortList_2+'")');
            takeDomSortList_2--;
        }
        var msg = new SpeechSynthesisUtterance();
        msg.text = items.sortWithDomAndTagsObjects[takeDomSortList_2].text.toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    });
}

function speechText_domSort_1(selectNum){
    confirmStausOfSpeechsynthesis();
    chrome.storage.local.get(domSortFormsObjects_1,function(items){
        if(items.DOMObjects[selectedDomLayerNum].length == 0){
            speechText_normal('この階層にリンクはありません');
            return;
        }
        if(takeSortList_1 < items.DOMObjects[selectedDomLayerNum].length && takeSortList_1 >= 0){
            takeSortList_1 = takeSortList_1 + selectNum;
        } else {
            executeScript('console.log("'+takeSortList_1+'")');
            takeSortList_1--;
        }
        var msg = new SpeechSynthesisUtterance();
        msg.text = items.DOMObjects[selectedDomLayerNum][takeSortList_1].text.toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
    });
}

var speech_flag = true;
function speechText_domSort_2(selectNum){
	confirmStausOfSpeechsynthesis();
	if(speech_flag){
		speech_flag = false;
		chrome.storage.local.get(domSortFormsObjects_2,function(items){
			if(items.DOMObjects[selectedDomLayerNum].length == 0){
				speechText_normal('この階層にリンクはありません');
                speech_flag = true;
				return;
			}
			if(takeSortList_2 < items.DOMObjects[selectedDomLayerNum].length && takeSortList_2 >= 0){
				takeSortList_2 = takeSortList_2 + selectNum;
			} else {
				executeScript('console.log("'+takeSortList_2+'")');
				takeSortList_2--;
			}
			var msg = new SpeechSynthesisUtterance();
			msg.text = items.DOMObjects[selectedDomLayerNum][takeSortList_2].text.toString();
			executeScript('console.log("' + msg.text + '");');
			msg.lang = 'ja-JP';
			speechSynthesis.speak(msg);

			msg.onend = function(e){
				speech_flag= true;
			};
		});
	}
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
