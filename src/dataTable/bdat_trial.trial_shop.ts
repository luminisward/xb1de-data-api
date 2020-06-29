import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    item: number,
    price: number,
    index: number,
    sflg: number,
    mflg: number
}

export interface TableWithText extends TableType {
    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        const rows = await this.db.getDataTable<TableType>({table: this.table})

        const itemParser = await getParser('bdat_common.ITM_itemlist', this.language)

        return await Promise.all(
            rows.map(async row => {
                row.item = row.item > 0 ? await itemParser.parseOne(row.item) : null
                return row
            })
        )
    }
    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        const itemParser = await getParser('bdat_common.ITM_itemlist', this.language)
        result.item = row.item > 0 ? await itemParser.parseOne(row.item) : null

        return result

    }
}
