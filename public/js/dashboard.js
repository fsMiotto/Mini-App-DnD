'use strict';

const { useState, useEffect } = React;

// --- FUNÇÃO AUXILIAR para calcular modificadores ---
function calculateModifier(score) {
    if (score === null || isNaN(score) || score < 0) return 0;
    // Garante que a pontuação está entre 0 e 20 para o cálculo pedido
    const cappedScore = Math.max(0, Math.min(20, score));
    const modifier = Math.floor((cappedScore - 10) / 2);
    return modifier;
}


// --- ESTADO INICIAL DA FICHA ---
const initialCharacterState = {
    info: {
        name: 'Grog Strongjaw', class: 'Bárbaro', level: 5,
        hp_current: null, hp_max: null, ac: null,
        initiative: null, speed: null, proficiency_bonus: null,
        inspiration: false,
    },
    attributes: {
        forca: 10, destreza: 10, constituicao: 10,
        inteligencia: 10, sabedoria: 10, carisma: 10,
    },
    proficiencies: {
        salvaguarda_forca: false, salvaguarda_destreza: false, salvaguarda_constituicao: false,
        salvaguarda_inteligencia: false, salvaguarda_sabedoria: false, salvaguarda_carisma: false,
        atletismo: false, acrobacia: false, furtividade: false, prestidigitacao: false,
        arcanismo: false, historia: false, investigacao: false, natureza: false, religiao: false,
        adestrar_animais: false, intuicao: false, medicina: false, percepcao: false, sobrevivencia: false,
        atuacao: false, enganacao: false, intimidacao: false, persuasao: false,
    },
    skill_values: {
        // Valores +k para cada perícia e salvaguarda
    },
    attacks: [ { name: 'Espada Longa', bonus: '+5', damage: '1d8+5 Cortante' } ],
    class_abilities: 'Fúria (4/dia)\nAtaque Descuidado\nSentido de Perigo',
};


// --- COMPONENTES ---

function AttributeBox({ name, score, onScoreChange, character, setCharacter }) {
    const modifier = calculateModifier(score);
    const formattedModifier = modifier >= 0 ? `+${modifier}` : modifier;
    
    const skillsByAttribute = {
        forca: ['Atletismo'],
        destreza: ['Acrobacia', 'Furtividade', 'Prestidigitação'],
        inteligencia: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
        sabedoria: ['Adestrar Animais', 'Intuição', 'Medicina', 'Percepção', 'Sobrevivência'],
        carisma: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão']
    };

    return (
        <div className="attribute-box">
            <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
            <div className="attribute-header">
                <input
                    type="number" className="styled-input"
                    value={score || ''} placeholder="0"
                    onChange={(e) => onScoreChange(name, parseInt(e.target.value, 10))}
                />
                <span className="modifier">({formattedModifier})</span>
            </div>
            <ul className="skill-list">
                <li className="saving-throw-item">
                    <input type="checkbox" />
                    <input type="number" className="skill-value-input" placeholder="0"/>
                    <span>Salvaguarda</span>
                </li>
                
                {/* --- DIVISÓRIA ADICIONADA --- */}
                <div className="skill-separator"></div>

                {(skillsByAttribute[name] || []).map(skill => (
                    <li key={skill}>
                        <input type="checkbox" />
                        {/* --- CAMPO DE ESCRITA ADICIONADO --- */}
                        <input type="number" className="skill-value-input" placeholder="0"/>
                        <span>{skill}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PrincipalView({ character, setCharacter }) {
    const handleAttributeChange = (attrName, value) => {
        setCharacter(prevChar => ({ ...prevChar, attributes: { ...prevChar.attributes, [attrName]: value } }));
    };

    return (
        <div className="principal-view">
            <h1 className="page-title">Ficha Principal</h1>
            <div className="principal-grid">
                <div className="main-stats-column">
                    <div className="top-stats">
                        <div className="stat-item"><label>Pontos de Vida</label><div className="hp-display"><input type="number" className="styled-input" placeholder="0" /> / <input type="number" className="styled-input" placeholder="0" /></div></div>
                        <div className="stat-item"><label>CA</label><input type="number" className="styled-input" placeholder="0" /></div>
                        <div className="stat-item"><label>Iniciativa</label><input type="number" className="styled-input" placeholder="0" /></div>
                        <div className="stat-item"><label>Desloc.</label><input type="number" className="styled-input" placeholder="0" /></div>
                    </div>
                    {/* --- AJUSTADO PARA NÃO SOBREPOR --- */}
                    <div className="top-stats" style={{alignItems: 'flex-end'}}>
                        <div className="stat-item"><label>Bônus de Proficiência</label><input type="number" className="styled-input" placeholder="0" /></div>
                        <div className="stat-item"><label>Inspiração</label><input type="checkbox" className="styled-checkbox" /></div>
                        <div className="stat-item">
                            <label>Salvaguardas de Morte</label>
                            <div className="death-saves">
                                <div>Sucessos: <input type="checkbox" /><input type="checkbox" /><input type="checkbox" /></div>
                                <div>Fracassos: <input type="checkbox" /><input type="checkbox" /><input type="checkbox" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="abilities-box">
                         <h3>Habilidades & Ataques</h3>
                        <table className="attacks-table">
                            <thead><tr><th>Ataque</th><th>Bônus</th><th>Dano/Tipo</th></tr></thead>
                            <tbody>
                                {character.attacks.map((attack, index) => (
                                    <tr key={index}><td>{attack.name}</td><td>{attack.bonus}</td><td>{attack.damage}</td></tr>
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
                                key={name} name={name} score={score}
                                onScoreChange={handleAttributeChange}
                                character={character} setCharacter={setCharacter}
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
                    <button onClick={() => setActiveTab('notas')}>Notas</button>
                    <button onClick={() => setActiveTab('magias')}>Magias</button>
                    <button onClick={() => setActiveTab('equipamentos')}>Equipamentos</button>
                </nav>
            </aside>
            <main className="main-content">{renderContent()}</main>
        </div>
    );
}

// --- App (Controlador Principal) ---
function App() {
    const [character, setCharacter] = useState(initialCharacterState);
    return <CharacterSheet character={character} setCharacter={setCharacter} />;
}

// --- Renderiza a aplicação na página ---
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);