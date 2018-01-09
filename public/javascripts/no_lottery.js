const nolottery_guest = io('/nolottery_guest');

//リダイレクト
nolottery_guest.on('redirect', (url) => {
	window.location.href = url;
});
