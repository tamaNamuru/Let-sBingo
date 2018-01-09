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
	console.log(style);
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
	console.log(style.fontFamily);
	for(var i = 1; i < select.options.length; i++){
		console.log(select.options[i].value);
		if(select.options[i].value == style.fontFamily){
			console.log(select.options[i].value);
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
/*
function changesize(){	//文字サイズの値取得
	var font = document.getElementById("font").value;
	var size = document.getElementById("size");
	var i = 0;
	var j = 0;
	var k = 0;
	if (font == "arial black"){
		size.options.length = 24; 
		for(i ;i <= 8 ;i++){
			size.options[i] = new Option(j);
			j = j+5;
		}
		for(k = 41 ;k <= 56 ; k++){
			size.options[i] = new Option(k);
			i++;
		}
	}
	else if (font == "Impact"){
		size.options.length = 28;  
		for(i ;i <= 8 ;i++){
			size.options[i] = new Option(j);
			j = j+5;
		}
		for(k = 41 ;k <= 60 ; k++){
			size.options[i] = new Option(k);
			i++;
		}
	}
	else if (font == "Verdana"){
		size.options.length = 26; 
		for(i ;i <= 8 ;i++){
			size.options[i] = new Option(j);
			j = j+5;
		}
		for(k = 41 ;k <= 58 ; k++){
			size.options[i] = new Option(k);
			i++;
		}
	}
	else if (font == "ＭＳ ゴシック"){
		size.options.length = 28; 
		for(i ;i <= 8 ;i++){
			size.options[i] = new Option(j);
			j = j+5;
		}
		for(k = 41 ;k <= 60 ; k++){
			size.options[i] = new Option(k);
			i++;
		}
	}
	else if (font == "cursive"){
		size.options.length = 28; 
		for(i ;i <= 8 ;i++){
			size.options[i] = new Option(j);
			j = j+5;
		}
		for(k = 41 ;k <= 60 ; k++){
			size.options[i] = new Option(k);
			i++;
		}
	}
	else if (font == "fantasy"){
		size.options.length = 28; 
		for(i ;i <= 8 ;i++){
			size.options[i] = new Option(j);
			j = j+5;
		}
		for(k = 41 ;k <= 60 ; k++){
			size.options[i] = new Option(k);
			i++;
		}
	}
}
*/
function update(){ //変更処理

	//背景画像
	var imagefile = document.getElementById("imagefileup");
	if(!imagefile.value){	//ファイルが指定されていなければ
		var bingoback = document.getElementById("bingo");	//現在の背景のurlを取得して送信
		var style = window.getComputedStyle(bingoback);
        if(style.backgroundImage){  //存在するなら
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
        if(style.backgroundImage){  //存在するなら
            document.getElementById("imagefiledown_url").value = 
                "url(\"" +
                style.backgroundImage.slice(style.backgroundImage.indexOf("/projects"));
        } else
            document.getElementById("imagefiledown_url").value = style.backgroundImage;
	}

	return true;
}
/*
function Check(){ //変更処理
	alert("aaa");
	var waku = document.getElementsByName("waku");
	var color = document.getElementsByName("color");
	var font = document.getElementById("font").value;
	var size = document.getElementById("size");
	// ファイル名のみ取得する
	var getbingofile = document.getElementById("bingofile").value;
	var regex = /\\|\\/;
	var array1 = getbingofile.split(regex);
        var getfile = document.getElementById("file").value;
	var regex = /\\|\\/;
	var array2 = getfile.split(regex);
	// 
	var bingourl = array1[array1.length - 1];
	var url = array2[array2.length - 1]; //array.length-1 = "2"
	var color = color[0].value ;
	var j = 0;
	var i = 0;
	//ビンゴの文字ON/OFF
	var bingofont = document.getElementsByName("bingofont");
	var box2 = document.getElementsByTagName("th");
	for(i; i < box2.length;i++){
		if(bingofont[0].checked){
			box2[i].style.fontSize = "70px";
		}else if(bingofont[1].checked){
			box2[i].style.fontSize = "0px";
		}
	}
	//
	var wakucolor = waku[2].value;	 
        for(i=0;i < 2;i++){
    	 if(waku[i].checked){
           j = Number(waku[i].value);
     	}
   	}
        var shadow =   "2px  2px 1.5px" + wakucolor +",-2px  2px 1.5px"+ wakucolor +",2px -2px 1.5px"+ wakucolor +",-2px -2px 1.5px"+ wakucolor ;
	var box = document.getElementsByTagName("td");
	var bingo = document.getElementById("bingo");
	var number = document.getElementById("number");
	bingo.style.backgroundImage = "url(images/" + bingourl + " )";
	number.style.backgroundImage = "url(images/" + url + " )";
	//数字のレイアウトを変える(elseはFREEの部分)
	for(i=0;i<box.length;i++){
        	if(i != 12){
				box[i].style.fontSize = size.value+"px";
				box[i].style.color = color;
				box[i].style.fontFamily = font;
				//枠線のON/OFF
				if(j == 1){
				box[i].style.textShadow = shadow;
			}else{
				box[i].style.textShadow = "";
			}
		}
		else{
			//	box[i].style.color = color;
		}
	}	
}
*/
