import MainScene from './MainScene.js'

const config = {
    width: 512,
    height: 512,
    backgroundColor: '#333',
    type: Phaser.AUTO,
    parent: 'survival-game',
    scene: [ MainScene ],
    scale: {
        zoom: 2
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
}

new Phaser.Game(config)