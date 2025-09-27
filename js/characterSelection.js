'use strict';

import { supabase } from './supabaseClient.js';
// A importação do 'initialCharacterState' já não é necessária aqui, o que simplifica o ficheiro.

// Função principal que corre quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos do DOM que vamos usar
    const characterListDiv = document.getElementById('character-list');
    const newCharacterBtn = document.getElementById('new-character-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const modal = document.getElementById('create-char-modal');
    const cancelBtn = document.getElementById('cancel-create-btn');
    const createForm = document.getElementById('create-char-form');
    const nameInput = document.getElementById('new-char-name');
    const userInfoSpan = document.querySelector('#user-info .username');
    
    let currentUser = null;

    // 1. Verifica quem está logado e busca os personagens
    async function initialize() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            currentUser = session.user;
            userInfoSpan.textContent = currentUser.email; 
            fetchCharacters(session.user);
        } else {
            window.location.href = 'index.html';
        }
    }

    // 2. Busca a lista de personagens no Supabase
    async function fetchCharacters(user) {
        characterListDiv.innerHTML = '<h2>A Carregar...</h2>';
        const { data, error } = await supabase
            .schema('character_data')
            .from('personagens')
            .select('character_id, nome, classe, nivel')
            .eq('user_id', user.id);

        if (error) {
            characterListDiv.innerHTML = '<p>Erro ao buscar personagens.</p>';
        } else {
            renderCharacterList(data);
        }
    }

    // 3. Mostra a lista de personagens na tela
    function renderCharacterList(characters) {
        characterListDiv.innerHTML = '';
        if (characters.length === 0) {
            characterListDiv.innerHTML = '<p style="text-align: center; margin-top: 20px;">Você ainda não tem personagens. Crie um novo!</p>';
        }
        characters.forEach(char => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div>
                    <h2>${char.nome || 'Personagem Sem Nome'}</h2>
                </div>
                <div>
                    <p>${char.classe || 'Sem Classe'} - Nível ${char.nivel || 0}</p>
                </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `dashboard.html?characterId=${char.id}`;
            });
            characterListDiv.appendChild(card);
        });
    }
    
    // 4. LÓGICA DE CRIAÇÃO OTIMIZADA
    async function handleCreateCharacter(event) {
        event.preventDefault();
        if (!currentUser) return;
        
        const characterName = nameInput.value.trim();
        if (!characterName) {
            alert("Por favor, insira um nome.");
            return;
        }

        // Prepara um objeto APENAS com os dados essenciais.
        // O resto será preenchido pelos valores DEFAULT na sua base de dados.
        const newCharacterData = { 
            nome: characterName,
            user_id: currentUser.id 
        };

        // --- A CHAMADA AO SUPABASE (INSERT) ---
        // Agora enviamos muito menos dados pela rede.
        const { data: newCharacter, error } = await supabase
            .schema('character_data')
            .from('personagens')
            .insert(newCharacterData)
            .select();

        if (error) {
            console.error('Erro ao criar personagem:', error);
            alert('Ocorreu um erro ao criar o personagem. Tente novamente.');
        } else {
            // Redireciona para a ficha do personagem recém-criado
            window.location.href = `dashboard.html?characterId=${newCharacter.id}`;
        }
    }

    // 5. Lógica de Logout
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Erro ao fazer logout:", error);
        } else {
            window.location.href = 'index.html';
        }
    }

    // Adiciona os "ouvintes" aos botões
    newCharacterBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    createForm.addEventListener('submit', handleCreateCharacter);
    logoutBtn.addEventListener('click', handleLogout);

    // Inicia tudo
    initialize();
});