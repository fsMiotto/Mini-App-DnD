// Importa a função createClient da biblioteca do Supabase via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// =================================================================================
//  COLOQUE AS SUAS CREDENCIAIS DO SUPABASE AQUI!
//  Vá para o seu projeto no Supabase > Project Settings > API
// =================================================================================
const SUPABASE_URL = 'A_SUA_URL_DO_PROJETO_SUPABASE'; 
const SUPABASE_ANON_KEY = 'A_SUA_CHAVE_ANON_DO_PROJETO_SUPABASE'; 

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Seletores do DOM ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const messageBox = document.getElementById('message-box');

const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');

// --- Funções de Ajuda ---
function showMessage(text, type = 'erro') {
    messageBox.textContent = text;
    messageBox.className = `mensagem ${type}`;
    messageBox.style.display = 'block';
}

// --- Lógica de Registo ---
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        showMessage(`Erro no registo: ${error.message}`);
    } else {
        showMessage('Registo bem-sucedido! Verifique o seu e-mail para confirmação.', 'sucesso');
        // Nota: Por padrão, o Supabase envia um e-mail de confirmação.
        // O utilizador só conseguirá fazer login após clicar no link do e-mail.
        // Pode desativar esta opção no painel do Supabase > Authentication > Providers > Email.
    }
});

// --- Lógica de Login ---
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        showMessage(`Erro no login: ${error.message}`);
    } else {
        showMessage('Login bem-sucedido! A redirecionar...', 'sucesso');
        // Aqui, você normalmente redirecionaria o utilizador para outra página
        // window.location.href = '/dashboard.html'; 
        console.log('Utilizador logado:', data.user);
    }
});

// --- Lógica para alternar entre formulários ---
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
