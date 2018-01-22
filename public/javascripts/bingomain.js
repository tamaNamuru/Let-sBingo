const manager = io('/manager');

window.onload = function(){
    let startstop = 0;
	let button = document.getElementById('bingobutton');
	button.onclick = function(){
		if(startstop == 0){
			//button.disabled = true;	//ボタンを押せなくする(div要素なので効果なし)
			//setTimeout(() => { button.disabled = false; }, 800 );	//0.8秒後解除
			manager.emit('rouletteStart', () => {
				startstop = 1;
				button.innerHTML ="STOP";
			});
			
		}else{
			//button.disabled = true;
			//setTimeout(() => { button.disabled = false; }, 800 );	//0.8秒後解除
for(var i=0; i < 10; i++){	//テスト用後で消す
			manager.emit('sendNumber', function(number) {
				let element = document.getElementById("numbers");
				if(number < 10)
					element.innerHTML += ' ';
				element.innerHTML += number + ' ';
                startstop = 0;
			});
}
			document.getElementById('bingobutton').innerHTML = "START";
		}
		
	}
}

function screenChange() {
    manager.emit('screenChangeView');
}

function bingoFinish() {
    if(confirm("ビンゴを中断して終了します。\n現在の状態は破棄されますがよろしいですか？")){
        manager.emit('closeRoom');
    }
}

//景品の合計数とビンゴ者の数を初期化
manager.on('roomInit', (pmax, bnum) => {
	document.getElementById('capacity').innerHTML = pmax;
	document.getElementById('bingoNum').innerHTML = bnum;
    let ls = document.getElementById("lotteryStart");
	if(bnum >= pmax){
        ls.className = 'btn2';
		ls.disabled = false;
        ls.onclick = () => {
			if(bnum > pmax){
				if(confirm("ビンゴの当選者が景品の数を" + (bnum - pmax) +
				"個超えました。\n最後にビンゴした参加者の中からじゃんけんで当選者を決めますがよろしいですか？")){
                    manager.emit('nextScene');
                }
			}else if(bnum < pmax){	//エラー回避
				alert("まだ、ビンゴの当選者が景品の数より少ないです。");
			}else{
                if(confirm("景品抽選に進みますがよろしいですか？")){
                    manager.emit('nextScene');
                }
			}
		}
	}else{
        ls.className = 'disabled';
        ls.disabled = true;
    }
});

/**
 * 参加者　→　サーバ　→　運営者
 */
manager.on('recieveReach', (name) => {
	let element = document.createElement("div");
	element.innerHTML = name + "さん";
	let parent_object = document.getElementById("reachmen");
	parent_object.appendChild(element);
	
	document.getElementById('reachNum').innerHTML = parseInt(document.getElementById('reachNum').innerHTML, 10) + 1;
});

manager.on('recieveBingo', (name, bingoCount) => {
	let element = document.createElement("div");
	element.innerHTML = name + "さん！";
	let parent_object = document.getElementById("bingomen");
	parent_object.appendChild(element);
	
	document.getElementById('bingoNum').innerHTML = bingoCount;
	//ビンゴの定員チェック
	let prizeMax = parseInt(document.getElementById("capacity").innerHTML, 10);
	if(bingoCount >= prizeMax){
		let button = document.getElementById("lotteryStart");
		button.disabled = false;
        button.className = 'btn2';
		button.onclick = () => {
			if(bingoCount > prizeMax){
				if(confirm("ビンゴの当選者が景品の数を" + (bingoCount - prizeMax) +
				"個超えました。\n最後にビンゴした参加者の中からじゃんけんで当選者を決めますがよろしいですか？")){
                    manager.emit('nextScene');
                }
			}else if(bingoCount < prizeMax){	//エラー回避
				alert("まだ、ビンゴの当選者が景品の数より少ないです。");
			}else{
                if(confirm("景品抽選に進みますがよろしいですか？")){
                    manager.emit('nextScene');
                }
			}
		}
	}
});

//リダイレクト
manager.on('redirect', (url) => {
	window.location.href = url;
});

//景品追加関連
//リセット
function sakuzyo() {
	var kakunin = confirm("景品情報をすべてリセットしますが、よろしいですか？");
	
	if(kakunin == true){
		let tbody = document.getElementById("tb");
        while (tbody.firstChild != tbody.lastChild) tbody.removeChild(tbody.lastChild);
	}else{
		alert("キャンセルしました");
	}
}

//テーブル追加
function AddTable() {
	var table = document.getElementById("keihin");
	
	var count = table.rows.length;
	
	var row1 = table.insertRow(count);
	
	var cell1 = row1.insertCell(0);
	var cell2 = row1.insertCell(1);
	var cell3 = row1.insertCell(2);
	var cell4 = row1.insertCell(3);
	
	var HTML1 = '<input type="text" name="name" value="" size="10" maxlength="20" />';
	var HTML2 = '<input type="number" name="kazu" min="1" max="500" value="1" step="1" required />';
	var HTML3 = '<select name="pictype"><option value="/images/追加景品_ギフト券.png" selected>ギフト券</option><option value="/images/追加景品_衣服.png">衣服</option><option value="/images/追加景品_食品類.png">食品類</option><option value="/images/追加景品_豪華景品.png">豪華景品</option></select>';
	var HTML4 = '<input type="button" name="dl" value="削除" onclick="deleteRow(this)">'
	
	
	cell1.innerHTML = HTML1;
	cell2.innerHTML = HTML2;
	cell3.innerHTML = HTML3;
	cell4.innerHTML = HTML4;
}
	
//行削除
function deleteRow(dlthis) {

	var table = document.getElementById("keihin");

    var tbody = document.getElementById("tb");

    var tr = dlthis.parentNode.parentNode;

    tbody.removeChild(tr);
}

//景品登録
function submitAdd() {
    if(confirm("景品を追加します。\n一度追加した景品は取り消すことができませんがよろしいですか？")){
        let name = document.getElementsByName("name");
        let kazu = document.getElementsByName("kazu");
        let pictype = document.getElementsByName("pictype");
        prizes = [];
        for(let i=0; i < kazu.length; i++){
            prizes.push({ name: name[i].value, count: kazu[i].value, url: pictype[i].value});
        }
        manager.emit("addPrize", prizes);
        let tbody = document.getElementById("tb");
        while (tbody.firstChild != tbody.lastChild) tbody.removeChild(tbody.lastChild);
    }
}