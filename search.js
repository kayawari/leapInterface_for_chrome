$(function(){
    removeInputTags();
    var linksArray       = removeSameLinkArray();
    var textLinksArray   = nullTextLinkArray();
    var formObjects = {
        links           : linksArray,
        notTextLinks    : textLinksArray
    };
    chrome.storage.sync.set(formObjects,function(){
        console.log("%cset extract objects to chrome storage !!","color:green;");
    });
});

function removeInputTags(){
    $('input,select,form,textarea').each(function(number){
        $(this).remove();
    });
}

function removeSameLinkArray(){
    var linkList = [];
    $("a").each(function(){
        linkList.push( $(this).attr("href") );
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

//リンク先がただの画像ページを抽出　=> 後回しにする
//aタグのhrefの末尾が.pngなどの画像拡張子だったら、消す。（そんな場合のリンクって実際あるのから？
/*
function extractImgHref(){
    var imgHrefList = [];
    $('a').each(function(number,element){
        if( $(element).href 
    
}
*/
