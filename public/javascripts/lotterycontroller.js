const lottery_manager = io('/lottery_manager', {transports: ['websocket']});

//景品が選択された
function prizeSubmit(pic){
	var parent = pic.parentNode;
    var prizeCount = parent.lastElementChild.getElementsByClassName("prizeCount")[0]
	if(prizeCount.innerHTML <= 0){
		document.getElementById("message").innerHTML = "残りが0の商品です";
		return;
	}
	var prizeName = parent.firstElementChild;	//名前
    lottery_manager.emit("sendScreenLottery", prizeName.nextElementSibling.innerHTML);
	var result = confirm(prizeName.innerHTML + "でよろしいですか？");
	if(result){
		prizeCount.innerHTML -= 1;
		lottery_manager.emit("lotteryStart", prizeName.nextElementSibling.innerHTML);
        document.getElementById("maxCount").innerHTML -= 1;
	}
}

//終了ボタンが押された
function finishButton() {
	lottery_manager.emit("lotteryFinish");
}

lottery_manager.on('init', (prizes, max) => {
    let table = document.getElementById("keihin");
    for(let i=0; i < prizes.length;){
        let rows = table.insertRow(-1);
        for(let j=0; j < 4 && i < prizes.length; j++, i++){
            let cell = rows.insertCell(-1);
            cell.innerHTML = "<p>" + prizes[i].name + "</p>" +
                "<p class='hide' style='display:none'>" + (i + 1) + "</p>" +
                "<div onclick='prizeSubmit(this)'><img src=" + prizes[i].picture_url + "></div>" +
                "<p>残り<span class='prizeCount'>" + prizes[i].count + "</span>個</p>";
        }
    }
    document.getElementById("maxCount").innerHTML = max;
});

//サーバからメッセージを受け取る
lottery_manager.on('setMessage', (msg) => {
	document.getElementById("message").innerHTML = msg;
});

lottery_manager.on('logout', () => {
	window.location.href = '/logout';
});
