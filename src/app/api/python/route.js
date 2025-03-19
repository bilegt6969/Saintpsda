import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function GET() {  // Remove unused 'req' parameter
    const pythonScriptPath = path.resolve(__dirname, 'j.py');
    const pythonProcess = spawn("python3", [pythonScriptPath]);

    let data = "";

    return new Promise((resolve) => {
        pythonProcess.stdout.on("data", (chunk) => {
            data += chunk.toString();
        });

        pythonProcess.stderr.on("data", (error) => {
            console.error("Python Error:", error.toString());
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                resolve(new Response(data, { status: 200, headers: { "Content-Type": "application/json" } }));
            } else {
                resolve(new Response(JSON.stringify({ error: "Python script failed" }), { status: 500 }));
            }
        });
    });
}