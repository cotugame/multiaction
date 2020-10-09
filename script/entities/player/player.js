'use strict'
const Obj = require('../obj')
const Stage = require('../../stages/sample')

class Player extends Obj {
	constructor(x, y, width, height) {
		super(x, y, width, height)
		this.attackTimer = 0
		this.attackInterval = 30
		this.damageTimer = 0
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
