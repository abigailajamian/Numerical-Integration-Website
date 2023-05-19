const xOfT = (()=>{
	let xAxis=[];
	let yAxis = []; 
	// use data recieved from inputs to create xaxis and yaxis data 
	
	const createXAxisArray = (tmax,dt)=>{
		while(xAxis.length>0){
			xAxis.pop();
		}
		let currentTime =0;
		while (currentTime < tmax){
			xAxis.push(currentTime);
			currentTime = currentTime+dt;
		}
		xAxis.push(tmax);
	}

	const collectXAxisData= ()=>{
		let dt = parseFloat(domElements.getDT());
		let tmax = parseFloat(domElements.getTMax());
		createXAxisArray(tmax,dt);
	
	}

	const collectYAxisData = (numericalFuntion) => {
		while(yAxis.length>0){
			yAxis.pop();
		}
		let y = [];
		let xKnot = parseFloat(domElements.getKnot());
		let t  = xAxis;

		let type = domElements.getType();

		if (type == 'k(t)^a'){
			y = numericalFuntion(xKnot,dervative.exponential,t);
			truthValues.exponential(t);
		} else if(type == 'k*cos(a*t)'){
			y =   numericalFuntion(xKnot,dervative.cos,t);
			truthValues.cos(t);
		} else if (type == 'k*sin(a*t)'){
			y =   numericalFuntion(xKnot,dervative.sin,t);
			truthValues.sin(t);
		} else if(type == 'k*e^at'){
			y =  numericalFuntion(xKnot,dervative.eFunction,t);
			truthValues.eFunction(t);
		}
		
		for(let i = 0;i<y.length;i++){
			yAxis.push(y[i]);
		}
	}

	const defineIntType = () => {
		let integrator = domElements.getIntType();
		if(integrator == 'trap'){
			return numericalIntegrators.trapInt;
		}else if(integrator == 'left'){
			return numericalIntegrators.leftInt;
		}else if(integrator == 'right'){
			return numericalIntegrators.rightInt;
		};
	}


	return {createXAxisArray,collectXAxisData,collectYAxisData,xAxis,yAxis,defineIntType}
})();

const xDotOfT = (()=>{

	let xAxis = xOfT.xAxis;
	let yAxis = [];

	const findYValues = () => {
		//math to graph xdot of t 
		while(yAxis.length>0){
			yAxis.pop();
		}
		let type = domElements.getType();
		for (let i = 0;i<xAxis.length;i++){
			if (type == 'k(t)^a'){
				 y = dervative.exponential(xAxis[i]);
			} else if(type == 'k*cos(a*t)'){
				 y = dervative.cos(xAxis[i]);
			} else if (type == 'k*sin(a*t)'){
				 y = dervative.sin(xAxis[i]);
			} else if(type ='k*e^at'){
				y = dervative.eFunction(xAxis[i]);
			}
		
		yAxis.push(y);
		}
	}

	const main = () =>{
		findYValues();
		domElements.createXDotGraph();
	}

	return {findYValues,main,xAxis,yAxis}
})();

const mainFlow= (()=>{

	const mainSetUp = () => {
		domElements.enter();
		domElements.reset();
		domElements.hover();
		domElements.typeChosen();
	}

	//main flow/calls all functions to make graph work 
	
	const main =()=>{
			domElements.checkKnot();
			xOfT.collectXAxisData();
			let fun = xOfT.defineIntType(); 
			xOfT.collectYAxisData(fun);
			xDotOfT.findYValues();
			//creates a loop function fo plot 1 data point at a time
			let i = 0;
			function myLoop(){
				setTimeout(function(){
					let subX = xOfT.xAxis.slice(0,i);
					let subY = xOfT.yAxis.slice(0,i);
					let subXDot =xDotOfT.xAxis.slice(0,i) ;
					let subYDot= xDotOfT.yAxis.slice(0,i); 
					domElements.createXOfTGraph(subX,subY);
					domElements.createXDotGraph(subXDot,subYDot);
	
					i++;
					if(i<xOfT.xAxis.length){
						myLoop();
					}
				},100);
			}
			myLoop();
		
		
		
	}
	//resets the whole page and clears arrays in xoft and xdotoft module patterns

	const resetFunction = () =>{
		document.querySelector('#dt').value = '';
		document.querySelector('#tmax').value = '';
		document.querySelector('#xknot').value = '';
		document.querySelector('#xdot').value = '';
		document.querySelector('#integrator').value = 'trap';
		document.querySelector('#xdot-type').value = 'type';
		document.querySelector('#k-value').value = '';
		document.querySelector('#xdot-value').value = '';
		xOfT.xAxis = [];
		xOfT.yAxis = [];
		xDotOfT.xAxis = [];
		xDotOfT.yAxis = [];
		let xoft = document.querySelector('#xoft');
		while(xoft.firstChild){
			xoft.removeChild(xoft.firstChild);
		}
		let xdotoft = document.querySelector('#xdotoft');
		while(xdotoft.firstChild){
			xdotoft.removeChild(xdotoft.firstChild);
		}
	}

	const hoverFunction = (label) => {
		// define dom manipulation elements
		let left = document.querySelector('.left-side')
		let firstNew = document.createElement('div');
		let newDiv = document.createElement('div');
		//create div to overlay on form (append the descriptions to)
		firstNew.classList.add('descriptions');
		left.append(firstNew);
		//making the desriptions
		newDiv.id = 'popup';
		
		if(label.innerText == 'XDOT Value :'){
			newDiv.innerText = 'Function used to integrate data.';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-25%';
			
		} else if (label.innerText == 'XKNOT Value :'){
			newDiv.innerText = 'The begining value of the graph. \n X-Axis = 0 \n Y-Axis = XKNOT';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-17%';
		}else if (label.innerText == 'DT Value :'){
			newDiv.innerText = 'Integration step size';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-13%';
		}else if (label.innerText == 'T-Max Value :'){
			newDiv.innerText = 'Integrate from 0 to T-Max.';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-9%';
		} else if (label.innerText == 'Integrator Function :') {
			newDiv.innerText = 'Define the numerical integrator used to find the area under the curve.';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-29%';
		} else {
			left.removeChild(firstNew);
		}

	}
	const noHover = (label) => {
		
		if (label.innerText == 'Type -'||label.innerText == 'a value -'||label.innerText == 'k value -'){
			return;
		} else{
			let div = document.querySelector('.descriptions');
			div.remove();
		}

	}

	return{main,resetFunction,hoverFunction,noHover,mainSetUp}
})();

const domElements = (()=>{

	//retrieve data from inputs of html
	const getIntType = () => {
		let input = document.querySelector('#integrator').value;
		return input;
	}
	const getDT = ()=>{
		let input = document.querySelector('#dt').value;
		return input;
	} 

	const getTMax =()=>{
		let input = document.querySelector('#tmax').value;
		return input;
	}

	const getKnot = () =>{
		let input = document.querySelector('#xknot').value;
		return input;
	

	}
	const checkKnot = () => {
		let valid = getType();
		let input = getKnot();
		if (valid == 'k(t)^a'){
			if(input == '-1'){
				let div = document.createElement('div');
				let place = document.querySelector('form')
				div.innerText = '*-1 is not a sufficent input for exponential integration*';
				div.id = 'error'
				div.style.color='rgb(255, 4, 4)'
				place.insertBefore(div, place.children[11]);
				//make it stop running main.flow
			}
		} else {
			return;
		}
	}

	const getDot = () => {
		let input = document.querySelector('#xdot-value').value;
		return input;
	}

	let getKValue= () => {
		let input = document.querySelector('#k-value').value;
		return input;
	}

	let getType = () => {
		let input = document.querySelector('#xdot-type').value;
		return input;
	}

	// create graphs using data

	const createXOfTGraph = (x,y) => {
		let graph = document.querySelector('#xoft');

		let trace0 = {
			x:x,
			y:y,
			mode: "lines+markers",
			type:"scatter",
			
		}
		

		let trace1 = {
			x:[0,0],
			y:[y[y.length -1], y[y.length -2]],
			fill:'tozeroy'

		}

		let trace2 = {
			x:x,
			y:truthValues.trueY,
			mode: 'lines',
			line: {
				dash: 'dot',
				width: 4
			},
			color: 'Green'
		}

		let data = [trace0,trace1,trace2];

		let layout = {
			xaxis : {title:"t"},
			yaxis : { title:"X(t)"},
			title: 'X Of T Graph'
		};
 
		Plotly.newPlot(graph,data,layout);

	}

	const createXDotGraph = (x,y) =>{
		let graph = document.querySelector('#xdotoft');

		
		let trace0 = {
			x:x.slice(-2),
			y:[y[y.length-2],y[y.length-2]],
			fill:'tozeroy'
		}
		let trace2 = {
			x:x.slice(-2),
			y:[y[y.length-1],y[y.length-1]],
			fill:'tozeroy'
		}
		let trace1 = {
			x:x.slice(-2),
			y:y.slice(-2),
			fill:'tozeroy'
		}

		let data = [{
			x:x,
			y:y,
			mode: "lines+markers",
			type:"scatter"
			
		}];

		let intType = domElements.getIntType();
		if(intType == 'trap'){
			data.push(trace1);
		}else if(intType == 'left'){
			data.push(trace0);
		}else if(intType== 'right'){
			data.push(trace2);
		}
		

		let layout = {
			xaxis : {title:"t"},
			yaxis : {title:"X Dot (t)"},
			title: 'X Dot Of T Graph'
		};
	
		Plotly.newPlot(graph,data,layout);
	
	
	}


	//add event listeners 
	const enter = () => {
		let btn = document.querySelector('#submit');
		btn.addEventListener('click',mainFlow.main);
	}

	const reset = () => {
		let btn = document.querySelector('#reset');
		btn.addEventListener('click',mainFlow.resetFunction)
	}

	const hover = () => {
		let label = document.querySelectorAll('label');
		for (let i = 0 ; i<label.length;i++){
			label[i].addEventListener('mouseover', () => {mainFlow.hoverFunction (label[i])});
			label[i].addEventListener('mouseleave',() => {mainFlow.noHover (label[i])});
		}

	}

	const typeChosen = () => {
		let select = document.querySelector('#xdot-type');
		select.addEventListener('change', defaultInputs);
	
	}

	//add default values	
	const defaultInputs = () => {
		let input = document.querySelector('#xdot-type').value;
		if (input != 'Choose Type'){
			let a = document.querySelector('#xdot-value');
			let k = document.querySelector('#k-value');
			let Xknot = document.querySelector('#xknot');
			let dt = document.querySelector('#dt');
			let tmax = document.querySelector('#tmax');
			a.value= '2';
			k.value= '1';
			Xknot.value = '0';
			dt.value = '.1';
			tmax.value = '8';
			

		}
	}

	return{getDT,getTMax,getKnot,getDot,createXOfTGraph,enter,createXDotGraph,reset,hover,getKValue,getType,typeChosen,defaultInputs,getIntType,checkKnot}
})();


const numericalIntegrators = (() => {
	
	const trapInt = (Xknot,derivativeFunc,t) =>{
		let positionList = [];
		let previousXDot = derivativeFunc(0);//initalizes it 
		let previousX = Xknot; // initalizes x 
		positionList.push(previousX);
		for(let i=1;i<t.length;i++){
			let dt = t[i]-t[i-1]; // determines the space length between each one
			let currentXDot = derivativeFunc(t[i]);
			let currentX = (currentXDot+previousXDot)/2*dt+previousX;
			positionList.push(currentX);
			previousXDot = currentXDot;
			previousX =  currentX;
		}
		return positionList;
	}

	const leftInt = (Xknot,derivativeFunc,t) => {
		let positionList = [];
		let currentX= Xknot; // initalizes x 
		positionList.push(currentX);
		for (let i = 0;i<t.length-1;i++){
			let dt = t[i+1]-t[i];
			let currentXDot = derivativeFunc(t[i]);
			currentX = currentXDot*dt+currentX;
			positionList.push(currentX);
		}
		return positionList;
	}


	const rightInt = (Xknot,derivativeFunc,t) => {
		let positionList = [];
		let currentX= Xknot; // initalizes x 
		positionList.push(currentX);
		for (let i = 1;i<t.length-1;i++){
			let dt = t[i] - t[i-1];
			let currentXDot = derivativeFunc(t[i]);
			currentX = currentXDot*dt+currentX;
			positionList.push(currentX);
		}
		return positionList;
	}
	return {trapInt,leftInt,rightInt}
})();

const dervative = (()=> {

	const exponential = (t) =>{
		let k = domElements.getKValue();
		let a = domElements.getDot();
		return k*(t**a);
	}

	const cos =(t)=>{
		let k = parseFloat(domElements.getKValue());
		let a = parseFloat(domElements.getDot());
		return k*Math.cos(a*t);
	}

 	const sin = (t) => {	
		let k = domElements.getKValue();
		let a = domElements.getDot();
		return k*Math.sin(a*t);
	}

	const eFunction = (t) => {
		let e = Math.E;
		let k = domElements.getKValue();
		let a = domElements.getDot();
		return k*e**(a*t);
	}

	return {exponential,cos,sin,eFunction}
})();

const truthValues = (()=>{
	 
	let trueY = [];
	let yValue = '';
	const exponential = (t) => {
		let k = parseFloat(domElements.getKValue());
		let a = parseFloat(domElements.getDot());
		let xknot = parseFloat(domElements.getKnot());
		while(trueY.length>0){
			trueY.pop();
		}
		for (let i =0;i<t.length;i++){
			 yValue = (k*t[i]**(a+1)) / (a+1)+xknot;
			trueY.push(yValue);
		}
		return trueY;
	}

	const cos = (t) => {
		let k = parseFloat(domElements.getKValue());
		let a = parseFloat(domElements.getDot());
		let xknot = parseFloat(domElements.getKnot());
		while(trueY.length>0){
			trueY.pop();
		}
		for (let i =0;i<t.length;i++){
			 yValue = k*Math.sin(a*t[i]) / a + xknot;
			trueY.push(yValue);
		}
		return trueY;
	}

	const sin = (t) => {
		let k = parseFloat(domElements.getKValue());
		let a = parseFloat(domElements.getDot());
		let xknot = parseFloat(domElements.getKnot());
		while(trueY.length>0){
			trueY.pop();
		}
		for (let i =0;i<t.length;i++){
			yValue = -k*Math.cos(a*t[i])/a + (k/a) + xknot;
			trueY.push(yValue);
		}
		return trueY;
	}

	const eFunction = (t) => {
		let k = parseFloat(domElements.getKValue());
		let a = parseFloat(domElements.getDot());
		let xknot = parseFloat(domElements.getKnot());
		while(trueY.length>0){
			trueY.pop();
		}
		for (let i =0;i<t.length;i++){
			yValue = k*Math.E**(a*t[i])/a - (k/a) + xknot;
			trueY.push(yValue);
		}
		return trueY;
	}

	return {exponential,cos,sin,eFunction,trueY}
})();

mainFlow.mainSetUp();

//-------------------------------------------------------------------------------------------------

/* TO-DO (FUTURE STEPS):

1. Add pictures/visual representation of descriptions 
2. Fix glitch when "graph values" is pressed again before the graph is completed runnning 
3. Stop graphs from moving when popup append
*/

