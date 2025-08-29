'use strict';

const { useState } = React;

// --- FUNÇÃO AUXILIAR para calcular modificadores ---
function calculateModifier(score) {
    if (score === null || isNaN(score) || score < 0) return 0;
    const cappedScore = Math.max(0, Math.min(20, score));
    const modifier = Math.floor((cappedScore - 10) / 2);
    return modifier;
}

// --- ESTADO INICIAL DA FICHA (COM DADOS PARA AS NOVAS ABAS) ---
const initialCharacterState = {
    info: { name: 'Grog Strongjaw', class: 'Bárbaro', level: 5, hp_current: null, hp_max: null, ac: null, initiative: null, speed: null, proficiency_bonus: null, inspiration: false, },
    attributes: { forca: 10, destreza: 10, inteligencia: 10, sabedoria: 10, constituicao: 10, carisma: 10, },
    proficiencies: { /* ... */ },
    skill_values: { /* ... */ },
    attacks: [ { name: 'Espada Longa', bonus: '+5', damage: '1d8+5 Cortante' } ],
    class_abilities: 'Fúria (4/dia)\nAtaque Descuidado\nSentido de Perigo',
    // Dados para as outras abas:
    notes: [
        { id: 1, title: 'Loot da Caverna', content: 'Encontrámos um machado estranho e 50gp.' },
        { id: 2, title: 'NPCs Importantes', content: 'Não confiar no K\'Varn, o anão da taverna.' },
    ],
    spell_slots: {
        1: { total: 4, used: 2 },
        2: { total: 3, used: 1 },
        3: { total: 2, used: 0 },
    },
    spells: [
        { level: 1, name: 'Marca do Caçador' },
        { level: 1, name: 'Curar Ferimentos' },
        { level: 2, name: 'Passo Nebuloso' },
        { level: 3, name: 'Velocidade' },
    ],
    inventory: {
        equipment: 'Espada Longa\nEscudo de Aço\nMochila com suprimentos',
        treasures: '50 peças de ouro\n1x Poção de Cura\n1x Gema misteriosa'
    }
};


// --- COMPONENTES ---

function AttributeBox({ name, score, onScoreChange }) {
    const modifier = calculateModifier(score);
    const formattedModifier = modifier >= 0 ? `+${modifier}` : modifier;
    const skillsByAttribute = {
        forca: ['Atletismo'], destreza: ['Acrobacia', 'Furtividade', 'Prestidigitação'],
        inteligencia: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
        sabedoria: ['Adestrar Animais', 'Intuição', 'Medicina', 'Percepção', 'Sobrevivência'],
        carisma: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão']
    };
    return (
        <div className="attribute-box">
            <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
            <div className="attribute-header">
                <input type="number" className="styled-input" value={score || ''} placeholder="0" onChange={(e) => onScoreChange(name, parseInt(e.target.value, 10))} />
                <span className="modifier">({formattedModifier})</span>
            </div>
            <ul className="skill-list">
                <li className="saving-throw-item"><input type="checkbox" /><input type="number" className="skill-value-input" placeholder="0"/><span>Salvaguarda</span></li>
                <div className="skill-separator"></div>
                {(skillsByAttribute[name] || []).map(skill => (
                    <li key={skill}><input type="checkbox" /><input type="number" className="skill-value-input" placeholder="0"/><span>{skill}</span></li>
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
                    <div className="paper-container">
                         <h3>Habilidades & Ataques</h3>
                        <table className="attacks-table">
                            <thead><tr><th>Ataque</th><th>Bônus</th><th>Dano/Tipo</th></tr></thead>
                            <tbody>
                                {character.attacks.map((attack, index) => (
                                    <tr key={index}><td>{attack.name}</td><td>{attack.bonus}</td><td>{attack.damage}</td></tr>
                                ))}
                            </tbody>
                        </table>
                        <textarea className="paper-textarea" placeholder="Descreva aqui as habilidades da sua classe..." value={character.class_abilities} onChange={(e) => setCharacter(prev => ({...prev, class_abilities: e.target.value}))} />
                    </div>
                </div>
                <div className="attributes-column">
                    <div className="attributes-grid">
                        {Object.entries(character.attributes).map(([name, score]) => (
                           <AttributeBox key={name} name={name} score={score} onScoreChange={handleAttributeChange} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTES DAS OUTRAS ABAS (REATIVADOS E CRIADOS) ---
function NotasView({ notes }) {
    // Este é um componente de exemplo, a lógica de criar/apagar virá depois
    return (
        <div className="notas-view">
             <h1 className="page-title">Notas</h1>
             <p>Aqui você poderá criar e apagar múltiplas notas sobre a sua aventura.</p>
             {/* A lógica de criar e apagar notas virá aqui */}
        </div>
    );
}

function MagiasView({ spells, spellSlots }) {
    const spellsByLevel = spells.reduce((acc, spell) => {
        acc[spell.level] = acc[spell.level] || [];
        acc[spell.level].push(spell);
        return acc;
    }, {});
    return (
        <div className="magias-view">
            <h1 className="page-title">Livro de Magias</h1>
            {/* O Object.entries garante que iteramos sobre todos os níveis definidos em spell_slots */}
            {Object.entries(spellSlots).map(([level, slots]) => (
                <div className="spell-level" key={level}>
                    <h2>
                        <span>Nível {level}</span>
                        <span className="spell-slot-tracker">
                            Espaços: <input type="number" defaultValue={slots.total - slots.used} /> / {slots.total}
                        </span>
                    </h2>
                    <ul className="spell-list">
                       {(spellsByLevel[level] || []).map(spell => (
                            <li key={spell.name}>{spell.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

function TesourosView({ inventory, setCharacter }) {
    return (
        <div className="tesouros-view">
            <h1 className="page-title">Tesouros e Inventário</h1>
            {/* Aplicamos as duas classes aqui: o estilo do contêiner e o layout de grid */}
            <div className="paper-container tesouros-grid">
                {/* Primeiro textarea (coluna 1) */}
                <textarea 
                    className="paper-textarea"
                    placeholder="Liste aqui seu equipamento..."
                    value={inventory.equipment}
                    onChange={(e) => setCharacter(prev => ({...prev, inventory: {...prev.inventory, equipment: e.target.value}}))}
                />
                {/* Segundo textarea (coluna 2) */}
                <textarea 
                    className="paper-textarea"
                    placeholder="Liste aqui suas moedas, gemas e outros tesouros..."
                    value={inventory.treasures}
                    onChange={(e) => setCharacter(prev => ({...prev, inventory: {...prev.inventory, treasures: e.target.value}}))}
                />
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL (FICHA DE PERSONAGEM) ---
function CharacterSheet({ character, setCharacter }) {
    // O 'useState' guarda a aba que está atualmente ativa. 'principal' é o valor inicial.
    const [activeTab, setActiveTab] = useState('principal');

    // Esta função decide qual componente de "view" mostrar com base no estado de 'activeTab'.
    const renderContent = () => {
        // --- LÓGICA DO MENU REATIVADA ---
        switch (activeTab) {
            case 'principal': 
                return <PrincipalView character={character} setCharacter={setCharacter} />;
            case 'notas': 
                return <NotasView notes={character.notes} />;
            case 'magias': 
                return <MagiasView spells={character.spells} spellSlots={character.spell_slots} />;
            case 'tesouros': 
                return <TesourosView inventory={character.inventory} setCharacter={setCharacter} />;
            default: 
                return <PrincipalView character={character} setCharacter={setCharacter} />;
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
                    {/* Cada botão agora tem um 'onClick' que chama 'setActiveTab'. */}
                    {/* Isto atualiza o estado, e o React redesenha a tela com o novo conteúdo. */}
                    {/* A classe 'active' é aplicada condicionalmente para o realce vermelho. */}
                    <button onClick={() => setActiveTab('principal')} className={activeTab === 'principal' ? 'active' : ''}>Principal</button>
                    <button onClick={() => setActiveTab('notas')} className={activeTab === 'notas' ? 'active' : ''}>Notas</button>
                    <button onClick={() => setActiveTab('magias')} className={activeTab === 'magias' ? 'active' : ''}>Magias</button>
                    <button onClick={() => setActiveTab('tesouros')} className={activeTab === 'tesouros' ? 'active' : ''}>Tesouros</button>
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
    const [character, setCharacter] = useState(initialCharacterState);
    return <CharacterSheet character={character} setCharacter={setCharacter} />;
}

// --- Renderiza a aplicação na página ---
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);
