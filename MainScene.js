import Player from "./Player.js"

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    preload() {
        Player.preload(this)
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/images/map.json')
    }
    
    create() {
        const map = this.make.tilemap({ key: 'map' })
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0)
        const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0)
        this.player = new Player({
            scene: this,
            x: 0,
            y: 0,
            texture: 'female',
            frame: 'townsfolk_f_idle_1'
        })
        const testPlayer = new Player({
            scene: this,
            x: 100,
            y: 100,
            texture: 'female',
            frame: 'townsfolk_f_idle_1'
        })
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
    }

    update() {
        this.player.update(this)
    }
}