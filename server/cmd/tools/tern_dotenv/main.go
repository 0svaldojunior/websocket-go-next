package main

import (
	"fmt"
	"os/exec"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	command := exec.Command(
		"tern",
		"migrate",
		"--migrations",
		"./internal/store/pgstore/migrations",
		"--config",
		"./internal/store/pgstore/migrations/tern.conf",
	)

	// Captura a saída combinada (stdout e stderr)
	output, err := command.CombinedOutput()
	if err != nil {
		fmt.Printf("Erro ao executar o comando: %v\n", err)
		fmt.Printf("Saída do comando: %s\n", output) // Exibe a saída do comando
		panic(err)
	}

	// Se não houve erro, você pode exibir a saída se necessário
	fmt.Printf("Saída do comando: %s\n", output)
}
