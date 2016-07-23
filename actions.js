var move=false;
var currentTime_1;
var process_img_left_1;


$('#play').click(function(){
	play();
	console.log("screen.width="+screen.width);
	$('#play').hide();
	$('#pause').show();
});

$('#pause').click(function(){
	pause();
	$('#pause').hide();
	$('#play').show();	
});

$('#list').on("click","p",function(){	
	var id=$(this).attr('id');
	var digits=id.slice(5);
	digits=parseInt(digits);
	which_song=digits;
	music_change(digits);
	$(this).css('color','#DC143C');
});

$('#rewind').click(function(){
	which_song=((which_song-1)+list_len)%list_len;
	music_change(which_song);
});

$('#forward').click(function(){
	which_song=((which_song+1)+list_len)%list_len;
	music_change(which_song);
});

$('#process_img').mousedown(function(e){
	move=true;
	var media = document.getElementById("media");
    currentTime_1= media.currentTime;
    process_img_left_1=document.getElementById("process_img").offsetLeft;
	document.getElementById("media").pause();
	clearInterval(animate);
	clearInterval(process);
	clearInterval(time);
	
});

$('#process_img').draggable({axis:"x",
	containment:"#time_move",
	scroll:false,
	drag:function(){
		if(move){
			var timebar=document.getElementById("time_move").offsetWidth;
			var media = document.getElementById("media");
			var time_length = media.duration;
			var process_img_left_2=document.getElementById("process_img").offsetLeft;
			var currentTime=currentTime_1+(process_img_left_2- process_img_left_1)*time_length/timebar;
			document.getElementById("media").currentTime = currentTime;
			console.log("mouseup");
			showTime();
		}
	}
});

$('body').mouseup(function(e){
	if(move){
		animate=setInterval(lrc_animate,100);
		process=setInterval(deal_process_time,100);
		time=setInterval(showTime,1000);	
		document.getElementById("media").play();
	}	
	move=false;	
});

$('#cycle').click(function(){//单曲循环
	$('#cycle').hide();
	$('#random').hide();
	$('#single').show();
	document.getElementById("media").loop="loop";
});

$('#single').click(function(){//随机播放
	$('#cycle').hide();
	$('#single').hide();
	$('#random').show();
	var rand_num=Math.floor(Math.random()*list_len);
	music_change(rand_num);
});

$('#random').click(function(){//顺序播放
	$('#cycle').show();
	$('#random').hide();
	$('#single').hide();
	for(var i=0;i<list_len;i++){
		console.log("i="+i);
		music_change(i);
	}
});