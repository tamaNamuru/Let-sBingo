//socket.io
const janken_guest = io('/janken_guest');
let wait = true;    //trueで結果待ちor待機中

$(function() {
 $('.btn2').bind('click', function(e){
		var te = this;
		$("#gu_btn").css({"border":"solid "});
		$("#ch_btn").css({"border":"solid "});
		$("#pa_btn").css({"border":"solid "});
		$(this).css({"border":"solid 10px #f00"});
		setTimeout(function(){ pop(te)},0);

});

function pop(e){
    if(wait) return;
	var te = "";
	switch($(e).val()){
	case "1":
		te = "グー";
		break;
	case "2":
		te = "チョキ";
		break;
	case "3":
		te = "パー";
		break;
	}

	if(!confirm(te + 'でいいですか？')){
		return false;
	}
	$("#gu_btn").hide();
	$("#ch_btn").hide();
	$("#pa_btn").hide();
	$("#all_btn").show();
	if($(e).val() == "1"){	
		$("#all_btn").css({'background-image':'url("/images/gu.jpg")'});
        te = "g";
	}else if($(e).val() == "2"){
		$("#all_btn").css({'background-image':'url("/images/ch.jpg")'});
        te = "c";
	}else{
		$("#all_btn").css({'background-image':'url("/images/pa.jpg")'});
        te = "p";
	}
    janken_guest.emit('sendJanken', te, () => {
        $("#use").text("しばらくお待ちください。");
        wait = true;
    });
}

function reset(){
	$("#gu_btn").show();
	$("#ch_btn").show();
	$("#pa_btn").show();
	$("#all_btn").hide();
}

janken_guest.on('jankenStart', () => {
    wait = false;
    $("#use").text("グー、チョキ、パーのいずれか1つ選んでください。");
    reset();
});

janken_guest.on('katinuke', () => {
    $("#use").text("あなたは景品を獲得できます！");
});

janken_guest.on('sendWin', () => {
    $("#use").text("あなたの勝ち！");
    janken_guest.emit('resultWin');
});

janken_guest.on('sendLose', () => {
    $("#use").text("あなたの負け<br>お疲れさまでした。5秒後に自動でログアウトします。");
    janken_guest.emit('resultLose');
    //$("#all_btn").after("<input type='button' onclick='location.href=\"/logout/userexit\"' value='ログアウト'/>");
    setTimeout(()=>{ window.location.href = "/logout/userexit" },5000);
});
    
janken_guest.on('logoutOn', () => {
    $("#use").text("お疲れさまでした。5秒後に自動でログアウトします。"); //下のボタンからログアウトしてください。
    //$("#all_btn").after("<input type='button' onclick='location.href=\"/logout/userexit\"' value='ログアウト'/>");
    setTimeout(()=>{ window.location.href = "/logout/userexit" },5000);
})
//リダイレクト
janken_guest.on('redirect', (url) => {
	window.location.href = url;
});
//リロードじゃんけん結果待ち
janken_guest.on('reloadView', (te) => {
    $("#gu_btn").hide();
	$("#ch_btn").hide();
	$("#pa_btn").hide();
	$("#all_btn").show();
	if(te == "g"){	
		$("#all_btn").css({'background-image':'url("/images/gu.jpg")'});
	}else if(te == "c"){
		$("#all_btn").css({'background-image':'url("/images/ch.jpg")'});
	}else if(te == "p"){ //パー
		$("#all_btn").css({'background-image':'url("/images/pa.jpg")'});
	}
});
});