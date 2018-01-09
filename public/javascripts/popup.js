(function($){  // 無名関数($の競合を回避)
    // ポップアップ用のタグを消す
$('#popup-background').animate({'left' : 1500},0);

    
    // class「popupimg」のリンクがクリックされた時のイベント定義
    $('.popupimg').bind('click', function(e){
        // aタグでデフォルト動作を無効にする
        e.preventDefault(); 
        // クリックされたaタグのhrefを取得する
        var imgsrc = this.href;
            imgload();
	//ID'　　'のCSS変更
	$('#to').css('background-image', 'url('+imgsrc+')');

	//guestはbingocard.jsで宣言されたグローバル変数
	//(ローカル変数にするとインスタンスが2つになり、セッションが複数生成されるらしいので)
	//socket.ioを使って詳細をサーバに問い合わせる
	guest.emit('prizeInfo', this.lastChild.innerHTML);

    });

    // ポップアップされた領域のクリックイベント
    $('#popfooter').bind('click', function(){
        // ポップアップを消すため、タグをフェードアウトさせる
        $('#popup-background').animate({'left' : 1500}, 500);

        
    });

    // ポップアップ表示用関数
    function imgload(){
        // ポップアップの背景部分を表示する
	$('#popup-background').animate({'left' : 0}, 500);
            // 画像の表示用タグにCSSを当て、表示を行う

        
    }
})(jQuery)

guest.on('getPrize', (name, count, setumei) => {
	//ID'　　'のtext変更
	$('#keihinname').text(name);
	$('#kazu').text(count);
	$('#setumei').text(setumei);
});