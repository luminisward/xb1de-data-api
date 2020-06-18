import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    materia1: number,
    materia1Per: number,
    materia2: number,
    materia2Per: number
}

export interface TableWithText extends BaseFields {

    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        const ITM_itemlist = await getParser('bdat_common.ITM_itemlist', this.language)
        result.materia1 = row.materia1 > 0 ? await ITM_itemlist.parseOne(row.materia1) : null
        result.materia2 = row.materia2 > 0 ? await ITM_itemlist.parseOne(row.materia2) : null

        return result

    }
}
