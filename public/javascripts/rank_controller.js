const nolottery_manager = io('/nolottery_manager');

$(function() {

var idx = 0;
var count2 = 0;
var count = 0;
    
    let guests; //[]{rank, name}
    nolottery_manager.on('sendResult', (guestInfo) => {
    	
        guests = guestInfo;
        let homo = 0;
        let id = setInterval(function() {
        	homo++;
        	if(homo < 6) {
        		Array.prototype.push.apply(guests, guestInfo);
        	}else {
        		console.log(guests);
        		setTimeout(function(){a()}, 0);
        		clearInterval(id);
        	}
        }, 10);
        //setTimeout(function(){a()}, 0);
        
    });
	$('.btn1').click(function(e){
        if(confirm('終了しますがよろしいですか？')){
            nolottery_manager.emit('lotteryFinish');
        }
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
					$('.b_table tbody').html('<tr><th class="th_number">番号</th><th class="th_name"><input type="button" value="終了" class="btn1">ビンゴ者名</th></tr>');
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
    
    nolottery_manager.on('logout', () => {
	   window.location.href = '/logout';
    });
});
