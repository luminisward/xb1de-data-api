import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields
{
    'row_id': number
    'name': number
    'mob_name': number
    'resource': number
    'rlt_meet': number
    'remove': number
    'shop_list': number
    'icon_type': number
    'rlt_face': string,
    'rlt_posX': number
    'rlt_posY': number
    'rlt_texture': number
    'rlt_lnd': number
    'rlt_sex': number
    'rlt_age': number
    'range_s': number
    'range_e': number
    'rlt_job': number
    'size': number
    'scale': number
    'family': number
    'move_speed': number
    'autotalk1': number
    'autotalk2': number
    'autotalk3': number
    'autotalk4': number
    'autotalk5': number
    'autotalk6': number
    'exc_talk_id': number
    'exc_id1': number
    'exc_id2': number
    'exc_id3': number
    'exc_id4': number
    'exc_id5': number
    'present': number
    'exc_map_id': number
    'npc_unique_id': number
}


export interface TableWithText extends TableType {
    name: any
    rlt_job: any

}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const newRow: TableWithText = _.clone(row)

        newRow.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})
        newRow.rlt_job = await this.db.getMsSingle({table: this.msTable, row_id: row.rlt_job, language: this.language})
        // console.log(newRow)

        return newRow

    }
}
