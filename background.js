//jquery 2.x.x not supporting IE 6,7,8
var takeDomSortList_2 = 0;
var takeSortList_2 = 0;

//chrome.local.storageのJSONフォーマット
//下二つのオブジェクト。なぜか形式を変えないと上書きされてしまうので、tmpNum,Numを無理やり追加
var domSortFormsObjects_2 = {
	DOMObjects :[],
	maxDomLayer:0
};
var sortWithDomAndTags = {
	sortWithDomAndTagsObjects : []
};

var clickFlag = true;

//クリックされたキーを識別する変数
var clickSwitcher = 1;
//dom階層選択変数
var selectedDomLayerNum = 1;
//取得階層の最大値
var maxDomLayerNum;

chrome.browserAction.onClicked.addListener(function() {
	executeScript('console.log("プログラム開始");');
	chrome.browserAction.setBadgeText({ text: connected ? "on" : "off" });
});

chrome.runtime.onMessage.addListener(function(req,sen,sendRes){
    if(req.keycode == 49){//type '1'
    	clickSwitcher       = 1;
    takeDomSortList_2   = 0;
        //階層内のリンクを選ぶ変数をキーを押した段階でリセット
        selectedDomLayerNum = 0;
        chrome.storage.local.get(domSortFormsObjects_2,function(items){
        	executeScript('console.log('+JSON.stringify(items)+');');
            //DOM階層の最大値を格納
        	maxDomLayerNum = items.maxDomLayer;
            speechText_normal('階層を選択してください。');
            speechText_normal('全部で' + maxDomLayerNum + '階層あります。');
        })
    }
    if(req.keycode == 50){//type '2'
    	clickSwitcher = 2;
    takeDomSortList_2 = 0;
    chrome.storage.local.get(sortWithDomAndTags,function(items){
    	executeScript('console.log('+JSON.stringify(items.sortWithDomAndTagsObjects)+');');
    });
    speechText_sortLinks_2(takeDomSortList_2);
}
    if(req.keycode == 51){//type '3'
    	if(clickSwitcher == 1){
    		minusDomLayerNum();
    	}else{
    		executeScript('console.log("DOM選択モードになっていません。");');
    		speechText_normal('DOM選択モードになっていません');
    	}
    }
    if(req.keycode == 52){//type '4'
    	if(clickSwitcher == 1){
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

function plusDomLayerNum(){
	takeSortList_2 = 0;
	if(selectedDomLayerNum < maxDomLayerNum) {
		selectedDomLayerNum++;
		speechText_normal('現在の階層は'+selectedDomLayerNum+'番目です');
	}else{
		speechText_normal('これ以上、深い階層はありません。');
	}
}

function minusDomLayerNum(){
	takeSortList_2 = 0;
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
    if( takeDomSortList_2 > 0 || takeSortList_2 > 0 ){
    	switchSpeechText(-1);
    }
}

function switchSpeechText(selectNum){
    //selectNumは、-1か+1のどちらか
    if(clickSwitcher === 1) { speechText_domSort_2(selectNum); }
    if(clickSwitcher === 2) { speechText_sortLinks_2(selectNum);}
}

function speechText_normal(str){
	var msg = new SpeechSynthesisUtterance();
	msg.text = str;
	msg.lang = 'ja-JP';
	executeScript('console.log("' + msg.text + '");');
	speechSynthesis.speak(msg);
}

var speech_flag = true;
function speechText_sortLinks_2(selectNum){
	confirmStausOfSpeechsynthesis();
	if(speech_flag){
		speech_flag = false;
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

            msg.onend = function(e){
				speech_flag= true;
			};
		});
	}
}

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
