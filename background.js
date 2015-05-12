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
    var i = 0, iz = frame.gestures.length;

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
                    swipe(gesture.direction[0],
                          gesture.direction[1],
                          gesture.direction[2]);
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

function executeScript(code) {
    chrome.tabs.executeScript(null, {
        code: code
    });
}

