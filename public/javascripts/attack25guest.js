const attack25_guest = io('/attack25_guest');

(function($){  // 無名関数($の競合を回避)
// ポップアップ用のタグを消す
$('#popup-background').hide();
$('#popup-background2').hide();
$('#popup-background3').hide();
var selectnumber =[]
var hoveryouso;
//var count=0;
var trcount = 0;
var i = 1;
let loadflag = false;	//運営者がリロードして何度も送信してくる可能性があるので

attack25_guest.on('guestStart', (opens) => {
if(loadflag) return;
loadflag = true;
//td作成
for(var count = 1; count <= opens.length; count++){
	$('#table'+i).append('<div class="tiketd"><div class="tikekazu"></div></div>');
	//奇数の場合
	if( (count  % 2 ) != 0 ) {
		$('.tiketd').eq(count-1).css('margin-left',"31px");
		$('.tiketd').eq(count-1).css('margin-top',"13px");
		$('.tiketd').eq(count-1).css('float',"left");
	
	}
	//偶数の場合
	if( (count  % 2 ) == 0 ) {
		$('.tiketd').eq(count-1).css('margin-left',"4px");
		$('.tiketd').eq(count-1).css('margin-top',"13px");
		$('.tiketd').eq(count-1).css('float',"left");
	
	}
    if(opens[count-1]){ //開封済み
        $('.tiketd').eq(count-1).children().text("");
        $('.tiketd').eq(count-1).css({"background-image":'url("/images/tike5.png")'});
        selectnumber.push($('.tiketd').eq(count-1));
    }else{
        if(count <= 9){
                $('.tikekazu').eq(count-1).text("0" + (count));
        }else{
                $('.tikekazu').eq(count-1).text(count);
        }
        if(count%8 == 0 ){
            i++;
        }
    }
}
var flag2;
//hoverの処理（tdにクラスをつける)
$(".tiketd").hover(function(){
	hoveryouso=this;
	var flag = "1";
	$.each(selectnumber,function(index,number) {
  		if($(hoveryouso).children().text() == ""){
			flag = "0"; 
			return false;
		}
	});
	var url = $(this).css("background-image");
	if(flag == "0"){
		$(this).css({"background-image":'url("/images/tike5.png")'});
		flag2 = "0";
	}else{
		$(this).css({"background-image":'url("/images/tike2.png")'});
		flag2 = "1";
	}
},function(){
	if(flag2 == "0"){
		$(this).css({"background-image":'url("/images/tike5.png")'});
	}else{
		$(this).css({"background-image":'url("/images/tike.png")'});
	}
});
        $('#setumeiok').text("Your Turn!");
        $('#setumeiok').css({"color":'tomato'});
        $('#setumeiok').prop("disabled", false);
    });
    
    //景品が贈られた
    //attack25_guest.on('sendPrize', (name, picture_url) => {
    //    $('#popup-td2').css({"background-image":"url("+picture_url+")"});
    //    $('#popup-td3').text(name);
    //});

    //リダイレクト
    attack25_guest.on('redirect', (url) => {
	   window.location.href = url;
    });
    //リロード時
    attack25_guest.on('lotteryResult', (name, picture_url) => {
        $('#popup-td2').css({"background-image":"url("+picture_url+")"});
        $('#popup-td3').text(name);
        $('#setumei').hide();
        $('#setumeiok').hide();
        //$('#popup-background3').fadeIn();
        //setTimeout(function(){ 
        keihinpop();
        //},5000);
    });
    
//count=0;
setTimeout(function(){ ChangeTab('table1')},0);
//最初の画面の削除
$('#setumeiok').bind('click', function(e){
	$('#setumei').hide();
	$('#setumeiok').hide();
});

//クリックされた時のイベント定義
 $('.okbotton').bind('click', function(e){

        // aタグでデフォルト動作を無効にする
        e.preventDefault(); 
	if(hoveryouso == null || $(hoveryouso).children().text() == ""){
		alert("番号が選択されていません!!");
	}else{
		
	// 選択確認
	if(!confirm($(hoveryouso).children().text()+'番でよろしいでしょうか？')){
		return false;
	} else {
        attack25_guest.emit('sendLotteryNumber', parseInt($(hoveryouso).children().text()),
        function(name, picture_url) {
        	$('#popup-td2').css({"background-image":"url("+picture_url+")"});
        	$('#popup-td3').text(name);
        });
		setTimeout(function(){ tikeyaburi(0)},0);
	}
	}
});
function tikeyaburi(kazu){
  $('#popup-background2').fadeIn();
  selectnumber.push($(hoveryouso).children().text());
  //$(hoveryouso).fadeOut();
  //$(hoveryouso).remove();
  $("#tike4kazu").text( $(hoveryouso).children().text());
	if(kazu == 1){
	  $("#tike3").animate({marginLeft: "-800px",deg:"30"}, {duration:1000,
				// 途中経過
				progress:function() {
					$('#tike3').css({
						transform:'rotate(' + this.deg + 'deg)'
					});
				}
	  });
	  $("#tike4").animate({marginLeft: "1500px",deg:"-70"}, {duration:1000,
				// 途中経過
				progress:function() {
					$('#tike4').css({
						transform:'rotate(' + this.deg + 'deg)'
					});
				}
	  });
	  $("#tike4kazu").animate({marginLeft: "1500px",deg:"-250"}, {duration:1500,
				// 途中経過
				progress:function() {
					$('#tike4kazu').css({
						transform:'rotate(' + this.deg + 'deg)'
					});
				}
	  });
	  setTimeout(function(){ kyuukei()},2000);
	}else{
	setTimeout(function(){ tikeyaburi(1)},500);
	}
}
function kyuukei(){
  $(hoveryouso).children().text("");
  $(hoveryouso).css({"background-image":'url("/images/tike5.png")'});
  $('#popup-background3').fadeIn();
  setTimeout(function(){ keihinpop()},6000);	//6秒待つ
}
function keihinpop(){
$('#popup-background').fadeIn(100);
//星を作る関数。n は星の個数。多いほど星が多く振ります。
	function starMaker(n) {
	    var star = document.createElement("popup-background");
	    star.className = "star";
	    star.textContent = "★";

	    //★●◆■▼▲
	    for(var i = 0; i < n; i++) {
	        starSet(star);
	    }
	}
	//星のセッティングをする関数。
	function starSet(clone) {
	    var starClone = clone.cloneNode(true);
	    var starStyle = starClone.style;
	    //星の位置（left）、アニメーションの遅延時間（animation-delay）、サイズ（font-size）をランダムで指定
	    starStyle.left = 100 * Math.random() + "%";
	    starStyle.animationDelay = 8 * Math.random() + "s";
	    starStyle.fontSize = ~~(50 * Math.random() + 20) + "px";
	    document.body.appendChild(starClone);
	    //星一つのアニメーションが終わったら新しい星を生成
	    /*starClone.addEventListener("animationend", function() {
	        this.parentNode.removeChild(this);
	        var star = document.createElement("popup-background");
	        star.className = "star";
	        star.textContent = "★";
	        starSet(star);
	    }, false)
	   */
	}
	//使用例。星を50個ふらせます。
	starMaker(50)
}

    /*
 $('#kakunin').bind('click', function(e){
	if(!confirm('本当に削除してよろしいですか？')){
		return false;
	} else {
		
	}
$('#popup-background').hide();
$('#popup-background2').hide();
$('#popup-background3').hide();
 });
*/
})(jQuery)

function ChangeTab(tabname) {
  document.getElementById('table1').style.display = 'none';
  document.getElementById('table2').style.display = 'none';
  document.getElementById('table3').style.display = 'none';
  document.getElementById('table4').style.display = 'none';
  
  document.getElementById(tabname).style.display = 'block';

}
