import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    'name': number
    'mapID': number
    'money': number
    'rare': number
}


export interface TableWithText extends TableType {
    name: any
}

export default class extends BaseParser {

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
