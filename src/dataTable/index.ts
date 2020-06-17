import {Db} from '../database'

const parserCache: { [key: string]: BaseParser } = {}

export const getParser = async (tablename: string, language: string): Promise<BaseParser> => {
    const db = Db.getInstance()
    const cacheKey = tablename + '.' + language
    const parserModuleName = tablename.replace(/\d+/g, '')

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
    protected table = ''
    msTable = ''
    protected language = 'cn'

    constructor({db, table, language}: { db: Db, table: string, language: string }) {
        this.db = db
        this.language = language
        this.setTable(table)
    }

    abstract async parse(): Promise<any[]>

    abstract async parseOne(row_id: number): Promise<any>

    fieldsWithoutRowID(row: BaseFields): string[] {
        return Object.keys(row).filter(key => key !== 'row_id')
    }

    protected setTable(table: string): void {
        this.table = table
        this.msTable = this.table.split('.').map(s => s + '_ms').join('.')
    }

    protected async overrideDataX(resultRow: any): Promise<void> {
        try {
            const data = await import(`../../dataX/${this.table}`)
            Object.assign(resultRow, data[resultRow.row_id])
        } catch (e) {
            console.log(e.message)
        }

    }
}

export const text2html = (text: string): string => {
    text = text.replace(/\[XENO:n \]\n/g, '<br />')
    text = text.replace(/\[System:Color name=item \]/g, '')
    text = text.replace(/\[\/System:Color\]/g, '')
    return text
}
