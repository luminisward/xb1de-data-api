import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    name: number,
    cast: number,
    recast: number,
    tp: number,
    dex: number,
    rate1: number,
    rate2: number,
    arts_type: number,
    lv: number,
    atk_type: number,
    elem: number,
    dmg_type: number,
    dmg_time: number,
    tgt: number,
    range_type: number,
    range: number,
    range_val: number,
    flag: 256,
    st_type: number,
    st_val: number,
    st_val2: number,
    st_time: number,
    st_itv: number,
    sp_cnd: number,
    sp_proc: number,
    sp_val1: number,
    sp_val2: number,
    kb_type: number,
    kb_lv: number,
    act_idx: number,
    idx: number
}

export interface TableWithText extends TableType {
    name: any
    // [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)
        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})

        return result

    }
}
