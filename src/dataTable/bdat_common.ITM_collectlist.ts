import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    'name': number
    'mapID': number
    'type': number
    'FSplus1': number
    'FSplus2': number
    'FSplus3': number
    'FSplus4': number
    'FSplus5': number
    'FSplus6': number
    'FSplus7': number
    'money': number
}


export interface TableWithText extends TableType {
    name: any
    mapID: any
}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse(): Promise<any[]> {
        return []
    }

    async parseOne(row_id: number): Promise<any> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})

        const mapIdParser = await getParser('bdat_common.FLD_maplist', this.language)
        result.mapID = await mapIdParser.parseOne(row.mapID)

        return result

    }
}
