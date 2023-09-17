const { execSync } = require("child_process");

const id = process.argv[2]; // Obtener el primer argumento pasado al script

const command = `cables -e ${id} -i -c -f -b -d static/cables`;

try {
  execSync(command, { stdio: "inherit" });
} catch (error) {
  console.error(error);
}
