'use strict'
const Obj = require('../obj')
const Stage = require('../../stages/sample')

class Boss00 extends Obj {
	constructor(scene, layer, x, y) {
		const chipSize = Stage.chipSize
		const width = 64
		const height = 64
		super(x*chipSize+width/2, (y+1)*chipSize, width, height)
		this.mode = 0
		this.count = 0

		const rect = new g.FilledRect({
			scene: scene,
			x: this.x-this.width/2,
			y: this.y-this.height,
			width: this.width,
			height: this.height,
			cssColor: '#6000a0'
		})
		this.rect = rect
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
		layer.append(rect)
	}
}
module.exports = Boss00
