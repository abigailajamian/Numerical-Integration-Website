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
		let dt = parseInt(domElements.getDT());
		let tmax = parseInt(domElements.getTMax());
		createXAxisArray(tmax,dt);
	}

	const collectYAxisData = () => {
		let xKnot = parseInt(domElements.getKnot());
		let t  = xAxis;
		numericalIntegrators.trapInt(xKnot,dervative.exponential,t);
		yAxis.push(numericalIntegrators.positionList);
	//create main flow (call when enter is pressed/clicked)
	}

	const main = () => {
		collectXAxisData();
		collectYAxisData ();
		
		domElements.createXOfTGraph();
	}

	return {createXAxisArray,collectXAxisData,collectYAxisData,xAxis,yAxis,main}
})();

const xDotOfT = (()=>{

	let xAxis = xOfT.xAxis;
	let yAxis = [];

	const findYValues = () => {
		//math to graph xdot of t 
		for (let i = 0;i<xAxis.length;i++){
		let y = dervative.exponential([i]);
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

	//main flow/calls all functions to make graph work 
	const main =()=>{
		xOfT.collectXAxisData();
		xOfT.collectYAxisData ();
		domElements.createXOfTGraph();
		xDotOfT.findYValues();
		domElements.createXDotGraph();
		
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
		let newDiv = document.createElement('div');
		newDiv.id = 'popup';
		if(label.innerText == 'XDOT Value :'){
			newDiv.innerText = 'xdot description here';
			label.append(newDiv);
		} else if (label.innerText == 'XKNOT Value :'){
			newDiv.innerText = 'xknot description here';
			label.append(newDiv);
		}else if (label.innerText == 'DT Value :'){
			newDiv.innerText = 'dt description here';
			label.append(newDiv);
		}else if (label.innerText == 'T-Max Value :'){
			newDiv.innerText = 'tmax description here';
			label.append(newDiv);
		}
	}
	const noHover = () => {
		let div = document.querySelector('#popup');
		let label = document.querySelector('label');
		label.removeChild(div);
	}
	return{main,resetFunction,hoverFunction,noHover}
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
		let input = document.querySelector('#xdot').value;
		return input;
	}

	// create graphs using data

	const createXOfTGraph = () => {
		let graph = document.querySelector('#xoft');
		let ymax = xOfT.yAxis[xOfT.yAxis.length -1];

		let data = [{
			x:xOfT.xAxis,
			y:xOfT.yAxis,
			mode: "lines+markers",
			type:"scatter"
		}];

		let layout = {
			xaxis : {range: [0, parseInt(domElements.getTMax())],title:"t"},
			yaxis : {range:[0,ymax], title:"X(t)"},
			title: 'X Of T Graph'
		};
 
		Plotly.newPlot(graph,data,layout);

	}

	const createXDotGraph = () =>{
		let graph = document.querySelector('#xdotoft');
		let ymax = xDotOfT.yAxis[xDotOfT.yAxis.length -1];

		let data = [{
			x:xDotOfT.xAxis,
			y:xDotOfT.yAxis,
			mode: "lines+markers",
			type:"scatter"
		}];

		let layout = {
			xaxis : {range: [0, parseInt(domElements.getTMax())],title:"t"},
			yaxis : {range:[0,ymax], title:"X Dot (t)"},
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
			label[i].addEventListener('mouseleave',mainFlow.noHover);
		}

	}


	return{getDT,getTMax,getKnot,getDot,createXOfTGraph,enter,createXDotGraph,reset,hover}
})();


const numericalIntegrators = (() => {
	
	const trapInt = (Xknot,derivativeFunc,t) =>{
		let positionList = xOfT.yAxis;
		let previousXDot = derivativeFunc(0);//initalizes it 
		let previousX = Xknot; // initalizes x 
		positionList.push(previousXDot);
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
	//TODO; change to be more generalized and work with other deravatives
	const exponential = (t) =>{
		let a = domElements.getDot();
		return t**a;
	}

	return {exponential}
})();

//need to call to add event listners (add in a main setup function to do this )
domElements.enter();
domElements.reset();
domElements.hover();
