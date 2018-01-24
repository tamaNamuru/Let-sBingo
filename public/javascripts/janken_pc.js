const janken_manager = io('/janken_manager', {transports: ['websocket']});

var unei_te;
var eventkakunin = 0;
function te_select(obj) {
    var start_gu = document.getElementById("gu_btn")
    var start_ch = document.getElementById("ch_btn");
    var start_pa = document.getElementById("pa_btn");
    unei_te = obj.value;
    if(!confirm(unei_te + 'でいいですか？')){
        return false;
    }
    //じゃんけんのimgを取得
    var gu_img = (start_gu.currentStyle || document.defaultView.getComputedStyle(start_gu,'')).backgroundImage;
    var ch_img = (start_ch.currentStyle || document.defaultView.getComputedStyle(start_ch,'')).backgroundImage;
    var pa_img = (start_pa.currentStyle || document.defaultView.getComputedStyle(start_pa,'')).backgroundImage;
    //選択した手の表示
    var hyoji_te = document.getElementById("hyoji_te");
    switch(unei_te) {
        case "グー": hyoji_te.style.backgroundImage = gu_img;
            unei_te = 'g';
            break;
        case "チョキ": hyoji_te.style.backgroundImage = ch_img;
            unei_te = 'c';
            break;
        case "パー": hyoji_te.style.backgroundImage = pa_img;
            unei_te = 'p';
            break;
    }
    janken_manager.emit('sendJanken', unei_te, () => {
        start_gu.style.visibility ="hidden";
        start_ch.style.visibility ="hidden";
        start_pa.style.visibility ="hidden";

        hyoji_te.style.visibility = "visible";
    });
}
function reset() {
    document.getElementById("gu_btn").style.visibility = "visible";
    document.getElementById("ch_btn").style.visibility = "visible";
    document.getElementById("pa_btn").style.visibility = "visible";
    document.getElementById("hyoji_te").style.visibility = "hidden";
}
function next(){
    window.location.href = '/bingo/lottery';
}
janken_manager.on('jankenStart', () => {
    document.getElementById("message").innerHTML = "まだ手が決まっていない人がいます。しばらくお待ちください。";
    //次のじゃんけんを開始するボタンを作ったほうがいいかもしれないがとりあえず三秒後次に進む
    window.setTimeout( () => {
        reset();
        janken_manager.emit('screenReset');
    }, 3000);
})
janken_manager.on('goLottery', () => {
    document.getElementById("gu_btn").style.visibility ="hidden";
    document.getElementById("ch_btn").style.visibility ="hidden";
    document.getElementById("pa_btn").style.visibility ="hidden";
    document.getElementById("next").disabled = false;
    document.getElementById("message").innerHTML = "下のボタンから景品抽選に進んでください。";
});
janken_manager.on('setMessage', (message) => {
    document.getElementById("message").innerHTML = message;
});

janken_manager.on('setPrizeMax', (prizeMax) => {
    document.getElementById("nin4").innerHTML = prizeMax;
});

janken_manager.on('setNin', (nin) => {
    document.getElementById("nin2").innerHTML = nin;
});
