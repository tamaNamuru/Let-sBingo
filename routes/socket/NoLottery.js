var BaseLottery = require('./BaseLottery');

module.exports = class NoLottery extends BaseLottery {
	constructor() {
		super();
		this.roomGuestInfo = [];	//[0～抽選者数-1] = {rank:, name:}
        this.guestJumpurl = '/guest/nolottery'
	}
	
	reloadInit(socket) {
		if(this.roomGuestInfo.length > 0){
			socket.emit('sendResult', this.roomGuestInfo);
		}
	}
	
	//初期化終了直後roomGuestInfoが渡され、それ以外はnull
	guestInit(socket, prizeMax) {
		if(!this.winnerSessions.get(socket.request.sessionID)){	//一度目の接続なら
			this.winnerSessions.set(socket.request.sessionID, socket.id);
			this.guestPriority.push( [socket.request.session.guest.winner, socket.request.session.user.name] );
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
				let prewin = -1;
				let rank = 0;
				let add = 1;
				for(let guest of this.guestPriority){
					if(guest[0] != prewin){
						prewin = guest[0];
						rank += add;
						add = 1;
					}else{
						++add;
					}
					this.roomGuestInfo.push({rank: rank, name: guest[1]});
				}
				return this.roomGuestInfo;
			}
		}
		this.winnerSessions.set(socket.request.sessionID, socket.id);
		return null;
	}
}
