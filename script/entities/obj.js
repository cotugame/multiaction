'use strict'

class Obj {
	constructor(x, y, width, height) {
		this._x = x
		this._y = y
		this._parent = null
		this.width = width
		this.height = height
		this.animNo = 0
		this.anim = []
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

	get x() {
		if (this._parent) {
			return this._x+this._parent.x
		}
		return this._x
	}

	set x(x) {
		this._x = x
	}

	get y() {
		if (this._parent) {
			return this._y+this._parent.y
		}
		return this._y
	}

	set y(y) {
		this._y = y
	}

	get parent() {
		return this._parent
	}

	set parent(parent) {
		if (parent === null) {
			this._x = this.x
			this._y = this.y
			this._parent = null
		} else {
			this._parent = parent
		}
	}

	get isDead() {
		return this.dead
	}

	setAnim(no) {
		if (this.animNo !== no) {
			this.animNo = no
			this.entity.frames = this.anim[no]
			this.entity.frameNumber = 0
		}
	}
}

module.exports = Obj
