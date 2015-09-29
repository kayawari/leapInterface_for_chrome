$(function(){
    removeInputTags();
    var linksArray      = removeSameLinkArray();
    var imgAltArray     = removeImgNotAltArray(0);
    var imgNotAltArray  = removeImgNotAltArray(1);
    var headTagsArray   = extractHeadTagsArray();
    var formObjects = {
        links       :linksArray,
        imgAlt      :imgAltArray,
        imgNotAlt   :imgNotAltArray,
        headTags    :headTagsArray
    };
    var topNode = $('body');
    extractDOMTree(topNode,1);
    console.log("%cextract objects with DOM node!!","color:green");
    console.log(all_arr);
    //あとは、chrome.strageにぶち込む

    chrome.storage.local.set(formObjects,function(){
        console.log("%cset extract objects to local storage !!","color:green;");
        //console.log(formObjects);
    });
});

function removeInputTags(){
    $('input,select,form,textarea').each(function(number){
        $(this).remove();
    });
}

$(window).keydown(function(e){
    e.preventDefault();
    if(e.keyCode == 69){
        chrome.runtime.sendMessage({keycode:69},function(response){
            console.log('type E');
        });
    }
    
    if(e.keyCode == 82){
        chrome.runtime.sendMessage({keycode:82},function(response){
            console.log('type R');
        });
    }
    
    if(e.keyCode == 90){
        chrome.runtime.sendMessage({keycode:90},function(response){
            console.log('type Z');
        });
    }
});

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
function extractDOMTree(nodeObject,layerNum){
    var temp_arr = [];
    var nodeObjectChildren = nodeObject.children();
    var nodeLength = nodeObjectChildren.length;

    for(var i=0;i<nodeLength; i++){
        var tag = $(nodeObjectChildren[i]).get(0).tagName;
        console.log(tag);

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
}

//ハッシュのkeyに変数を利用するための関数
//ES6形式に変更？
function hash_key(key,value){
    var h = {};
    h[key] = value;
    return h;
}
