'use strict';

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js';
// Importa o nosso componente de Ficha de Personagem do novo ficheiro
import CharacterSheet from './CharacterSheet.js';
// Importa o nosso modelo de personagem vazio
import { initialCharacterState } from './CharacterSheetState.js';

const { useState, useEffect } = React;

function App() {
    // --- ESTADOS DA APLICAÇÃO ---
    const [user, setUser] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- useEffect: Executa quando a aplicação carrega ---
    useEffect(() => {
        async function getInitialData() {
            // Pega a sessão do utilizador
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setUser(session.user);
                // Se houver um utilizador, busca os seus personagens
                const { data: characterList, error } = await supabase
                    .from('personagens')
                    .select('id, info') // Pega só o ID e o objeto 'info' para a lista
                    .eq('jogador_id', session.user.id);

                if (error) {
                    console.error('Erro ao buscar personagens:', error);
                } else {
                    setCharacters(characterList || []); // Guarda a lista de personagens no estado
                }
            } else {
                // Se não houver sessão (ninguém logado), manda de volta para o login
                window.location.href = 'index.html';
            }
            setLoading(false); // Termina de carregar
        }

        getInitialData();
    }, []); // O array vazio [] garante que isto só executa uma vez

    // --- FUNÇÃO PARA CARREGAR OS DETALHES DE UM PERSONAGEM ---
    async function loadCharacterDetails(characterId) {
        setLoading(true);
        const { data, error } = await supabase
            .from('personagens')
            .select('*')
            .eq('id', characterId)
            .single(); // .single() pega apenas um registo em vez de uma lista

        if (error) {
            console.error('Erro ao carregar detalhes do personagem:', error);
        } else {
            setSelectedCharacter(data);
        }
        setLoading(false);
    }
    
    // --- FUNÇÃO PARA CRIAR UM NOVO PERSONAGEM ---
    async function handleCreateCharacter() {
        setLoading(true);
        const newCharacterData = {
            ...initialCharacterState,
            jogador_id: user.id
        };

        const { data: newCharacter, error } = await supabase
            .from('personagens')
            .insert(newCharacterData)
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar novo personagem:', error);
            setLoading(false);
        } else {
            const newCharacterForList = { id: newCharacter.id, info: newCharacter.info };
            setCharacters(prevChars => [...prevChars, newCharacterForList]);
            setSelectedCharacter(newCharacter);
            setLoading(false);
        }
    }

    // --- RENDERIZAÇÃO CONDICIONAL ---
    if (loading) {
        return <div className="loading-screen"><h1>A Carregar...</h1></div>;
    }

    if (selectedCharacter) {
        return (
            <CharacterSheet 
                character={selectedCharacter} 
                setCharacter={setSelectedCharacter}
                onBack={() => setSelectedCharacter(null)}
            />
        );
    }

    return (
        <div className="character-selection-container">
            <h1>Meus Personagens</h1>
            <div className="character-list">
                {characters.map(char => (
                    <div key={char.id} className="character-card" onClick={() => loadCharacterDetails(char.id)}>
                        <h2>{char.info?.name || 'Personagem Sem Nome'}</h2>
                        <p>{`${char.info?.class || 'Sem Classe'} - Nível ${char.info?.level || 1}`}</p>
                    </div>
                ))}
            </div>
            <button className="new-character-btn" onClick={handleCreateCharacter}>+ Criar Novo Personagem</button>
        </div>
    );
}

// --- Renderiza a aplicação na página ---
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);
