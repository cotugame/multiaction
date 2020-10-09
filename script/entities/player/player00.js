'use strict'
const Player = require('./player')
const Stage = require('../../stages/stage')

class Player00 extends Player {
	constructor(scene, layer, x, y, camera, id, stage, blocks) {
		const tileSize = Stage.tileSize
		const playerOfs = Player.playerPos
		const width = 32, height = 32
		super(x, y, width, height)
		this.life = 64
		this.mouseOn = false
		this.mouseX = 0
		this.mouseY = 0
		this.mode = 0
		this.count = 0
		this.anim = [
			[0],
			[0, 1],
			[2],
			[3]
		]

		const color = (id === g.game.selfId) ? '#00ff00' : "#ff0000"
		const entity = new g.FrameSprite({
			scene: scene,
			src: scene.assets["anmplayer"],
			x: this.x-this.width/2,
			y: this.y-this.height,
			width: this.width,
			height: this.height,
			scaleX: 1,
			frames: this.anim[this.animNo],
			interval: 1000/4,
			loop: true
		})
		const rect = entity
		this.entity = entity
		this.rect = entity
		entity.start()

		let jump = false

		const ax = 2/1
		const ay = 1/1
		const jv = -16
		const sx = 4
		const maxVx = 8
		const maxVy = 16
		rect.update.add(() => {
			if (this.isDead) {
				if (y > tileSize*stage.height+height) {
					y = tileSize*stage.height+height
					this.vy = 0
				}
				this.vy += ay
				y += this.vy
				rect.x = x-width/2
				rect.y = y-height
				rect.modified()
				return
			}

			const move = (() => {
				if (this.mouseOn) {
					const dx = this.mouseX-playerOfs.x
					const dy = this.mouseY-playerOfs.y+this.height/2
					if (dx >= 0x10) {
						this.vx += ax
						if (this.vx > maxVx) this.vx = maxVx
						this.dir = 1
						entity.scaleX = this.dir
					} else if (dx <= -0x10) {
						this.vx -= ax
						if (this.vx < -maxVx) this.vx = -maxVx
						this.dir = -1
						entity.scaleX = this.dir
					}
					if (jump === false) {
						if (dy < -0x18) {
							this.vy = jv
							jump = true
						}
					}
				} else {
					if (this.vx > 0) {
						this.vx -= sx
						if (this.vx < 0) this.vx = 0
					} else if (this.vx < 0) {
						this.vx += sx
						if (this.vx > 0) this.vx = 0
					}
				}
				this._x += this.vx
			})
			if (this.damageTimer > 0) {
				this.damageTimer--
				this.x += this.vx
			} else {
				move()
			}

			const colchk = ((func) => {
				for (const block of blocks) {
					const ww = (width+block.width)/2
					const hh = (height+block.height)/2
					if (this.x > block.x-ww && this.x < block.x+ww && this.y > block.y-block.height && this.y-height < block.y) {
						func(block, ww)
						return true
					}
				}
				return false
			})

			const w2 = Math.floor(width/2)
			if (this.vx < 0) {
				if ((stage.getAtr(this.x-w2, this.y-1) & 8) || (stage.getAtr(this.x-w2, this.y-this.height) & 8)) {
					this.x = ((this.x-w2)&-tileSize)+tileSize+w2
					this.vx = 0
				}
				colchk((block, w) => {
					this.x = block.x+w
					this.vx = 0
				})
			} else if (this.vx > 0) {
				if ((stage.getAtr(this.x+w2, this.y-1) & 8) || (stage.getAtr(this.x+w2, this.y-this.height) & 8)) {
					this.x = ((this.x+w2)&-tileSize)-w2
					this.vx = 0
				}
				colchk((block, w) => {
					this.x = block.x-w
					this.vx = 0
				})
			}
			this.vy += ay
			if (this.vy > maxVy) this.vy = maxVy
			this.y += this.vy

			if (this.y > tileSize*stage.height) {
				this.y = tileSize*stage.height
				this.vy = 0
				jump = false
			} else {
				if (this.vy < 0) {
					if ((stage.getAtr(this.x-w2, this.y-height) & 8) || (stage.getAtr(this.x+w2-1, this.y-height))) {
						y = (y&-tileSize)+this.height
						this.vy = 0
					}
					colchk((block, w) => {
						this.y = block.y+height
						this.vy = 0
					})
					if (this.parent !== null) {
						this.parent = null
					}
				} else {
					if ((stage.getAtr(this.x-w2, this.y) & 8) || (stage.getAtr(this.x+w2-1, this.y) & 8)) {
						this.y = (this.y&-tileSize)
						this.vy = 0
						jump = false
					}
					if (colchk((block, w) => {
						this.y = block.y-block.height
						if (this.parent === null) {
							this.parent = block
						//	this.x = this.x-block.x
						}

						this.vy = 0
						jump = false
					}) === false) {
						if (this.parent !== null) {
							this.parent = null
						}
					}
				}
			}

			if (this.damageTimer === 0) {
				let ano = 0
				if (jump === true) {
					ano = 2
				} else {
					if (this.vx != 0) {
						ano = 1
					}
				}
				this.setAnim(ano)
			}
			entity.x = Math.floor(this.x-width/2)
			entity.y = Math.floor(this.y-height)
			entity.modified()
			if (id === g.game.selfId) {
				camera.x = Math.floor(this.x-playerOfs.x)
				camera.y = Math.floor(this.y-playerOfs.y)
				camera.modified()
			}
		})
		layer.append(rect)
	}
}

module.exports = Player00
