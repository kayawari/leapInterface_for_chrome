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

chrome.browserAction.onClicked.addListener(function() {
    connected = !connected; // toggle state
    if (connected) {
      //Leap.loop({ enableGestures: true }, onframe);
        executeScript('console.log("接続完了！");'); 
        chrome.storage.local.get(formsObjects,function(items){
            executeScript('console.log(' + JSON.stringify(items) + ');');
            formsObjectsLinksLength = items.links.length;
        });
        speechText();//音声案内
        
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
    var i = 0;
    var hand = frame.hands[0];//hand class
    var finger = hand.fingers[0];//fingers class
    var thumbPointable = frame.pointables[0];//Pointable class
    var indexPointable = frame.pointables[1];
    var middlePointable = frame.pointables[2];
    var ringPointable = frame.pointables[3];
    var pinkyPointable = frame.pointables[4];
    //frame.pointable[5]以降は、2本目の手の指の数になる。
    var fingersNum = 5;
    var iges = frame.gestures.length;
    var ifin = frame.fingers.length;//The number of th finger

    if(iges > 0){
        for (; i < iges; ++i) {
            var gesture = frame.gestures[i];
            var thumbSpeed = thumbPointable.tipVelocity;
            var indexSpeed = indexPointable.tipVelocity;
            var middleSpeed = middlePointable.tipVelocity;
            var ringSpeed = ringPointable.tipVelocity;
            var pinkySpeed = pinkyPointable.tipVelocity;
                
            if(thumbSpeed[1] > 350) clickToLink(fingersNum,0);
            if(indexSpeed[1] > 350) clickToLink(fingersNum,1);
            if(middleSpeed[1] > 350) clickToLink(fingersNum,2);
            if(ringSpeed[1] > 350) clickToLink(fingersNum,3);
            if(pinkySpeed[1] > 350) clickToLink(fingersNum,4);
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
            /*
            if(gesture.type === "circle"){
                executeScript('history.back();');
            }*/
            
        }
    }   

}

function swipe(x, y, z, listNum) {
    executeScript('console.log("swipe!!");');
    if (x < 0) {
        previousLinkSelecting(takeLinksList);
    } else {
        nextLinkSelecting(listNum);
    }
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
            executeScript('console.log("clickToLink : "' + clickedURIText.toString() + ');');
            speechText.onend = function(e){
                clickFlag = true;
            };
        });
    }
}

function nextLinkSelecting( listNum ){
    if(formsObjectsLinksLength > takeLinksList){
        executeScript('console.log("Refresh next link!!");');
        takeLinksList = listNum + 5;
    }
    speechText();
}

//スワイプ左は、history.backに利用しているので、他のジェスチャが必要。
function previousLinkSelecting( listNum ){
    if(takeLinksList > 0){
        executeScript('console.log("Refresh previous link!!");');
        takeLinksList = listNum - 5;
    }
    speechText();
}

function executeScript(code){
    chrome.tabs.executeScript(null, {
        code:code
    });
}

function speechText(){
    var count = takeLinksList;
    var speechText = [];//speechの再生を順に行うため、一度配列に格納
    chrome.storage.local.get(formsObjects,function(items){
        for(var i = count,j = 0; i < count + 5; i++,j++){
            speechText.push( new SpeechSynthesisUtterance(items.links[i].text.toString()) );
            executeScript('console.log("' + items.links[i].text.toString() + '");');
            speechText[j].lang = 'ja-JP';
            speechSynthesis.speak(speechText[j]);
        }
    });
}


