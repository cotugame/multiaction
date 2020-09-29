'use strict'

const TILE_SIZE = 0x20

class Stage {
	constructor(scene, stage) {
		const areaNum = 1
		this.width = 0x100
		this.height = 0x20
		this.areas = new Array(areaNum)

		const map = scene.assets["map00"].data
		this.areas[0] = new Uint8Array(this.width*this.height)
		let src = 0
		let dst = 0
		for (let j = 0; j < map.length/4; j++) {
			let data = 0
			for (let i = 0; i < 4; i++) {
				const code = map.charCodeAt(src++)
				if (code >= 0x41 && code <= 0x5a) {
					data = (data<<6)|(code-0x41)
				} else if (code >= 0x61 && code <= 0x7a) {
					data = (data<<6)|(code-0x61+26)
				} else if (code >= 0x30 && code <= 0x39) {
					data = (data<<6)|(code-0x30+26*2)
				} else if (code === 0x2b) {
					data = (data<<6)|0x3e
				} else {
					data = (data<<6)|0x3f
				}
			}
			this.areas[0][dst++] = (data>>16)&0xff
			this.areas[0][dst++] = (data>>8)&0xff
			this.areas[0][dst++] = data&0xff
		}

		const srcWidth = Math.floor(scene.assets["tile00"].width/TILE_SIZE)
		this.field = new g.E({ scene: scene })
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				const rect = new g.Sprite({
					scene: scene,
					src: scene.assets["tile00"],
					x: x*TILE_SIZE,
					y: y*TILE_SIZE,
					width: TILE_SIZE,
					height: TILE_SIZE,
					srcX: (this.areas[0][y*this.width+x]%srcWidth)*TILE_SIZE,
					srcY: Math.floor(this.areas[0][y*this.width+x]/srcWidth)*TILE_SIZE
				})
				this.field.append(rect)
			}
		}
		scene.append(this.field)
	}

	static get tileSize() {
		return TILE_SIZE
	}

	static get chipSize() {
		console.log('***************** chipSize')
		return TILE_SIZE
	}

	getAtr(x, y) {
		const xx = Math.floor(x/TILE_SIZE)
		const yy = Math.floor(y/TILE_SIZE)
		if (xx < 0 || xx >= this.width) return 0
		if (yy < 0 || yy >= this.height) return 0
		return (this.areas[0][yy*this.width+xx] & 0xe0) ? 0xff : 0
	}
}

module.exports = Stage
