import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    crystal_per: number,
    wpn_per: number,
    equip_per: number,
    arts_per: number,
    crystal1: number,
    crystal1Per: number,
    crystal2: number,
    crystal2Per: number,
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
    equip1: number,
    equip1_slot: number,
    equip1Per: number,
    equip2: number,
    equip2_slot: number,
    equip2Per: number,
    equip3: number,
    equip3_slot: number,
    equip3Per: number,
    equip4: number,
    equip4_slot: number,
    equip4Per: number,
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

export interface TableWithText extends TableType {

    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)


        const ITM_dropcrystallist = await getParser('bdat_common.ITM_dropcrystallist', this.language)

        result.crystal1 = row.crystal1 > 0 ? await ITM_dropcrystallist.parseOne(row.crystal1) : null
        result.crystal2 = row.crystal2 > 0 ? await ITM_dropcrystallist.parseOne(row.crystal2) : null


        const ITM_itemlist = await getParser('bdat_common.ITM_itemlist', this.language)
        for (let i = 1; i <= 4 ; i++) {
            const wpn = `wpn${i}`
            result[wpn] = row[wpn] > 0 ? await ITM_itemlist.parseOne(row[wpn]) : null
            const equip = `equip${i}`
            result[equip] = row[equip] > 0 ? await ITM_itemlist.parseOne(row[equip]) : null
        }


        return result

    }
}
