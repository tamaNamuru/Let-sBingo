var box = document.getElementsByTagName("p");
var i=0;
var randomInt;
var generated = new Array();
var generatedCount = generated.length;
var id = "";
var i = 0;
var count = 0;
var cols = 0;
var rows = 0;
function Check(hantei){
	var box2= document.getElementById("soto");
	var box3 = document.getElementById("uti2");
	if(hantei == "bb"){
        randomInt = Math.floor( Math.random() * ( 75 - 1 ) + 1 );
        box[0].innerHTML  = randomInt;
        if(randomInt > 60){
            box2.style.backgroundColor=box3.style.backgroundColor="#FFFF66";
        }else if(randomInt > 45){
            box2.style.backgroundColor=box3.style.backgroundColor="#DD0000";
        }else if(randomInt > 30){
            box2.style.backgroundColor=box3.style.backgroundColor="#0000CC";
        }else if(randomInt > 15){
            box2.style.backgroundColor=box3.style.backgroundColor="#FFAAFF";
        }else{
            box2.style.backgroundColor=box3.style.backgroundColor="#f4a460";
        }
        id = setTimeout("Check('cc')", 100);
	}else if(hantei == "cc"){
		randomInt = Math.floor( Math.random() * ( 75 - 1 ) + 1 );
		box[0].innerHTML  = randomInt;
		if(randomInt > 60){
			box2.style.backgroundColor=box3.style.backgroundColor="#FFFF66";
		}else if(randomInt > 45){
			box2.style.backgroundColor=box3.style.backgroundColor="#DD0000";
		}else if(randomInt > 30){
			box2.style.backgroundColor=box3.style.backgroundColor="#0000CC";
		}else if(randomInt > 15){
			box2.style.backgroundColor=box3.style.backgroundColor="#FFAAFF";
		}else{
			box2.style.backgroundColor=box3.style.backgroundColor="#f4a460";
		}
		id = setTimeout("Check('cc')", 100);
	}else{
		if(generated.length < 75){
			randomInt = hantei;	//数字が入っているはず
			box[0].innerHTML = randomInt;
			if(randomInt > 60){
				box2.style.backgroundColor=box3.style.backgroundColor="#FFFF66";
			}else if(randomInt > 45){
				box2.style.backgroundColor=box3.style.backgroundColor="#DD0000";
			}else if(randomInt > 30){
				box2.style.backgroundColor=box3.style.backgroundColor="#0000CC";
			}else if(randomInt > 15){
				box2.style.backgroundColor=box3.style.backgroundColor="#FFAAFF";
			}else{
				box2.style.backgroundColor=box3.style.backgroundColor="#f4a460";
			}
			generated[i] = randomInt;  
			i++;
			generatedCount++;
			clearTimeout(id);
			addTable("sample1_table",randomInt);
		}
	}
}
function addTable(id,randomInt) {
	count++;
	var table = document.getElementById(id);
	var rows = table.rows.length;
	
	if(rows == 0){
		display(id,randomInt);
		rows++;
	}else {
		display(id,randomInt);
		count =  1;
	}
}

var history_b = new Array();
var flagcount = 0;
function display(id, randomInt) {
	var table = document.getElementById(id);
	flagcount++;
	var atai = "";
	if(history_b.length > 6) {
		history_b.shift();
	}
	history_b.push(randomInt);
	if(history_b.length == 1) {
		atai = "<td><div class=\"ball\"><div class=\"ball2\"><div class=\"ball3\">" + history_b[0] + "</div></div></div></td>";
	}else {
		for(var i = 0; i < history_b.length; i++){
			atai = atai + "<td><div class=\"ball\"><div class=\"ball2\"><div class=\"ball3\">" + history_b[i] + "</div></div></div></td>";
		}
	}
	atai = atai + "</table>";
	table.innerHTML = (atai);
	for(var j = 0; j < history_b.length; j++){
		var ball = document.getElementsByClassName("ball")[j];
		var ball2 = document.getElementsByClassName("ball2")[j];
		var ball3 = document.getElementsByClassName("ball3")[j];
		if(history_b[j] > 60){
			ball.style.backgroundColor="#FFFF66";
			ball2.style.backgroundColor="#FFFF66";
			ball3.style.border="solid 3px #FFFF66";
		}else if(history_b[j] > 45){
			ball.style.backgroundColor="#DD0000";
			ball2.style.backgroundColor="#DD0000";
			ball3.style.border="solid 3px #DD0000";
		}else if(history_b[j] > 30){
			ball.style.backgroundColor="#0000CC";
			ball2.style.backgroundColor="#0000CC";
			ball3.style.border="solid 3px #0000CC";
		}else if(history_b[j] > 15){
			ball.style.backgroundColor="#FFAAFF";
			ball2.style.backgroundColor="#FFAAFF";
			ball3.style.border="solid 3px #FFAAFF";
		}else{
			ball.style.backgroundColor="#f4a460";
			ball2.style.backgroundColor="#f4a460";
			ball3.style.border="solid 3px #f4a460";
		}
	}
}

//socket
const sub = io('/sub');

$(function() {
	var countflag = 0;
	$('#buttonMove').click(function() {
	countflag++;
		if(countflag < 76) {
			if(countflag > 6) {
				/*$('#sample1_table').animate({"left": "+=280px"},"slow");*/
				$('.ball').animate({"left": "-=280px"},"slow");
			}
		}
	});
    
    // ポップアップ用のタグを消す
    $('#popup-background').hide();
    $('.popup-roomname').hide();
    $('.popup-roomid').hide();
    var idhide = true;
    sub.on('changeView', () => {
        if(idhide){
            $('#popup-background').fadeIn(100);
            $('.popup-roomname').fadeIn(100);
            $('.popup-roomid').fadeIn(100);
        }else{
            $('#popup-background').fadeOut();
            $('.popup-roomname').fadeOut();
            $('.popup-roomid').fadeOut();
        }
        idhide = !idhide;
    });
});

//ビンゴ者数の更新
sub.on('updateBingoCount', (count) => {
	document.getElementById("bingosya").innerHTML = count;
});
//運営者がStartボタンを押すとサーバ経由で受信する
sub.on('rouletteStart', () => {
	Check("bb");
});

var countflag = 0;
//送られてきた数字を表示
sub.on('broadcastNumber', (number) => {
	Check(number);	//送られてきた数字を入力
	countflag++;
	if(countflag < 76) {
		if(countflag > 6) {
			/*$('#sample1_table').animate({"left": "+=280px"},"slow");*/
			$('.ball').animate({"left": "-=280px"},"slow");
		}
	}
});

//じゃんけんに
sub.on('redirect', (url) => {
    window.location.href = url;
});