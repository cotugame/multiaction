'use strict'

class Obj {
	life = 4
	dead = false
	rect
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	destroy() {
		this.rect.destroy()
	}

	get isDead() {
		return this.dead
	}
}

module.exports = Obj
