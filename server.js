// Carrega as variáveis de ambiente ANTES de qualquer outra coisa
require("dotenv").config();
const express = require("express"); // Framework principal
const cors = require("cors"); // Controle de origens
const session = require("express-session"); // Gerenciamento de sessões
const bcrypt = require("bcryptjs"); // Criptografia de senhas
const conexao = require("./db.js"); // Pool de conexões MySQL

// Cria a instância do servidor Express
const app = express();

// Lista de origens permitidas para acessar a API
const listOrigins = [
    "http://localhost:8081", // Expo no computador
    "http://localhost:8081", // Expo web (porta usada no seu projeto)
    "http://localhost:5501", // Live Server do VS Code
    "http://127.0.0.1:5501", // Variação do Live Server
    "https://Dudadesa.github.io" // Deploy no GitHub Pages
];
app.use(cors({
    origin: listOrigins, // Só aceita requisições dessas origens
    credentials: true, // Permite envio de cookies de sessão
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Cabeçalhos aceitos
}));

// Configurações da API
app.use(express.json()); // Habilita leitura de dados JSON no corpo das requisições
app.use(express.urlencoded({ extended: true }));

// Configuração do objeto sessão
const sessionConfig = {
    secret: process.env.SESSION_SECRET, // Chave secreta para assinar o COOKIE
    resave: false, // Não salva a sessão se não houve mudanças
    saveUninitialized: false, // Não cria sessão para usuários não logados
    name: 'cadastro.sid', // Nome personalizado para o cookie da sessão
    cookie: {
        httpOnly: true, // Impede acesso ao cookie via JavaScript (segurança)
        maxAge: 1000 * 60 * 60 // Tempo de vida: 1 hora em milisegundos
    }
};

// Ambiente Local X Produção
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    sessionConfig.cookie.sameSite = "none";
    sessionConfig.cookie.secure = true;
} else {
    sessionConfig.cookie.sameSite = "lax";
    sessionConfig.cookie.secure = false;
}

app.use(session(sessionConfig));

// Rota principal
app.get("/", (req, res) => {
    res.send("API Tela Cadastro funcionando");
});

// Rota de Cadastro
app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        console.log(req.body);

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        // Verifica se já existe usuário com esse e-mail
        const [rows] = await conexao.execute(
            "SELECT id_usuario FROM tb_usuario WHERE email_usuario = ?", [email]
        );

        if (rows.length > 0) {
            return res.status(409).json({ erro: "E-mail já cadastrado" });
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Insere o novo usuário
        const sql = `INSERT INTO tb_usuario
                    (nme_usuario, email_usuario, snh_usuario)
                    VALUES (?, ?, ?)`;
        await conexao.execute(sql, [nome, email, senhaHash]);
        res.json({ mensagem: "Usuário cadastrado com sucesso" });

    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao cadastrar usuário!" });
    }
});



// Iniciando o Servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});