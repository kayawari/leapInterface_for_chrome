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
                    enableGestures: true,
                  //frameEventName: "animationFrame"
                });
        leap.loop(onframe);
    } else {
        // TODO: disconnect impl
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
    var iges = frame.gestures.length;
    var ifin = frame.fingers.length;
    var extendedFingers = 0;

    if(iges > 0){
        for (; i < iges; ++i) {
            var gesture = frame.gestures[i];

            if(gesture.type === "keyTap" || gesture.type === "screenTap") {
                clickToLink();             
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

/*
    //if(ifin > 0){指が検出されたら、、、
        var hand_data = frame.hands[i];
        var finger_data = frame.fingers[i];
        var pointable_data = frame.pointables[i];
        console.log('ここから、追加情報');
        var nameMap = ["thumb", "index","middle", "ring", "pinky"];
        var fingersName = nameMap[finger.type];

        for(var j=0; j < ifin; ++j){
                console.log(gesture.pointableIds);
                
                //if(finger.type === 0){
                //fingersName = nameMap[finger.type];
                    console.log(fingersName);
                    if(gesture.type === 'keytap' || gesture.type === 'screentap'){
                        console.log('ここから、追加情報');
                        console.log(gesture.pointableIds);
                    }
                //}
        }
    //}
*/

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

function clickToLink(){
    var linkList;
    executeScript('var linkList = document.getElementsByTagName("a")[1].href;');
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

