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
		this.entity = null
		this.rect = null
	}

	destroy() {
		if (this.entity) {
			this.entity.destroy()
			this.entity = null
		} else {
			console.log('**** warning ****')
			if (this.rect) {
				this.rect.destroy()
				this.rect = null
			}
		}
	}

	get isDead() {
		return this.dead
	}
}

module.exports = Obj
