const guest = io('/guest', {transports: ['websocket']});

let card = [];
let reachflag;
let waitflag;   //リーチのときセッションを更新するまで待つフラグ

guest.on('cardSet', function(cardNumbers, numbers) {
	for(let i=0; i < 5; i++){
		card[i] = [];
	}
	reachflag = false;
    waitflag = false;

	let table = document.getElementById("number");
	for(let i=0; i < 5; i++) {
		for(let j=0; j < 5; j++) {
			if(i==2 && j == 2) {
				card[j][i] = true;
				table.rows[j].cells[i].style.color = "red";
				continue;
			}
			card[j][i] = false;
			table.rows[j].cells[i].firstChild.innerHTML = cardNumbers.substr((i*5+j)*2, 2);
		}
	}
	
	for(let i=0; i < numbers.length; i++){
		cardCheck(numbers[i]);
	}
	buttonActive = true;
});

guest.on('broadcastNumber', (number) => {
	cardCheck(number);
});

//リダイレクト
guest.on('redirect', (url) => {
	window.location.href = url;
});

//ビンゴカードの判定
function cardCheck(number) {
    if(waitflag) return;
    
	let cell = 0;
	if(number > 60){
		cell = 4;
	} else if(number > 45){
		cell = 3;
	} else if(number > 30){
		cell = 2;
	} else if(number > 15){
		cell = 1;
	}
	let table = document.getElementById("number");

	let urow = -1;
	let ucell = -1;
	for(let i=0; i < 5; i++) {
		if(table.rows[i].cells[cell].firstChild.innerHTML == number){
			urow = i;
			ucell = cell;
			break;
		}
	}
	
	if(urow != -1) {
		//点滅(仮)
		let num = table.rows[urow].cells[ucell];
		let numspan = table.rows[urow].cells[ucell].firstChild;
		numspan.className = "tenmetsu";
		//押されたら
		num.onclick = () => {
			num.onclick = () => {};

			numspan.className = "";
			//穴あけ
			num.style.backgroundImage = "url(/images/hit.png)";
			num.style.backgroundSize = "100% 100%";
			num.style.border = "0px #ff0000 solid";
			num.style.borderTopLeftRadius = "0px";
	 		num.style.borderTopRightRadius = "0px";

			card[urow][ucell] = true;
			let cnt = 0;
			//横
			for(let i=0; i < 5; i++){
				if(card[urow][i])
					++cnt;
			}
			let max = cnt;
			cnt = 0;
			//縦
			for(let i=0; i < 5; i++){
				if(card[i][ucell])
					++cnt;
			}
			if(max < cnt) max = cnt;
			cnt = 0;
			//斜め
			if(urow == ucell){
				for(let i=0; i < 5; i++){
					if(card[i][i])
						++cnt;
				}
			}else if(urow + ucell == 4){
				for(let i=0; i < 5; i++){
					if(card[4-i][i])
						++cnt;
				}
			}
			if(max < cnt) max = cnt;
			//リーチ・ビンゴ判定
			if(max == 4 && !reachflag){
				reachflag = true;
                waitflag = true;
				guest.emit('reach', () => { waitflag = false;});
                //アニメーション
                document.getElementById("reachgif").style.display = "inline";
				setTimeout(() => {
                    document.getElementById("reachgif").style.display = "none";
                },7000);
			}else if(max == 5){
                waitflag = true;
				guest.emit('bingo', () => { waitflag = false;});
                //アニメーション
                document.getElementById("bingogif").style.display = "inline";
				setTimeout(() => {
                    document.getElementById("bingogif").style.display = "none";
                },7000);
			}
		}
	}
}
