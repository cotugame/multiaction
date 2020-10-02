'use strict'
const Obj = require('../obj')

class Normal extends Obj {
	constructor(scene, x, y, dir) {
		super(x, y, 8, 8)
		this.mode = 0
		this.count = 0

		const rect = new g.FilledRect({
			scene: scene,
			x: this.x-this.width/2,
			y: this.y-this.height,
			width: this.width,
			height: this.height,
			cssColor: '#ffffff'
		})
		this.entity = rect
		rect.update.add(() => {
			switch(this.mode) {
			case 0:
				this.x += dir*8
				rect.x = this.x+dir*16
				rect.modified()
				if (++this.count > 0x40) {
					this.mode++
					this.count = 0
					scene.remove(rect)
					this.dead = true
				}
				break
			default:
				break
			}
		})
		scene.append(rect)
	}
}

module.exports = Normal
