window.onload = function(){
	var btn = document.getElementById("btn"),
		area = document.getElementById("area"),
		box = document.getElementById("box"),
		item = getByClass(box, 'item'),
		flag = true;

	var lottery = {
		startIndex : 0,  //起始位置
		count : 0,       //总数
		timer : null,	  //setTimtout ID
		speed : 20,       //初始转动速度
		times : 0, 		  //转动次数
		cycle : 50,		  //转动最少次数
		prize : 0,       //中奖位置
		init: function(){
			var selected = getByIndex(item, this.startIndex);
			if(selected){
				selected.className += " act";
			}
			lottery.count = item.length;
		},
		roll: function(){
			var index = this.startIndex,
				count = this.count,
				selected = getByIndex(item, index);

			if(selected){
				selected.className = selected.className.replace(/(^|\s+)act(\s+|$)/, "");
			}
			index++;
			if(index > count){
				index = 1;
			}
			getByIndex(item, index).className += " act";
			this.startIndex = index;
		},
		stop: function(index){
			this.prize = index;
		}
	}

	function roll(){
		lottery.times++;
		lottery.roll();
		//超出60次，到达终点，结束
		if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.startIndex){
			clearTimeout(lottery.timer);
			showPrize(lottery.prize);
			lottery.prize = -1;
			lottery.times = 0;
			flag = true;
		}else{
			//前50次速度由慢变快，最快保持在40
			if(lottery.times < lottery.cycle){
				lottery.speed -= 5;
				if(lottery.speed < 40){
					lottery.speed = 40;
				}
			//转够50次,随机确定最终位置，赋值给prize
			}else if(lottery.times == lottery.cycle){
				var index = Math.ceil(Math.random() * (lottery.count)) || 0;
				lottery.prize = index;
			}else{
				//超出60次，且没到终点，速度越来越慢
				if(lottery.times > lottery.cycle + 10){
					lottery.speed = 500;
				}else{
					//51-60次之间速度小幅度变慢
					lottery.speed += 50;
				}
			}
			
			lottery.timer = setTimeout(roll, lottery.speed);
		}
	}

	//初始化
	lottery.init();

	btn.onclick = function(){
		if(flag){
			flag = false;
			lottery.speed = 100;
			roll();
		}
	}

	function showPrize(index){
		var selected = getByIndex(item, index);
		var img = selected.getElementsByTagName('img')[0].src;
		area.innerHTML = '<img src="'+ img +'">';
	}

	function getByClass(box, className){
		var all = box.getElementsByTagName('*');
		var reg = new RegExp("(^|\\s+)" + className + "(\\s+|$)");
		var res = [];

		for(var i = 0, len = all.length; i < len; i++){
			var elem = all[i];
			if(reg.test(elem.className)){
				res.push(elem);
			}
		}

		return res;
	}

	function getByIndex(item, index){
		for(var i = 0, len = item.length; i < len; i++){
			var dataIndex = item[i].getAttribute("data-index");
			if(dataIndex == index){
				return item[i];
			}
		}
	}
}
