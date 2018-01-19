module.exports = class Janken {
	constructor() {
		this.winnerSessions = new Map();	//Map(sessionID, socket.id)個人に送信したい場合使う。
		this.jankenWait = 0;	//じゃんけん待ちの数
		this.katinuke = new Map();	//Map(sessionID, 0:じゃんけん中, 1:勝ち抜け, 2:負け)
		this.guestTe = [];	//['g' or 'c' or 'p'] = new Set(sessionID, …)
		this.guestTe['g'] = new Set();
		this.guestTe['c'] = new Set();
		this.guestTe['p'] = new Set();
		this.resultJanken = 0;	//結果待ち人数
	}
	
	//bc[0] = bingoCountの減少分 ,bc[1] = lastBingoCountの減少分
	jankenJadge(te,  nokori, janken_guest){
		let bc = new Array(0, 0);
		var kati = '';
		switch(te){
		case 'g':   //グー
			kati = 'p';
			break;
		case 'c':   //チョキ
			kati = 'g';
			break;
		case 'p':   //パー
			kati = 'c';
			break;
		}
		this.resultJanken = 0;
		
		if(this.guestTe[kati].size > nokori){  //勝った人だけ残す
			let make = '';
			switch(te){
			case 'g':   //グー
				make = 'c';
				break;
			case 'c':   //チョキ
				make = 'p';
				break;
			case 'p':   //パー
				make = 'g';
				break;
			}
			
			for(let sess of this.guestTe[te]){	//あいこ
				this.katinuke.set(sess, 2);
				janken_guest.to(this.winnerSessions.get(sess)).emit('sendLose');
				--bc[0];
				--bc[1];
				++this.resultJanken;
			}
			for(let sess of this.guestTe[make]){	//まけ
				this.katinuke.set(sess, 2);
				janken_guest.to(this.winnerSessions.get(sess)).emit('sendLose');
				--bc[0];
				--bc[1];
				++this.resultJanken;
			}
		}else{  //少数勝ち抜け
			for(let sess of this.guestTe[kati]){
				this.katinuke.set(sess, 1);
				janken_guest.to(this.winnerSessions.get(sess)).emit('sendWin');
				--bc[1];
				++this.resultJanken;
			}
		}
		this.jankenWait = 0;
		this.guestTe['g'] = new Set();
		this.guestTe['c'] = new Set();
		this.guestTe['p'] = new Set();
		return bc;
	}
	
	//0:じゃんけん終了済み, 1:一度目の接続, 2:リロード
	guestCheck(socket) {
		if(!this.winnerSessions.get(socket.request.sessionID)){	//一度目の接続なら
			this.winnerSessions.set(socket.request.sessionID, socket.id);
			this.katinuke.set(socket.request.sessionID, 0);
			return 1;
		}else if(this.katinuke.get(socket.request.sessionID) == 0){	//二度目以降じゃんけん中
			this.winnerSessions.set(socket.request.sessionID, socket.id);	//ソケットIDは接続のたびに代わるので
			if(this.guestTe['g'].has(socket.request.sessionID))
				socket.emit('reloadView', 'g');
			else if(this.guestTe['c'].has(socket.request.sessionID))
				socket.emit('reloadView', 'c');
			else if(this.guestTe['p'].has(socket.request.sessionID))
				socket.emit('reloadView', 'p');
			else	//リロードすると先にじゃんけんできる画面になるが、運営者が押すまで先に進まないので大丈夫
				socket.emit('jankenStart');
			return 2;
		}else{	//すでにじゃんけん終了済み
			if(this.katinuke.get(socket.request.sessionID) == 1){	//勝っている
				socket.leave(socket.request.session.user.id);
				socket.join(socket.request.session.user.id + 'winner');	//winner直接書き込んでるので注意
                socket.emit('katinuke');
			}else{  //負けている
				//ここまでくるということはセッションだけ更新されていない
				socket.leave(socket.request.session.user.id);   //退室
				socket.request.session.guest.winner = 'none'; //負けたら勝ちフラグを消す
				//セッションを保存
				socket.request.session.save((err) => {
				});
                socket.emit('logoutOn');
			}
		}
		return 0;
	}
	
	guestSend(te, sessionID) {
		if(!this.guestTe[te].has(sessionID)){	//念のため
			this.guestTe[te].add(sessionID);
			++this.jankenWait;
			return true;
		}
		return false;
	}
	
	isJankenResultEnd() {
		if(++this.jankenWait == this.resultJanken){
			return true;
		}
		return false;
	}
	
	winnerSessionsSize() {
		return this.winnerSessions.size;
	}
	
}
