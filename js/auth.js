// Importa a instância do cliente Supabase que criámos no outro ficheiro.
// Agora, não precisamos de colocar as chaves API em todos os ficheiros.
import { supabase } from './supabaseClient.js';

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
    event.preventDefault(); 
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        showMessage(`Erro no registo: ${error.message}`);
    } else {
        showMessage('Registo bem-sucedido! Pode fazer o login agora.', 'sucesso');
        signupForm.reset(); 
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
        
        // Após o login bem-sucedido, redirecionamos o utilizador para o dashboard.
        // O setTimeout dá tempo para o utilizador ler a mensagem de sucesso.
        setTimeout(() => {
            window.location.href = 'characterSelection.html';
        }, 1500); // 1.5 segundos
    }
});

// --- Lógica para alternar entre os formulários de login e registo ---
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
