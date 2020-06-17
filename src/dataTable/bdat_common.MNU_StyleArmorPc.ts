import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    name: number
    head: number
    body: number
    arm: number
    waist: number
    leg: number
    index: number
}

export interface TableWithText extends TableType {
    name: any

}

export default class extends BaseParser {
    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.name = await this.db.getMsSingle({table: 'bdat_common_ms.ITM_fashionlist_ms', row_id: row.name, language: this.language})

        return result

    }
}
