'use strict'
const Obj = require('../obj')
const Stage = require('../../stages/sample')

class Player extends Obj {
	attackTimer = 0
	attackInterval = 30
	constructor(x, y, width, height) {
		super(x, y, width, height)
	}

	static get playerPos() {
		const chipSize = Stage.chipSize
		return { x: g.game.width/2, y: g.game.height-chipSize*2 }
	}

	get isAttack() {
		if (this.attackInterval === 0 || this.isDead) return false
		if (++this.attackTimer >= this.attackInterval) {
			this.attackTimer = 0
			return true
		}
		return false
	}
}

module.exports = Player
