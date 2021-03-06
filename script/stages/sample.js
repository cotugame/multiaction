'use strict'

class Stage {
	constructor(scene) {
		const areaNum = 4
		this.width = 256
		this.height = 32
		this.areas = new Array(areaNum)
		this.areas[0] = new Array(this.height)
		for (let y = 0; y < this.height; y++) {
			this.areas[0][y] = new Array(this.width)
			for (let x = 0; x < this.width; x++) {
				const chr = (y < this.height-2) ? 0 : 8
			//	this.areas[0][y][x] = {chr: chr, atr: chr}
				this.areas[0][y][x] = {chr: chr, atr: chr}
			}
		}
		for (let j = 0; j < 64; j++) {
			const length = g.game.random.get(4, 7)
			const x = g.game.random.get(0, this.width-length-1)
			const y = g.game.random.get(0, this.height-8)
			for (let i = 0; i < length; i++) {
				const chr = 7
				this.areas[0][y][x+i] = {chr: chr, atr: chr}
			}
		}
		for (let j = 0; j < 128; j++) {
			const length = g.game.random.get(4, 15)
			const x = g.game.random.get(0, this.width-length-1)
			const y = g.game.random.get(0, this.height-4)
			for (let i = 0; i < length; i++) {
				const chr = 9
				this.areas[0][y][x+i] = {chr: chr, atr: chr}
			}
		}
/*
		for (let x = 0; x < this.width; x++) {
			const chr = x%16
			this.areas[0][0][x] = {chr: chr, atr: chr}
			this.areas[0][this.height-1][x] = {chr: chr, atr: chr}
		}
*/
		for (let y = 0; y < this.height; y++) {
			const chr = y%16
			this.areas[0][y][0] = {chr: chr, atr: chr}
			this.areas[0][y][this.width-1] = {chr: chr, atr: chr}
		}

		const colors = [
			'#00c0c0',	// 00
			'#0000ff',	// 01
			'#ff0000',	// 02
			'#ff00ff',	// 03
			'#00ff00',	// 04
			'#00ffff',	// 05
			'#ffff00',	// 06
			'#ffffff',	// 07

			'#804040',	// 08
			'#00a000',	// 09
			'#7f0000',	// 0a
			'#7f007f',	// 0b
			'#007f00',	// 0c
			'#007f7f',	// 0d
			'#7f7f00',	// 0e
			'#7f7f7f',	// 0f
		]

		this.size = 32
		this.field = new g.E({ scene: scene })
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				const rect = new g.FilledRect({
					scene: scene,
					x: x*this.size,
					y: y*this.size,
					width: this.size,
					height: this.size,
				//	cssColor: ((x+y)%2 == 0) ? "#000000" : "#6000a0"
					cssColor: colors[this.areas[0][y][x].chr]
				})
				this.field.append(rect)
			}
		}
		scene.append(this.field)
	}

	static get chipSize() {
		return 32
	}

	getAtr(x, y) {
		const chipSize = Stage.chipSize;
		const xx = Math.floor(x/chipSize)
		const yy = Math.floor(y/chipSize)
		if (xx < 0 || xx >= this.width) return 0
		if (yy < 0 || yy >= this.height) return 0
		return this.areas[0][yy][xx].atr
	}

	setpos(x, y) {
	//	this.field.x = (x & -this.size*2)
	//	this.field.y = (y & -this.size*2)
	//	this.field.modified()
	}
}

module.exports = Stage
