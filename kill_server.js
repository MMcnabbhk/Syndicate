
import { exec } from 'child_process';

const PORT = 4000;

exec(`lsof -i :${PORT} -t`, (err, stdout, stderr) => {
    if (err) {
        console.log(`No process found running on port ${PORT}.`);
        return;
    }

    const pids = stdout.trim().split('\n');
    if (pids.length === 0) {
        console.log(`No process found running on port ${PORT}.`);
        return;
    }

    console.log(`Found process(es) on port ${PORT}: ${pids.join(', ')}`);

    pids.forEach(pid => {
        exec(`kill -9 ${pid}`, (killErr) => {
            if (killErr) {
                console.error(`Failed to kill process ${pid}:`, killErr);
            } else {
                console.log(`Successfully killed process ${pid}.`);
            }
        });
    });
});
