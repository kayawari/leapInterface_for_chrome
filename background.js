//jquery 2.x.x not supporting IE 6,7,8
var connected = false; // Boolean: { false: disconnected, true: connected }
var gestureState = 0;  // Number: { 0: none, 1: start, 2: progress }
var leap = null;       // Leap.Controller instance
var takeLinksList = 0;//リンクを指の本数分取得するが、そのスタートの番号...
//五本指操作を検討したプログラム
var formsObjects = {
    links       :[],
    imgAlt      :[],
    imgNotAlt   :[],
    headTags    :[]
};
var formsObjectsLinksLength = 0;
var clickFlag = true;
var swipeFlag = true;

chrome.browserAction.onClicked.addListener(function() {
    connected = !connected; // toggle state
    if (connected) {
      //Leap.loop({ enableGestures: true }, onframe);
        executeScript('console.log("接続完了！");'); 
        chrome.storage.local.get(formsObjects,function(items){
            executeScript('console.log(' + JSON.stringify(items) + ');');
            formsObjectsLinksLength = items.links.length;
        });
        speechText(1);//変更点

        leap = new Leap.Controller({
                    //host: "127.0.0.1",
                    //port: 6437,
                    enableGestures: true//,ジェスチャ認識を利用するかどうか
                    //frameEventName: "animationFrame",
                    //useAllPlugins: true
                });
        //chrome.tabs.executeScript(null, {file:"search.js"});
        leap.loop(onframe);
    } else {
        // TODO: disconnect impl
        executeScript("console.log('接続失敗');");
        leap.disconnect();
    }
    chrome.browserAction.setBadgeText({ text: connected ? "on" : "off" });
});


function onframe(frame) {
    if (!connected) {
        console.log("接続失敗");
        return;
    }
    var hand            = frame.hands[0];//hand class
    var finger          = hand.fingers[0];//fingers class
    var thumbPointable  = frame.pointables[0];//Pointable class
    var indexPointable  = frame.pointables[1];
    var middlePointable = frame.pointables[2];
    var ringPointable   = frame.pointables[3];
    var pinkyPointable  = frame.pointables[4];
    //frame.pointable[5]以降は、2本目の手の指の数になる。
    var fingersNum      = 5;
    var iges            = frame.gestures.length;
    var ifin            = frame.fingers.length;//The number of th finger

    var i = 0;
    if(iges > 0){
        for (; i < iges; ++i) {
            var gesture     = frame.gestures[i];
            var thumbSpeed  = thumbPointable.tipVelocity;
            var indexSpeed  = indexPointable.tipVelocity;
            var middleSpeed = middlePointable.tipVelocity;
            var ringSpeed   = ringPointable.tipVelocity;
            var pinkySpeed  = pinkyPointable.tipVelocity;
                
            if(thumbSpeed[1]    > 350) clickToLink(fingersNum,0);
            if(indexSpeed[1]    > 350) clickToLink(fingersNum,1);
            if(middleSpeed[1]   > 350) clickToLink(fingersNum,2);
            if(ringSpeed[1]     > 350) clickToLink(fingersNum,3);
            if(pinkySpeed[1]    > 350) clickToLink(fingersNum,4);
            //マイナス方向も判定に入れる？　＋　正確な値にするべきかも。

            if(gesture.type === "swipe"){
                switch(gesture.state){
                    case "start":
                        if(gestureState === 0){
                            gestureState = 1;
                        }
                        break;
                    case "update":
                        if(gestureState === 1){
                            gestureState = 2;
                        }
                        break;
                    case "stop":
                        if(gestureState === 2){
                            gestureState = 0;
                            swipe(  gesture.direction[0],
                                    gesture.direction[1],
                                    gesture.direction[2],
                                    takeLinksList );
                        }
                }
            }
            //if(gesture.type === "circle"){ executeScript('history.back();'); }
        }
    }   
}

function swipe(x, y, z, listNum) {
    executeScript('console.log("swipe!!");');
    if(x > 0){ 
        nextLinkSelecting(listNum);
    }else{
        previousLinkSelecting(listNum);
    }
    
    if(y > 200 || y < 200){ recAPI(x,y); } 
}

function clickToLink( fingersNum, fingersValue ){
    if(clickFlag){
        clickFlag = false;
        var clickedURINumber = fingersValue + takeLinksList;
        var speechText = new SpeechSynthesisUtterance();
        speechText.lang = 'JP-ja';
        chrome.storage.local.get(formsObjects,function(items){
            var clickedURIText  = items.links[clickedURINumber].text;
            var clickedURI      = items.links[clickedURINumber].uri;
            speechText.text = clickedURIText.toString();
            speechSynthesis.speak(speechText);
            executeScript('location.href="' + clickedURI.toString() + '";');

            speechText.onend = function(e){ clickFlag = true; };
        });
    }
}

//実験１：５つずつ
//実験２：１つずつ
//実験３：見出し
//実験４：マウス
//
//実験1,2,3では、speechText()の引数の値を１or５に変更する
//実験1,2,3では、saikiCount()の引数の値を1or5に変更する
//注意！！ ===> 最初に呼び出すspeechTextの値を変更することも忘れずに。
function nextLinkSelecting( listNum ){
    executeScript('console.log("Refresh next link!!");');
    
    //実験1
    //takeLinksList = listNum + 5;
    
    //実験2,3
    takeLinksList = listNum + 1;

    speechText(1);//変更点
}

function previousLinkSelecting( listNum ){
    executeScript('console.log("Refresh previous link!!");');

    //実験1
    //takeLinksList = listNum - 5;
    
    //実験2,3
    takeLinksList = listNum - 1;
    
    speechText(1);//変更点
}

var saikiCount = 1;//変更点
function speechText(num){
    var count = takeLinksList;
    var i = count + num;
    chrome.storage.local.get(formsObjects,function(items){
        var msg = new SpeechSynthesisUtterance(items.links[i].text.toString());
        //var msg = new SpeechSynthesisUtterance(items.headTags[i].toString());
        msg.text = items.links[i].text.toString();
        //msg.text = items.headTags[i].toString();
        executeScript('console.log("' + msg.text + '");');
        msg.lang = 'ja-JP';
        speechSynthesis.speak(msg);
        msg.onend = function(e){
            if(saikiCount > 1){
                saikiCount--;
                speechText(num - 1);
            }else{
                saikiCount = 1;//変更点
                return -1;
            }
        }
    });
}
/*
function speechText(){
    var count = takeLinksList;
    var speechText = []; //speechの再生を順に行うため、一度配列に格納
    chrome.storage.local.get(formsObjects,function(items){
        
        //実験1
        for(var i = count,j = 0; i < count + 5; i++,j++){
        
        //実験2,3
        //for(var i = count,j = 0; i < count + 1; i++,j++){
            
            //実験1,2
            speechText.push( new SpeechSynthesisUtterance(items.links[i].text.toString()) );
            executeScript('console.log("' + items.links[i].text.toString() + '");');

            //実験3
            //speechText.push( new SpeechSynthesisUtterance(items.headTags[i].toString()) );
            //executeScript('console.log("' + items.headTags[i].toString() + '");');
            
            speechText[j].lang = 'ja-JP';
            speechSynthesis.speak(speechText[j]);
            speechText[j].onend = function(e){

        }
    });
}
*/

//=====================================================================
//=====================================================================
//=====================================================================

function executeScript(code){
    chrome.tabs.executeScript(null, {
        code:code
    });
}

var tabCount = 0;
//タブキーによる音声案内
$(window).keydown(function(e){
    //e.preventDefault();
    if(e.keyCode === 9){
        chrome.storage.local.get(formsObjects,function(items){
            var speechText = new SpeechSynthesisUtterance();
            speechText.lang = 'ja-JP';
            speechText.text = items.links[tabCount].text.toString();
            speechSynthesis.speak(speechText);
        });
    }
    //tabで一つ前のワードに戻る機能も追加する 
});

function recAPI(x,y){
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
                    var recText = results[i][0].transcript.toString();
                    var localStorageText = items.links[j].text.toString();
                    if( localStorageText.indexOf(recText,0) > 0 ){
                        searchResults.push(items.links[j].text);
                    }
                }
            }
        });
        //検索した文字列の音声解析
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

