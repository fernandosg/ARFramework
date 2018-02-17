class Label{
	constructor(){

	}

	init(){
		this.canvas=document.createElement("canvas");
		this.canvas.width=width;
		this.canvas.height=height;
		this.context=canvas.getContext("2d");
	}

	definir(parametros){
		this.context.fillStyle=parametros.color;
		this.context.textAlign=parametros.alineacion;
		this.context.font=parametros.tipografia;
		this.x_origen=parametros.x;
		this.y_origen=parametros.y;
	}

	crear(texto){
		this.context.fillText(texto,this.x_origen,this.y_origen);
		this.textura = new THREE.Texture(this.canvas);
		this.textura.minFilter = THREE.LinearFilter;
		this.textura.magFilter = THREE.LinearFilter;
		this.textura.needsUpdate = true;

		let material = new THREE.SpriteMaterial({
			map: textura,
			transparent: false,
			useScreenCoordinates: false,
			color: 0xffffff // CHANGED
		});

		this.sprite = new THREE.Sprite(material);
		this.sprite.scale.set(15,15, 1 ); // CHANGED
		return this.sprite;
	}

	actualizar(texto){
		this.context.clearRect(0, 0, canvas.width, canvas.height);
		this.context.fillText(this.texto,this.x_origen,this.y_origen);
		this.textura.needsUpdate=true;
	}
}
export { Label as default}
