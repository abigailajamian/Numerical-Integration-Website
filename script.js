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
		return xAxis;
	}

	const collectXAxisData= ()=>{
		let dt = domElements.getDT();
		let tmax = domElements.getTMax();
		createXAxisArray(tmax,dt);
	}

	const collectYAxisData = () => {
		let xKnot = domElements.getKnot();
		let dervFunction = domElements.getDot();
		let t  = xAxis;
		trapINt(xKnot,dervFunction,t);
	}
	return {createXAxisArray,collectXAxisData,collectYAxisData}
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
	return{getDT,getTMax,getKnot,getDot}
})();

