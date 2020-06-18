import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    wpn_per: number,
    uni_wpn_per: number,
    uni_equip_per: number,
    arts_per: number,
    wpn1: number,
    wpn1_slot: number,
    wpn1Per: number,
    wpn2: number,
    wpn2_slot: number,
    wpn2Per: number,
    wpn3: number,
    wpn3_slot: number,
    wpn3Per: number,
    wpn4: number,
    wpn4_slot: number,
    wpn4Per: number,
    uni_wpn1: number,
    uni_wpn1Per: number,
    uni_wpn2: number,
    uni_wpn2Per: number,
    uni_wpn3: number,
    uni_wpn3Per: number,
    uni_wpn4: number,
    uni_wpn4Per: number,
    uni_wpn5: number,
    uni_wpn5Per: number,
    uni_wpn6: number,
    uni_wpn6Per: number,
    uni_wpn7: number,
    uni_wpn7Per: number,
    uni_wpn8: number,
    uni_wpn8Per: number,
    uni_equip1: number,
    uni_equip1Per: number,
    uni_equip2: number,
    uni_equip2Per: number,
    uni_equip3: number,
    uni_equip3Per: number,
    uni_equip4: number,
    uni_equip4Per: number,
    uni_equip5: number,
    uni_equip5Per: number,
    uni_equip6: number,
    uni_equip6Per: number,
    uni_equip7: number,
    uni_equip7Per: number,
    uni_equip8: number,
    uni_equip8Per: number,
    arts1: number,
    arts1Per: number,
    arts2: number,
    arts2Per: number,
    arts3: number,
    arts3Per: number,
    arts4: number,
    arts4Per: number,
    arts5: number,
    arts5Per: number,
    arts6: number,
    arts6Per: number,
    arts7: number,
    arts7Per: number,
    arts8: number,
    arts8Per: number,
    [key: string]: any
}

export interface TableWithText extends BaseFields {

    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        const ITM_itemlist = await getParser('bdat_common.ITM_itemlist', this.language)

        for (let i = 1; i <= 4 ; i++) {
            const wpn = `wpn${i}`
            result[wpn] = row[wpn] > 0 ? await ITM_itemlist.parseOne(row[wpn]) : null
        }
        for (let i = 1; i <= 8 ; i++) {
            const uni_wpn = `uni_wpn${i}`
            result[uni_wpn] = row[uni_wpn] > 0 ? await ITM_itemlist.parseOne(row[uni_wpn]) : null
            const uni_equip = `uni_equip${i}`
            result[uni_equip] = row[uni_equip] > 0 ? await ITM_itemlist.parseOne(row[uni_equip]) : null
            const arts = `arts${i}`
            result[arts] = row[arts] > 0 ? await ITM_itemlist.parseOne(row[arts]) : null
        }


        return result

    }
}
