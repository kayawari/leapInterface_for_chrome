var connected = false; // Boolean: { false: disconnected, true: connected }
var gestureState = 0;  // Number: { 0: none, 1: start, 2: progress }
var leap = null;       // Leap.Controller instance

chrome.browserAction.onClicked.addListener(function() {
    connected = !connected; // toggle state

    if (connected) {
      //Leap.loop({ enableGestures: true }, onframe);
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
        return;
    }
    var i = 0
    var iz = frame.gestures.length;
    var ifin = frame.fingers.length;
    var extendedFingers = 0;

    if(iz > 0){
    for (; i < iz; ++i) {
        var gesture = frame.gestures[i];

        if (gesture.type === "swipe") {
                switch (gesture.state) {
                case "start":
                    if (gestureState === 0) { // avoid chattering
                        gestureState = 1;
                    }
                    break;
                case "update":
                    if (gestureState === 1) { // avoid chattering
                        gestureState = 2;
                    }
                    break;
                case "stop":
                    if (gestureState === 2) { // avoid chattering
                        gestureState = 0;
                        swipe(  gesture.direction[0],
                                gesture.direction[1],
                                gesture.direction[2]);
                    }
                }
            }
        }
    }

    if(ifin > 0){//指が検出されたら、、、
        var hand_data = frame.hands[i];
        var finger_data = frame.fingers[i];
        var pointable_data = frame.pointables[i];
        
        var nameMap = ["thumb", "index","middle", "ring", "pinky"];
        var fingersName = nameMap[finger.type];

        for(var j=0; j < ifin; ++j){
            if(fingers.extended && ifin == 5){//指が開いているかつ、検出された指の数が5のとき。
                console.log(gesture.pointableIds);
                switch(gesture.pointableIds){
                    //各指の検出って、switchの番号振り分けで可能なのだろうか
                    case 0:
                        if(gesture.type === "keytap" || gesture.type === "screentap"){
                            
                        }
                    break;
                    case 1:
                        if(gesture.type === "keytap" || gesture.type === "screentap"){
                            
                        }
                    break;
                    case 2:
                        if(gesture.type === "keytap" || gesture.type === "screentap"){
                            
                        }
                    break;
                    case 3:
                        if(gesture.type === "keytap" || gesture.type === "screentap"){
                            
                        }
                    break;
                    case 4:
                        if(gesture.type === "keytap" || gesture.type === "screentap"){
                            
                        }
                    break;
                }
                
            }
        }
    }
}

function swipe(x, y, z) {
    if (x < 0) {
        console.log("swipeLeft");
        executeScript('document.body.style.backgroundColor = "yellow"');
    } else {
        console.log("swipeRight");
        executeScript('document.body.style.backgroundColor = "blue"');
    }
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

