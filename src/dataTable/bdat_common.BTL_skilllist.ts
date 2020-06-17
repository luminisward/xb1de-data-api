import _ from 'lodash'
import {BaseParser, BaseFields, text2html} from './index'

export interface TableType extends BaseFields {
    'name': string,
    'cylinder_name': number
    'atr_type': number
    'rvs_status': number
    'rvs_type': number
    'attach': number
    'accum': number
    'max': number
    'val_type': number
    'lower_E': number
    'upper_E': number
    'lower_D': number
    'upper_D': number
    'lower_C': number
    'upper_C': number
    'lower_B': number
    'upper_B': number
    'lower_A': number
    'upper_A': number
    'lower_S': number
    'upper_S': number
    'percent_E': number
    'percent_D': number
    'percent_C': number
    'percent_B': number
    'percent_A': number
    'percent_S': number
    'money': number
    'category': number
    'rvs_caption': number
}


export interface TableWithText extends TableType {
    name: any
    rvs_caption: any
}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<any>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)


        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})
        result.rvs_caption = text2html(await this.db.getMsSingle({table: this.msTable, row_id: row.rvs_caption, language: this.language}))

        return result

    }
}
