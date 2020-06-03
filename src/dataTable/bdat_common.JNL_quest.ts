import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    row_id: number
    title: number
    qst_genre: number
    non_auto: number
    reward_mes: number
    npc_id: number
    no_map: number
    force: number
    mes_accept: number
    mes_refuse: number
    flg_s: number
    cnd_questID: number
    flg_famous: number
    cnd_famous: number
    npcmeetID1: number
    npcmeetID2: number
    flg_relate: number
    cnd_relate: number
    up_questID: number
    up_questID2: number
    no_report: number
    reward_A1: number
    reward_A2: number
    reward_A3: number
    reward_B1: number
    reward_B2: number
    reward_B3: number
    reward_exp: number
    reward_money: number
    order_succ_A: number
    type_succ_A1: number
    cnd_succ_A1: number
    num_succ_A1: number
    hnd_succ_A1: number
    type_succ_A2: number
    cnd_succ_A2: number
    num_succ_A2: number
    hnd_succ_A2: number
    type_succ_A3: number
    cnd_succ_A3: number
    num_succ_A3: number
    hnd_succ_A3: number
    type_succ_A4: number
    cnd_succ_A4: number
    num_succ_A4: number
    hnd_succ_A4: number
    order_succ_B: number
    type_succ_B1: number
    cnd_succ_B1: number
    num_succ_B1: number
    hnd_succ_B1: number
    type_succ_B2: number
    cnd_succ_B2: number
    num_succ_B2: number
    hnd_succ_B2: number
    type_succ_B3: number
    cnd_succ_B3: number
    num_succ_B3: number
    hnd_succ_B3: number
    type_succ_B4: number
    cnd_succ_B4: number
    num_succ_B4: number
    hnd_succ_B4: number
    up_famous_A: number
    flg_relate_A1: number
    up_relate_A1: number
    flg_relate_A2: number
    up_relate_A2: number
    flg_relate_A3: number
    up_relate_A3: number
    flg_relate_A4: number
    up_relate_A4: number
    up_famous_B: number
    flg_relate_B1: number
    up_relate_B1: number
    flg_relate_B2: number
    up_relate_B2: number
    flg_relate_B3: number
    up_relate_B3: number
    flg_relate_B4: number
    up_relate_B4: number
}

export interface TableWithText extends TableType {
    title: any

}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<any> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const newRow: TableWithText = _.clone(row)

        newRow.title = await this.db.getMsSingle({table: this.msTable, row_id: row.title, language: this.language})
        console.log(newRow)

        return newRow

    }
}
