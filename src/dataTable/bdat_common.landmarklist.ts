import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    'row_id': number
    'name': number,
    'category': number
    'mapID': number
    'S_FLG_MIN1': number
    'S_FLG_MAX1': number
    'posX': number
    'posY': number
    'posZ': number
    'areaR': number
    'areaY': number
    'areaX': number
    'areaZ': number
    'rotY': number
    'getEXP': number
    'getAP': number
    'getPP': number
    'jump_posX': number
    'jump_posY': number
    'jump_posZ': number
    'jump_rotY': number
    'UI_posX': number
    'UI_posY': number
}


export interface TableWithText extends TableType {
    name: any
    mapID: any
}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)


        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})

        const mapidParser = await getParser('bdat_common.FLD_maplist', this.language)
        result.mapID = row.mapID > 0 ? await mapidParser.parseOne(row.mapID) : null

        return result

    }
}
