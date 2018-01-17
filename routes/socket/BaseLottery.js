module.exports = class BaseLottery {
	constructor() {
		this.winnerSessions = new Map();	//Map(sessionID, socket.id)個人に送信したい場合使う。
		this.guestPriority = [];	//[0～景品の数-1][winner(数字), sessionID]
        this.guestjumpurl;
	}
	
	guestInit(socket){
	}
}
