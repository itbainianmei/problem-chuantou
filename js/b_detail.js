'use strict'
var start={
	index:0,
	timer : null,
	toDouble:function(num){  //补零函数
		return num<10?'0'+num:''+num;
	},
	timeRight:function(isToday){ //右侧用餐时间布局
		var that =this;
		var j = 0, k = 0,n=0;
		$('#time_right').html(`<li class="timer_con h90 lh90 pl30 tl pr30">立即下单
					<img class="none act fr mt30" src="image/act.png" alt="act">
				</li>`);
		if(isToday){
			var nowHour = new Date().getHours();
			var nowMinute = new Date().getMinutes();
			if(nowMinute > 45){
				j = nowHour + 1;
				k = 0;
			}else{
				if(nowMinute<15){
					nowMinute = 15;
				}else if (nowMinute>15 && nowMinute<30){
					nowMinute = 30;
				}else if(nowMinute>30 && nowMinute<45){
					nowMinute = 45;
				}else if(nowMinute>45){
					nowMinute = 0;
				}
				j = nowHour;
				k = nowMinute;
			}
		}
		for(;j<=23;j++){  //右侧用餐时间
			if(!n){
				var i =k;
				n=1;
			}else{
				var i =0;
			}
			for(;i<60;i=i+15){
				var timerCon = '<li class="timer_con pb25 pt25 pl30 pr30 tl">'+that.toDouble(j)+':'+that.toDouble(i)+'<img class=" none act fr" src="image/act.png" alt="act"></li>';
				$('#time_right').append(timerCon);
			}
		}
		$('#time_right li').eq(that.index).find('img').removeClass('none');
	},
	changeRightTime:function(timerCon){  ////点击改变时间,传入父级#id
		var that = this;
		var actImage_all = $(timerCon).find('.act');
		var timer_con = $(timerCon).find('.timer_con');
		 $(timerCon).delegate('li','click',function(ev){
			for(var act=0, len = actImage_all.length;act < len; act++ ){
				actImage_all.eq(act).addClass('none');
			}
			$(this).find('.act').removeClass('none');
			that.index = $(this).index();
			ev.stopPropagation();
		 });
	},
	timeLeft:function(){ //左侧用餐时间布局
		var day = day ? day:1;
		var oDate = new Date();
		var d = oDate.getDate()+1;
		var M = (oDate.getMonth())+1;
		var Y = oDate.getYear();
		var maxDay = new Date(Y,M,0).getDate(); //找到本月最后一天
		for(;d<=maxDay;d++){
			day++;
			var dayStr = '<div class="h90 lh90">'+M+'月'+d+'号</div>';
			$('#time_left').append(dayStr);
		}
		for(var most=1;most<=7-day;most++){
			var dayStr = '<div class="h90 lh90">'+(M+1)+'月'+most+'号</div>';
			$('#time_left').append(dayStr);
		}
	},
	changeLefttTime:function(){ //左侧用餐日期点击
		var that = this;
		var isToday = 1;
		$('#time_left div').each(function(index){   //左侧用餐日期
			$(this).click(function(){
				if(index!=0){
					isToday = 0;
				}else{
					isToday = 1;
				}
				$('#time_left div').removeClass('bgfff c333');
				$(this).addClass('bgfff c333');
				that.timeRight(isToday);
				that.changeRightTime('#time_right');
				that.effect();
			});

		});
		
	},
	effect:function(){
		// 用来兼容ios
		var li = $('.active_list li');
		for(var i = 0,len=li.length; i < len; i++)
		{
		  li[i].addEventListener('touchstart',function(ev){
		  	$(this).addClass('bgeee');
		  	ev.stopPropagation();
		  },false);
		  li[i].addEventListener('touchmove',function(ev){
		  	$(this).removeClass('bgeee');
		  	ev.stopPropagation();
		  },false);
		  li[i].addEventListener('touchend',function(ev){
		  	$(this).removeClass('bgeee');
		  	ev.stopPropagation();
		  },false);
		}
	},
	swiper:function(){   //swiper的滑屏效果
		var that = this;
		var swiper = new Swiper('.swiper-container', {
	        paginationClickable: true,
	        direction: 'vertical',
	         slidesPerView: 3,
	    });
	    that.timer = setInterval(function(){
	    	var index = swiper.activeIndex+1;
	    	$('.swiper-slide').css('color','#999').removeClass('c333')
	    	$('.swiper-slide').eq(index).css('color','#333').addClass('c333');
	    },30); 
	},
	init:function(){ //入口
		var that = this;
		// that.timeRight();
		that.timeRight(1);
		that.timeLeft();
		that.changeRightTime('#time_right');
		that.changeLefttTime();
		that.effect();
		that.swiper();
	}
};
start.init();