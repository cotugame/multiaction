'use strict'
const Obj = require('../obj')

class Item extends Obj {
	constructor(x, y, width, height) {
		super(x, y, width, height)
	}
}

module.exports = Item
