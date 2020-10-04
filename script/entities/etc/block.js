'use strict'
const Obj = require('../obj')
const Stage = require('../../stages/stage')

class Block extends Obj {
	constructor(scene, layer, x, y) {
		const tileSize = Stage.tileSize
		const width = 0xc0, height = 0x20
		super(x*tileSize+tileSize/2, (y+1)*tileSize, width, height)

		const entity = new g.FilledRect({
			scene: scene,
			x: this.x-this.width/2,
			y: this.y-this.height,
			width: this.width,
			height: this.height,
			cssColor: '#7f7f7f'
		})
		this.entity = entity

		let mode = 0
		let count = 0
		let vx = 2
		entity.update.add(() => {
			switch(mode) {
			case 0:
				this.x += vx
				if (++count >= 30) {
					vx = -vx
					count = 0
				}
				break
			default:
				break
			}
			entity.x = this.x-width/2
			entity.y = this.y-height
			entity.modified()
		})
		layer.append(entity)
	}
}

module.exports = Block
