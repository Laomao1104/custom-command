import {world} from '@minecraft/server-gametest'

world.events.beforeChat.subscribe((ev) => {

    const player ev.sender

    const msg = ev.message

    

    if(msg== "+command1") {

        player.runCommand("give @s diamond ")

    }

})
