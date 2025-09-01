'use strict';

const { useState, useMemo } = React;

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
    attacks: [ { id: 1, name: 'Espada Longa', bonus: '+5', damage: '1d8+5', damage_type: 'Cortante' } ],
    class_abilities: 'Fúria (4/dia)\nAtaque Descuidado\nSentido de Perigo',
    // Dados para as outras abas:
    notes: [
        { id: 1, title: 'Loot da Caverna', content: 'Encontrámos um machado estranho e 50gp.' },
        { id: 2, title: 'NPCs Importantes', content: 'Não confiar no K\'Varn, o anão da taverna.' },
    ],
    spell_slots: {
        1: { total: 4, atuais: 2 }, // Mantendo sua nova estrutura
        2: { total: 3, atuais: 1 },
        3: { total: 2, atuais: 0 },
    },
    spells: [
        { id: Date.now() + 1, level: 0, name: 'Mãos Mágicas' },
        { id: Date.now() + 2, level: 0, name: 'Raio de Fogo' },
        { id: Date.now() + 3, level: 1, name: 'Marca do Caçador' },
        { id: Date.now() + 4, level: 1, name: 'Curar Ferimentos' },
        { id: Date.now() + 5, level: 2, name: 'Passo Nebuloso' },
        { id: Date.now() + 6, level: 3, name: 'Velocidade' },
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
        forca: ['Atletismo'], 
        destreza: ['Acrobacia', 'Furtividade', 'Prestidigitação'],
        inteligencia: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
        sabedoria: ['Adestrar Animais', 'Intuição', 'Medicina', 'Percepção', 'Sobrevivência'],
        constituicao: [],
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
                    <li key={skill}><input type="checkbox" /><input type="number" className="skill-value-input" placeholder="0"/><span >{skill}</span></li>
                ))}
            </ul>
        </div>
    );
}

function PrincipalView({ character, setCharacter }) {
    const handleAttributeChange = (attrName, value) => {
        setCharacter(prevChar => ({ ...prevChar, attributes: { ...prevChar.attributes, [attrName]: value } }));
    };

    const handleAttackChange = (id, field, value) => {
        setCharacter(prev => ({
            ...prev,
            attacks: prev.attacks.map(attack =>
                attack.id === id ? { ...attack, [field]: value } : attack
            )
        }));
    };

    const handleAddAttack = () => {
        const newAttack = {
            id: Date.now(), // ID único simples para a nova linha
            name: '',
            bonus: '',
            damage: '',
            damage_type: ''
        };
        setCharacter(prev => ({ ...prev, attacks: [...prev.attacks, newAttack] }));
    };

    const handleRemoveAttack = (idToRemove) => {
        setCharacter(prev => ({
            ...prev,
            attacks: prev.attacks.filter(attack => attack.id !== idToRemove)
        }));
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
                            <thead>
                                <tr>
                                    <th>Ataque</th>
                                    <th>Bônus</th>
                                    <th>Dano</th>
                                    <th>Tipo</th>
                                    <th style={{width: '40px'}}></th> {/* Espaço para o botão de remover */}
                                </tr>
                            </thead>
                            <tbody>
                                {character.attacks.map(attack => (
                                    <tr key={attack.id}>
                                        <td><input type="text" className="table-input" value={attack.name} onChange={e => handleAttackChange(attack.id, 'name', e.target.value)} placeholder="Nome do Ataque" /></td>
                                        <td><input type="text" className="table-input" value={attack.bonus} onChange={e => handleAttackChange(attack.id, 'bonus', e.target.value)} placeholder="+0" /></td>
                                        <td><input type="text" className="table-input" value={attack.damage} onChange={e => handleAttackChange(attack.id, 'damage', e.target.value)} placeholder="1d8" /></td>
                                        <td><input type="text" className="table-input" value={attack.damage_type} onChange={e => handleAttackChange(attack.id, 'damage_type', e.target.value)} placeholder="Cortante" /></td>
                                        <td><button onClick={() => handleRemoveAttack(attack.id)} className="remove-spell-btn">🗑️</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="add-item-placeholder" onClick={handleAddAttack}>
                            <button className="add-item-btn" aria-label="Adicionar ataque">+</button>
                            <span>Adicionar ataque...</span>
                        </div>
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

function MagiasView({ spells, spellSlots, setCharacter }) {
    // useMemo otimiza a performance, recalculando a lista agrupada apenas quando 'spells' mudar.
    const spellsByLevel = useMemo(() => {
        return spells.reduce((acc, spell) => {
            acc[spell.level] = acc[spell.level] || [];
            acc[spell.level].push(spell);
            return acc;
        }, {});
    }, [spells]);
    // Handler para atualizar os slots de magia no estado principal
    const handleSlotChange = (level, field, value) => {
        const numericValue = parseInt(value, 10);
        if (value !== '' && isNaN(numericValue)) return; // Ignora se não for número

        setCharacter(prev => ({
            ...prev,
            spell_slots: {
                ...prev.spell_slots,
                [level]: { ...prev.spell_slots[level], [field]: value === '' ? null : numericValue }
            }
        }));
    };

    const handleAddSpell = (level) => {
        const newSpell = {
            id: Date.now(),
            level: parseInt(level, 10),
            name: ''
        };
        setCharacter(prev => ({
            ...prev,
            // Adiciona a nova magia e re-ordena o array para manter os níveis juntos
            spells: [...prev.spells, newSpell].sort((a, b) => a.level - b.level)
        }));
    };

    const handleSpellChange = (id, value) => {
        setCharacter(prev => ({
            ...prev,
            spells: prev.spells.map(spell =>
                spell.id === id ? { ...spell, name: value } : spell
            )
        }));
    };

    const handleRemoveSpell = (idToRemove) => {
        setCharacter(prev => ({
            ...prev,
            spells: prev.spells.filter(spell => spell.id !== idToRemove)
        }));
    };

    return (
        <div className="magias-view">
            <h1 className="page-title">Livro de Magias</h1>

            {/* Seção dedicada para Truques (Nível 0) */}
            <div className="spell-level" key="0">
                <h2>Truques</h2>
                <ul className="spell-list">
                   {(spellsByLevel[0] || []).map(spell => (
                        <li key={spell.id}>
                            <input type="text" className="table-input" value={spell.name} onChange={e => handleSpellChange(spell.id, e.target.value)} placeholder="Nome do truque" />
                            <button onClick={() => handleRemoveSpell(spell.id)} className="remove-spell-btn">🗑️</button>
                        </li>
                    ))}
                    <li className="add-item-placeholder" onClick={() => handleAddSpell(0)}>
                        <button className="add-item-btn" aria-label="Adicionar truque">+</button>
                        <span>Adicionar truque...</span>
                    </li>
                </ul>
            </div>

            {/* Seção para magias de nivel */}
            {Object.entries(spellSlots).map(([level, slots]) => (
                <div className="spell-level" key={level}>
                    <h2><span>Nível {level}</span><span className="spell-slot-tracker">Espaços: <input type="number" value={slots.atuais ?? ''} onChange={(e) => handleSlotChange(level, 'atuais', e.target.value)} placeholder="0" /> / <input type="number" value={slots.total ?? ''} onChange={(e) => handleSlotChange(level, 'total', e.target.value)} placeholder="0" /></span></h2>
                    <ul className="spell-list">
                       {(spellsByLevel[level] || []).map(spell => (
                            <li key={spell.id}>
                                <input type="text" className="table-input" value={spell.name} onChange={e => handleSpellChange(spell.id, e.target.value)} placeholder="Nome da magia" />
                                <button onClick={() => handleRemoveSpell(spell.id)} className="remove-spell-btn">🗑️</button>
                            </li>
                        ))}
                        <li className="add-item-placeholder" onClick={() => handleAddSpell(level)}>
                            <button className="add-item-btn" aria-label="Adicionar magia">+</button>
                            <span>Adicionar magia...</span>
                        </li>
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
                return <MagiasView spells={character.spells} spellSlots={character.spell_slots} setCharacter={setCharacter} />;
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
