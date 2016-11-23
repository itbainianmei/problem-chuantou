'use strict'
var shopStart = {
	// urlOrderCreate : 'http://10.30.1.19:9191/order-api/api/order/generalOrder',
	urlRequest : localStorage.getItem("urlRequest"),
	urlImg : 'http://wangposcomm.oss-cn-beijing.aliyuncs.com/hi/meal/',  //图片的前缀  阿里云
	organizedId : localStorage.getItem('organizedId'),   //组织id
	openid : localStorage.getItem('openid'),   //用户Id
	deskNo : localStorage.getItem('deskNo'),   //桌号
	totalPrice : parseFloat($('#totalPrice2').html()),   //总价
	totalNumber : parseFloat($('#totalNumber2').html()),  //点菜总数量
	itemsStorage : JSON.parse(localStorage.getItem('itemsStorage')),  //存储每种菜品信息
	orderList : JSON.parse(localStorage.getItem('orderList')),   //左侧菜单信息
	otherList : JSON.parse(localStorage.getItem('otherList')),   //左侧菜单信息
	createOrder: {},
	add_reduce_item:function(itemId,itemName,itemPrice){    //加菜或者减菜封装 itemid为右侧每个li的id    
		var that = this,tempPrice,
			addBtn = $('#'+itemId).find('.img-add'),    //+按钮   
		    reduceBtn = $('#'+itemId).find('.img-reduce'),   //-按钮
		    elementItemNumber = $('#'+itemId).find('.itemNumber'),
			itemNumber = parseFloat(elementItemNumber.html());  //每个商品数量
			that.totalPrice = parseFloat(that.totalPrice);	
		addBtn.bind('touchstart',function(ev){     //加菜
			reduceBtn.removeClass('none');
			elementItemNumber.removeClass('none');
			var getCategoryName = $(this).closest('.menu1-veg1').attr('category');  //找到分类 凉菜
			itemNumber++;            //每个商品的数量
			$('#'+itemId).find('.itemNumber').html(itemNumber);
			that.totalNumber++;         //商品总数量
			$('#totalNumber2').html(that.totalNumber);
			that.totalPrice += itemPrice;   //商品总价格
			tempPrice = parseFloat(that.totalPrice).toFixed(2);
			$('#totalPrice2').html(tempPrice);  
			that.inforStorage(itemId,itemNumber,1);   //每次点击存储	
			ev.stopPropagation();
		});
		reduceBtn.bind('touchstart',function(){     //减菜	
			var getCategoryName = $(this).closest('.menu1-veg1').attr('category');  //找到分类 凉菜
			if(itemNumber >= 1){    //每个商品的数量都不能为负数
				itemNumber--;
				if(that.totalPrice > 0){    //商品总价格只有大于0才能进行减法计算
					that.totalPrice -= itemPrice;
					tempPrice = parseFloat(that.totalPrice).toFixed(2);
					if(tempPrice == '-0.00'){   //处理-0.00
						tempPrice = '0.00';
					}
				}
				if(that.totalNumber > 0){    //商品总数量大于0
					that.totalNumber--;  
					if(that.totalNumber == 0){
						$('#totalNumber2').html(that.totalNumber);
					} 
				}
			}
			$('#'+itemId).find('.itemNumber').html(itemNumber);
			$('#totalNumber2').html(that.totalNumber);
			$('#totalPrice2').html(tempPrice);
			that.inforStorage(itemId,itemNumber,0);   //每次点击存储
			if(itemNumber == 0){       //商品数量为0隐藏减号和数量0
				reduceBtn.addClass('none');
				elementItemNumber.addClass('none');
				$(this).closest('.menu1-veg1').remove();
				if($('#itemsList').html() === ''){
					$('#submitBtn').addClass('submitBtn2').removeClass('submitBtn1');
				}
			}
		});
	},
	inforStorage:function(itemId,itemNumber,isOk){     //点击加或减 存储商品模块 
		var that = this,orderListNo,otherListNotp,otherListNotn,tempPrice,
			itemsStorage = JSON.parse(localStorage.getItem('itemsStorage')),
			orderList = JSON.parse(localStorage.getItem('orderList')),
			otherList = JSON.parse(localStorage.getItem('otherList')),
			category = $('#'+itemId).attr('fid');
			
		for(var name in orderList){
			if(category === name){
				orderListNo = parseFloat(that.orderList[name]);
				otherListNotp = parseFloat(that.otherList.tp);   
				otherListNotn = parseFloat(that.otherList.tn); 
				if(isOk){   //1  +
					orderListNo += 1;
					otherListNotn += 1; 
					otherListNotp += parseFloat($('#'+itemId).attr('item-price'));
					tempPrice = otherListNotp.toFixed(2);
					itemsStorage[itemId].nNum = orderListNo;
					
				}else{
					orderListNo -= 1;  //0 -
					otherListNotn -= 1;
					otherListNotp -= parseFloat($('#'+itemId).attr('item-price'));
					tempPrice = otherListNotp.toFixed(2);
					itemsStorage[itemId].nNum = orderListNo;
				}
				that.orderList[name] = orderListNo;  //用当前覆盖全局中的存储的分类信息  
				that.otherList.tp = tempPrice;  //用当前覆盖全局中的存储的分类信息  
				that.otherList.tn = otherListNotn;  // 
			}	
		}

		itemsStorage[itemId].itemNumber = itemNumber;
		var nowLi = itemsStorage[itemId];   //当前local存储的li对象信息
		for(var item in itemsStorage){
			if(item === itemId){
				that.itemsStorage[item] = nowLi;  //用当前覆盖全局中的存储的对象的信息   没对0进行处理返回前一页要处理哦~
			}
		}
		localStorage.setItem('itemsStorage',JSON.stringify(that.itemsStorage));  //重新存储商品

		localStorage.setItem('orderList',JSON.stringify(that.orderList));  //重新存储左边分类数量
		localStorage.setItem('otherList',JSON.stringify(that.otherList));  //
	},
	isExist:function(deskNo){ //桌号是否存在

		var that = this;
		$.ajax({
			url:that.urlRequest+'deskno/deskNoIsExist',
            type :'post',
            dataType : 'json',
			data:{
				'organizedId':that.organizedId,
				'name':deskNo,  //桌号
			}, 
            success : function(data){
            	if(data.status != 0){  //成功码为0
            		console.log(data.info);
            	}
            	if(data.data.isExist){  //桌号存在
            		localStorage.setItem('deskNo',deskNo);
            		$('#mask,#deskNoBox').addClass('none');
            		that.orderCreate(deskNo);
            	}else{
            		$('#mask,#deskNoBox').removeClass('none');
            		alert('您的桌号不存在,请重新输入');
            	}
			},
			error :function(data){
				alert('桌号添加失败');

			}
        });
	},
	orderCreate:function(deskNo){  //生成订单
		var that = this;
		var　orderData = JSON.parse(localStorage.getItem("resubmit"))?JSON.parse(localStorage.getItem("resubmit")):{};//获取该订单是否是重新下单的提交订单
		$.ajax({
            url: that.urlRequest+'order/generalOrder',
            type :'post',
            dataType : 'json',
			data:{
				'organizedId':that.organizedId,  //组织id
				'itemList':JSON.stringify(that.itemsStorage), //商品列表
				'userId':that.openid,    //用户id
				'note':$('#textarea').val(),  //备注信息
				'deskNo':deskNo   //桌号
			},  
            success : function(data){
            	if(data.status != 0){  //成功码为0
            		alert(data.info);
					$('#submitBtn').bind('touchstart',clickFun);
            		return;
            	}
            	if(data.data.orderCreateStatus){  //订单生成成功
					var resubmit = orderData.resubmit;
					if(resubmit!=null&&resubmit=="resubmit"){
						//该订单是重新下单
						var orderId = orderData.orderId;
						var state = orderData.state;
						//修改流程状态
						$.ajax({
							url: urlRequest+"order/updateFlowState/"+orderId+"/"+state,
							type: "POST",
							data:"",
							dataType: "json",
							success: function (data) {
								if(data.status==0){
									console.log(data.info);
								}else {
									console.log(data.info);
									alert(data.info);
								}
							},
							error: function (data) {
								console.log('服务端报错，' + data.status);
							}
						});
					}

            		that.itemsStorage = {};
					that.orderList = {};
					that.otherList = {};
					that.totalPrice = 0;
					that.totalNumber = 0;
					localStorage.removeItem('itemsStorage');
					localStorage.removeItem('orderList');
					localStorage.removeItem('otherList');
					localStorage.removeItem("resubmit");
            		that.createOrder.orderNo = data.data.orderNo;
            		localStorage.setItem('orderNo',data.data.orderNo);  //存储订单编号
            		location.href=that.urlRequest+'order/orderCDetail?orderNo='+localStorage.getItem('orderNo')+'&organizedId='+localStorage.getItem('organizedId');
            	}else{
            		alert('订单返回成功,生成失败');
            	}
			},
			error :function(data){
				alert('订单生成失败');
				$('#submitBtn').bind('touchstart',clickFun);
			}
        });
	},
	inputDesk:function(){//输入桌号
		var that =this;
		$('#sureBtn').bind('touchstart',function(ev){       //确定
			if($('#deskNum').val() === ''){
				alert('桌号不能为空');
			}else{
				var deskNo = $('#deskNum').val();
				that.isExist(deskNo);
			}
			ev.stopPropagation();
		});
		$('#cancelBtn').bind('touchstart',function(ev){      //取消
			$('#deskNum').blur();
			$('#deskNum').val('');
			$('#mask,#deskNoBox').addClass('none');
			$('#submitBtn').bind('touchstart',clickFun);
			ev.stopPropagation();
		});
	},
	submitBtn:function(){
		var that = this;
		$('#mask').bind('touchstart',function(ev){   //点击遮罩
			$('#mask,#deskNoBox').addClass('none');
			ev.stopPropagation();
		});
		$('#submitBtn').bind('touchstart',clickFun);

		function clickFun(ev){   //点击提交
			console.log("提交订单");
			$('#submitBtn').unbind('touchstart');
			$('#textarea').blur();
			if($(this).hasClass('submitBtn2')){
				alert('暂无订单记录,无法提交订单');
				$('#submitBtn').bind('touchstart',clickFun);
				return ;
			}else{
				var deskNo = localStorage.getItem('deskNo');
				if(!deskNo){
					$('#mask,#deskNoBox').removeClass('none'); 			//桌号不存在
				}else{
					that.isExist(deskNo);
				}
			}
			ev.stopPropagation();
		}
	},

	init:function(){  //入口
		var that = this;
		that.submitBtn();
		that.inputDesk();
		for(var item =0,len = $('#itemsList li').length; item < len; item++){
			var nowLi = $('#itemsList li').eq(item),
				itemId = nowLi.attr('item-id'),      //id
				itemName = nowLi.attr('item-name'),  //name
				itemPrice = parseFloat(nowLi.attr('item-price'));  //price   和前一个页面不同，不用除100
			that.add_reduce_item(itemId,itemName,itemPrice);  //点菜
		}
	}
};
shopStart.init();