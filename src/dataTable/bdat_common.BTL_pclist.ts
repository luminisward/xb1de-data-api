import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    'name': number
    'guest': number
    'lv': number
    'hp': number
    'str': number
    'agi': number
    'eth': number
    'delay': number
    'hit_range': number
    'dbl_atk': number
    'cnt_atk': number
    'chest_height': number
    'ts_low': number
    'ts_nrm': number
    'ts_high': number
    'tp_atk': number
    'tp_arts': number
    'tp_atkdmg': number
    'tp_artsdmg': number
    'hp_lv99': number
    'str_lv99': number
    'agi_lv99': number
    'eth_lv99': number
    'icon_type': number
    'icon_type2': number
    'icon_type3': number
    'tag_icon': number
    'icon_future': number
    'atk1': number
    'atk2': number
    'atk3': number
    'def_wpn': number
    'def_head': number
    'def_body': number
    'def_arm': number
    'def_waist': number
    'def_legg': number
    'melia_lv': number
    'melia_def_wpn': number
    'melia_def_head': number
    'melia_def_body': number
    'melia_def_arm': number
    'melia_def_waist': number
    'melia_def_legg': number

    [key: string]: any
}


export interface TableWithText extends TableType {
    name: any

    [key: string]: any

}

export default class extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})

        // {
        //     const itmParser = await getParser('bdat_common.ITM_itemlist', this.language)
        //     for (const key of [
        //         'def_wpn',
        //         'def_head',
        //         'def_body',
        //         'def_arm',
        //         'def_waist',
        //         'def_legg',
        //         'melia_def_wpn',
        //         'melia_def_head',
        //         'melia_def_body',
        //         'melia_def_arm',
        //         'melia_def_waist',
        //         'melia_def_legg'
        //     ]) {
        //         result[key] = await itmParser.parseOne(row[key])
        //     }
        // }

        return result

    }
}
