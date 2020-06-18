import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    atr_type: number,
    rank: number,
    cylinder: number,
    skill1: number,
    skill2: number,
    comment: string
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

        const BTL_skilllist = await getParser('bdat_common.BTL_skilllist', this.language)
        result.skill1 = row.skill1 > 0 ? await BTL_skilllist.parseOne(row.skill1) : null
        result.skill2 = row.skill2 > 0 ? await BTL_skilllist.parseOne(row.skill2) : null

        return result

    }
}
