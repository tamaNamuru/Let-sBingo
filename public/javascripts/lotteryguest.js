const lottery_guest = io('/lottery_guest');

//抽選番号を受け取る
lottery_guest.on('lotteryNumber', (number) => {
	document.getElementById("lotteryNumber").innerHTML = number;
});

//景品ゲット
lottery_guest.on('lotteryResult', (name, url) => {
	document.getElementById("prize").innerHTML = name;
	document.getElementById("picture").src = url;
	document.getElementById("prizeblock").style.display = "block";
});

//リダイレクト
lottery_guest.on('redirect', (url) => {
	window.location.href = url;
});
