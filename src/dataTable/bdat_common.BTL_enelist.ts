import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    'row_id': number
    'name': number,
    'resource': number
    'c_name_id': number
    'mnu_vision_face': number
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

        return result

    }
}
