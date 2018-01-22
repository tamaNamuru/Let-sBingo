module.exports = function(io) {
	var app = require('express');
	var router = app.Router();
	
	var Room = require('./Room');
	
	let roomMaps = new Map();	//部屋Map(id, Room)
	
	//ビンゴ
	//運営者
	var manager = io.of('/manager').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) {	//部屋が立っていない場合
			idroom = new Room(socket);
			roomMaps.set(socket.request.session.user.id, idroom);
			room.emit('addRoom', socket.request.session.user.name);
		}else if(idroom.moveMode(socket)){
			return;
		}
		socket.join(socket.request.session.user.id);
		
		//ルーレット
		socket.on('rouletteStart', (fn) => {
			if(idroom.bingoCountCheck()){
				sub.to(idroom.id).emit('rouletteStart');
				fn();
			}
		});
		//数字をルーム参加者に向けて送信する
		socket.on('sendNumber', function(fn) {
			let num = idroom.getSendNumber();
			if(num != -1){
				guest.to(idroom.id).emit('broadcastNumber', num);
				sub.to(idroom.id).emit('broadcastNumber', num);
				fn(num);
			}
		});
		
		socket.on('screenChangeView', () => {
			sub.to(idroom.id).emit('changeView');
		});
		//景品を追加する
		socket.on('addPrize', (prizes) => {
			idroom.addPrizes(socket, prizes);
		});
		
		//じゃんけんか抽選へ
		socket.on('nextScene', () => {
			idroom.nextScene(socket);
			room.emit('removeRoom', socket.request.session.user.name);
		});
		//部屋を閉じる(保存はされない)
		socket.on('closeRoom', () => {
			roomMaps.delete(idroom.id);
			room.emit('removeRoom', socket.request.session.user.name);
			guest.to(idroom.id).emit('redirect', '/logout/userexit');	//ルーム参加者を強制ログアウト(セッションも消去)
			guest.to(idroom.id + Room.winner()).emit('redirect', '/logout/userexit');
			socket.emit('redirect', '/');
		});
	});
	
	//運営者スクリーン用画面
	var sub = io.of('/sub').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		socket.join(socket.request.session.user.id);
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(idroom){
			socket.emit('updateBingoCount', idroom.bingoCount);
		}
	});
	
	//参加者
	var guest = io.of('/guest').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.guest) {
			socket.emit('redirect', '/logout');
			return;
		}
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(idroom === undefined){
			socket.emit('redirect', '/logout/userexit');	//ログインしたけど部屋がなくなっていた場合のため
			return;
		}
		if(idroom.guestInit(socket)){
			return;
		}
		
		//リーチを管理者に伝える
		socket.on('reach', (reachfn) => {
			if(idroom.reachUpdate(socket)){
				manager.to(idroom.id).emit('recieveReach', socket.request.session.user.name);
				//セッションを保存
				socket.request.session.save((err) => {
					if(err) console.log('session save error' + err);
					reachfn();
				});
			}
		});
		//ビンゴ
		socket.on('bingo', (bingofn) => {
			if(idroom.bingoUpdate(socket)){
				manager.to(idroom.id).emit('recieveBingo', socket.request.session.user.name, idroom.bingoCount);
				sub.to(idroom.id).emit('updateBingoCount', idroom.bingoCount);
				//セッションを保存
				socket.request.session.save((err) => {
					if(err) console.log('session save error' + err);
					bingofn();
				});
			}
		});
	});
	
	//じゃんけん
	//運営者
	var janken_manager = io.of('/janken_manager').on('connection', function(socket) {
		if(!socket.request.session.user)
			return;
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) return;
		
		if(idroom.bingoCount == idroom.prizeMax){
			socket.emit('goLottery');  //じゃんけんの必要がない
			return;
		}
		socket.join(socket.request.session.user.id);
		
		idroom.jankenInit(socket);
		
		guest.to(idroom.id + Room.winner()).emit('redirect', '/guest/janken');
		sub.to(socket.request.session.user.id).emit('redirect', '/bingo/jankenscreen');
		
		//運営者のじゃんけんで判定
		socket.on('sendJanken', (te, fnSubmit) => {
			let resultJanken = idroom.isJankenSend(te, janken_guest, socket);
			if(resultJanken != -1){
				fnSubmit();
				janken_sub.to(idroom.id).emit('screenUpdate', te);
                janken_sub.to(idroom.id).emit('setScreenNum', idroom.prizeMax - idroom.bingoCount + idroom.lastBingoCount, idroom.lastBingoCount);
				if(resultJanken == 0){ //人数変動なし
					socket.emit('jankenStart');
					janken_guest.to(idroom.id).emit('jankenStart');
                    janken_sub.to(idroom.id).emit('screenUpdate', 'n');    //隠す
				}
			}
		});
		
		//スクリーンの表示をリセットする
		socket.on('screenReset', () => {
			janken_sub.to(socket.request.session.user.id).emit('screenUpdate', 'n');
		});
	});
	
	//運営者スクリーン用画面
	var janken_sub = io.of('/janken_sub').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
        let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) return;
		
		socket.join(socket.request.session.user.id);
        socket.emit('setScreenNum', idroom.prizeMax - idroom.bingoCount + idroom.lastBingoCount, idroom.lastBingoCount);
	});
	
	//参加者
	var janken_guest = io.of('/janken_guest').on('connection', function (socket) {
		if(!socket.request.session.user) {
			socket.emit('redirect', '/logout');
			return;
		}
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(idroom === undefined){
			socket.emit('redirect', '/logout/userexit');	//ログインしたけど部屋がなくなっていた場合のため
			return;
		}
		if(idroom.jankenGuestInit(socket, janken_guest)){
			return;
		}
		
		socket.on('sendJanken', (te, fn) => {
			if(idroom.jankenGuestSend(te, socket.request.sessionID)){
                if(idroom.lastBingoCount == idroom.janken.jankenWait){
                    janken_manager.to(idroom.id).emit('setMessage', '準備OK!出す手を選んでください');
                }
				fn();
			}
		});
		
		socket.on('resultWin', () => {
			socket.leave(idroom.id);
			socket.join(idroom.id + Room.winner());
			switch(idroom.jankenGuestUpdate()){
			case 1:	//抽選へ
				janken_manager.to(idroom.id).emit('goLottery');
				break;
			case 2:	//じゃんけん続行
				janken_manager.to(idroom.id).emit('jankenStart');
				janken_guest.to(idroom.id).emit('jankenStart');
				janken_sub.to(idroom.id).emit('screenUpdate', 'n');    //隠す
				break;
			}
		});
		
		socket.on('resultLose', () => {
			socket.leave(idroom.id);
			socket.request.session.guest.winner = Room.none(); //負けたら勝ちフラグを消す
			//セッションを保存
			socket.request.session.save((err) => {
			});
			switch(idroom.jankenGuestUpdate()){
			case 1:	//抽選へ
				janken_manager.to(idroom.id).emit('goLottery');
				break;
			case 2:	//じゃんけん続行
				janken_manager.to(idroom.id).emit('jankenStart');
				janken_guest.to(idroom.id).emit('jankenStart');
				janken_sub.to(idroom.id).emit('screenUpdate', 'n');    //隠す
				break;
			}
		});
	});
	
	//景品抽選なし
	var nolottery_manager = io.of('/nolottery_manager').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) return;
		
		socket.join(socket.request.session.user.id);
		idroom.noLotteryInit(socket);
		
		//終了
		socket.on('lotteryFinish', () => {
            idroom.janken = null;
			roomMaps.delete(idroom.id);
			
			guest.to(idroom.id).emit('redirect', '/logout/userexit');	//ルーム参加者を強制ログアウト
			nolottery_guest.to(idroom.id).emit('redirect', '/logout/userexit');
			socket.emit('logout');
		});
		
		janken_guest.to(idroom.id + Room.winner()).emit('redirect', '/guest/nolottery');
		janken_sub.to(idroom.id).emit('redirect', '/bingo/nolotteryscreen');
		janken_guest.to(idroom.id).emit('logoutOn');
		guest.to(idroom.id + Room.winner()).emit('redirect', '/guest/nolottery');
		sub.to(idroom.id).emit('redirect', '/bingo/nolotteryscreen');
	});
	
	var nolottery_sub = io.of('/nolottery_sub').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) return;
		
		socket.join(socket.request.session.user.id);
		idroom.noLotteryInit(socket);
	});
	var nolottery_guest = io.of('/nolottery_guest').on('connection', function (socket) {
		if(!socket.request.session.user) {
			socket.emit('redirect', '/logout');
			return;
		}
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(idroom === undefined){
			socket.emit('redirect', '/logout/userexit');	//ログインしたけど部屋がなくなっていた場合のため
			return;
		}
		if(socket.request.session.guest.winner == Room.none() || socket.request.session.guest.winner == Room.reach()) return;	//urlに直接アクセスされたときのため
		socket.join(socket.request.session.user.id);
		
		let guestInfo = idroom.lotteryGuestInit(socket);
		if(guestInfo){
			nolottery_manager.to(idroom.id).emit('sendResult', guestInfo);
			nolottery_sub.to(idroom.id).emit('sendResult', guestInfo);
		}
	});
	
	//景品抽選
	//運営者
	var lottery_manager = io.of('/lottery_manager').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) return;
		
		socket.join(socket.request.session.user.id);
		idroom.simpleLotteryInit(socket);
		
		//スクリーンに商品を映す
		socket.on('sendScreenLottery', (prize_id) => {
			let info = idroom.getPrizeInfo(prize_id);
			lottery_sub.to(idroom.id).emit('resetNumber');
			lottery_sub.to(idroom.id).emit('setLottery', info.name, info.picture_url);
		});
		//当選した抽選番号を決定して景品情報を送る
		socket.on('lotteryStart', (prize_id) => {
			if(idroom.simpleLotteryStart(socket)){
				let num = idroom.getCurrentNumber(prize_id);
                console.log(num);
				let info = idroom.getPrizeInfo(prize_id);
				lottery_sub.to(idroom.id).emit('setNumber', num + 1);
				lottery_guest.to(idroom.getWinnerSocketID(num)).emit('lotteryResult',
				info.name, info.picture_url);
			}
		});
		
		//終了
		socket.on('lotteryFinish', () => {
			if(idroom.simpleLotteryFinish()){
                idroom.janken = null;
				roomMaps.delete(idroom.id);
			}else{
				socket.emit('setMessage', "まだ配られていない景品があります。");
				return;
			}
			
			guest.to(idroom.id).emit('redirect', '/logout/userexit');	//ルーム参加者を強制ログアウト
			lottery_guest.to(idroom.id).emit('redirect', '/logout/userexit');
			socket.emit('logout');
		});
		
		janken_guest.to(idroom.id + Room.winner()).emit('redirect', '/guest/lottery');
		janken_sub.to(idroom.id).emit('redirect', '/bingo/lotteryscreen');
		janken_guest.to(idroom.id).emit('logoutOn');
		guest.to(idroom.id + Room.winner()).emit('redirect', '/guest/lottery');
		sub.to(idroom.id).emit('redirect', '/bingo/lotteryscreen');
	});

	//運営者スクリーン用画面
	var lottery_sub = io.of('/lottery_sub').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		socket.join(socket.request.session.user.id);
	});
	
	//参加者
	var lottery_guest = io.of('/lottery_guest').on('connection', function (socket) {
		if(!socket.request.session.user) {
			socket.emit('redirect', '/logout');
			return;
		}
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(idroom === undefined){
			socket.emit('redirect', '/logout/userexit');	//ログインしたけど部屋がなくなっていた場合のため
			return;
		}
		if(socket.request.session.guest.winner == Room.none() || socket.request.session.guest.winner == Room.reach()) return;	//urlに直接アクセスされたときのため
		socket.join(socket.request.session.user.id);
		
		let guestPriority = idroom.lotteryGuestInit(socket);
		if(guestPriority){
			console.log(socket.id);
			for(var i=0; i < guestPriority.length; i++){
				console.log(idroom.getWinnerSocketID(i));
				lottery_guest.to(idroom.getWinnerSocketID(i)).emit('lotteryNumber', i+1);	//抽選番号を送る
			}
			lottery_manager.to(idroom.id).emit('setMessage', "準備OK!");
		}
	});
	
	//アタック25
	var attack25_manager = io.of('/attack25_manager').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) return;
		
		socket.join(socket.request.session.user.id);
		idroom.attack25LotteryInit(socket);
		
		socket.on('lotteryStart', () => {
			let purl = idroom.attack25LotteryStart();
			socket.emit('setImages', purl);
			attack25_sub.to(idroom.id).emit('setImages', purl);
		});
		
		socket.on('lotteryGuestTurn', () => {
			attack25_sub.to(idroom.id).emit('hidePopup');
			idroom.attack25NextTurn(attack25_guest, socket);
		});
		
		//終了
		socket.on('lotteryFinish', () => {
            idroom.janken = null;
			roomMaps.delete(idroom.id)
			
			guest.to(idroom.id).emit('redirect', '/logout/userexit');	//ルーム参加者を強制ログアウト
			attack25_guest.to(idroom.id).emit('redirect', '/logout/userexit');
			socket.emit('logout');
		});
		//準備ができたので移動させる
		janken_guest.to(idroom.id + Room.winner()).emit('redirect', '/guest/attack25lottery');
		janken_sub.to(idroom.id).emit('redirect', '/bingo/attack25screen');
		janken_guest.to(idroom.id).emit('logoutOn');
		guest.to(idroom.id + Room.winner()).emit('redirect', '/guest/attack25lottery');
		sub.to(idroom.id).emit('redirect', '/bingo/attack25screen');
	});
	var attack25_sub = io.of('/attack25_sub').on('connection', function (socket) {
		if(!socket.request.session.user || !socket.request.session.user.administrator)
			return;
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(!idroom) return;
		socket.join(socket.request.session.user.id);
		
		idroom.attack25SubInit(socket);
	});
	var attack25_guest = io.of('/attack25_guest').on('connection', function (socket) {
		if(!socket.request.session.user) {
			socket.emit('redirect', '/logout');
			return;
		}
		let idroom = roomMaps.get(socket.request.session.user.id);
		if(idroom === undefined){
			socket.emit('redirect', '/logout/userexit');	//ログインしたけど部屋がなくなっていた場合のため
			return;
		}
		if(socket.request.session.guest.winner == Room.none() || socket.request.session.guest.winner == Room.reach()) return;	//urlに直接アクセスされたときのため
		socket.join(socket.request.session.user.id);
		
		let prizeMax = idroom.lotteryGuestInit(socket);
		if(prizeMax != -1){
			attack25_manager.to(idroom.id).emit('placeBox', prizeMax);
		}
		
		//抽選券の番号を送信された
		socket.on('sendLotteryNumber', (number, fn) => {
			let index = number - 1;
			let info = idroom.attack25SendNumber(index, socket.request.sessionID);
			let pic_url = '';
			if(info.picture_url) pic_url = info.picture_url;
			attack25_manager.to(idroom.id).emit('sendPrizeNumber', index, pic_url);
			attack25_sub.to(idroom.id).emit('sendPrizeNumber', index, pic_url, info.name);
			fn(info.name, pic_url);
		});
	});
	
	//ルーム選択
	var room = io.of('/room').on('connection', function (socket) {
		roomMaps.forEach(function(value, key, map){
			if(value.isRoomModeBingo())
				socket.emit('addRoom', value.name);
		});
	});
	
	return router;
}
