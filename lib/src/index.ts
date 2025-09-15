import { DatabaseEngineItem } from '@sonolus/core'

export { csvToLevelData } from './csv/convert.js'
export * from './csv/index.js'

export const version = '0.0.1'

export const databaseEngineItem = {
    name: 'cgss',
    version: 13,
    title: {
        en: 'Deresute',
        jp: 'デレステ'
    },
    subtitle: {
        en: 'THE iDOLM@STER CINDERELLA GIRLS STARLIGHT STAGE',
        ja: 'アイドルマスター シンデレラガールズ スターライトステージ',
    },
    author: {
        en: 'Gorengan Hunter#329978',
    },
    description: {
        en: [
            'A recreation of THE iDOLM@STER CINDERELLA GIRLS STARLIGHT STAGE engine in Sonolus.',
            '',
            'Version:',
            version,
            '',
            'GitHub Repository:',
            'https://github.com/gorenganhunter/sonolus-cgss-engine',
        ].join('\n'),
    },
} as const satisfies Partial<DatabaseEngineItem>
