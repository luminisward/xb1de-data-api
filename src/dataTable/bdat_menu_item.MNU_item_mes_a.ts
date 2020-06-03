import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    row_id: number
    comment: number
}

export interface TableWithText extends TableType {
    comment: any

}

export default class extends BaseParser {
    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.comment = await this.db.getMsSingle({
            table: this.msTable,
            row_id: row.comment,
            language: this.language
        })

        return result

    }
}
