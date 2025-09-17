// --- ESTADO INICIAL DA FICHA (COM DADOS PARA AS NOVAS ABAS) ---
export const initialCharacterState = {
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
        1: { total: 4, atuais: 2 }, // Mantendo sua nova estrutura
        2: { total: 3, atuais: 1 },
        3: { total: 2, atuais: 0 },
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