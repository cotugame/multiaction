'use strict'

class Stage {
	constructor(scene) {
		this.size = 64
		this.field = new g.E({ scene: scene })
		for(let y = 0; y < g.game.height/this.size+2; y++) {
			for(let x = 0; x < g.game.width/this.size+2; x++) {
				const rect = new g.FilledRect({
					scene: scene,
					x: x*this.size,
					y: y*this.size,
					width: this.size,
					height: this.size,
					cssColor: ((x+y)%2 == 0) ? "#000000" : "#6000a0"
				})
				this.field.append(rect)
			}
		}
		scene.append(this.field)
	}
}

module.exports = Stage
