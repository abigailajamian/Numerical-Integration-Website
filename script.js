const xOfT = (()=>{
	let xAxis=[];
	let yAxis = []; 
	// use data recieved from inputs to create xaxis and yaxis data 
	const createXAxisArray = (tmax,dt)=>{
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

	const collectYAxisData = () => {
		let xKnot = parseFloat(domElements.getKnot());
		let t  = xAxis;
		let type = domElements.getType();
		if (type == 'k(t)^a'){
			numericalIntegrators.trapInt(xKnot,dervative.exponential,t);
		} else if(type == 'k*cos(a*t)'){
			numericalIntegrators.trapInt(xKnot,dervative.cos,t);
		} else if (type == 'k*sin(a*t)'){
			numericalIntegrators.trapInt(xKnot,dervative.sin,t);
		} else if(type == 'k*e^at'){
			numericalIntegrators.trapInt(xKnot,dervative.eFunction,t);
		}
		yAxis.push(numericalIntegrators.positionList);
	}

	const main = () => {
		collectXAxisData();
		collectYAxisData ();
		
		domElements.createXOfTGraph();
	}

	return {createXAxisArray,collectXAxisData,collectYAxisData,xAxis,yAxis,main,}
})();

const xDotOfT = (()=>{

	let xAxis = xOfT.xAxis;
	let yAxis = [];

	const findYValues = () => {
		//math to graph xdot of t 
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
	}

	//main flow/calls all functions to make graph work 
	
	const main =()=>{
		xOfT.collectXAxisData();
		xOfT.collectYAxisData ();
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
			newDiv.innerText = 'xdot description here';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-25%';
		} else if (label.innerText == 'XKNOT Value :'){
			newDiv.innerText = 'xknot description here';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-17%';
		}else if (label.innerText == 'DT Value :'){
			newDiv.innerText = 'dt description here';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-13%';
		}else if (label.innerText == 'T-Max Value :'){
			newDiv.innerText = 'tmax description here';
			firstNew.append(newDiv);
			firstNew.style.marginTop = '-9%';
		} else {
			left.removeChild(firstNew);
		}
	}
	const noHover = (label) => {
		
		if (label.innerText == 'Type -' ||label.innerText == 'a value -' ||label.innerText == 'k value -' ){
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
		

		let data = [{
			x:x,
			y:y,
			mode: "lines+markers",
			type:"scatter"
		}];

		let layout = {
			xaxis : {title:"t"},
			yaxis : { title:"X(t)"},
			title: 'X Of T Graph'
		};
 
		Plotly.newPlot(graph,data,layout);

	}

	const createXDotGraph = (x,y) =>{
		let graph = document.querySelector('#xdotoft');

		let data = [{
			x:x,
			y:y,
			mode: "lines+markers",
			type:"scatter"
		}];

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

	return{getDT,getTMax,getKnot,getDot,createXOfTGraph,enter,createXDotGraph,reset,hover,getKValue,getType}
})();


const numericalIntegrators = (() => {
	
	const trapInt = (Xknot,derivativeFunc,t) =>{
		let positionList = xOfT.yAxis;
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
	}



	return {trapInt}
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

mainFlow.mainSetUp();


