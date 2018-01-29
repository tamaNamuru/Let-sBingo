const attack25_guest = io('/attack25_guest');

(function($){ 
$('#popup-background').hide();
$('#popup-background2').hide();
$('#popup-background3').hide();
var selectnumber =[];
var hoveryouso;
var trcount = 0;
var i = 1;
let loadflag = false;
attack25_guest.on('guestStart', (opens) => {
	if(loadflag) return;
	loadflag = true;
	for(var count = 1; count <= opens.length; count++){
		$('#table'+i).append('<div class="tiketd"><div class="tikekazu"></div></div>');
		if( (count  % 2 ) != 0 ) {
			$('.tiketd').eq(count-1).css('margin-left',"31px");
			$('.tiketd').eq(count-1).css('margin-top',"13px");
			$('.tiketd').eq(count-1).css('float',"left");
	
		}
		if( (count  % 2 ) == 0 ) {
			$('.tiketd').eq(count-1).css('margin-left',"4px");
			$('.tiketd').eq(count-1).css('margin-top',"13px");
			$('.tiketd').eq(count-1).css('float',"left");
	
		}
    		if(opens[count-1]){
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
        $('#setumeiok').val("あなたの番!");
        $('#setumeiok').css({"color":'tomato'});
        $('#setumeiok').prop("disabled", false);
});
    
attack25_guest.on('redirect', (url) => {
	window.location.href = url;
});
attack25_guest.on('lotteryResult', (name, picture_url) => {
	$('#popup-td2').css({"background-image":"url("+picture_url+")"});
	$('#popup-td3').text(name);
        $('#setumei').hide();
        $('#setumeiok').hide();
        
        $('#popup-background').fadeIn(100);
});
    
setTimeout(function(){ ChangeTab('table1')},0);
$('#setumeiok').bind('click', function(e){
	$('#setumei').hide();
	$('#setumeiok').hide();
});

 $('.okbotton').bind('click', function(e){

        e.preventDefault(); 
	if(hoveryouso == null || $(hoveryouso).children().text() == ""){
		alert("番号が選択されていません!!");
	}else{
		
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
  	$("#tike4kazu").text( $(hoveryouso).children().text());
	if(kazu == 1){
	  	$("#tike3").animate({marginLeft: "-800px",deg:"30"}, {duration:1000,
				progress:function() {
					$('#tike3').css({
						transform:'rotate(' + this.deg + 'deg)'
					});
				}
	  	});
	  	$("#tike4").animate({marginLeft: "1500px",deg:"-70"}, {duration:1000,
				progress:function() {
					$('#tike4').css({
						transform:'rotate(' + this.deg + 'deg)'
					});
				}
	  	});
	  	$("#tike4kazu").animate({marginLeft: "1500px",deg:"-250"}, {duration:1500,
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
  	setTimeout(function() { $('#popup-background').fadeIn(100); }, 6000);
}
})(jQuery)

function ChangeTab(tabname) {
  	document.getElementById('table1').style.display = 'none';
  	document.getElementById('table2').style.display = 'none';
  	document.getElementById('table3').style.display = 'none';
  	document.getElementById('table4').style.display = 'none';
  
  	document.getElementById(tabname).style.display = 'block';
}
