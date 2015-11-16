$(function(){
	var topNode = $('body');
	var all_arr = extractDOMTree(topNode,1);
	var sortWithDomLayersAndObjectsArray = sortWithDomLayersAndObjects(all_arr);
	
	chrome.storage.local.set({ DOMObjects : sortWithDomLayersAndObjectsArray,maxDomLayer: maxDom},function(){
		console.log("%cset link objects 2 with DOM to local storage !!","color:red;");
	});
	
	chrome.storage.local.set({ sortWithDomAndTagsObjects : extractObjectsFromArray(sortWithDomLayersAndObjectsArray) },function(){
		console.log("%cset link Array with DOM to local storage !!","color:blue;");
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

//配列・オブジェクトの中身のテキストの長さの昇順に並び替え
//クイックソートにしたい
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

//DOMに応じて、Webページのリンク情報を抽出
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
    return divideTheObjectsForEachOfDom(all_arr);
}

//ハッシュのkeyに変数を利用するための関数
//ES6形式の場合、この関数は不要のはず
function hash_key(key,value){
	var h = {};
	h[key] = value;
	return h;
}

//階層毎に分ける
function divideTheObjectsForEachOfDom(arr){
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
//domとtagの中身ごとにソート
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

//配列のオブジェクトのネストがすごかったので、配列の中のオブジェクトを出す。
function extractObjectsFromArray(arr){
	var tmp_all_arr = [];
	for(var i=0;i<arr.length;i++){
		for(var j=0;j<arr[i].length;j++){
			tmp_all_arr.push(arr[i][j]);
		}
	}
	
	for(var i=0; i<tmp_all_arr.length; i++){
		if(!tmp_all_arr[i].text || tmp_all_arr[i].text === null || tmp_all_arr[i].text === undefined || tmp_all_arr[i].text.length == 0 || tmp_all_arr[i].text === ""){
			tmp_all_arr.splice(i,1);
			i--;
		}
	}
	return tmp_all_arr;
}
