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

    async parseOneByField(field: string, value: string): Promise<any> {
        const row: BaseFields = await this.db.getDataTableRowWhere({table: this.table, field, value})
        return await this.parseOne(row.row_id)
    }

    fieldsWithoutRowID(row: BaseFields): string[] {
        return Object.keys(row).filter(key => key !== 'row_id')
    }

    protected setTable(table: string): void {
        this.table = table
        this.msTable = this.table.split('.').map(s => s + '_ms').join('.')
    }

    protected async overrideDataX(resultRow: {[key: string]: any}): Promise<void> {
        try {
            const data = await import(`../../dataX/${this.table}`)
            Object.assign(resultRow, data[resultRow.row_id])
        } catch (e) {
            console.log(e.message)
        }

    }
}

export const text2html = (text: string): string => {
    const replacePattern: [RegExp, string][] = [
        [/\[XENO:n \]\n/g, '<br />'],
        [/\[System:Color name=item \]/g, ''],
        [/\[\/System:Color\]/g, ''],
        [/\[XENO:del del=this \]/g, ''],
        [/\[XENO:wait wait=key \]/g, ''],
        [/\[System:PageBreak \]/g, '<br />'],
        [/\[XENO:line \]/g, '──'],
    ]
    for (const [searchValue, replaceValue] of replacePattern) {
        text = text.replace(searchValue, replaceValue)
    }
    return text
}
