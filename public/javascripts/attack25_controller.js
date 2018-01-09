const attack25_manager = io('/attack25_manager');

//transform:'rotate(200deg)' 傾けるCSS
(function($){  // 無名関数($の競合を回避)
    var center = $('#center').offset();
    var count = 0;
    var stopcount = 0;
    var tdarray1 = new Array();
    var tdarray2 = new Array();
    var img1 = new Array();
    //var img2 = new Array();
    var array;
    var tenmetucount =0;
    var vwint = [[830,0],[595,470],[440,390],[365,300],[170,325],[130,285],[90,245]];
    var boxkazu;
//4行  17vh;
//3行  26vh;
    //8個  10;   235;
    //7個　90;   245;
    //6個　130;　285;
    //5個　170;　325;
    //4個  365;  300;
    //3個  440;  390;
    //2個  595;  470;
    //1個  830;


//景品の取得↓
attack25_manager.on('sendPrizeNumber', (number, picture_url) => {
	tenmetucount =0;
    img1[number] = picture_url; //サーバ側で抽選権の番号を-1している
	count = number;			
	setTimeout(function(){ tenmetu(count,1)},500);
	setTimeout(function(){ idou(count)},5500);
	setTimeout(function(){ henka(count)},7500);
	setTimeout(function(){ popup(count)},8000);
});
    
//画像を交互に出して点滅
function tenmetu(count,i){
	if(i==0){
	$('td').eq(count).css('background-image',"url(/images/l_e_present_70.png)");
	setTimeout(function(){ tenmetu(count,1)},500);
	tenmetucount++;
	}else if(tenmetucount >= 8){
	}else{
		$('td').eq(count).css('background-image',"url(/images/check_present.png)");
		setTimeout(function(){ tenmetu(count,0)},500);
		tenmetucount++;
	}
}
//最初の移動
   function idou(count,i){
   	var top1 = $('td').eq(count).offset();
	var top2 = top1.top;
	var left1 = top1.left;	
	$('td').eq(count).css({ position:'absolute',zIndex:2 });
	$('td').eq(count).animate({'left':center.left - parseInt($('td').eq(count).css("margin-left")) , 
	'top': center.top,height:"240px",width:"300px"},1000);
	setTimeout(function(){ modoru(count,top2,left1)},8000);
   }
//ボックスを開け煙を出す
   function henka(count){
	$('td').eq(count).css('background-image',"url(/images/hako.png)");
	$( "#minikemuri" ).fadeIn( "slow" ) ;
   }
//2回目の移動
   function modoru(count,e,q){
		$('td').eq(count).css({ position:'absolute',zIndex:1,height:"160px",width:"200px" });
		$( "#minikemuri" ).fadeOut(0) ;
		$('td').eq(count).css('background-image',"url("+img1[count]+")");
		$('td').eq(count).css('font-size',"0px");
		$('td').eq(count).animate({'left':q - parseInt($('td').eq(count).css("margin-left"))  ,'top': e},0);
   }
//煙を出しポップアップを表示させる
   function popup(count){
	$("#keihinimg").css('background-image',"url("+img1[count]+")");
	$("#kemuri").fadeIn();
	$("#kemuri").fadeOut( 2000 ) ;
	$("#keihinimg").fadeIn( 2000 ) ;
	$("#waku").fadeIn( 4000 ) ;	
   }
//ポップアップをクリックすると消す	
   $('#keihinimg').bind('click', function(){
       $('#keihinimg').fadeOut();
       $("#waku").fadeOut();
       attack25_manager.emit('lotteryGuestTurn');
   });

$('#startButton').bind('click', function(e){
    attack25_manager.emit('lotteryStart');
});

attack25_manager.on('placeBox', (boxNum) => {
    boxkazu = boxNum;
    var boxkazu2 =  0;
    for(var j = 0; j< 4;j++){
		if(boxkazu2 == boxkazu){
			break;
		}
        $('#table').append('<tr></tr>');
        for(var i = 0; i< 8;i++){
			$('tr').eq(j).prepend('<td></td>');
			boxkazu2++;
			if(boxkazu2 == boxkazu){
				break;
			}
		}	
    		
	}
	var boxkazu2 = 0;
	for(var j = 0; j< 4;j++){
		if(boxkazu2 == boxkazu){
			break;
		}
		var vw = 10;
    		if(Math.floor(boxkazu/8) == j && j != 0){
			vw = vwint[boxkazu-j*8-1][0];
    			for(var i = 0; i < 8;i++){
				$('td').eq(count).css('margin-left',vw+"px");
				count++;
				vw = vw + vwint[boxkazu-j*8-1][1];
				boxkazu2++;
				if(boxkazu2 == boxkazu){
					break;
				}
			}
		}else{
			for(var i = 0; i < 8;i++){
				$('td').eq(count).css('margin-left',vw+"px");
				count++;
				vw = vw + 235;
				boxkazu2++;
				if(boxkazu2 == boxkazu){
					break;
				}
			}
		}
    }
    $('#startButton').prop("disabled", false);
});
    
    attack25_manager.on('reloadInit', (opens, images, cur_url) => {
        img1 = images;
        boxkazu = opens.length;
		var boxkazu2 =  0;
		for(var j = 0; j< 4;j++){
			if(boxkazu2 == boxkazu){
				break;
			}
	        $('#table').append('<tr></tr>');
	        for(var i = 0; i< 8;i++){
				$('tr').eq(j).prepend('<td></td>');
				boxkazu2++;
				if(boxkazu2 == boxkazu){
					break;
				}
			}
		}
		boxkazu2 = 0;
		for(var j = 0; j < 4;j++){
			if(boxkazu2 == boxkazu){
				break;
			}
			var vw = 10;
    		if(Math.floor(boxkazu/8) == j && j != 0){
				vw = vwint[boxkazu-j*8-1][0];
    			for(var i = 0; i < 8;i++){
					$('td').eq(count).css('margin-left',vw+"px");
					count++;
					vw = vw + vwint[boxkazu-j*8-1][1];
					boxkazu2++;
					if(boxkazu2 == boxkazu){
						break;
					}
				}
			}else{
				for(var i = 0; i < 8;i++){
					$('td').eq(count).css('margin-left',vw+"px");
					count++;
					vw = vw + 235;
					boxkazu2++;
					if(boxkazu2 == boxkazu){
						break;
					}
				}
			}
    	}
    	for(i = 0;i<boxkazu;i++){
	        if(opens[i]){
	            $('td').eq(i).css('background-image',"url("+img1[i]+")");
	        }else{
	            $('td').eq(i).css('background-image',"url(/images/l_e_present_70.png)");
	        }
		}
		$("#keihinimg").css('background-image',"url("+cur_url+")");
		$("#keihinimg").fadeIn( 2000 ) ;
		$("#waku").fadeIn( 4000 ) ;	
    });
    
//景品セット↓
attack25_manager.on('setImages', (images) => {
    $('#startButton').prop("disabled", true);
	var tdlength = $('td').length;
    img1 = images;
    //景品画像を挿入する
	for(i = 0;i<tdlength;i++){
		var imgtop = $("td").eq(i).offset().top - 130 + "px";
		var imgleft = $("td").eq(i).offset().left + "px";
		$('.table').append('<img class="gazou" src="'+ img1[i] +'" width="200px" height="150px"></img>');
		$('.gazou').eq(i).css("top",imgtop);
		$('.gazou').eq(i).css("left",imgleft);
	}
	setTimeout(function(){ down()},1000);
	setTimeout(function(){ henka2()},2500);	
	setTimeout(function(){ idou2()},3500);	
});
//景品画像を下に移動させ消す
   function down(){
	var tdlength = $('td').length;
	for(i = 0;i<tdlength;i++){	
		$('.gazou').eq(i).css("z-index","0");
		$('.gazou').eq(i).animate({'top':"+=130px",'left':"+=100px",height:"0px",width:"0px"},1000,);	
		$('.gazou').eq(i).fadeOut(1000);	
	}
   }
//ボックスを閉める
   function henka2(){
	var tdlength = $('td').length;
	for(i = 0;i<tdlength;i++){	
		$('td').eq(i).css('background-image',"url(/images/l_e_present_70.png)");	
	}
   }
//tdの移動
   function idou2(){
		var Array1 = new Array();
		var areaycount = 0;
		if(stopcount == 0){
			//すべてのtdのトップとmargin-leftを配列に入れる(後で元の位置に戻すため)
			for( count = 0; count < boxkazu ;count++){
	   			tdarray1[count] = $('td').eq(count).offset().top;
				tdarray2[count] = $('td').eq(count).css("margin-left");
			}
			stopcount++;
			setTimeout(function(){ idou2()});
		}else if(stopcount < 5){
			//ボックスをシャッフルする
			for(i =0;i < Math.floor(boxkazu/2) ;i++){
			var kae1 = Math.floor( Math.random() * ( boxkazu ));
			while(true){
				if(hantei(Array1, kae1)){  //数字の重複判定
				  var kae1 = Math.floor( Math.random() * ( boxkazu ) );
				}else{
				  Array1[areaycount] = kae1;
				  areaycount++;
				  break;
				}
			} 
			var kae2 = Math.floor( Math.random() * ( boxkazu ) );
			while(true){
				if(hantei(Array1, kae2)){  //数字の重複判定
				  var kae2 = Math.floor( Math.random() * ( boxkazu ));
				}else{
				  Array1[areaycount] = kae2;
				  areaycount++;
				  break;
				}
			} 
			var tdtop1 = $("td").eq(kae1).offset().top;
			var tdmargin1 = $('td').eq(kae1).css("margin-left");
			var tdtop2 = $("td").eq(kae2).offset().top;
			var tdmargin2 = $('td').eq(kae2).css("margin-left");
			$('td').eq(kae2).animate({'top':tdtop1+"px","margin-left":tdmargin1},1000,); 
			$('td').eq(kae1).animate({'top':tdtop2+"px","margin-left":tdmargin2},1000,);  
	   		}
			stopcount++;
			setTimeout(function(){ idou2()},1000);
   		}else{
			//すべてのボックスを中央に移動させる
   			for( count = 0; count <boxkazu;count++){
			$('td').eq(count).animate({'left':center.left - parseInt($('td').eq(count).css("margin-left")) , 
			'top': center.top},1000);
			}
			setTimeout(function(){ idou3(tdarray1,tdarray2,0)},1000);
   		}
   }
//順番に元の位置に移動する
   function idou3(tdarray1,tdarray2,count) {
  	if(count < boxkazu){
		$('td').eq(count).animate({'top': tdarray1[count]+"px","left":"0px","margin-left":tdarray2[count]},1000);
		count++;
		setTimeout(function(){ idou3(tdarray1,tdarray2,count)},200);
   		
	}else{
	setTimeout(function(){ bangou()},1500);
   	}
   }
//tdに番号が振られる
   function bangou(){
	for( count = 0; count < boxkazu;count++){
		$('td').eq(count).text(count+1);
	}
    attack25_manager.emit('lotteryGuestTurn');
   }
//数字が重複していないか判定	
   function hantei(arr, val) {
  	return arr.some(function(arrVal) {
    	return val == arrVal;
   	});
   }

    attack25_manager.on('prizeFinish', () => {
        alert("景品抽選を終了します。");
        attack25_manager.emit('lotteryFinish');
    });
    attack25_manager.on('logout', () => {
        window.location.href = '/logout';
    });
})(jQuery)

$(function(){
    
 $(".modal-open").click(function(){

 pointY = $(window).scrollTop();
$('body').css({
 'position': 'fixed',
 'width': '100%',
 'top': -pointY
});

 //キーボード操作などにより、オーバーレイが多重起動するのを防止する
 $( this ).blur() ; //ボタンからフォーカスを外す
 if( $( "#modal-overlay" )[0] ) return false ; //新しくモーダルウィンドウを起動しない (防止策1)
 //if($("#modal-overlay")[0]) $("#modal-overlay").remove() ;		//現在のモーダルウィンドウを削除して新しく起動する (防止策2)
 
 //オーバーレイを出現させる
 $( "body" ).append( '<div id="modal-overlay"></div>' ) ;
 $( "#modal-overlay" ).fadeIn( "slow" ) ;
 
 //コンテンツをセンタリングする
 centeringModalSyncer() ;
 
 //コンテンツをフェードインする
 $( "#modal-content" ).fadeIn( "slow" ) ;
 
 //[#modal-overlay]、または[#modal-close]をクリックしたら…
 $( "#modal-overlay,#modal-close" ).unbind().click( function(){
 
 //[#modal-content]と[#modal-overlay]をフェードアウトした後に…
 $( "#modal-content,#modal-overlay" ).fadeOut( "slow" , function(){
 
 //[#modal-overlay]を削除する
 $('#modal-overlay').remove() ;
 
 } ) ;
 
 } ) ;
 
 } ) ;

 function releaseScrolling(){
 $('body').css({
 'position': 'relative',
 'width': '',
 'top': ''
 });
 $(window).scrollTop(pointY);
}

 
 //リサイズされたら、センタリングをする関数[centeringModalSyncer()]を実行する
 $( window ).resize( centeringModalSyncer ) ;
 
 //センタリングを実行する関数
 function centeringModalSyncer() {
 
 //画面(ウィンドウ)の幅、高さを取得
 var w = $( window ).width() ;
 var h = $( window ).height() ;
 
 // コンテンツ(#modal-content)の幅、高さを取得
 // jQueryのバージョンによっては、引数[{margin:true}]を指定した時、不具合を起こします。
 var cw = $( "#modal-content" ).outerWidth( {margin:true} );
 var ch = $( "#modal-content" ).outerHeight( {margin:true} );
 var cw = $( "#modal-content" ).outerWidth();
 var ch = $( "#modal-content" ).outerHeight();
 
 //センタリングを実行する
 $( "#modal-content" ).css( {"left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px"} ) ;
 
 }

});
