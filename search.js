$(function(){
    //はじめにフォームタグなどを削除
    removeInputTags();
    var linksArray      = removeSameLinkArray();
    var imgAltArray     = removeImgNotAltArray()[0];
    var imgNotAltArray  = removeImgNotAltArray()[1];
    var formObjects = {
        links       :linksArray,
        imgAlt      :imgAltArray,
        imgNotAlt   :imgNotAltArray,
    };
    chrome.storage.local.set(formObjects,function(){
        console.log("%cset form objects to local storage !!","color:green;");
    });

    var headTagsArray   = extractHeadTagsArray();
    var formObjects = {
        headTags    :headTagsArray
    };
    chrome.storage.local.set(formObjects,function(){
        console.log("%cset hTag objects to local storage !!","color:blue;");
    });

    var topNode = $('body');
    var all_arr = extractDOMTree(topNode,1);
    var sortWithDomLayersArray = sortWithDomLayers(all_arr);
    var sortWithDomLayersAndObjectsArray = sortWithDomLayersAndObjects(all_arr);
    var sortFormObject_1 = {
        DOMObjects : sortWithDomLayersArray,
        maxDomLayer: maxDom
    };
    var sortFormObject_2 = {
        DOMObjects : sortWithDomLayersAndObjectsArray,
        maxDomLayer: maxDom
    };
    chrome.storage.local.set(sortFormObject_1,function(){
        console.log("%cset link objects 1 with DOM to local storage !!","color:red;");
    });
    chrome.storage.local.set(sortFormObject_2,function(){
        console.log("%cset link objects 2 with DOM to local storage !!","color:pink;");
    });

    var sortWithDomLayersObjects = extractObjectsFromArray(sortWithDomLayersArray);
    var sortWithDomAndTagsObjects = extractObjectsFromArray(sortWithDomLayersAndObjectsArray);
    var sortWithDom = {
        sortWithDomObjects : sortWithDomLayersObjects,
        tmpNum : 1
    };
    var sortWithDomAndTags = {
        Num : 2,
        sortWithDomAndTagsObjects : sortWithDomAndTagsObjects
    };
    chrome.storage.local.set(sortWithDom,function(){
        console.log("%cset link Array with DOM to local storage !!","color:yellow;");
    });
    chrome.storage.local.set(sortWithDomAndTags,function(){
        console.log("%cset link Array with DOM to local storage !!","color:skyblue;");
    });
});

$(window).keydown(function(e){
    e.preventDefault();

    if(e.keyCode == 49){
        chrome.runtime.sendMessage({keycode:49},function(response){
           //console.log('type 1');
        });
    }
    if(e.keyCode == 50){
        chrome.runtime.sendMessage({keycode:50},function(response){
            //console.log('type 2');
        });
    }
    if(e.keyCode == 51){
        chrome.runtime.sendMessage({keycode:51},function(response){
            //console.log('type 3');
        });
    }
    if(e.keyCode == 52){
        chrome.runtime.sendMessage({keycode:52},function(response){
            //console.log('type 4');
        });
    }
    if(e.keyCode == 53){
        chrome.runtime.sendMessage({keycode:53},function(response){
            //console.log('type 5');
        });
    }
    if(e.keyCode == 54){
        chrome.runtime.sendMessage({keycode:54},function(response){
            //console.log('type 6');
        });
    }
    if(e.keyCode == 55){
        chrome.runtime.sendMessage({keycode:55},function(response){
            //console.log('type 7');
        });
    }
    if(e.keyCode == 56){
        chrome.runtime.sendMessage({keycode:56},function(response){
            //console.log('type 8');
        });
    }

    if(e.keyCode == 69){
        chrome.runtime.sendMessage({keycode:69},function(response){
            //console.log('type E');
        });
    }
    if(e.keyCode == 82){
        chrome.runtime.sendMessage({keycode:82},function(response){
            //console.log('type R');
        });
    }
    if(e.keyCode == 90){
        chrome.runtime.sendMessage({keycode:90},function(response){
            //console.log('type Z');
        });
    }

});

function removeInputTags(){
    $('input,select,form,textarea').each(function(number){
        $(this).remove();
    });
}

function removeSameLinkArray(){
    var linkList = [];
    $("a").each(function(){
        linkList.push({
            "uri"   :$(this).attr("href"),
            "text"  :$(this).text(),
            "title" :$(this).attr("title")
        });
    });
    
    //リンクの重複削除
    var arrObj = {};
    for(var i=0; i<linkList.length; i++){
        arrObj[linkList[i]['uri']] = linkList[i];
    }
    linkList = [];
    for(var key in arrObj){
        linkList.push(arrObj[key]);
    }
    
    //textがないリンク削除
    for(var i=0; i<linkList.length; i++){
        if(!linkList[i].text || linkList[i].text === null || linkList[i].text === undefined || linkList[i].text.length == 0 || linkList[i].text === ""){
            linkList.splice(i,1);
            i--;
        }
    }

    return sortLinkByLengthOfTheSentence(linkList);
}

function removeImgNotAltArray(){
    var imgAltLink      = [],
        imgNotAltLink   = [];
    $('a > img').each(function(){
        if( $(this).attr('alt') !== undefined ){
            imgAltLink.push({
                'uri'   :$(this).attr('href'),
                'text'  :$(this).attr('alt')
            });
        } else {
            imgNotAltLink.push( $(this).attr('href') );
        }
    });
   
    //uriが重複する要素を削除
    var arrObj = {};
    for(var i=0; i<imgAltLink.length; i++){
        arrObj[imgAltLink[i]['uri']] = imgAltLink[i];
    }
    imgAltLink = [];
    for(var key in arrObj){
        imgAltLink.push(arrObj[key]);
    }

    return imgAltLink,imgNotAltLink;
}

function extractHeadTagsArray(){
    var headTagsArray = [];
    $('h1,h2,h3,h4,h5,h6').each(function(){
        headTagsArray.push( $(this).text() );
    });

    //textがないhタグ削除
    for(var i=0; i<headTagsArray.length; i++){
        if(!headTagsArray[i] || headTagsArray[i] === null || headTagsArray[i] === undefined || headTagsArray[i].length == 0 || headTagsArray[i] === ""){
            headTagsArray.splice(i,1);
            i--;
        }
    }

    return sortHTagByLengthOfTheSentence(headTagsArray);
}

function sortHTagByLengthOfTheSentence(processedList){
    var listLength = processedList.length;
    var temp;
    for(var i=0; i<listLength-1; i++){
        for(var j=listLength-1; j>i; j--){
            if( processedList[j-1].length > processedList[j].length ){
                temp = processedList[j-1];
                processedList[j-1] = processedList[j];
                processedList[j] = temp;
            }
        }
    }
    return processedList;
}

function sortLinkByLengthOfTheSentence(processedList){
    var listLength = processedList.length;
    var temp;
    for(var i=0; i<listLength-1; i++){
        for(var j=listLength-1; j>i; j--){
            if( processedList[j-1].text.length > processedList[j].text.length ){
                temp = processedList[j-1];
                processedList[j-1] = processedList[j];
                processedList[j] = temp;
                //bubble sort
            }
        }
    }
    return processedList;
}

var all_arr = [];
var maxDom = 0;//DOMの最深層の数を格納
function extractDOMTree(nodeObject,layerNum){
    var temp_arr = [];
    var nodeObjectChildren = nodeObject.children();
    var nodeLength = nodeObjectChildren.length;

    for(var i=0;i<nodeLength; i++){
        var tag = $(nodeObjectChildren[i]).get(0).tagName;
        //console.log(tag);

        if(tag == 'a' || tag == 'A'){
            temp_arr.push({
                text: $(nodeObjectChildren[i]).text(),
                uri : $(nodeObjectChildren[i]).attr('href')
            });
        }
    }
    if(temp_arr.length != 0){
        all_arr.push(hash_key(layerNum,temp_arr));
    }

    for(var j=0;j<nodeLength;j++){
        if(nodeObjectChildren){
            extractDOMTree($(nodeObjectChildren[j]),layerNum + 1);
        }
    }
    if(maxDom < layerNum) maxDom = layerNum;
    //console.log(maxDom);
    return divideObjectsWithDom(all_arr);
}

//ハッシュのkeyに変数を利用するための関数
//ES6形式に変更？
function hash_key(key,value){
    var h = {};
    h[key] = value;
    return h;
}

//階層毎に分ける
function divideObjectsWithDom(arr){
    var arrLength = arr.length;
    var tmp_all_arr = [];
    for(var domNum = 1; domNum <= maxDom; domNum++){
        var tmpArr = [];
        for(var i=0;i<arrLength;i++){
            for(key in arr[i]){
                if(key == domNum){
                    tmpArr.push(arr[i]);
                }
            }
        }
        tmp_all_arr.push(tmpArr);
    }
    return tmp_all_arr;
}


//ここがひどい.for文のネストがすごい事に.extractedDomTree()に盛り込めるはず。
function sortWithDomLayers(arr){
    var tmp_all_arr = [];
    for(var i=0;i < arr.length; i++){
        var tmpArr = [];
        for(var j=0;j<arr[i].length;j++){
            for(key in arr[i][j]){
                for(var k=0; k<arr[i][j][key].length; k++){
                    tmpArr.push(arr[i][j][key][k]);
                }
            }
        }
        sortLinkByLengthOfTheSentence(tmpArr);
        tmp_all_arr.push(tmpArr);
    }
    return tmp_all_arr;
}

function sortWithDomLayersAndObjects(arr){
    var tmp_all_arr = [];
    for(var i=0;i < arr.length; i++){
        var tmpArr = [];
        for(var j=0;j<arr[i].length;j++){
            for(key in arr[i][j]){
                sortLinkByLengthOfTheSentence(arr[i][j][key]);
                for(var k=0; k<arr[i][j][key].length; k++){
                    tmpArr.push(arr[i][j][key][k]);
                }
            }
        }
        tmp_all_arr.push(tmpArr);
    }
    return tmp_all_arr;
}

function extractObjectsFromArray(arr){
    var tmp_all_arr = [];
    for(var i=0;i<arr.length;i++){
        for(var j=0;j<arr[i].length;j++){
            tmp_all_arr.push(arr[i][j]);
        }
    }
    return tmp_all_arr;
}
