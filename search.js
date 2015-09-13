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
    //重複削除前
    //console.log('linkList:',linkList);
    
    var arrObj = {};
    for(var i=0; i<linkList.length; i++){
        arrObj[linkList[i]['uri']] = linkList[i];
    }
    linkList = [];
    for(var key in arrObj){
        linkList.push(arrObj[key]);
    }
    //重複削除後
    //console.log(linkList,"color:pink");
    linkList.some(function(v,k){
        if(v.text === undefined || v.text === null || v.text == ''){
            linkList.splice(k,1);
        }
    });//textがないリンクを削除する

    return linkList;
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
    
    var arrObj = {};
    for(var i=0; i<imgAltLink.length; i++){
        arrObj[imgAltLink[i]['uri']] = imgAltLink[i];
    } //uriが重複する要素を削除
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
    return headTagsArray;
}
