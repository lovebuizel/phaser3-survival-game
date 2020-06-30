import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json')
        scene.load.animation('enemies_anim', 'assets/images/enemies_anim.json')
        scene.load.audio('bear', 'assets/audio/bear.mp3')
        scene.load.audio('wolf', 'assets/audio/wolf.mp3')
        scene.load.audio('ent', 'assets/audio/ent.mp3')
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
            frame: `${enemy.name}_idle_1`,
            drops,
            health,
            name: enemy.name
        })
        this.attacking = null
        this.attackTimer = null
        const { Body, Bodies } = Phaser.Physics.Matter.Matter
        const enemyCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'enemyCollider' })
        const enemySensor = Bodies.circle(this.x, this.y, 80, { isSensor: true, label: 'enemySensor' })
        const compoundBody = Body.create({
            parts: [ enemyCollider, enemySensor ],
            frictionAir: 0.35
        })
        this.setExistingBody(compoundBody)
        this.setFixedRotation()

        this.scene.matterCollision.addOnCollideStart({
            objectA: [ enemySensor ],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.name === 'player') {
                    this.attacking = other.gameObjectB
                }
            }
        })

        this.scene.matterCollision.addOnCollideStart({
            objectA: [ enemyCollider ],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.name === 'player') {
                    if(this.attackTimer === null) {
                        this.attackTimer = setInterval(this.attack, 500, this.attacking)
                    }
                }
            }
        })

        this.scene.matterCollision.addOnCollideActive({
            objectA: [ enemyCollider ],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.name === 'player') {
                    if(this.attackTimer === null) {
                        this.attackTimer = setInterval(this.attack, 500, this.attacking)
                    }
                }
            }
        })
    }

    attack = target => {
        if(target.dead || this.dead) {
            clearInterval(this.attackTimer)
            return
        }
        target.hit()
    }

    update() {
        if(this.dead) return
        if(this.attacking) {
            const direction = this.attacking.position.subtract(this.position)
            if(direction.length() <= 120 && direction.length() > 24) {
                direction.normalize()
                this.setVelocityX(direction.x)
                this.setVelocityY(direction.y)
                if(this.attackTimer) {
                    clearInterval(this.attackTimer)
                    this.attackTimer = null
                }
            } 
        }
        this.setFlipX(this.velocity.x < 0)
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play(`${this.name}_walk`, true)
        } else {
            this.anims.play(`${this.name}_idle`, true)
        }
    }
}