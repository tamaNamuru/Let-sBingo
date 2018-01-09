const manager = io('/manager');

//let capacity = true;
let prizeMax = 0;

//ビンゴを開始する
function bingoStart() {
	//画面のリセット
	document.getElementById("roomId").innerHTML = "";
	//document.getElementById("startButton").style.display="none";
	//規模が大きくなるようであればdocument.body.innerHTMLでbody全体を書き換える
	
	//let element = document.createElement("div");
	//element.innerHTML = "<button type='button' onclick='lottery()'>番号抽選</button>";
	//document.getElementById("game").appendChild(element);
	let button = document.getElementById("startButton");
	button.innerHTML = "番号抽選START";
	button.onclick = () => {
		button.disabled = true;	//ボタンを押せなくする
		stop.disabled = false;
		//setTimeout(() => { button.disabled = false; }, 800 );	//0.8秒後解除
		manager.emit('rouletteStart');
	}
	let stop = document.createElement("button");
	stop.innerHTML = "番号抽選STOP";
	stop.disabled = true;
	stop.onclick = () => {
		stop.disabled = true;
		button.disabled = false;
for(var i=0; i < 10; i++){	//テスト用後で消す
		manager.emit('sendNumber', function(number) {
			let element = document.getElementById("numbers");
			element.innerHTML += number + ' ';
		});
}
	}
	document.body.insertBefore(stop, button.nextSibling);
}

function screenChange() {
    manager.emit('screenChangeView');
}
/*
function prizeAdd() {
	prizeMax += parseInt(document.getElementById("addPrize").value, 10);
	document.getElementById('capacity').innerHTML = prizeMax;
}
*/
/*
manager.on('joinGuest', (name) => {
	let element = document.createElement("div");
	element.innerHTML = name + "さんが入室しました。";
	let parent_object = document.getElementById("users");
	parent_object.appendChild(element);
});
*/
//景品の合計数を受け取る
manager.on('prizeMax', (max) => {
	prizeMax = parseInt(max, 10);
	document.getElementById('capacity').innerHTML = prizeMax;
});

/**
 * 参加者　→　サーバ　→　運営者
 */
manager.on('recieveReach', (name) => {
	let element = document.createElement("div");
	element.innerHTML = name + "さんがリーチ！";
	let parent_object = document.getElementById("recieve");
	parent_object.appendChild(element);
});

manager.on('recieveBingo', (name, bingoCount) => {
	let element = document.createElement("div");
	element.innerHTML = name + "さんがビンゴ！";
	let parent_object = document.getElementById("recieve");
	parent_object.appendChild(element);
	
	document.getElementById('bingoNum').innerHTML = bingoCount;
	//ビンゴの定員チェック
	if(bingoCount >= prizeMax){
//		capacity = false;
		let button = document.getElementById("lotteryStart");
		button.innerHTML = "景品抽選に進む";
		button.disabled = false;
		button.onclick = () => {
			let add = parseInt(document.getElementById("addPrize").value, 10);
			if(bingoCount > prizeMax + add){
				alert("景品の数がビンゴの当選数より" + (bingoCount - prizeMax - add) +
				"個少ないです。\n最後にビンゴした組の中から景品がもらえる参加者をじゃんけんで決めます");
                window.location.href = '/bingo/janken';
			}else if(bingoCount < prizeMax + add){
				alert("まだ、ビンゴの当選者が景品の数より少ないです。");
			}else{
				alert("ぴったり");
				window.location.href = '/bingo/janken';
			}
		}
		//let div = document.getElementById('numbers');
		//document.body.insertBefore(button, div);
	}
});

//リダイレクト
manager.on('redirect', (url) => {
	window.location.href = url;
});






//'/lottery_manager'で使う
//景品抽選開始
function prizeLotteryStart() {
	manager.emit('sendPrizeLotteryStart', function() {
		//TODO
		//window.location.href = url;
	});
}
