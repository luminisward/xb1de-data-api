import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    S_FLG_MIN: number,
    S_FLG_MAX: number,
    gimmickID: number,
    questID: number,
    quest_STFLG: number,
    popTime: number,
    wtrType: number,
    posX: number,
    posY: number,
    posZ: number,
    Radius: number,
    snap: number,
    popNum: number,
    itm1ID: number,
    itm1Per: number,
    itm2ID: number,
    itm2Per: number,
    itm3ID: number,
    itm3Per: number,
    itm4ID: number,
    itm4Per: number,
    itm5ID: number,
    itm5Per: number,
    itm6ID: number,
    itm6Per: number,
    itm7ID: number,
    itm7Per: number,
    itm8ID: number,
    itm8Per: number,
    [key: string]: any
}

export interface TableWithText extends TableType {
    itm1ID: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        const rows = await this.db.getDataTable<TableType>({table: this.table})

        const itemParser = await getParser('bdat_common.ITM_itemlist', this.language)
        const cache: {[key: string]: any} = {}
        const getItemName = async (id: number) => {
            if (cache[id]){
                return cache[id]
            }
            const itm = await itemParser.parseOne(id)
            cache[id] = itm.itemID.name
            return cache[id]
        }

        const results = []
        for (const row of rows) {
            for (let i = 1; i <= 8; i++) {
                const key = `itm${i}ID`
                if (row[key] > 0) {
                    row[key] = await getItemName(row[key])
                } else {
                    row[key] = null
                }
            }
            results.push(row)
        }

        return results
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        const ITM_itemlist = await getParser('bdat_common.ITM_itemlist', this.language)
        result.itm1ID = await ITM_itemlist.parseOne(row.itm1ID)
        result.itm2ID = await ITM_itemlist.parseOne(row.itm2ID)
        result.itm3ID = await ITM_itemlist.parseOne(row.itm3ID)
        result.itm4ID = await ITM_itemlist.parseOne(row.itm4ID)
        result.itm5ID = await ITM_itemlist.parseOne(row.itm5ID)
        result.itm6ID = await ITM_itemlist.parseOne(row.itm6ID)
        result.itm7ID = await ITM_itemlist.parseOne(row.itm7ID)
        result.itm8ID = await ITM_itemlist.parseOne(row.itm8ID)

        return result

    }
}
