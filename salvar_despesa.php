<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configurações do banco de dados
$servername = "localhost";
$username = "********"; // Usuário com privilégios limitados
$password = '*********'; // Sua senha do novo usuário, entre aspas simples
$dbname = "*********"; // Nome do seu banco de dados

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Verifica se os dados foram enviados via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Escapa e obtém os dados do formulário
    $data_despesa = $_POST['data_despesa'];
    $forma_pagamento = $_POST['forma_pagamento'];
    $parcela = $_POST['parcela'];
    
    // O valor já vem limpo do JavaScript, basta convertê-lo
    $valor = floatval($_POST['valor']);

    $descricao = $_POST['descricao'];

    // Prepara a instrução SQL para evitar injeção
    $sql = $conn->prepare("INSERT INTO despesas (data, forma_pagamento, parcela, valor, descricao) VALUES (?, ?, ?, ?, ?)");
    $sql->bind_param("sssds", $data_despesa, $forma_pagamento, $parcela, $valor, $descricao);
    
    // Executa a instrução e verifica o resultado
    if ($sql->execute()) {
        echo "Despesa registrada com sucesso!";
    } else {
        echo "Erro: " . $sql->error;
    }

    $sql->close();
}

$conn->close();
?>
