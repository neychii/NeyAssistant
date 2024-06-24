const { fileLoader } = require('../../module/fileLoader');
const { skipFolders } = require('../../module/skipFolder');

async function commands(client) {
    const server = await client.guilds.fetch(client.config.server.id);

    await client.commands.clear;
    const commands = []
    let commandsArray = []
    let devCommands = []
    //const contexts = []

    const commandFiles = await fileLoader('src/Commands');
  //  const contextFiles = await fileLoader('Feature/Contexts');

    for (const file of commandFiles) {
        if (skipFolders(file)) {
            commands.push({
                Commands: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        }
        try {
            const command = require(file);
            client.commands.set(command.data.name, command); 
            if (command.devOnly) {
                devCommands.push(command.data.toJSON());
                commands.push({
                Command: command.data.name,
                Status: 'Devs'
            });
            } else {
                commandsArray.push(command.data.toJSON());
                commands.push({
                Command: command.data.name,
                Status: 'Loaded'
            });
            }
        } catch (error) {
            const fileName = file.split('/').pop().slice(0, -3);
            commands.push({
                Command: fileName,
                Status: 'Failed'
            });;
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }

    /* Looping through all the contexts files. same principles with commands one
    for (const file of contextFiles) {
        if (skipFolders(file)) {
            contexts.push({
                Context: file.split('/').pop().slice(0, -3),
                Status: 'SubFolders'
            });
            continue;
        }
        try {
            const context = require(file);
            client.contexts.set(context.data.name, context);
            commandsArray.push(context.data.toJSON()); // we put context together with commands because they're essentially the same

            contexts.push({
                Context: context.data.name,
                Status: 'Loaded'
            });
        } catch (error) {
            const fileName = file.split('/').pop().slice(0, -3);
            contexts.push({
                Context: fileName,
                Status: 'Failed'
            });
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }*/

    // Creating the command application commands
    client.application.commands.set(commandsArray);
    server.commands.set(devCommands);

    // Check if the commands array is empty and push empty array to the tables
    !commands.length
        ? commands.push({ Command: 'Empty', Status: 'No Commands Detected' })
        : commands;
    // Check if the contexts array is empty and push empty array to the tables
 /*   !contexts.length
        ? contexts.push({ Context: 'Empty', Status: 'No Context Detected' })
        : contexts;*/
    // Logs tables of commands and contexts and end the timer
    console.table(commands, ['Command', 'Status']);
   // console.table(contexts, ['Context', 'Status']);
}

module.exports = {commands};