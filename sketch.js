var screenSize = 700;
var rr = 255;
var rg = 0;
var rb = 0;
var auto = false;
var bgColor;
var sideSize;
var maxSize;


function setup() {
	createCanvas(screenSize, screenSize);
	bgColor = $("#color").val();
	background(bgColor);
	
	$("#clear").click(function(){
		background(bgColor);
	});
	
	$("#auto").click(function(){
		auto = !auto;
	});
	
	$("#save").click(function(){
		var date = new Date();
		var name = "CoolPic_" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + "_" + date.getHours() + ":" + date.getMinutes();
		saveCanvas(name, 'png');
	});
	
	$("#bgButton").click(function(){
		bgColor = $("#color").val();
		console.log(bgColor);
		background(bgColor);
	});
	
}

function draw() {
	selectColors();
	selectSizes();
	regularDraw();
	if(auto)
	{
		autoDraw();
		$("#auto").text("Stop AutoDraw");
	}
	else
		$("#auto").text("Start AutoDraw");
}


function regularDraw()
{
	if(mouseIsPressed)
	{
		ellipse(mouseX, mouseY, sideSize, sideSize);
		ellipse(mouseY, mouseX, sideSize, sideSize);
		
		ellipse(screenSize - mouseX, screenSize - mouseY, sideSize, sideSize);
		ellipse(screenSize - mouseY, screenSize - mouseX, sideSize, sideSize);
		
		ellipse(mouseX, screenSize - mouseY, sideSize, sideSize);
		ellipse(mouseY, screenSize - mouseX, sideSize, sideSize);

		ellipse(screenSize - mouseX, mouseY, sideSize, sideSize);
		ellipse(screenSize - mouseY, mouseX, sideSize, sideSize);
	}
}

//AUTO DRAW///////////
var curX;
var curY;
var slope;
var mult;
var x1, y1, x2, y2;
function autoDraw()
{
	if(curX == null || Math.abs(curX - x2) < 10){
		x1 = Math.floor(Math.random() * screenSize);
		y1 = Math.floor(Math.random() * screenSize);
		x2 = Math.floor(Math.random() * screenSize);
		y2 = Math.floor(Math.random() * screenSize);
		curX = x1;
		curY = x1;
		slope = (y2-y1)/(x2-x1);
		mult = Math.floor(Math.random() * 13) + 3;
	}
	else
	{
		if(x1 < x2)
			curX += mult;
		else
			curX -= mult;
		curY += slope * mult;

		ellipse(curX, curY, sideSize, sideSize);
		ellipse(curY, curX, sideSize, sideSize);
	
		ellipse(screenSize - curX, screenSize - curY, sideSize, sideSize);
		ellipse(screenSize - curY, screenSize - curX, sideSize, sideSize);

		ellipse(curX, screenSize - curY, sideSize, sideSize);
		ellipse(curY, screenSize - curX, sideSize, sideSize);

		ellipse(screenSize - curX, curY, sideSize, sideSize);
		ellipse(screenSize - curY, curX, sideSize, sideSize);
		
	}
	
}

function selectSizes()
{
	maxSize = $("#size").val();
	var middleDist = (auto) ? dist(screenSize/2, screenSize/2, curX, curY) : dist(screenSize/2, screenSize/2, mouseX, mouseY);
	if($("#sizeType").val() == "regular")
		sideSize = (auto) ? (curX/screenSize) * maxSize + 1 : (mouseX/screenSize) * maxSize + 1;
	else if($("#sizeType").val() == "middleSmall")
		sideSize = (middleDist/(screenSize/2))*maxSize + 1;
	else if($("#sizeType").val() == "middleBig")
		sideSize = (1-(middleDist/(screenSize/2)))*maxSize + 1;
	else if($("#sizeType").val() == "loop")
		sideSize = sizeLoop(maxSize, maxSize / 100);
}

var switchVal = 0;
function colorChange(increase)
{
	switch(switchVal)
	{
		case 0:
			rg += increase;
			if(rg >= 255)
				switchVal++;
			break;
		case 1:
			rr -= increase;
			if(rr <= 0)
				switchVal++;
			break;
		case 2:
			rb += increase;
			if(rb >= 255)
				switchVal++;
			break;
		case 3:
			rg -= increase;
			if(rg <= 0)
				switchVal++;
			break;
		case 4:
			rr += increase;
			if(rr >= 255)
				switchVal++;
			break;
		case 5:
			rb -= increase;
			if(rb <= 0)
				switchVal = 0;
			break;
	}
}

function selectColors()
{
	var value = $("#colors").val();
	var x = (auto) ? curX : mouseX;
	var y = (auto) ? curY : mouseY;
	var r = 0;
	var g = 0;
	var b = 0;
	var sw = $("#stroke").val();
	if(sw <= 0)	sw = 0;

	
	if(value == "rainbow")
	{
		colorChange(15);
		r = rr;
		g = rg;
		b = rb;
	}
	else if(value == "random")
	{
		r = Math.floor(Math.random()*255);
		g = Math.floor(Math.random()*255);
		b = Math.floor(Math.random()*255);
	}
	else if(value == "red")
	{
		r = x/screenSize*255;
		g = 0;
		b = y/screenSize*255;
	}
	else if(value == "blue")
	{
		r = 0;
		g = x/screenSize*255;
		b = y/screenSize*255;
	}
	else if(value == "green")
	{
		r = x/screenSize*255;
		g = y/screenSize*255;
		b = 0;
	
	}
	else if(value == "grey")
	{
		r = y/screenSize*255;
		g = y/screenSize*255;
		b = y/screenSize*255;
	}
	else if(value == "sunset")
	{
		r = 255;
		g = y/screenSize*255;
		b = 0;
	}
	else if(value == "lime")
	{
		r = 0
		g = 255
		b = y/screenSize * 255;
	}
	else if(value == "blood")
	{
		r = 255
		g = 0
		b = y/screenSize * 255;
	}
	

	if($("#check").prop('checked') == true)
		stroke(0);
	else
		stroke(r/2, g/2, b/2);
	strokeWeight(sw);
	fill(r, g, b);
}

var c = 1;
var atMax = false;
function sizeLoop(max, rate)
{
	if($("#sizeType").val() == "loop" && (mouseIsPressed || auto))
	{
		if(c < max && !atMax)
			c += rate;
		else if(c >= max)
			atMax = true;

		if(c > 0 && atMax)
			c -= rate;
		else if(c <= 0)
			atMax = false;
	}
	return c;
}