var connected = false; // Boolean: { false: disconnected, true: connected }
var gestureState = 0;  // Number: { 0: none, 1: start, 2: progress }
var leap = null;       // Leap.Controller instance

chrome.browserAction.onClicked.addListener(function() {
    connected = !connected; // toggle state

    if (connected) {
      //Leap.loop({ enableGestures: true }, onframe);
      console.log("接続完了！");
        leap = new Leap.Controller({
                    //host: "127.0.0.1",
                    //port: 6437,
                    enableGestures: true,//ジェスチャ認識を利用するかどうか
                    //frameEventName: "animationFrame",
                    //useAllPlugins: true
                });
        leap.loop(onframe);
    } else {
        // TODO: disconnect impl
        console.log("接続失敗");
        leap.disconnect();
    }
    chrome.browserAction.setBadgeText({ text: connected ? "on" : "off" });
});


function onframe(frame) {
    if (!connected) {
        console.log("接続失敗");
        return;
    }
    var i = 0
    var hand = frame.hands[0];//hand class
    var finger = hand.fingers[0];//fingers class
    var thumbPointable = frame.pointables[0];//Pointable class
    var indexPointable = frame.pointables[1];
    var middlePointable = frame.pointables[2];
    var ringPointable = frame.pointables[3];
    var pinkyPointable = frame.pointables[4];
    //frame.pointable[5]以降は、2本目の手の指の数になる。

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

            //executeScript('console.log(' + thumbSpeed + ');');
            if(fingers.extened && ifin >= 5){
                //If all fingers are extending (true)  && fingers count >= 5.
                
                if(thumbSpeed[1] > 200) {clickToLink(0);}
                else if(indexSpeed[1] > 200) {clickToLink(1);}
                else if(middleSpeed[1] > 200) {clickToLink(2);}
                else if(ringSpeed[1] > 200) {clickToLink(3);}
                else if(pinkySpeed[1] > 200) {clickToLink(4);}

            }
            
            
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
                                    gesture.direction[2]);
                        }
                }
            }
        }
    }   

}

function swipe(x, y, z) {
    if (x < 0) {
        executeScript('document.body.style.backgroundColor = "yellow"');
        executeScript('console.log("swipeLeft");');
    } else {
        executeScript('document.body.style.backgroundColor = "blue"');
        executeScript('console.log("swiprRight");');
    }
}

function clickToLink(linkNum){
    //最初から下一行みたいに、文字列連結すれば、値を送ることは可能。
    executeScript('var linkList = document.getElementsByTagName("a")[' + linkNum + '].href;');
    executeScript('console.log("click to link");');
    executeScript('console.log(linkList);');
    executeScript('location.href = linkList;');
}

function clickFinger(){
    console.log('Link click');
    executeScript('document.link[i]'); 
}

function executeScript(code) {
    chrome.tabs.executeScript(null, {
        code: code
    });
}

