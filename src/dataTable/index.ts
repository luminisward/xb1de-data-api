import {Db} from '../database'

const parserCache: { [key: string]: BaseParser } = {}

export const getParser = async (tablename: string, language: string): Promise<BaseParser> => {
    const db = Db.getInstance()
    const parserModuleName = tablename.replace(/\d+/g, '')
    const cacheKey = parserModuleName + '.' + language

    if (!parserCache.hasOwnProperty(parserModuleName)) {
        const {default: Parser} = await import(`./${parserModuleName}`)
        parserCache[cacheKey] = new Parser({db, table: tablename, language})
    }

    return parserCache[cacheKey]
}

export interface BaseFields {
    row_id: number
}

export abstract class BaseParser {

    protected db: Db
    protected table: string
    msTable = ''
    protected language = 'cn'

    constructor ({db, table, language}: { db: Db, table: string, language: string }) {
        this.db = db
        this.table = table
        this.msTable = this.table.split('.').map(s => s + '_ms').join('.')
        this.language = language
    }

    abstract async parse(): Promise<any[]>

    abstract async parseOne(row_id: number): Promise<any>

    fieldsWithoutRowID (row: BaseFields): string[] {
        return Object.keys(row).filter(key => key !== 'row_id')
    }

}
