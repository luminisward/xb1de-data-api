import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    'name': number
    'pc': number
    'cast': number
    'recast': number
    'tp': number
    'dex': number
    'rate1': number
    'rate2': number
    'arts_type': number
    'atk_type': number
    'chain_type': number
    'elem': number
    'dmg_type': number
    'dmg_time': number
    'tgt': number
    'range_type': number
    'range': number
    'range_val': number
    'hate': number
    'flag': number
    'st_type': number
    'st_val': number
    'st_val2': number
    'st_time': number
    'st_itv': number
    'sp_cnd': number
    'sp_proc': number
    'sp_val1': number
    'sp_val2': number
    'kb_type': number
    'kb_lv': number
    'grow_powl': number
    'grow_powh': number
    'grow_st_time': number
    'grow_st_val': number
    'glow_recast': number
    'icon': number
    'icon_base': number
    'act_idx': number
    'idx': number
    'list_idx': number
    'get_type': number
    'get_lv': number
    'melia_lv': number
    'melia_slot_idx': number
    'help': number
}


export interface TableWithText extends TableType {
    name: any

}

export default class Bdat_qtMNU_qt extends BaseParser {
    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)


        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})
        // newRow.rlt_job = await this.db.getMsSingle({table: this.msTable, row_id: row.rlt_job, language: this.language})
        // console.log(newRow)

        return result

    }
}
