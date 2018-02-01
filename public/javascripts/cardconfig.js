window.onload = function(){
	//ビンゴの文字
	var bingofont = document.getElementsByName("bingofont");
	var style;
	if(!(bingofont[0].checked || bingofont[1].checked)) {		//両方チェックされていない
		var bingoth = document.getElementsByTagName("th")[0];
		style = window.getComputedStyle(bingoth);
		if(style.fontSize == "0px"){	//現在なしなので
			bingofont[1].checked = true;
		}else{	//あり
			bingofont[0].checked = true;
		}
	}
	//数字の色
	var kazu = document.getElementsByClassName("kazu")[0];
	style = window.getComputedStyle(kazu);
	var color = document.getElementsByName("color");
	color[0].value = rgbTo16(style.color);
	var wakucolor = document.getElementsByName("wakucolor");
	wakucolor[0].value = rgbTo16(style.webkitTextStrokeColor);
	//枠線
	var waku = document.getElementsByName("waku");
	if(!(waku[0].checked || waku[1].checked)) {	//両方チェックされていない
		var kazu = document.getElementsByClassName("kazu")[0];
		if(style.webkitTextStroke == '0px'){	//現在枠なし
			waku[1].checked = true;
		}else{
			waku[0].checked = true;
		}
	}
	//フォント
	var select = document.getElementById("font");
	for(var i = 1; i < select.options.length; i++){
		if(select.options[i].value == style.fontFamily){
			select.options[i].selected = true;
			break;
		}
	}
	select = document.getElementById("size");
	for(var i = 0; i < select.options.length; i++){
		if(select.options[i].value == style.fontSize){
			select.options[i].selected = true;
			break;
		}
	}
}
//変換	rgb(0,0,0)→#000000
rgbTo16 = function(col){
  return "#" + col.match(/\d+/g).map(function(a){return ("0" + parseInt(a).toString(16)).slice(-2)}).join("");
}

function update(){ //変更処理

	//背景画像
	var imagefile = document.getElementById("imagefileup");
	if(!imagefile.value){	//ファイルが指定されていなければ
		var bingoback = document.getElementById("bingo");	//現在の背景のurlを取得して送信
		var style = window.getComputedStyle(bingoback);
        if(style.backgroundImage != 'none' && style.backgroundImage.indexOf("/projects") != -1){  //存在するなら
            document.getElementById("imagefileup_url").value = 
                "url(\"" +
                style.backgroundImage.slice(style.backgroundImage.indexOf("/projects"));
        } else
            document.getElementById("imagefileup_url").value = style.backgroundImage;
	}
	var imagefile = document.getElementById("imagefiledown");
	if(!imagefile.value){
		var bingoback = document.getElementById("number");
		var style = window.getComputedStyle(bingoback);
        if(style.backgroundImage != 'none' && style.backgroundImage.indexOf("/projects") != -1){  //存在するなら
            document.getElementById("imagefiledown_url").value = 
                "url(\"" +
                style.backgroundImage.slice(style.backgroundImage.indexOf("/projects"));
        } else
            document.getElementById("imagefiledown_url").value = style.backgroundImage;
	}

	return true;
}
