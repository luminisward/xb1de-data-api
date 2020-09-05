import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    obj_id: number,
    sflg1: number,
    eflg1: number,
    mine_type: number,
    reset_time: number,
    cnt_min: number,
    cnt_max: number,
    point_id: number,
    posX: number,
    posY: number,
    posZ: number,
    get_id: number,
    skill1: number,
    skill1_per: number,
    skill2: number,
    skill2_per: number,
    skill3: number,
    skill3_per: number,
    skill4: number,
    skill4_per: number
    [key: string]: any
}

export interface TableWithText extends TableType {
    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        const rows = await this.db.getDataTable<TableType>({table: this.table})

        const BTL_skilllist = await getParser('bdat_common.BTL_skilllist', this.language)
        const ITM_itemlist = await getParser('bdat_common.ITM_itemlist', this.language)
        const cache: {[key: string]: any} = {}
        const getSkill = async (id: number) => {
            if (cache[id]){
                return cache[id]
            }
            cache[id] = await BTL_skilllist.parseOne(id)
            return cache[id]
        }

        const results = []
        for (const row of rows) {
            for (let i = 1; i <= 4; i++) {
                if (row[`skill${i}`] > 0) {
                    row[`skill${i}`] = await getSkill(row[`skill${i}`])
                } else {
                    row[`skill${i}`] = null
                }
            }

            row.posX = row.posX / 10000
            row.posY = row.posY / 10000
            row.posZ = row.posZ / 10000

            row.get_id = await ITM_itemlist.parseOne(row.get_id)

            results.push(row)
        }

        return rows
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        const ITM_itemlist = await getParser('bdat_common.ITM_itemlist', this.language)
        result.get_id = await ITM_itemlist.parseOne(row.get_id)

        return result

    }
}
