chrome.tabs.executeScript(null, {file:"jquery-2.1.4.js"});
$(function(){
   executeScript('console.log(' + extractFormTagsArray() + ' );');
   executeScript('console.log(' + removeSameLinkArray() + ');');
   executeScript('console.log(' + nullTextLinkArray() + ');');
   /*
    console.log( nullTextLinkArray(0) );
    console.log( nullTextLinkArray(1) );
    console.log( nullTextLinkArray(2) );
    console.log( nullTextLinkArray(3) );
   */
   extractFormTagsArray();
   removeSameLinkArray();
   nullTextLinkArray();

});
//この方法だと、リンクの順番がおかしくならない？いやいいのか？

//リンク先がただの画像ページを抽出　=> 後回しにする
//aタグのhrefの末尾が.pngなどの画像拡張子だったら、消す。（そんな場合のリンクって実際あるのから？
/*
function extractImgHref(){
    var imgHrefList = [];
    $('a').each(function(number,element){
        if( $(element).href 
    
}
*/

function executeScript(code){
    chrome.tabs.executeScript(null, {
        code:code
    });
}

function extractFormTagsArray(){
     var formList = [];
     $('form').each(function(number){
        formList[number] = $(this);
     });
     return formList;
}

function removeSameLinkArray(){
    var linkList = [];
    $('a').each(function(number){
        linkList[number] = $(this).href;
    });
    linkList.filter(function(x,i,self){
        return self.indexOf(x) === i;
    });
    return linkList;
}

function nullTextLinkArray(){
    var TextLinkList = [],
        AltLinkList = [],
        notTextLinkList = [],
        notAltLinkList = [];
        //テキスト、alt属性がないものあるもので分ける。
    $('a').each(function(number, element){
        if( $(element).text() !== undefined ){//effective js 参照
            TextLinkList[number] = $(element).href;
        } else {
            notTextLinkList[number] = $(element).href;
        }
    });
    $('a img').each(function(number, element){
        if( $(element).attr('alt') !== undefined ){//effective js 参照
            AltLinkList[number] = $(element).href;
        } else {
            notAltLinkList[number] = $(element).href;
        }
    });
    return TextLinkList,AltLinkList,notTextLinkList,notAltLinkList;
}


