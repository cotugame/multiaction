'use strict'
const Stage = require('../../stages/sample')

class Enemy {
	constructor(scene, x, y) {
		const chipSize = Stage.chipSize
		this.width = 32
		this.height = 32
		this.x = x*chipSize+this.width/2
		this.y = (y+1)*chipSize
		this.mode = 0
		this.count = 0

		const rect = new g.FilledRect({
			scene: scene,
			x: this.x-this.width/2,
			y: this.y-this.height,
			width: this.width,
			height: this.height,
			cssColor: '#0000ff'
		})
		rect.update.add(() => {
			switch(this.mode) {
			case 0:
				this.x++
				rect.x = this.x
				rect.modified()
				if (++this.count > 0x100) {
					this.mode++
					this.count = 0
				}
				break
			case 1:
				this.x--
				rect.x = this.x
				rect.modified()
				if (++this.count > 0x100) {
					this.mode--
					this.count = 0
				}
				break
			default:
				break
			}
		})
		scene.append(rect)
	}
}
module.exports = Enemy
