import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json')
        scene.load.animation('enemies_anim', 'assets/images/enemies_anim.json')
    }

    constructor(data) {
        const { scene, enemy } = data
        const drops = JSON.parse(enemy.properties.find(p => p.name === 'drops').value)
        const health = enemy.properties.find(p => p.name === 'health').value
        super({
            scene,
            x: enemy.x,
            y: enemy.y,
            texture: 'enemies',
            frame: 'bear_idle_1',
            drops,
            health,
            name: enemy.name
        })
    }

    update() {
        console.log('enemy update')
    }
}