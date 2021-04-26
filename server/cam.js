const piCam = require('pi-camera');

let num = 0;
let set = "A";
setInterval(function(){
	const myCam = new piCam({
		mode:'photo',
		output:`pages/cam/current.jpg`,
		/*Default
		 *w=2592
		 *l=1944
		 */
		width:2592,
		height:1944,
		nopreview:true
	});

    myCam.snap()
	    .then((result)=>{
    	})
	    .catch((error)=>{
		    console.log(error);
	    });
	num++;
	// if (num>=99){
	// 	num=0;
	// 	(set=="A") ? set="B" : set="A";
	// }
},10000);
