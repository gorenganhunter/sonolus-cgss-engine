const { hash } = require("@sonolus/core")
const fs = require("fs")

const pkg = require("./package.json")

const engine = {
    name: 'cgss',
    version: 13,
    title: { en: 'Deresute', ja: "デレステ" },
    subtitle: { en: 'THE iDOLM@STER CINDERELLA GIRLS STARLIGHT STAGE', ja: "アイドルマスター シンデレラガールズ スターライトステージ" },
    author: { en: 'Gorengan Hunter#329978' },
    tags: [],
    description: {
        en: 'A recreation of THE iDOLM@STER CINDERELLA GIRLS STARLIGHT STAGE engine in Sonolus.\n' +
            `Version: ${pkg.version}\n` +
            '\n' +
            'Github Repository\n' +
            'https://github.com/gorenganhunter/sonolus-cgss-engine'
    },
    skin: 'cgss-witch-02',
    background: 'cgss-bg-live-4004-4',
    effect: '8bit',
    particle: 'none',
    thumbnail: {
        hash: '0b365769472b25f0f35039eb5e73240ac7676cc3',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/cgss-sonolus-data/0b365769472b25f0f35039eb5e73240ac7676cc3'
    },
    playData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/cgss-sonolus-data/'
    },
    watchData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/cgss-sonolus-data/'
    },
    previewData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/cgss-sonolus-data/'
    },
    tutorialData: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/cgss-sonolus-data/'
    },
    configuration: {
        hash: '',
        url: 'https://cdn.jsdelivr.net/gh/gorenganhunter/cgss-sonolus-data/'
    }
}

const files = {
    playData: "./dist/EnginePlayData",
    watchData: "./dist/EngineWatchData",
    previewData: "./dist/EnginePreviewData",
    tutorialData: "./dist/EngineTutorialData",
    configuration: "./dist/EngineConfiguration"
}

const db = require("./cgss-server/pack/db.json")
// const dbc = require("./d4c/pack/db.json")

for (const file of Object.keys(files)) {
    const path = files[file]
    const buffer = fs.readFileSync(path)
    const hashed = hash(buffer)
    if (db.engines.length) fs.rmSync(`./cgss-sonolus-data/${db.engines[0][file].hash}`, { force: true })
    fs.writeFileSync(`./cgss-sonolus-data/${hashed}`, buffer)
    engine[file] = {
        hash: hashed,
        url: `https://cdn.jsdelivr.net/gh/gorenganhunter/cgss-sonolus-data/${hashed}`
    }
}

const version = {
    last_updated: new Date().toISOString()
}

fs.writeFileSync("./cgss-sonolus-data/version.json", JSON.stringify(version))

db.engines[0] = engine
// dbc.engines[0] = engine

fs.writeFileSync("./cgss-server/pack/db.json", JSON.stringify(db))

fs.writeFileSync("./cgss-server/version.json", JSON.stringify(version))
//
// fs.writeFileSync("./d4c/pack/db.json", JSON.stringify(dbc))
//
// fs.writeFileSync("./d4c/version.json", JSON.stringify(version))
