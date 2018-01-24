const janken_sub = io('/janken_sub', {transports: ['websocket']});

$(function() {
	var first_img = "/images/usa.png"; //じゃんけんなし
	var janken_array = ["/images/usa.png","/images/usagu.png", 
		"/images/usach.png", "/images/usapa.png"]; //表示なし(0),グー(1)、チョキ(2)、パー(3)
    $('.btn').on("click", function() {
        //選択したもの格納
        var te = $(this).val();
        
        switch(te) {
            case "グー": changeImg(1);
                break;
            case "チョキ": changeImg(2);
                break;
            case "パー": changeImg(3);
                break;
            default: changeImg(0);
                break;
        }
    });
    function changeImg(te) {
        var te_img = janken_array[te];
            $('#re').attr({
            "src": te_img
            }, 2000);
    }

    janken_sub.on('screenUpdate', (te) => {
        switch(te) {
            case "g": changeImg(1);
                break;
            case "c": changeImg(2);
                break;
            case "p": changeImg(3);
                break;
            default: changeImg(0);
                break;
        }
    });
    
    janken_sub.on('redirect', (url) => {
        window.location.href = url;
    });

    janken_sub.on('setScreenNum', (nokori, lastBingoCount) => {
        document.getElementsByClassName("nin2")[0].innerHTML = nokori;
        document.getElementsByClassName("nin2")[1].innerHTML = lastBingoCount;
    });
});