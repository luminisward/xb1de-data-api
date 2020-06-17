import _ from 'lodash'
import {BaseParser, BaseFields, text2html} from './index'

export interface TableType extends BaseFields {
    exc_talk1: number
    exc_talk2: number
    exc_talk3: number
}

export interface TableWithText extends BaseFields {
    exc_talk1: any
    exc_talk2: any
    exc_talk3: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.exc_talk1 = text2html(await this.db.getMsSingle({table: this.msTable, row_id: row.exc_talk1, language: this.language}))
        result.exc_talk2 = text2html(await this.db.getMsSingle({table: this.msTable, row_id: row.exc_talk2, language: this.language}))
        result.exc_talk3 = text2html(await this.db.getMsSingle({table: this.msTable, row_id: row.exc_talk3, language: this.language}))

        return result

    }
}
