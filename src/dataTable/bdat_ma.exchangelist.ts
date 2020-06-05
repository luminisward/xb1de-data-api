import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    'row_id': number
    'wpn1': number
    'head1': number
    'body1': number
    'arm1': number
    'waist1': number
    'legg1': number
    'kessyou1': number
    'kessyou2': number
    'collect1': number
    'collect2': number
    'materia1': number
    'materia2': number
    [key: string]: number
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

        const fields: string[] = this.fieldsWithoutRowID(row)

        for (const field of fields) {
            result[field] = row[field] > 0 ? await ITM_itemlist.parseOne(row[field]) : null
        }

        return result

    }
}
