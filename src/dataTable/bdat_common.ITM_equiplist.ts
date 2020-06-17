import _ from 'lodash'
import {BaseParser, BaseFields} from './index'
import {getParser} from './index'


export interface TableType extends BaseFields {
    'name': number,
    'parts': number,
    'uni_flag': number,
    'arm_phy': number,
    'arm_eth': number,
    'eva_rate': number,
    'arm_type': number,
    'jwl_slot': number,
    'jwl_skill1': number,
    'pc': number[],
    'money': number
}


export interface TableWithText extends TableType {
    name: any
    jwl_skill1: any
    pc: any[]

    [key: string]: any

}

enum PartsTable {
    ITM_headlist = 1,
    ITM_bodylist,
    ITM_armlist,
    ITM_waistlist,
    ITM_legglist
}

export default class Bdat_qtMNU_qt extends BaseParser {


    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<any> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})


        const ITM_itemlist = await getParser('bdat_common.ITM_itemlist', this.language)
        if (row.jwl_skill1 > 0) {
            const gem = await ITM_itemlist.parseOne(row.jwl_skill1)
            result.jwl_skill1 = gem
        } else {
            result.jwl_skill1 = null
        }


        await this.overrideDataX(result) // 修正Attack V parts等数据错误
        const ITM_partslist = await getParser(`bdat_common.${PartsTable[result.parts]}`, this.language)

        result.pc = await Promise.all(
            row.pc.map(async partsId => {
                if (partsId > 0) {
                    const parts = await ITM_partslist.parseOne(partsId)
                    return parts
                }
                return null
            })
        )

        return result

    }
}
