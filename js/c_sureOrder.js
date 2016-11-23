'use strict';
var start={
	toDouble:function(num){  //补零函数
		return num<10?'0'+num:''+num;
	},
	timeRight:function(){ //右侧用餐时间布局
		var that =this;
		for(var j=0;j<=23;j++){  //右侧用餐时间
			for(var i=0;i<60;i=i+15){
				var timerCon = '<li class="timer_con h90 lh90 pl30 pr30 tl">'+that.toDouble(j)+':'+that.toDouble(i)+'<img class=" none act fr mt30" src="image/act.png" alt="act"></li>';
				$('#time_right').append(timerCon);
			}
		}
	},
	changeRightTime:function(timerCon){  ////点击改变时间,传入父级#id
		var actImage_all = $(timerCon).find('.act');
		var timer_con = $(timerCon).find('.timer_con');
		 $(timerCon).delegate('li','click',function(ev){
			for(var act=0, len = actImage_all.length;act < len; act++ ){
				actImage_all.eq(act).addClass('none');
			}
			$(this).find('.act').removeClass('none');
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
		$('#time_left div').each(function(){   //左侧用餐日期
			$(this).click(function(){
				$('#time_left div').removeClass('bgfff c333');
				$(this).addClass('bgfff c333');
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
	lableClick:function(labelbox,textarea){     //标签点击快备注 标签的父级和备注区域  string
		var li = $('#'+labelbox).find('li');
		li.each(function(){
			$(this).click(function(){
				var textCon = $('#'+textarea).val();
				var text = $(this).text()+'  ';
				textCon += text;
				$('#'+textarea).val(textCon);
			});
		});
	},
	swiper:function(){   //swiper的滑屏效果
		var swiper = new Swiper('.swiper-container', {
	        paginationClickable: true,
	        direction: 'vertical',
	        slidesPerView: 3
	    });
	    setInterval(function(){
	    	var index = swiper.activeIndex+1;
	    	$('.swiper-slide').css('color','#999')
	    	$('.swiper-slide').eq(index).css('color','#333');
	    },30); 
	},
	init:function(){ //入口
		var that = this;
		that.timeRight();
		that.timeLeft();
		that.changeRightTime('#time_right');
		that.changeLefttTime();
		that.lableClick('all_lable_text_con','all_lable_area'); //整单备注
		that.lableClick('lable_container','label_area'); //单品备注
		that.effect();  //这个必须在changeRightTime之后执行
		that.swiper();
	}
};
start.init();