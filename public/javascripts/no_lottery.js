const nolottery_guest = io('/nolottery_guest', {transports: ['websocket']});

//リダイレクト
nolottery_guest.on('redirect', (url) => {
	window.location.href = url;
});
