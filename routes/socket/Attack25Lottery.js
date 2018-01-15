var SimpleLottery = require('./SimpleLottery');

module.exports = class Attack25Lottery extends SimpleLottery {
	constructor(prizes) {
		super(prizes);
		this.attack25Info = [];	//[景品数-1] = prize_id
		this.roomOpens = []	//[景品数-1] = trueで開封済み
		for(let i=0; i < prizes.length; i++){
			for(let j=0; j < prizes[i].count; j++){
				this.attack25Info.push(i+1);
				this.roomOpens.push(false);
			}
		}
		let a = this.attack25Info.length;
		while(a) {
			let j = Math.floor(Math.random() * a);
			let t = this.attack25Info[--a];
			this.attack25Info[a] = this.attack25Info[j];
			this.attack25Info[j] = t;
		}
        this.guestJumpyurl = '/guest/attack25lottery';
        this.shaffule = false;
	}
	
	reloadInit(socket, prizeMax) {
		if(prizeMax == this.guestPriority.length) {	//抽選者がそろっていれば
			if(this.curIndex == 0){
				socket.emit('placeBox', prizeMax, this.shaffule);
			}else{	//途中再開
				let purl = [];
				for(let i=0; i < this.prizeInfo.length; i++){
					for(let j=0; j < this.prizeInfo[i].count; j++){
						if(this.prizeInfo[i].picture_url)	//nullチェック
							purl.push(this.prizeInfo[i].picture_url);
						else
							purl.push('');
					}
				}
				//抽選者が選んだ抽選権の番号を記録していないので
				//prize_idを使って一つ前の景品の画像を呼び出す
				let current_url = this.prizeInfo[this.guestPrizeID.get(
				this.guestPriority[this.curIndex-1][1])-1].picture_url;
				socket.emit('reloadInit', this.roomOpens, purl, current_url);
			}
		}
	}
	
	getPictureURLs(){
		let purl = [];
		for(let i=0; i < this.prizeInfo.length; i++){
			for(let j=0; j < this.prizeInfo[i].count; j++){
				purl.push(this.prizeInfo[i].picture_url);
			}
		}
		return purl;
	}
	
	startGuestTurn(attack25_guest, socket, prizeMax){
		if(this.curIndex < prizeMax){
			attack25_guest.to(this.getSocketID(this.curIndex)).emit('guestStart', this.roomOpens);
		}else{
			socket.emit('prizeFinish');
		}
	}
	
	//大画面用
	subInit(socket) {
		if(this.curIndex == 0 && !this.shaffule){
			socket.emit('placeBox', this.attack25Info.length);
		}else{	//リロード
			socket.emit('reloadInit', this.roomOpens, this.getPictureURLs());
		}
	}
	
	//初期化終了直後prizeMaxが返され、それ以外は-1
	guestInit(socket, prizeMax) {
		if(!this.winnerSessions.get(socket.request.sessionID)){	//一度目の接続なら
			this.winnerSessions.set(socket.request.sessionID, socket.id);
			this.guestPriority.push( [socket.request.session.guest.winner, socket.request.sessionID] );
			this.guestPrizeID.set(socket.request.sessionID, -1);	//まだ景品が決まってない
			if(prizeMax == this.guestPriority.length){	//抽選者がそろっていれば
				this.guestPriority.sort(	//優先度が高い順に並べる
					function(a, b){
						var aWin = a[0];
						var bWin = b[0];
						if(aWin < bWin) return -1;
						if(aWin > bWin) return 1;
						return 0;
					}
				);
				
				return prizeMax;
			}
		}else if(this.guestPrizeID.get(socket.request.sessionID) != -1){	//景品が確定していれば
			let info = this.prizeInfo[this.guestPrizeID.get(socket.request.sessionID)-1];
			socket.emit('lotteryResult', info.name, info.picture_url);
		}else{
			this.winnerSessions.set(socket.request.sessionID, socket.id);	//ソケットIDは接続のたびに代わるので]
			if(socket.request.sessionID == this.guestPriority[this.curIndex][1]){	//自分の番だったら
				socket.emit('guestStart', this.roomOpens);
			}
		}
		return -1;
	}
	
	//数字に対応した景品を取得
	numberToLottery(index, sessionID) {
		this.roomOpens[index] = true;
		++this.curIndex;
		this.guestPrizeID.set(sessionID, this.attack25Info[index]);
		return this.prizeInfo[this.attack25Info[index]-1];            
	}
}
