'use strict'
const Item = require('./item')
const Stage = require('../../stages/stage')

class Item00 extends Item {
	constructor(stage, layer, x, y, no) {
		const tileSize = Stage.tileSize
		console.log(x*tileSize+tileSize/2, (y+1)*tileSize, tileSize, tileSize)
		super(x*tileSize+tileSize/2, (y+1)*tileSize, tileSize, tileSize)

		this.entity = stage.createTile(x, y, no)
		layer.append(this.entity)
	}
}
module.exports = Item00
