// ARQUIVO: public/js/dashboard.js
'use strict';

const { useState, useEffect } = React;

// --- FUNÇÃO AUXILIAR para calcular modificadores ---
function calculateModifier(score) {
    if (score === null || isNaN(score)) return 0;
    const modifier = Math.floor((score - 10) / 2);
    return modifier;
}

// --- ESTADO INICIAL DA FICHA ---
// Usaremos este objeto para guardar todos os dados.
// Os campos "k", "x", "y" foram substituídos por null para que o placeholder "0" apareça.
const initialCharacterState = {
    info: {
        name: 'Grog Strongjaw',
        class: 'Bárbaro',
        level: 5,
        hp_current: null,
        hp_max: null,
        ac: null,
        initiative: null,
        speed: null,
        proficiency_bonus: null,
        inspiration: false,
    },
    attributes: {
        forca: 10,
        destreza: 10,
        constituicao: 10,
        inteligencia: 10,
        sabedoria: 10,
        carisma: 10,
    },
    proficiencies: {
        // Guarda quais perícias e salvaguardas são proficientes
        salvaguarda_forca: false,
        salvaguarda_destreza: false,
        // ... etc para todas as perícias e salvaguardas
    },
    attacks: [
        { name: 'Espada Longa', bonus: '+5', damage: '1d8+5 Cortante' },
    ],
    class_abilities: 'Fúria (4/dia)\nAtaque Descuidado\nSentido de Perigo',
    // ... outras seções como notas, magias, equipamentos ...
};

// --- COMPONENTES ---

// Componente reutilizável para cada bloco de Atributo
function AttributeBox({ name, score, onScoreChange }) {
    const modifier = calculateModifier(score);
    const formattedModifier = modifier >= 0 ? `+${modifier}` : modifier;
    
    // Lista de perícias por atributo
    const skillsByAttribute = {
        forca: ['Atletismo'],
        destreza: ['Acrobacia', 'Furtividade', 'Prestidigitação'],
        inteligencia: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
        sabedoria: ['Adestrar Animais', 'Intuição', 'Medicina', 'Percepção', 'Sobrevivência'],
        carisma: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão'],
        constituicao: []
    };

    return (
        <div className="attribute-box">
            <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
            <div className="attribute-header">
                <input
                    type="number"
                    className="styled-input"
                    value={score || ''}
                    placeholder="0"
                    onChange={(e) => onScoreChange(name, parseInt(e.target.value, 10))}
                />
                <span className="modifier">({formattedModifier})</span>
            </div>
            <ul className="skill-list">
                <li className="saving-throw">
                    <input type="checkbox" />
                    <span>+k Salvaguarda</span>
                </li>
                {(skillsByAttribute[name] || []).map(skill => (
                    <li key={skill}>
                        <input type="checkbox" />
                        <span>+k {skill}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Componente para a Aba Principal
function PrincipalView({ character, setCharacter }) {

    const handleAttributeChange = (attrName, value) => {
        setCharacter(prevChar => ({
            ...prevChar,
            attributes: {
                ...prevChar.attributes,
                [attrName]: value
            }
        }));
    };
    
    const handleInfoChange = (fieldName, value) => {
        setCharacter(prevChar => ({
            ...prevChar,
            info: {
                ...prevChar.info,
                [fieldName]: value
            }
        }));
    };

    return (
        <div className="principal-view">
            <h1 className="page-title">Ficha Principal</h1>
            <div className="principal-grid">
                <div className="main-stats-column">
                    <div className="top-stats">
                        <div className="stat-item">
                            <label>Pontos de Vida</label>
                            <div className="hp-display">
                                <input type="number" className="styled-input" placeholder="0" /> / <input type="number" className="styled-input" placeholder="0" />
                            </div>
                        </div>
                        <div className="stat-item">
                            <label>CA</label>
                            <input type="number" className="styled-input" placeholder="0" />
                        </div>
                         <div className="stat-item">
                            <label>Iniciativa</label>
                            <input type="number" className="styled-input" placeholder="0" />
                        </div>
                         <div className="stat-item">
                            <label>Desloc.</label>
                            <input type="number" className="styled-input" placeholder="0" />
                        </div>
                    </div>
                    <div className="top-stats">
                         <div className="stat-item">
                            <label>Bônus de Proficiência</label>
                            <input type="number" className="styled-input" placeholder="0" />
                        </div>
                         <div className="stat-item">
                            <label>Inspiração</label>
                            <input type="checkbox" className="styled-checkbox" />
                        </div>
                        <div className="stat-item">
                             <label>Salvaguardas</label>
                             <div className="death-saves">
                                <div>Sucessos: <input type="checkbox" /><input type="checkbox" /><input type="checkbox" /></div>
                                <div>Fracassos: <input type="checkbox" /><input type="checkbox" /><input type="checkbox" /></div>
                             </div>
                        </div>
                    </div>
                    <div className="abilities-box">
                        <h3>Habilidades & Ataques</h3>
                        <table className="attacks-table">
                            <thead>
                                <tr><th>Ataque</th><th>Bônus</th><th>Dano/Tipo</th></tr>
                            </thead>
                            <tbody>
                                {character.attacks.map((attack, index) => (
                                    <tr key={index}>
                                        <td>{attack.name}</td>
                                        <td>{attack.bonus}</td>
                                        <td>{attack.damage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <textarea 
                            className="class-abilities-textarea" 
                            placeholder="Descreva aqui as habilidades da sua classe..."
                            value={character.class_abilities}
                            onChange={(e) => setCharacter(prev => ({...prev, class_abilities: e.target.value}))}
                        />
                    </div>
                </div>
                <div className="attributes-column">
                    <div className="attributes-grid">
                        {Object.entries(character.attributes).map(([name, score]) => (
                           <AttributeBox 
                                key={name} 
                                name={name} 
                                score={score}
                                onScoreChange={handleAttributeChange}
                           />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL (FICHA DE PERSONAGEM) ---
function CharacterSheet({ character, setCharacter }) {
    const [activeTab, setActiveTab] = useState('principal');

    const renderContent = () => {
        switch (activeTab) {
            case 'principal': return <PrincipalView character={character} setCharacter={setCharacter} />;
            // Adicione as outras abas aqui no futuro
            // case 'notas': return <NotasView />;
            // case 'magias': return <MagiasView />;
            // case 'equipamentos': return <EquipamentosView />;
            default: return <PrincipalView character={character} setCharacter={setCharacter} />;
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="profile-section">
                    <div className="avatar">✏️</div>
                    <div className="character-name">{character.info.name}</div>
                    <div className="character-info">{character.info.class} - Nv. {character.info.level}</div>
                </div>
                <nav className="nav-menu">
                    <button onClick={() => setActiveTab('principal')} className={activeTab === 'principal' ? 'active' : ''}>Principal</button>
                    <button onClick={() => setActiveTab('notas')} className={activeTab === 'notas' ? 'active' : ''}>Notas</button>
                    <button onClick={() => setActiveTab('magias')} className={activeTab === 'magias' ? 'active' : ''}>Magias</button>
                    <button onClick={() => setActiveTab('equipamentos')} className={activeTab === 'equipamentos' ? 'active' : ''}>Equipamentos</button>
                </nav>
            </aside>
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}

// --- App (Controlador Principal) ---
function App() {
    // Usamos o estado do React para guardar os dados da ficha.
    // Quando setCharacter for chamado, a interface será redesenhada.
    const [character, setCharacter] = useState(initialCharacterState);

    // Futuramente, aqui buscaremos os personagens do Supabase
    // e permitiremos ao utilizador escolher um.
    
    return <CharacterSheet character={character} setCharacter={setCharacter} />;
}

// --- Renderiza a aplicação na página ---
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);