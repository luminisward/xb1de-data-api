import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    ID_NAME: string,
    questID: number,
    quest_STFLG: number,
    S_FLG_MIN: number,
    S_FLG_MAX: number,
    NAMED_FLG: number,
    posX: number,
    posY: number,
    posZ: number,
    Radius: number,
    snap: number,
    ene1ID: number,
    ene1Lv: number,
    ene1Scale: number,
    ene1Per: number,
    ene1num: number,
    ene2ID: number,
    ene2Lv: number,
    ene2Scale: number,
    ene2Per: number,
    ene2num: number,
    ene3ID: number,
    ene3Lv: number,
    ene3Scale: number,
    ene3Per: number,
    ene3num: number,
    ene4ID: number,
    ene4Lv: number,
    ene4Scale: number,
    ene4Per: number,
    ene4num: number,
    ene5ID: number,
    ene5Lv: number,
    ene5Scale: number,
    ene5Per: number,
    ene5num: number,
    POP_TIME: number,
    ene_type: number,
    pop_type: number,
    move_type: number,
    rndwalkR: number,
    Dir: number,
    form: number,
    form_range: number,
    routeID: number,
    gimmickID: number,
    child_ID: number,
    posATR: number,
    [key: string]: any
}

export interface TableWithText extends TableType {
    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        const rows = await this.db.getDataTable<TableType>({table: this.table})

        const BTL_enelist = await getParser('bdat_common.BTL_enelist', this.language)
        const cache: {[key: string]: any} = {}
        const getEne = async (id: number) => {
            if (cache[id]){
                return cache[id]
            }
            const ene = await BTL_enelist.parseOne(id)
            cache[id] = ene.name
            return cache[id]
        }

        const results = []
        for (const row of rows) {

            for (let i = 1; i <= 5; i++) {
                if (row[`ene${i}ID`] > 0) {
                    row[`ene${i}ID`] = await getEne(row[`ene${i}ID`])
                } else {
                    row[`ene${i}ID`] = null
                }
            }
            results.push(row)
        }

        return results
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)


        const BTL_enelist = await getParser('bdat_common.BTL_enelist', this.language)

        for (let i = 1; i <= 5; i++) {
            if (row[`ene${i}ID`] > 0) {
                result[`ene${i}ID`] = await BTL_enelist.parseOne(row[`ene${i}ID`])
            } else {
                result[`ene${i}ID`] = null
            }
        }


        return result

    }
}
