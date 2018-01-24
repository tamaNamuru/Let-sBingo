const nolottery_sub = io('/nolottery_sub');

$(function() {

var idx = 0;
var count2 = 0;
var count = 0;
    
    let guests; //[]{rank, name}
    nolottery_sub.on('sendResult', (guestInfo) => {
        guests = guestInfo;
        
	var Audio = $( "#media_player" );
	$( "#media_player" ).volume = 0.5;
	Audio.get(0).play();
        setTimeout(function(){a()}, 0);
    });
	function a(){
		if(idx < guests.length){
            let rank = '';
            if(guests[idx].rank < 10){
                rank = '0';
            }
            rank += guests[idx].rank;
			if(count2 == 0){
				if(count == 0){
                    $('.b_table .tr1').remove();
					$('.b_table tbody tr td').remove();
					$('.b_table').append('<tr class ="tr1" ><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>').slice(-2);
					$('.tr1').eq(count).children().eq(1).animate({fontSize: '90px'},400);
					count++;
					setTimeout(function(){ a()},200);
				}else if(count < 9) {
					$('.b_table').append('<tr class ="tr1" ><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>').slice(-2);
					$('.tr1').eq(count).children().eq(1).animate({fontSize: '90px'},400);
					count++;
					setTimeout(function(){ a()},200);
				} else{
					$('.b_table').append('<tr class ="tr1" ><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>');
					//count = $('.tr1').length - 1;
					$('.tr1').eq(count).children().eq(1).animate({fontSize: '90px'},400);
					count = 0;
					count2 = 1;
					setTimeout(function(){ a()},500);
				} 
			}else if(count2 == 1){  
				if(count == 0){
					$('.b1_table tbody').html('<tr><th class="th_number">番号</th><th class="th_name">ビンゴ者名</th></tr>');
					$('.b1_table').append('<tr class ="tr2"><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>');
					$('.tr2').eq(count).children().eq(1).animate({fontSize: '90px'},400);
					count++;
					setTimeout(function(){ a()},200);
				}else if(count < 9) {
					$('.b1_table').append('<tr class ="tr2"><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>');
					$('.tr2').eq(count).children().eq(1).animate({fontSize: '90px'},400);
					count++;
					setTimeout(function(){ a()},200);
				} else {
					$('.b1_table').append('<tr class ="tr2"><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>');
					$('.tr2').eq(count).children().eq(1).animate({fontSize: '90px'},1000);
					count = 0;
					count2 = 2;
					setTimeout(function(){ a()},1000);
				}
			}else{
				if(count == 0){
					$('.b_table tbody').html('<tr><th class="th_number">番号</th><th class="th_name">ビンゴ者名</th></tr>');
					$('.b_table').append('<tr class ="tr1" ><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>').slice(-2);
					$('.tr1').eq(count).children().eq(1).animate({fontSize: '90px'},400);
					count++;
					setTimeout(function(){ a()},200);
				}else if(count < 9) {
					$('.b_table').append('<tr class ="tr1" ><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>').slice(-2);
					$('.tr1').eq(count).children().eq(1).animate({fontSize: '90px'},400);
					count++;
					setTimeout(function(){ a()},200);
				} else{
					$('.b_table').append('<tr class ="tr1" ><td>'+ rank +'</td><td style="font-size:0px">'+guests[idx].name+'</td></tr>');
					//count = $('.tr1').length - 1;
					$('.tr1').eq(count).children().eq(1).animate({fontSize: '90px'},1000);
					count = 0;
					count2 = 1;
					setTimeout(function(){ a()},1000);
				}
			}
            ++idx;
		}else{
            count = 0;
            count2 = 0;
            idx = 0;
            if(guests.length > 20){
                setTimeout(function(){ a()},1000);
            }
        }
	}
});
