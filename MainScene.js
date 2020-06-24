import Player from "./Player.js"

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    preload() {
        Player.preload(this)
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/images/map.json')
        this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
    }
    
    create() {
        const map = this.make.tilemap({ key: 'map' })
        this.map = map
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0)
        const layer1 = map.createStaticLayer('圖塊層 1', tileset, 0, 0)
        const layer2 = map.createStaticLayer('圖塊層 2', tileset, 0, 0)
        layer1.setCollisionByProperty({ collides: true })
        this.matter.world.convertTilemapLayer(layer1)

        this.addResources()

        // const tree = new Phaser.Physics.Matter.Sprite(this.matter.world, 150, 150, 'resources', 'tree')
        // const rock = new Phaser.Physics.Matter.Sprite(this.matter.world, 200, 200, 'resources', 'rock')
        // tree.setStatic(true)
        // rock.setStatic(true)
        // this.add.existing(tree)
        // this.add.existing(rock)

        this.player = new Player({
            scene: this,
            x: 100,
            y: 100,
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

    addResources() {
        console.log(this.map)
        const resources = this.map.getObjectLayer('Resources')
        resources.objects.forEach(resource => {
            console.log(resource)
            const resourceItem = new Phaser.Physics.Matter.Sprite(this.matter.world, resource.x, resource.y, 'resources', resource.type)
            const yOrigin = resource.properties.find(p => p.name === 'yOrigin').value
            // 從左下開始算 所以要+x -y
            resourceItem.x += resourceItem.width / 2
            resourceItem.y -= resourceItem.height / 2
            resourceItem.y += resourceItem.height * (yOrigin - 0.5)

            const { Bodies } = Phaser.Physics.Matter.Matter
            const circleCollider = Bodies.circle(resourceItem.x, resourceItem.y, 12, { isSensor: false, label: 'collider' })
            resourceItem.setExistingBody(circleCollider)
            resourceItem.setStatic(true)
            resourceItem.setOrigin(0.5, yOrigin)
            this.add.existing(resourceItem)
        });
    }

    update() {
        this.player.update(this)
    }
}