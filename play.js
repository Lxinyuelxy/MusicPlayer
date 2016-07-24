var lrc_data = [];//二维数组，存放每句歌词出现的时间和歌词数据
var animate;//设置歌词动画函数指针
var process;
var time;
var which_song=0;
var list_len;

window.onload=function(){
	get_lyric("get_lyric_data","Carpenters - Top Of The World.lrc","");
	get_lyric("get_music_list","","list");
	play();
}

function get_lyric(method,lyric_name/*歌词名或歌曲名*/,ob){
	$.ajax({
        cache: true,
        type: "GET",
       	url: "get_lrc.php?method="+method+"&name="+encodeURI(lyric_name),
        async: true,
        dataType: "json",
        success: function(data) {
			if(data.state == "success"){
        		if(method == "get_music_list"){
            		deal_music_list(data.music_list,ob);
            		}else{
						deal_lyric_data(data.lrc);
            		}
            	}else{
            		alert(data.message);
            	}
        	},
        error: function(XMLHttpRequest,textStatus,errorThrown) {
            alert(textStatus);
        }
	});
}

function deal_music_list(music_list_data,music_list_object){//获取并显示歌曲列表信息
	var music_list_object = document.getElementById(music_list_object);
	var list="";
	list_len=music_list_data.length;
	for(var i=0; i < music_list_data.length; ++i){
		list+="<p id=\"music" + i+"\">"+music_list_data[i]+"</p>";
	}
	music_list_object.innerHTML = list;
}

function deal_lyric_data(ajax_lrc_data){//获取歌词信息
	lrc_data.splice(0,lrc_data.length);
	var lrc_list = ajax_lrc_data.split(",");
	var lrc_length = lrc_list.length;
	var time_min;
	var time_sec;
	for(var i=0; i< lrc_length; ++i){
		//console.log(i+". lrc_lis:"+ lrc_list[i]);
		time_min = parseInt( lrc_list[i].substr(2,1) )*60*1000;//分转毫秒
		//console.log(i+".time_min:"+time_min);
		time_sec = parseFloat( lrc_list[i].substr(4,5) )*1000;//秒转毫秒
		//console.log(i+".time_sec:"+time_sec);
		lrc_data.push( [time_min + time_sec,lrc_list[i].substr(10)] );
		if(lrc_data[i][1] == ""){
			lrc_data[i][1] = "&nbsp;";
		}
	}
	init_lrc();
}

function init_lrc(){//显示歌词
	var lrc="";
	var lrc_p="<p id=\"t";
	var lrc_p_end="\">";
	for(var i=0; i< lrc_data.length; ++i){
		lrc+=lrc_p + lrc_data[i][0] + lrc_p_end + lrc_data[i][1] + "</p>";
	}
	document.getElementById("lrc_move").innerHTML = lrc;
}	
		
function lrc_animate(){
	if(lrc_data.length != 0){
		var i=0;
		var top=0;
		var lrc_move = document.getElementById('lrc_move');
		var current_time = document.getElementById("media").currentTime*1000;	
		console.log("lrc_data.length="+lrc_data.length);
		var len=lrc_data.length-1;
		for(i=0; i<len;++i){
			//if( current_time < lrc_data[i][0] || ( i == len-1 ) || (current_time >=lrc_data[i][0] && current_time < lrc_data[i+1][0]) ){
			if(( i == len-1 ) ||  current_time < lrc_data[i+1][0]){
				break;
				}
			}
		
			top = 150 - 38*i;
			document.getElementById("t"+lrc_data[i][0]).style.fontSize = "40px";
			document.getElementById("t"+lrc_data[i][0]).style.color = "White";
			if(i != 0 ){
				document.getElementById("t"+lrc_data[i-1][0]).style.fontSize = "20px";
				document.getElementById("t"+lrc_data[i-1][0]).style.color = "black";
			}
		lrc_move.style.top = top+"px";
	}
}

function music_change(music_id){
	for(var i=0;i<list_len;++i){
		document.getElementById("music"+i).style.color = "black";
	}
	pause();
	var src = document.getElementById("music"+music_id).innerHTML;
	document.getElementById("media").src = "mp3/"+src;
	get_lyric("get_lyric_data",src.split(".")[0]+".lrc","");
	play();
}

function deal_process_time(){
	var width = document.getElementById("time_move").offsetWidth - document.getElementById("process_img").offsetWidth;
	var currentTime = media.currentTime;
	var length = media.duration;//歌曲总时长
	document.getElementById("process_img").style.left=(258+width*(currentTime/length))+"px";
}

function showTime(){
	var media = document.getElementById("media");
	var currentTime = Math.floor(media.currentTime);
	var length = Math.floor(media.duration);
	var min_cur=Math.floor(currentTime/60),
		sec_cur=currentTime%60,
		min_len=Math.floor(length/60),
		sec_len=length%60;
	if(min_cur<10){
		min_cur="0"+min_cur;
	}
	if(sec_cur<10){
		sec_cur="0"+sec_cur;
	}
	if(min_len<10){
		min_len="0"+min_len;
	}
	if(sec_len<10){
		sec_len="0"+sec_len;
	}
	document.getElementById("currentTime").innerHTML =min_cur+":"+sec_cur;
	document.getElementById("totalTime").innerHTML =min_len+":"+sec_len;	
}

function play(){
	for(i=0; i< lrc_data.length; ++i){
		console.log(i+".time:"+lrc_data[i][0]+lrc_data[i][1]);
			
	}
	lrc_animate();
	animate=setInterval(lrc_animate,100);
	process=setInterval(deal_process_time,100);
	time=setInterval(showTime,1000);
	document.getElementById("media").play();
}

function pause(){
	clearInterval(animate);
	clearInterval(process);
	clearInterval(time);
	document.getElementById("media").pause();
}


