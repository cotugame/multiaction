'use strict'

class Obj {
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.dir = 1
		this.life = 4
		this.dead = false
		this.rect = null
	}

	destroy() {
		this.rect.destroy()
	}

	get isDead() {
		return this.dead
	}
}

module.exports = Obj
