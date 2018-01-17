//クラス共通の変数
var connection = require('../tediousConnection');
var select = 'SELECT name, count, description FROM prize WHERE room_id = ? AND prize_id = ?';
var sum = 'SELECT SUM(count) AS prizeMax FROM prize WHERE room_id = ?';

var none = 'none'; //guest.winner
var reach = 'reach'
var winner = 'winner'; //勝ち残りのroom分け

var Janken = require('./Janken');
var NoLottery = require('./NoLottery');
var SimpleLottery = require('./SimpleLottery');
var Attack25Lottery = require('./Attack25Lottery');

module.exports = class Room {
	//ビンゴ
	//運営者
	constructor(socket) {
		this.id = socket.request.session.user.id;
		this.name = socket.request.session.user.name;
		this.mode = 0;	//0:ビンゴ中, 1:じゃんけん中, 2:景品抽選中
		this.numbers = [];	//抽選番号 例：[0,1,2…] = 25, 50, 2…
		for(let i=1; i <= 75; i++)
			this.numbers.push(i);
		//シャッフル
		let a = 75;
		while(a) {
			let j = Math.floor(Math.random() * a);
			let t = this.numbers[--a];
			this.numbers[a] = this.numbers[j];
			this.numbers[j] = t;
		}
		this.curIndex = 0;	//抽選された数 = index(0～74)
		this.bingoCount = 0;	//当選者の数(0～)
		this.lastBingoCount = 0;	//じゃんけんする可能性がある人数
		this.addPrize = [];  //[index] = {name: , count: }
		let self = this;
		//景品の総数を取得
		connection.query(sum, [this.id], function(error, result) {
			self.prizeMax = result[0].prizeMax;	//景品の数
			//景品の数, ビンゴ人数
			socket.emit('roomInit', result[0].prizeMax, self.bingoCount);
		});
	}
	
	//ビンゴ中以外であればtrueを返す
	moveMode(socket) {
		switch(this.mode){
		case 1: //じゃんけん
			socket.emit('redirect', '/bingo/janken');
			return true;
		case 2:	//景品抽選にリダイレクト
			socket.emit('redirect', '/bingo/lottery');
			return true;
		}
		socket.emit('roomInit', this.prizeMax, this.bingoCount);	//リロード
		return false;
	}
	
	//景品の数よりビンゴ者が少なければtrue
	bingoCountCheck() {
		return this.bingoCount < this.prizeMax;
	}
	//成功時：送信する数字, エラー：-1
	getSendNumber() {
		if(this.bingoCountCheck() && this.curIndex < 75){
			this.lastBingoCount = 0;
			return this.numbers[this.curIndex++];
		}
		return -1;
	}
	//景品追加
	addPrizes(socket, prizes) {
		for(let i=0; i < prizes.length; i++){
			if(prizes[i].name != ""){
				this.addPrize.push(prizes[i]);
				this.prizeMax += parseInt(prizes[i].count, 10);
			}
		}
		socket.emit('roomInit', this.prizeMax, this.bingoCount);	//再初期化
	}
	//じゃんけんか抽選へリダイレクト
	nextScene(socket) {
		if(this.bingoCount > this.prizeMax){
			socket.emit('redirect', '/bingo/janken');
		}else{
			socket.emit('redirect', '/bingo/lottery');
		}
	}
	//参加者
	//参加者がビンゴに参加する必要がなければtrue
	guestInit(socket) {
		if(socket.request.session.guest.winner != none &&
			socket.request.session.guest.winner != reach){    //勝利フラグが立っていれば
			switch(this.mode){	//ビンゴ以外であればリダイレクト
			case 1: //じゃんけん
				socket.emit('redirect', '/guest/janken');
				return true;
			case 2:	//景品抽選
				socket.emit('redirect', this.lottery.guestJumpurl);
				return true;
			}
			socket.join(this.id + winner);
		}else{
			socket.join(this.id);
		}
		//景品詳細表示
		socket.on('prizeInfo', (prizeid) => {
			connection.query(select, [this.id, prizeid], function(error, result) {
				if(error) console.log("select error");
				socket.emit('getPrize', result[0].name, result[0].count, result[0].description);
			});
		});
		if(this.mode != 0 )	//ビンゴが終わっていても景品閲覧だけはできるようにする
			return true;
		
		//カードを設定するここで抽選済みの数も送る
		socket.emit('cardSet', socket.request.session.guest.card, this.numbers.slice(0, this.curIndex));
		return false;
	}
	
	reachUpdate(socket){
		if(socket.request.session.guest.winner == none){
			socket.request.session.guest.winner = reach;
			return true;
		}
		return false;
	}
	
	bingoUpdate(socket){
		if(socket.request.session.guest.winner == reach){
			++this.bingoCount;
			++this.lastBingoCount;
			socket.leave(this.id);	//番号を受信する必要がなくなったので部屋を抜け
			socket.join(this.id + winner);	//ビンゴ済みのルームに
			socket.request.session.guest.winner = this.curIndex;	//景品獲得の権利取得
			return true;
		}
		return false;
	}
	
	//じゃんけん
	//運営者
	jankenInit(socket) {
		if(this.mode == 0){	//ビンゴから移行した場合初期化
			this.mode = 1;	//じゃんけん
			this.janken = new Janken();
		}
        socket.emit('setPrizeMax', this.prizeMax);
        socket.emit('setNin', this.bingoCount - this.lastBingoCount);
	}
	
	//-1:送信失敗, それ以外:変動した人数
	isJankenSend(te, janken_guest, socket) {
		if(this.lastBingoCount > this.janken.jankenWait){
			socket.emit('setMessage', "まだ出す手を決めていない人がいます");
			return -1;
		}
		let bc = this.janken.jankenJadge(te, this.prizeMax - this.bingoCount + this.lastBingoCount, janken_guest);
		this.bingoCount += bc[0];
		this.lastBingoCount += bc[1];
        socket.emit('setNin', this.bingoCount - this.lastBingoCount);
		return this.janken.resultJanken;
	}
    
	//参加者
	//じゃんけんに参加する必要がなければtrue
	jankenGuestInit(socket, janken_guest) {
		if(socket.request.session.guest.winner == this.curIndex){ //じゃんけん参加
			socket.join(socket.request.session.user.id);
		}else{  //景品取得確定済み
			if(socket.request.session.guest.winner == none || socket.request.session.guest.winner == reach) return true;
			socket.join(socket.request.session.user.id + winner);
			return true;
		}
		switch(this.janken.guestCheck(socket)){
		case 0:	//終了済み
			return true;
		case 1:	//一度目の接続
			if(this.janken.winnerSessionsSize() == this.lastBingoCount){
				janken_guest.to(socket.request.session.user.id).emit('jankenStart');
			}
			break;
		}
		return false;
	}
	
	jankenGuestSend(te, sessionID) {
		return this.janken.guestSend(te, sessionID);
	}
	
	//1:抽選, 2:じゃんけん続行
	jankenGuestUpdate() {
		if(this.janken.isJankenResultEnd()){
			if(this.bingoCount - this.lastBingoCount == this.prizeMax){
				this.janken = null;	//破棄は無理にここでしなくてもいいか？
				return 1;
			}
			return 2;
		}
		return 0;
	}
	
	//景品抽選なし
	//運営者
	noLotteryInit(socket){
		if(this.mode != 2){	//初回
			this.mode = 2;
			this.lottery = new NoLottery();
		}else{
			this.lottery.reloadInit(socket);
		}
	}
	
	//参加者初期化
	lotteryGuestInit(socket){
		return this.lottery.guestInit(socket, this.prizeMax);
	}
	
	//マリパくじ
	simpleLotteryInit(socket){
		if(this.mode != 2){
			this.mode = 2;
			let self = this;
			connection.query('SELECT name, count, picture_url FROM prize WHERE room_id = ?', [this.id], function(error, result) {
				for(let i=0; i < self.addPrize.length; i++){
					result.push({name: self.addPrize[i].name, count: self.addPrize[i].count, picture_url: ''});
				}
				socket.emit('init', result, self.prizeMax);
				self.lottery = new SimpleLottery(result);
			});
		}else{
			socket.emit('init', this.lottery.prizeInfo, this.prizeMax);
		}
	}
	
	//一つの景品情報獲得
	getPrizeInfo(prize_id) {
		return this.lottery.getPrizeInfo(prize_id);
	}
	//抽選した人のindexを獲得
	getCurrentNumber(prize_id) {
		--this.prizeMax;
		return this.lottery.nextNumbers(prize_id);
	}
	
	getWinnerSocketID(index) {
		return this.lottery.getSocketID(index);
	}
	
	//trueであれば景品情報を参加者に送る
	simpleLotteryStart(socket) {
		return this.lottery.lotteryCheck(socket, this.prizeMax);
	}
	
	//trueであれば終了
	simpleLotteryFinish() {
		if(this.prizeMax > 0){
			return false;
		}
		return true;
	}
	
	//アタック25
	attack25LotteryInit(socket){
		if(this.mode != 2){
			this.mode = 2;
			let self = this;
			connection.query('SELECT name, count, picture_url FROM prize WHERE room_id = ?', [this.id], function(error, result) {
				for(let i=0; i < self.addPrize.length; i++){
					result.push({name: self.addPrize[i].name, count: self.addPrize[i].count, picture_url: ''});
				}
				self.lottery = new Attack25Lottery(result);
			});
		}else{
			this.lottery.reloadInit(socket, this.prizeMax);
		}
	}
	
	//大画面用の景品のurlを返す
	attack25LotteryStart(){
        this.lottery.shaffule = true;
		return this.lottery.getPictureURLs();
	}
	
	attack25NextTurn(attack25_guest, socket) {
		this.lottery.startGuestTurn(attack25_guest, socket, this.prizeMax);
	}
	
	attack25SubInit(socket) {
		this.lottery.subInit(socket);
	}
	//送られた番号に対応する景品情報取得
	attack25SendNumber(index, sessionID) {
		return this.lottery.numberToLottery(index, sessionID);
	}
	
	isRoomModeBingo(){
		return this.mode == 0;
	}
	
	/*get set を設定できるらしい
	get id() {
		return this.id;
	}
	
	get name() {
		return this.name;
	}
	
	get bingoCount() {
		return this.bingoCount;
	}
	
	get prizeMax() {
		return this.prizeMax;
	}
	*/
	static winner() {
		return winner;
	}
	
	static none() {
		return none;
	}
	
	static reach() {
		return reach;
	}
}
