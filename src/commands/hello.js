import { CommandExecutor } from '../core/CommandExecutor.js';

export async function helloCommand() {
    const { stdout, stderr } = await CommandExecutor.run('echo Hello from shell!');

    if (stderr) {
        console.error('Error:', stderr);
    } else {
        console.log('Output:', stdout);
    }
}
