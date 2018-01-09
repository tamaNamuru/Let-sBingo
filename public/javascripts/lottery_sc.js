const lottery_sub = io('/lottery_sub');

//景品
lottery_sub.on('setLottery', (name, url) => {
	document.getElementById("namae").innerHTML = name;
	document.getElementById("prizeimg").src = url;
});

//抽選番号
lottery_sub.on('setNumber', (number) => {
    document.getElementById("number").innerHTML = number;
});
