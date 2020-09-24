'use strict'
const Stage = require('../../stages/sample')

class Normal {
	constructor(scene, x, y, dir) {
		const chipSize = Stage.chipSize
		this.width = 8
		this.height = 8
		this.x = x
		this.y = y
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
		rect.update.add(() => {
			switch(this.mode) {
			case 0:
				this.x += dir*8
				rect.x = this.x+dir*16
				rect.modified()
				if (++this.count > 0x40) {
					this.mode++
					this.count = 0
				}
				break
			case 1:
				scene.remove(rect)
				this.mode++
				break
			default:
				console.log('dead', this.count++)
				rect.destroy()
				break
			}
		})
		scene.append(rect)
	}
}

module.exports = Normal
