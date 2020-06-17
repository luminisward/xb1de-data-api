import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    resource: number
    style: number
    pcid: number
}

export interface TableWithText extends TableType {
    style: any
    pcid: any

}

export default class extends BaseParser {
    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        if (row.style > 0) {
            const MNU_StyleArmorPc = await getParser(`bdat_common.MNU_StyleArmorPc${row.pcid.toString().padStart(2, '0')}`, this.language)
            result.style = await MNU_StyleArmorPc.parseOne(row.style)
        } else {
            result.style = null
        }

        if (row.pcid > 0) {
            const BTL_pclist = await getParser('bdat_common.BTL_pclist', this.language)
            result.pcid = await BTL_pclist.parseOne(row.pcid)
        } else {
            result.pcid = null
        }

        return result
    }
}
