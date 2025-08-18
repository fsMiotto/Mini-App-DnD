// Importa a função createClient da biblioteca do Supabase via CDN.
// Esta linha busca o código necessário da internet para podermos usar o Supabase.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// =================================================================================
//  COLOQUE AS SUAS CREDENCIAIS DO SUPABASE AQUI!
//  Vá para o seu projeto no Supabase > Project Settings > API
// =================================================================================
const SUPABASE_URL = 'https://dvwpzqkoanwqysfdlymr.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d3B6cWtvYW53cXlzZmRseW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTkzOTksImV4cCI6MjA2OTgzNTM5OX0.-doywHumdnLGeHjqOPoevpwE-Lca3rJMSsptJwiJtcA'; 

// Cria o "cliente" Supabase.
// Pense nisto como configurar o número de telefone e a senha para poder ligar para o seu backend.
// Todas as nossas comunicações com o Supabase passarão por este objeto.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Seletores do DOM ---
// Aqui, estamos a criar variáveis em JavaScript que representam os elementos do nosso HTML.
// `document.getElementById` encontra um elemento no HTML pelo seu `id`.
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const messageBox = document.getElementById('message-box');

const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');

// --- Funções de Ajuda ---
// Uma pequena função para mostrar mensagens de erro ou sucesso ao utilizador.
function showMessage(text, type = 'erro') {
    messageBox.textContent = text;
    messageBox.className = `mensagem ${type}`;
    messageBox.style.display = 'block';
}

// --- Lógica de Registo ---
// `addEventListener` é como dizer: "Fique a ouvir. Quando o formulário de registo for submetido,
// execute a função que vou descrever a seguir."
signupForm.addEventListener('submit', async (event) => {
    // `event.preventDefault()` impede o comportamento padrão do navegador, que é recarregar a página.
    event.preventDefault(); 
    
    // Pegamos os valores que o utilizador digitou nos campos de e-mail and senha.
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // --- A CHAMADA AO SUPABASE ---
    // Esta é a linha mais importante. `supabase.auth.signUp` é a função que contacta o backend.
    // Ela envia o e-mail e a senha para o Supabase.
    // `await` significa que o nosso código vai esperar pela resposta do Supabase antes de continuar.
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    // Depois de receber a resposta, verificamos se houve um erro.
    if (error) {
        // Se `error` não for nulo, mostramos a mensagem de erro que o Supabase nos enviou.
        showMessage(`Erro no registo: ${error.message}`);
    } else {
        // Se não houve erro, mostramos uma mensagem de sucesso.
        showMessage('Registo bem-sucedido! Pode fazer o login agora.', 'sucesso');
        // Como desativámos a confirmação, o utilizador já pode fazer o login.
    }
});

// --- Lógica de Login ---
// Funciona de forma muito semelhante ao registo.
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // --- A CHAMADA AO SUPABASE ---
    // Desta vez, usamos `signInWithPassword` para autenticar um utilizador existente.
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        showMessage(`Erro no login: ${error.message}`);
    } else {
        showMessage('Login bem-sucedido! A redirecionar...', 'sucesso');
        // Em um projeto real, aqui é onde você redirecionaria o utilizador
        // para a página principal da aplicação.
        console.log('Utilizador logado:', data.user);
        // Exemplo: window.location.href = '/personagens.html';
    }
});

// --- Lógica para alternar entre os formulários de login e registo ---
// Este código apenas gere a interface, escondendo um formulário e mostrando o outro.
showSignupBtn.addEventListener('click', () => {
    loginView.style.display = 'none';
    signupView.style.display = 'block';
    messageBox.style.display = 'none';
});

showLoginBtn.addEventListener('click', () => {
    signupView.style.display = 'none';
    loginView.style.display = 'block';
    messageBox.style.display = 'none';
});