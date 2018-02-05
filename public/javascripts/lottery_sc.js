const lottery_sub = io('/lottery_sub');

(function($){ 
//var generated = new Array();
var randomInt;
var hantei = 0;
var setNumber = 0;
$(function() {
    lottery_sub.on('resetNumber', () => {
        document.getElementById("tyusen_num").innerHTML = '?';
    });
    
	lottery_sub.on('setNumber', (number) => {
        setNumber = number;
		randomInt = Math.floor( Math.random() * ( 99 ) + 1 );
		/*for(var j = 0; j < generated.length; j++) {
			if(randomInt == generated[j]){
				randomInt = Math.floor( Math.random() * ( 50 ) + 1 );
				j= -1;
			}
		}*/
		document.getElementById("tyusen_num").innerHTML = randomInt;
		setTimeout(function(){ Check(hantei)},50);

		
	});
		
});
function Check(hantei){
		if(hantei<60){
			randomInt = Math.floor( Math.random() * ( 99 ) + 1 );
			/*for(var j = 0; j < generated.length; j++) {
				if(randomInt == generated[j]){
					randomInt = Math.floor( Math.random() * ( 50 ) + 1 );
					j= -1;
				}
			}*/
			hantei++;
			document.getElementById("tyusen_num").innerHTML = randomInt;
			setTimeout(function(){ Check(hantei)},50);
		}else{
				randomInt = Math.floor( Math.random() * ( 99 ) + 1 );
				/*for(var j = 0; j < generated.length; j++) {
					if(randomInt == generated[j]){
						randomInt = Math.floor( Math.random() * ( 50 ) + 1 );
						j= -1;
					}
				}*/
				document.getElementById("tyusen_num").innerHTML = setNumber;
				//generated.push(number);
		}
}
$(function() {
	lottery_sub.on('setLottery', (name, url) => {
        $('#img2').attr('src',url);
		$("#title").animate({left: "1010px"},1000,function(){
			$("#title").css({"top": "-140px","left":"134px"});
			var beforeTextArr = name.split('');
			var afterText = '';
			var textcou = 1;
			var fontcou = 0;
			for (var i = 0; i < beforeTextArr.length ; i++) {
    				if(textcou%11 == 0 && 20 >= beforeTextArr.length){
					afterText += beforeTextArr[i] + '<br>';
					fontcou = 1;
				}else if(textcou%18 == 0 && 20 < beforeTextArr.length){
					afterText += beforeTextArr[i] + '<br>';
					fontcou = 2;
				}else{
					afterText += beforeTextArr[i];
				}
				textcou++;
			}
			if( beforeTextArr.length > 5 && fontcou == 0){
				$("#titlename").css({"font-size": "87px"});
				$("#titlename").css({"line-height": "230px"});
			}else if(fontcou == 1){
				$("#titlename").css({"font-size": "79px"});
				$("#titlename").css({"line-height": ""});
			}else if(fontcou == 2){
				$("#titlename").css({"font-size": "49px"});
				$("#titlename").css({"line-height": ""});
			}else{
				$("#titlename").css({"font-size": "170px"});
				$("#titlename").css({"line-height": "230px"});
			}
			$("#titlename").html(afterText);
		});
		$("#img1").animate({left: "1010px"},1000,function(){
			$("#img1").css({"left": "-749px"});//749
		});
		$("#img2").animate({left: "134px"},1000);
		setTimeout(function(){ kae(url)},1200);
	});
		
});

function kae(url){	
    $(function(){
        $("#title").animate({top: "695px"},1000, 'easeOutBounce');
    });
    $('#img1').attr('id',"img3");
    $("#img2").attr("id","img1");
    $('#img3').attr('id',"img2");
    //$('#img2').attr('src',url);
}

})(jQuery)
