var BaseLottery = require('./BaseLottery');

module.exports = class SimpleLottery extends BaseLottery {
	constructor(prizes) {
		super();
		this.guestPrizeID = new Map();	//Map(sessionID, prize_id(初期値：-1))再接続用
		this.prizeInfo = prizes;	//{name:, count:, picture_url:}
		this.numbers = [];	//抽選番号
		this.curIndex = 0;	//現在の進行
        this.guestJumpurl = '/guest/lottery';
	}
	
	getPrizeInfo(prize_id) {
		return this.prizeInfo[prize_id-1];
	}
	
	//次に進めつつ現在の抽選者のindexを返す
	nextNumbers(prize_id) {
		--this.prizeInfo[prize_id-1].count;	//再接続時のため減らす
		this.guestPrizeID.set(this.guestPriority[this.numbers[this.curIndex]][1], prize_id);	//再接続時用
		return this.numbers[this.curIndex++];
	}
	
	lotteryCheck(socket, prizeMax) {
		if(prizeMax > this.guestPriority.length){	//参加者がページ切り替えしたことを確認
			socket.emit('setMessage', "まだ画面が切り替わってない人がいます");
			return false;
		}
		if(prizeMax == 0){
			socket.emit('setMessage', "終了しました。");
			return false;
		}
		return true;
	}
	
	getSocketID(index) {
		return this.winnerSessions.get(this.guestPriority[index][1]);
	}
	
	//初期化終了直後guestPriorityが渡され、それ以外はnull
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
				
				for(var i=0; i < this.guestPriority.length; i++){
					this.numbers.push(i);
				}
				//当選する順番を決めるシャッフル
				let a = this.guestPriority.length;
				while(a) {
					let j = Math.floor(Math.random() * a);
					let t = this.numbers[--a];
					this.numbers[a] = this.numbers[j];
					this.numbers[j] = t;
				}
				return this.guestPriority;
			}
		}else if(this.guestPrizeID.get(socket.request.sessionID) != -1){	//景品が確定していれば
			let info = this.prizeInfo[this.guestPrizeID.get(socket.request.sessionID)-1];
			socket.emit('lotteryResult', info.name, info.picture_url);
			for(var i=0; i < this.guestPriority.length; i++){
				if(this.guestPriority[i][1] == socket.request.sessionID){
					socket.emit('lotteryNumber', i+1);	//抽選番号を送る
					break;
				}
			}
		}else{
			this.winnerSessions.set(socket.request.sessionID, socket.id);	//ソケットIDは接続のたびに代わるので
			for(var i=0; i < this.guestPriority.length; i++){
				if(this.guestPriority[i][1] == socket.request.sessionID){
					socket.emit('lotteryNumber', i+1);	//抽選番号を送る
					break;
				}
			}
		}
		return null;
	}
	
}
