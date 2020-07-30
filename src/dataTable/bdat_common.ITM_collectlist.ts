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
    type: any
}

enum CollectionType {
    蔬菜 = 1,
    果实,
    花,
    小动物,
    昆虫,
    自然物,
    机械零件,
    不明
}

export default class extends BaseParser {

    async parse(): Promise<any[]> {
        return []
    }

    async parseOne(row_id: number): Promise<any> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})

        if (row.mapID === 26) {
            result.mapID = null
        } else {
            const mapIdParser = await getParser('bdat_common.FLD_maplist', this.language)
            result.mapID = await mapIdParser.parseOne(row.mapID)
        }

        result.type = CollectionType[row.type]

        return result

    }
}
