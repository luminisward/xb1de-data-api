import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    crs_type: number,
    rank_type_low: number,
    rank_type_up: number,
    atr_type: number,
    skill_max: number
}

export type TableWithText = TableType

export default class extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)
        return result
    }
}
