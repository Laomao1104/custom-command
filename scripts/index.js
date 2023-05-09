//import libraries
import {world} from @minecraft/server-gametest;

//prefix (change to your prefix)
const prefix = '-c'

//your custom commands go here
function yourCommand(command,arg,text,player){
    const playerName = player.name ?? player.nameTag; //get player name
    //text = is the whole massage
    //player = is the player
    //playerName = is player name
    //args = is the word you put after prefix and command
    //example "-c give diamond 64 1" (arg[0] = diamond, arg[1] = 64, arg[2] = 1, and soo on)
    
    switch (command) {
        case 'hello': //if i type "-c hello" run this
            runCmdEntity(`tellraw @s { "rawtext": [ { "text": "hi ${playerName}" } ] }`,player);
            break;
            
        case 'gm': //if i type "-c gm" check argument
            if(arg[0] == "s"){ //if argument `s` do this
                runCmd(`gamemode s "${playerName}"`,"overworld");
            }else if(arg[0] == "c"){ //if argument `c` do this
                runCmd(`gamemode c "${playerName}"`,"overworld");
            }else{ //else do this
                runCmd(`say error`,"overworld");
            }
            break;
            
        case 'view':
            let v = getRot(player);
            runCmd(`say ${v}`);
            break;
            
        case 'water': 
            let water = testCmdEntity(`testforblock ~ ~ ~ water`,player);
            if(water.error){
                runCmd(`say you are not in water`,"overworld");
            }else{
                runCmd(`say you are in water`,"overworld");
            }
            break;
            
        case `give`:
            if(haveTag(player,"op")){
                runCmd(`give "${playerName}" ${arg[0]} ${arg[1]}`,"overworld");
            }else{
                runCmd(`say you don't have op ${playerName}`,"overworld");
            }
            break;
            
        default: //if no command match do this
            runCmdEntity(`tellraw @s { "rawtext": [ { "text": "§cunknown command, no command with name ${command}" } ] }`,player);
    }
}

//run when player chat
world.events.beforeChat.subscribe(msg => {
    if (msg.message.substr(0, prefix.length) == prefix) {
        let args_ = msg.message.slice(prefix.length).trim().split(' '); //split command & argument from prefix
        let command = args_.shift().toLowerCase(); //split command and command argument
        msg.cancel = true; //cancel chat
        const player = msg.sender //get the player that using this chat
        const text = msg.message; //get original message
        yourCommand(command,args_,text,player);
    }
})


//test if player has a tag
//player = player, not player name
//tag = tag the player need
function haveTag(player,tag){
    return player.hasTag(tag);
}


//run command from dimension
//cmd = your command
//dim = dimension, one of ( "overworld","nether","the end")
function runCmd(cmd,dim = "overworld"){
    return world.getDimension(dim ?? "overworld").runCommand(cmd);
}
//run command from entity/player
//cmd = your command
//entity = player, not player name
function runCmdEntity(cmd,entity){
    return entity.runCommand(cmd);
}


//run command from dimension then test error(if command run succsess then false)
//cmd = your command
//dim = dimension, one of( "overworld","nether","the end")
function testCmd(cmd,dim = "overworld"){
    try {
        return{
            result:world.getDimension(dim ?? "overworld").runCommand(cmd),
            error:false
        }
    } catch (e) {
        return{
            result:JSON.parse(e),
            error:true
        }
    }
}
//same with above but from entity/player
//cmd = your command
//entity = player, not player name
function testCmdEntity(cmd,entity){
    try {
        return{
            result:entity.runCommand(cmd),
            error:false
        }
    } catch (e) {
        return{
            result:JSON.parse(e),
            error:true
        }
    }
}


//get the text from command output run by dimension
//cmd = your command
//dim = dimension, one of ( "overworld","nether","the end")
function outCmd(cmd,dim = "overworld"){
    return runCmd(cmd,dim ?? "overworld").statusMessage;
}
//get the text from command output run by entity/player
//cmd = your command
//entity = player, not player name
function outCmdEntity(cmd,entity){
    return runCmdEntity(cmd,entity).statusMessage;
}
