'use strict'
var start = {
	organizedId : localStorage.getItem('organizedId'),//组织Id
	openid : localStorage.getItem('openid'),//用户Id
	urlRequest : localStorage.getItem('urlRequest'),
	// urlRequst : 'http://10.30.1.19:9191/order-api/api/product/clientProductList',
	//urlRequst : 'http://29.onpos.cn/order-api/api/product/clientProductList',
	//urlImg : 'http://wangposcomm.oss-cn-beijing.aliyuncs.com',  //图片的前缀  阿里云
	menuListUrl : 'http://desktop.wangpos.com/api/menu.xhtml',  //商品列表接口
	pricingUrl : 'http://desktop.wangpos.com/api/menu.xhtml',  //批价接口
	totalPrice : 0,   //总价
	totalNumber : 0,  //点菜总数量
	itemsStorage : JSON.parse(localStorage.getItem('itemsStorage'))?JSON.parse(localStorage.getItem('itemsStorage')):{},  //存储每种菜品信息
	orderList : JSON.parse(localStorage.getItem('orderList'))?JSON.parse(localStorage.getItem('orderList')):{},   //左侧菜单信息
	otherList : JSON.parse(localStorage.getItem('otherList'))?JSON.parse(localStorage.getItem('otherList')):{},   //总价 总数等信息
	scrollTop : '',
	getPageLocalStorage:function(){    // 取缓存值
		var that = this,itemsStorage = JSON.parse(localStorage.getItem('itemsStorage')),  //菜品信息
			orderList = JSON.parse(localStorage.getItem('orderList')),  //左侧菜单
			otherList = JSON.parse(localStorage.getItem('otherList'));  //总价,总数等信息
		if(itemsStorage && orderList && otherList) {
			that.totalPrice = otherList.tp;
			that.totalNumber = otherList.tn;
			$('#totalPrice').html(that.totalPrice);
			$('#totalNumber, #countNumber').html(that.totalNumber);//总数和已点数
			if(that.totalNumber == 0){
				$('#totalNumber').addClass('none');
			}else{
				$('#totalNumber').removeClass('none');  //购物车数量可见与否
			}
			for (var item in itemsStorage) {
				var itemNumber = itemsStorage[item].itemNumber,
					_item  = $('#'+item);
				if(itemNumber == 0){
					_item.find('.img-reduce').addClass('none');
					_item.find('.itemNumber ').addClass('none').html(itemNumber);  
				}else{
					_item.find('.img-reduce').removeClass('none');
					_item.find('.itemNumber').html(itemNumber).removeClass('none');
					$('#clickOk').removeClass('bgccc').addClass('bgf16130');   //按钮 只要有不为0的数量就可以点击
				}
			}
			for (var name in orderList) {
				$('#nav-'+name).find('.categoryNumber').html(orderList[name]);
				if(orderList[name] == 0){
					$('#nav-'+name).find('.categoryNumber').addClass('none');
				}else{
					$('#nav-'+name).find('.categoryNumber').removeClass('none');
				}
			}
		}
	},
	load:function(){  //初始化商品
		var that = this;
		if(that.organizedId == null){                 
			console.log('组织为空,请重试');
			history.go(-1);
			return;
		}
        /*var initDeg = 0;    // 加载loading
        var timer = setInterval(function(){
            initDeg+=20;
            $('#load_pic').css({'WebkitTransform':'rotate('+initDeg+'deg)'});
        },100);*/
		$('#nav li:first').attr('class','current');  //左侧菜单第一个li是current状态
		$('#nav li:first').find('.slideLine').removeClass('none');
		//$('#loading').remove();
		/*initDeg = 0;
		clearInterval(timer);*/
		$('.pro_img').on('error',function(){  //图片加载失败的，默认图片
			$(this).prop('src','http://wangposcomm.oss-cn-beijing.aliyuncs.com/hi/none.png');
		});
		that.getPageLocalStorage();   //取缓存数据
		$('body').append('<script id="navJs" src="'+that.urlRequest+'public/js/jquery.nav.js"></script>');
		for(var i = 0, len = $('#container li').length; i < len; i++){
			var nowLi = $('#container li').eq(i),
				_itemId = nowLi.attr('item-id'),      //id
				itemName = nowLi.attr('item-name'),  //name
				itemPrice = parseFloat(nowLi.attr('item-price')/100);  //price
			that.add_reduce_item(_itemId,itemName,itemPrice,1);  //点菜
		}

		$(document).ready(function() {  // 滑屏
			$('#nav').onePageNav();
		});
	},
	add_reduce_item:function(itemId,itemName,itemPrice,flag){    //加菜或者减菜封装 itemid为右侧每个li的id    
		var that = this,tempPrice,
			addBtn = $('#'+itemId).find('.img-add'),    //+按钮   
		    reduceBtn = $('#'+itemId).find('.img-reduce');  //-按钮
		   
			that.totalPrice = parseFloat(that.totalPrice);	
		if(flag){
			var _itemId = itemId;
		}else{
			var _itemId = itemId.substr(itemId.indexOf("-")+1);
		}
		addBtn.bind('touchstart',function(ev){     //加菜
			var elementItemNumber = $('#'+itemId).find('.itemNumber'),
				itemImage = $('#'+itemId).find('.pro_img').attr('src'),
			    itemNumber = parseFloat(elementItemNumber.html());  //每个商品数量
			reduceBtn.removeClass('none');
			elementItemNumber.removeClass('none');
			$('#clickOk').addClass('bgf16130').removeClass('bgccc');
			var getCategoryId = $(this).closest('.section').attr('list-id');          
			var getCategoryName = $(this).closest('.menu1-veg1').attr('category');  //找到分类 凉菜
			that.findCategoryNumber(getCategoryId,1);
			itemNumber++;            //每个商品的数量
			$('#'+itemId).find('.itemNumber').html(itemNumber);
			var se_itemId = $('#'+itemId).attr('item-id');
			$('#'+se_itemId).find('.itemNumber').html(itemNumber);
			that.totalNumber++;         //商品总数量
			$('#countNumber').html(that.totalNumber);//已点菜品 购物车里
			$('#totalNumber').removeClass('none').html(that.totalNumber);
			that.totalPrice += itemPrice;   //商品总价格
			tempPrice = parseFloat(that.totalPrice).toFixed(2);
			$('#totalPrice').html(tempPrice); 
			that.inforStorage(getCategoryName,itemName,itemPrice,itemNumber,_itemId,itemImage);   //每次点击存储	
			ev.stopPropagation();
		});
		reduceBtn.bind('touchstart',function(){     //减菜	
			var elementItemNumber = $('#'+itemId).find('.itemNumber'),
				itemImage = $('#'+itemId).find('.pro_img').attr('src'),
				itemNumber = parseFloat(elementItemNumber.html()),  //每个商品数量
				getCategoryId = $(this).closest('.section').attr('list-id'),
				getCategoryName = $(this).closest('.menu1-veg1').attr('category');  //找到分类 凉菜
				
			var se_itemId = $('#'+itemId).attr('item-id');
			that.findCategoryNumber(getCategoryId,0);
			if(itemNumber >= 1){    //每个商品的数量都不能为负数
				itemNumber--;
				if(itemNumber == 0){       //商品数量为0隐藏减号和数量0
					reduceBtn.addClass('none');
					elementItemNumber.addClass('none');
					$('#'+se_itemId).find('.img-reduce').addClass('none');
					$('#'+se_itemId).find('.itemNumber').addClass('none');
					if(!flag){  //如果购物车里，商品为0，就移除该商品
						var oParent = $(this).closest('.menu1-veg1').parent();
						$(this).closest('.menu1-veg1').remove();
						if(oParent.html() === ''){
							oParent.closest('div').remove();
						}
					}
				}
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
						$('#totalNumber').addClass('none');
						$('#clickOk').addClass('bgccc').removeClass('bgf16130');
					} 
				}
			}
			$('#'+itemId).find('.itemNumber').html(itemNumber);
			$('#'+se_itemId).find('.itemNumber').html(itemNumber);
			$('#countNumber').html(that.totalNumber);//已点菜品 购物车里
			$('#totalNumber').html(that.totalNumber);
			$('#totalPrice').html(tempPrice);
			that.inforStorage(getCategoryName,itemName,itemPrice,itemNumber,_itemId,itemImage);   //每次点击存储
		});
	},
	inforStorage:function(getCategoryName,itemName,itemPrice,itemNumber,itemId,itemImage){     //点击加或减 存储商品模块 
		var that = this,json = {},
			getCategoryId = $('#'+itemId).closest('.section').attr('list-id'),   //找到右侧li的ID
			categoryNumber = $('#nav-'+getCategoryId).find('.categoryNumber').html(); //找到左侧分类数量
		// {'itemid1':{'itemid':xxx,'itemPrice':xxx,'itemName':xxx,'itemNumber':xxx},'itemid2':{'itemid':xxx,'itemPrice':xxx,'itemName':xxx,'itemNumber':xxx}}
		json.getCategoryName = getCategoryName;
		json.itemId = itemId;
		json.itemPrice = itemPrice;
		json.itemName = itemName;
		json.itemNumber = itemNumber;
		json.img = itemImage;
		json.n = getCategoryId;  ///必须有  用来关联下一页的存储
		json.nNum = categoryNumber;
		that.itemsStorage[itemId] = json;
		if(itemNumber == 0){
			delete that.itemsStorage[itemId];
		}
		localStorage.setItem("itemsStorage",JSON.stringify(that.itemsStorage));//存储商品
		that.orderList[getCategoryId] = categoryNumber;
		if(categoryNumber === '0'){
			delete that.orderList[getCategoryName];
		}
		localStorage.setItem("orderList",JSON.stringify(that.orderList));//存储分类
		that.otherList.tp = parseFloat(that.totalPrice).toFixed(2);
		that.otherList.tn = parseFloat(that.totalNumber);
		localStorage.setItem("otherList",JSON.stringify(that.otherList));//存储其他
		
	},
	findCategoryNumber:function(str,addOrReduce){   //找对应左侧菜单数量
		var elementCategoryNumber = $('#nav-'+str).find('.categoryNumber'),
			categoryNumber = parseFloat(elementCategoryNumber.html());
		switch(addOrReduce){      
			case 0:         //减
				if(categoryNumber > 0){
					categoryNumber--;
					if(categoryNumber === 0){
						elementCategoryNumber.addClass('none');
					}
				}
			break;
			case 1:        //加
				categoryNumber++;
				elementCategoryNumber.removeClass('none');
			break;
			default:
			break;
		}
		elementCategoryNumber.html(categoryNumber);
	},
	orderOk:function(){  //点好了
		var that = this,clickOk = $('#clickOk');
		clickOk.bind('click',function(ev){
			var totalPrice = $('#totalPrice').html(),
				totalNumber = $('#totalNumber').html();
			that.otherList.tp = totalPrice;
			that.otherList.tn = totalNumber;
			localStorage.setItem('otherList',JSON.stringify(that.otherList));
			if(clickOk.hasClass('bgf16130')){
				// clickOk.attr('href','shopList.html');
				window.location = that.urlRequest+'product/clientShopList?shopList='+JSON.stringify(that.otherList)+'&itemsStorage='+JSON.stringify(that.itemsStorage);
			}
			ev.stopPropagation();
		});
	},

	buy_car:function(){  //购物车
		var that = this,bOk = 0;
		$('#delete_all').bind('touchend',function(ev){  //清除
			// localStorage.clear();
			localStorage.removeItem('itemsStorage');
			localStorage.removeItem('orderList');
			localStorage.removeItem('otherList');
			that.itemsStorage = {};
			that.orderList = {};
			that.otherList = {};
			$('#order_list').html('');
			$('.itemNumber, .categoryNumber, #totalNumber, #countNumber').html(0);
			$('#totalPrice').html('0.00');
			$('.img-reduce, .itemNumber, #totalNumber, .categoryNumber ').addClass('none');
			$('#clickOk').removeClass('bgf16130').addClass('bgccc');
			// $('#container').css('top',-that.scrollTop).removeClass('bfixed');//不加这个有问题
			$('body').css('height','').removeClass('of-hidden');//不加这个有问题
			that.totalNumber = 0;
			that.totalPrice = 0;
			ev.preventDefault();
			ev.stopPropagation();
		});
		$('#mask').bind('touchstart',function(ev){   //点击遮罩 隐藏
			$('#shop_list, #mask').addClass('none');
			// $('#container').css('top',-that.scrollTop).removeClass('bfixed');
			$('body').css('height','').removeClass('of-hidden');
			ev.preventDefault();
			ev.stopPropagation();
		});
		$('#buy_car').bind('touchstart',function(ev){  
			bOk++;
			// that.scrollTop = $(window).scrollTop();
			that.scrollTop = $(window).height();
			if(bOk & 1){
				var shoppingArr = that.addNewList();  //创建购物车列表
				$('#order_list').html('').append(shoppingArr.join(""));
				$('#shop_list, #mask').removeClass('none');
				$('#order_list ul').each(function(){
					if($(this).html() === ''){
						$(this).parent().remove();
					}
				});
				$('#shop_list').bind("touchstart touchmove tochend",function(ev){
					// $(this).css('pointer-events','none');
					// $('#container').addClass('bfixed').css('top',-that.scrollTop);
					$('body').css('height',that.scrollTop+'px').addClass('of-hidden');
					ev.stopPropagation();
				});

			}else{
				$('#shop_list, #mask').addClass('none');
				// $('#container').css('top',-that.scrollTop).removeClass('bfixed');
				$('body').css('height','').removeClass('of-hidden');
			}
			for(var i = 0, len = $('#order_list li').length; i < len; i++){
				var nowLi = $('#order_list li').eq(i),
					_itemId = nowLi.attr('id'),      //id
					itemName = nowLi.attr('item-name'),  //name
					itemPrice = parseFloat(nowLi.attr('item-price'));  //price
				that.add_reduce_item(_itemId,itemName,itemPrice,0);  //购物车点菜
			}
			ev.preventDefault();
			ev.stopPropagation();
		});
		bOk = 0;
	},
	findCategoryName:function(id){  ///找到左侧分类名字
		var result =$('#nav-'+id).find('.c-name i').text();
		return result;
	},
	addNewList:function(){
		var that = this, shoppingArr =[],itemArr = [],
		itemsStorage = JSON.parse(localStorage.getItem('itemsStorage')),
		itemsStorageArr = that.jsonToArr(itemsStorage,0),
		orderList = JSON.parse(localStorage.getItem('orderList')),
		orderListArr = that.jsonToArr(orderList,1);
		for(var category =0,len = orderListArr.length; category < len; category++ ){
			shoppingArr.push('<div class="tl bgfff" >');   //orderListArr[category]
			shoppingArr.push('<div class="category-title h70 lh70 bgeee pl30 ffamily">'+that.findCategoryName(orderListArr[category])+'</div>'); //凉菜
			shoppingArr.push('<ul>');
			for(var item = 0,_len = itemsStorageArr.length; item < _len; item++){ 
				if(itemsStorageArr[item].itemNumber == 0) continue;
				if (itemsStorageArr[item].n === orderListArr[category]) {
					itemArr.push('<li class="menu1-veg1 section clear border-b lh100 ml30 mr30" category="'+itemsStorageArr[item].getCategoryName+'" list-id="'+itemsStorageArr[item].n+'" item-id="'+itemsStorageArr[item].itemId+'" id="shop-'+itemsStorageArr[item].itemId+'" item-price="'+itemsStorageArr[item].itemPrice+'" item-name="'+itemsStorageArr[item].itemName+'">');
					itemArr.push('<p class="fl wp40 t-ell">'+itemsStorageArr[item].itemName+'</p>');
					itemArr.push('<div class="fr clear">');
					itemArr.push('<img class="img-reduce ver-mid" src="http://wangposcomm.oss-cn-beijing.aliyuncs.com/hi/meal/reduce.png">');
					itemArr.push('<i class="itemNumber lh50  mr15 ml15">'+itemsStorageArr[item].itemNumber+'</i>');
					itemArr.push('<img class="img-add ver-mid" src="http://wangposcomm.oss-cn-beijing.aliyuncs.com/hi/meal/add.png">');
					itemArr.push('</div>');
					itemArr.push('<p class="fr mr48"><i class="cf16130">￥</i><i class="cf16130 ffamily">'+itemsStorageArr[item].itemPrice+'</i><i class="c666">/例</i></p>');
					itemArr.push('</li>');
					shoppingArr.push(itemArr.join(""));
					itemArr=[];
				}
			}
			shoppingArr.push('</ul>');
			shoppingArr.push('</div>');
		}

		return shoppingArr;
	},
	jsonToArr:function(json,flag){   //json转成array
		var arr = [];
		switch(flag){
			case 0:   
				for(var i in json){
					arr.push(json[i]);
				}
			break;
			case 1:
				for(var i in json){
					arr.push(i);
				}
			break;
		}
		return arr;
	},
	init:function(){  //入口
		var that = this;
		that.load();  //初始化商品
		that.orderOk(); //点击点好了
		that.buy_car(); //点购物车
	}
};
start.init();