const nolottery_guest = io('/nolottery_guest');

nolottery_guest.on('setRank', () => {
    nolottery_guest.emit('getRank');
});

window.onload = function () {
    nolottery_guest.emit('getRank');
};

nolottery_guest.on('sendRank', (rank) => {
    document.getElementById("num").innerHTML = rank;
});

//リダイレクト
nolottery_guest.on('redirect', (url) => {
	window.location.href = url;
});
