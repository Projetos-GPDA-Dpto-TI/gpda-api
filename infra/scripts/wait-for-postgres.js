import { exec } from "node:child_process";

const loadingSpinner = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];
let spinnerIndex = 0;

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, _stderr) {
    if (stdout.search("accepting connections") === -1) {
      showLoadingMessage();
      setTimeout(checkPostgres, 100);
      return;
    }
    console.log("\n\n🟢 Postgres está pronto e aceitando conexões\n");
    return;
  }
}

function showLoadingMessage() {
  process.stdout.write(
    `\r${loadingSpinner[spinnerIndex]} Aguardando o PostgreSQL aceitar a conexão...`,
  );
  spinnerIndex = (spinnerIndex + 1) % loadingSpinner.length;
}

showLoadingMessage();
checkPostgres();
