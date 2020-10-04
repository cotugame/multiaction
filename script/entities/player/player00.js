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

		const color = (id === g.game.selfId) ? '#00ff00' : "#ff0000"
		const rect = new g.FilledRect({
			scene: scene,
			x: this.x-this.width/2,
			y: this.y-this.height,
			width: this.width,
			height: this.height,
			cssColor: color
		})
		const entity = rect
		this.entity = rect
		this.rect = rect

		let vx = 0
		let vy = 0
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

			if (this.mouseOn) {
				const dx = this.mouseX-playerOfs.x
				const dy = this.mouseY-playerOfs.y+this.height/2
				if (dx >= 0x10) {
					vx += ax
					if (vx > maxVx) vx = maxVx
					this.dir = 1
				} else if (dx <= -0x10) {
					vx -= ax
					if (vx < -maxVx) vx = -maxVx
					this.dir = -1
				}
				if (jump === false) {
					if (dy < -0x18) {
						vy = jv
						jump = true
					}
				}
			} else {
				if (vx > 0) {
					vx -= sx
					if (vx < 0) vx = 0
				} else if (vx < 0) {
					vx += sx
					if (vx > 0) vx = 0
				}
			}
			x += vx
			this.x = x

			const p = this
			function colchk(func) {
				for (const block of blocks) {
					const ww = (width+block.width)/2
					const hh = (height+block.height)/2
					if (p.x > block.x-ww && p.x < block.x+ww && p.y > block.y-block.height && p.y-height < block.y) {
						func(block, ww, hh)
						return true
					}
				}
				return false
			}
			const w2 = Math.floor(width/2)
			if (vx < 0) {
				if ((stage.getAtr(this.x-w2, this.y-1) & 8) || (stage.getAtr(this.x-w2, this.y-this.height) & 8)) {
					x = ((x-w2)&-tileSize)+tileSize+w2
					vx = 0
				}
				colchk((block, w) => {
					x = block.x+w
					vx = 0
				})
			} else if (vx > 0) {
				if ((stage.getAtr(this.x+w2, this.y-1) & 8) || (stage.getAtr(this.x+w2, this.y-this.height) & 8)) {
					x = ((x+w2)&-tileSize)-w2
					vx = 0
				}
				colchk((block, w) => {
					x = block.x-w
					vx = 0
				})
			}

			vy += ay
			if (vy > maxVy) vy = maxVy
			y += vy
			this.y = y
			if (y > tileSize*stage.height) {
				y = tileSize*stage.height
				vy = 0
				jump = false
			} else {
				if (vy < 0) {
					if ((stage.getAtr(this.x-w2, this.y-height) & 8) || (stage.getAtr(this.x+w2-1, this.y-height))) {
						y = (y&-tileSize)+this.height
						vy = 0
					}
					colchk((block, w) => {
						y = block.y+height
						vy = 0
					})
					if (this.parent !== null) {
						this.parent = null
						x = this.x
						y = this.y
					}
				} else {
					if ((stage.getAtr(this.x-w2, this.y) & 8) || (stage.getAtr(this.x+w2-1, this.y) & 8)) {
						y = (y&-tileSize)
						vy = 0
						jump = false
					}
					if (colchk((block, w) => {
						if (this.parent === null) {
							this.parent = block
							x = x-block.x
						}
						y = -block.height
					//	y = block.y-block.height
						vy = 0
						jump = false
					}) === false) {
						if (this.parent !== null) {
							this.parent = null
							x = this.x
							y = this.y
						}
					}
				}
			}

			this.x = x
			this.y = y
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
