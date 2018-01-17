var express = require('express');
var router = express.Router();

var connection = require('../tediousConnection');
var select = 'SELECT room_id FROM room WHERE name = ?';
//連続する500枚のカードは重複しないようにする。
//nodeはノンブロッキングなのであまりガードにはなっていない。
var cardChecks = [];

//参加者のログイン
router.post('/user', function(req, res, next) {
    if(req.session.user && req.session.user.administrator){ //運営者としてログイン中なので
        res.redirect('/');
        return;
    }
	if(0 == req.body.userName.length) {
		res.render('enter', {title: "Let's Bingo", error: '名前を入力してください。'});
	} else {
		connection.query(select, [req.body.roomName], function(error, result) {
			if(result.length == 0 || result[0].room_id != req.body.roomid) {
				console.log("id:" + req.body.roomid + "\npass:" + result[0].room_id);
				res.render('enter', {title: "Let's Bingo", error: 'IDが正しくありません。'});
			} else {
				if(req.session.user && req.session.guest){	//念のため
					if(req.session.user.id != req.body.roomid)	//別の部屋に入る場合は勝利フラグを消す
						req.session.guest.winner = 'none';
				}
				req.session.user = {id: req.body.roomid, name: req.body.userName, administrator: false};
				if(!req.session.guest){	//参加者固有のセッション
					//ここでビンゴカードのもとを作る
					//重複するカードが出ないようにする
					let card = "";
                    do {
                        for(let i=0; i < 5; i++) {
                            let range = i * 15 + 1;
                            let numSet = new Set();
                            for(let j=0; j < 5; j++) {
                                let num;
                                do {
                                    num = Math.floor(Math.random() * 15) + range;
                                }while(numSet.has(num));
                                numSet.add(num);
                                if(num < 10)
                                    card += " ";
                                card += num;
                            }
                        }
                    }while(cardChecks.indexOf(card) != -1);
                    cardChecks.push(card);
                    if(cardChecks.length > 500){
                        cardChecks.shift();
                    }
					//参加者のカード, 勝利フラグ none:ビンゴ中, reach:リーチ, 4～75:ビンゴ済み(数字はビンゴまでの抽選回数)
					req.session.guest = {card: card, winner: 'none'};
				}
				
				res.redirect('../guest');
			}
		});
	}
});

module.exports = router;
