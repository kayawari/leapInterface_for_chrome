//jquery 2.x.x not supporting IE 6,7,8
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

//クリックされたキーを識別する変数
var clickSwitcher = 1;
//dom階層選択変数
var selectedDomLayerNum = 0;
//取得階層の最大値
var maxDomLayerNum;
var speech_flag = true;
var click_flag = true;

chrome.browserAction.onClicked.addListener(function() {
	executeScript('console.log("プログラム開始");');
	chrome.browserAction.setBadgeText({ text: connected ? "on" : "off" });
});

chrome.runtime.onMessage.addListener(function(req,sen,sendRes){
    if(req.keycode == 49){//type '1'
    	clickSwitcher       = 1;
        takeSortList_2   = 0;
        //階層内のリンクを選ぶ変数をキーを押した段階でリセット
        selectedDomLayerNum = 0;
        chrome.storage.local.get(domSortFormsObjects_2,function(items){
        	executeScript('console.log('+JSON.stringify(items)+');');
            //DOM階層の最大値を格納
        	maxDomLayerNum = items.maxDomLayer;
            speechText_normal('全部で' + maxDomLayerNum + '階層あります。');
        });
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
    if(req.keycode == 84){//type 'T'
    	nowLinkSelecting();
    }
    if(req.keycode == 90){//type 'Z'
    	clickToLink();

        //これがまだできてない。
    }
});

function plusDomLayerNum(){
	if(click_flag){
        click_flag = false;
        var msg = new SpeechSynthesisUtterance();
        if(selectedDomLayerNum < maxDomLayerNum-1) {
		    selectedDomLayerNum++;
    	    takeSortList_2 = 0;
	    
            var layerNum = selectedDomLayerNum + 1;
            msg.text = '階層' + layerNum  + '番目';
            msg.lang = 'ja-JP';
            speechSynthesis.speak(msg);
            executeScript('console.log("' + msg.text + '");');
            msg.onend = function(e){
                click_flag = true;
            };
    	}else{
            msg.text = 'これ以上深い階層はないです';
            msg.lang = 'ja-JP';
            speechSynthesis.speak(msg);
            executeScript('console.log("' + msg.text + '");');
            msg.onend = function(e){
                click_flag = true;
            };
	    }
    }
}

function minusDomLayerNum(){
	if(click_flag){
        click_flag = false;
        var msg = new SpeechSynthesisUtterance();
        var layerNum = selectedDomLayerNum + 1;
    	if(selectedDomLayerNum > 0) {
	    	selectedDomLayerNum--;
	        takeSortList_2 = 0;
			
            msg.text = '階層' + layerNum  + '番目';
            msg.lang = 'ja-JP';
            speechSynthesis.speak(msg);
            executeScript('console.log("' + msg.text + '");');
            msg.onend = function(e){
                click_flag = true;
            };
	    }else{
            msg.text = '階層' + layerNum  + '番目';
            msg.lang = 'ja-JP';
            speechSynthesis.speak(msg);
            executeScript('console.log("' + msg.text + '");');
            msg.onend = function(e){
                click_flag = true;
            };
	    }
    }
}

function nextLinkSelecting(){
	if(click_flag){
        click_flag = false;
        switchSpeechText(1);
        click_flag = true;
    }
}

function previousLinkSelecting(){
	if(click_flag){
        click_flag = false;
        if( takeSortList_2 > 0 ){
        	switchSpeechText(-1);
        }
        click_flag = true;
    }
}

function nowLinkSelecting(){
	if(click_flag){
        click_flag = false;
        if( takeSortList_2 > 0 ){
        	switchSpeechText(0);
        }
        click_flag = true;
    }
}

function switchSpeechText(selectNum){
    //selectNumは、-1か+1のどちらか
    if(clickSwitcher === 1) { speechText_domSort_2(selectNum); }
    if(clickSwitcher === 2) { speechText_sortLinks_2(selectNum);}
}

function speechText_normal(str){
    if(speech_flag){
		speech_flag = false;
        var msg = new SpeechSynthesisUtterance();
        msg.text = str;
        msg.lang = 'ja-JP';
        executeScript('console.log("' + msg.text + '");');
        speechSynthesis.speak(msg);
        msg.onend = function(e){
			speech_flag= true;
		};
    }
}

var flag = true;
function speechText_domSort_2(selectNum){
	confirmStausOfSpeechsynthesis();
	if(flag){
		flag = false;
		chrome.storage.local.get(domSortFormsObjects_2,function(items){
			if(items.DOMObjects[selectedDomLayerNum].length === 0){
				speechText_normal('この階層にリンクはありません');
				flag = true;
				return;
			}
			
            takeSortList_2 = takeSortList_2 + selectNum;
			
            if(0 <= takeSortList_2 && takeSortList_2 < items.DOMObjects[selectedDomLayerNum].length){
			    var msg = new SpeechSynthesisUtterance();
                msg.text = items.DOMObjects[selectedDomLayerNum][takeSortList_2].text.toString();
                executeScript('console.log("' + msg.text + '");');
                msg.lang = 'ja-JP';
                speechSynthesis.speak(msg);

                msg.onend = function(e){
                    flag= true;
                };
            } else {
				speechText_normal('キーワードなし');
                takeSortList_2--;
                flag = true;
			}
		});
	}
}

function confirmStausOfSpeechsynthesis(){
	if(!'SpeechSynthesisUtterance' in window ){
		alert('web speech APIに未対応');
		return;
	}
}

function executeScript(code){
	chrome.tabs.executeScript(null, {
		code:code
	});
}
