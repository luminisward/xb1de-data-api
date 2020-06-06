import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
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

    [key: string]: any
}

export interface TableWithText extends TableType {
    title: any
    qst_genre: any
    npc_id: any
    cnd_questID: any

    [key: string]: any
}

enum TaskType {
    KillEnemy = 1,
    GetItem,
    TalkNpc,
    CompleteQuest,
    InteractObject,
}

enum GenreType {
    普通任务,
    剧情任务,
    子任务,
    限时任务
}

export default class QuestParser extends BaseParser {

    async parse(): Promise<any[]> {
        return []
    }

    async parseOne(row_id: number): Promise<TableWithText> {
        const table = getQuestTableName(row_id)
        this.setTable(table)

        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.title = await this.db.getMsSingle({table: this.msTable, row_id: row.title, language: this.language})
        result.qst_genre = GenreType[row.qst_genre]


        // npc_id && npcmeetID
        {
            const npcParser = await getParser('bdat_common.FLD_npclist', this.language)
            result.npc_id = result.npc_id > 0 ? await npcParser.parseOne(row.npc_id) : null
            result.npcmeetID1 = result.npcmeetID1 > 0 ? await npcParser.parseOne(row.npcmeetID1) : null
            result.npcmeetID2 = result.npcmeetID2 > 0 ? await npcParser.parseOne(row.npcmeetID2) : null
        }

        // cnd_questID
        {
            if (result.cnd_questID > 0) {
                const questParser = await getParser(getQuestTableName(row.cnd_questID), this.language)
                result.cnd_questID = await questParser.parseOne(row.cnd_questID)
            } else {
                result.cnd_questID = null
            }
        }

        // reward
        {
            const itmParser = await getParser('bdat_common.ITM_itemlist', this.language)
            for (const ab of ['A', 'B']) {
                for (let i = 1; i <= 3; i++) {
                    const key = `reward_${ab}${i}`
                    result[key] = result[key] > 0 ? await itmParser.parseOne(row[key]) : null
                }
            }
        }

        // 任务步骤
        {
            for (const ab of ['A', 'B']) {
                for (let i = 1; i <= 4; i++) {
                    const type_succ = `type_succ_${ab}${i}`
                    const cnd_succ = `cnd_succ_${ab}${i}`
                    // const num_succ = `num_succ_${ab}${i}`


                    result[type_succ] = row[type_succ] > 0 ? TaskType[row[type_succ]] : null

                    if (row[cnd_succ] > 0) {
                        switch (row[type_succ]) {

                            case TaskType.KillEnemy:
                                const eneParser = await getParser('bdat_common.BTL_enelist', this.language)
                                result[cnd_succ] = await eneParser.parseOne(row[cnd_succ])
                                break

                            case TaskType.GetItem:
                                const itmParser = await getParser('bdat_common.ITM_itemlist', this.language)
                                result[cnd_succ] = await itmParser.parseOne(row[cnd_succ])
                                break

                            case TaskType.TalkNpc:
                                const npcParser = await getParser('bdat_common.FLD_npclist', this.language)
                                result[cnd_succ] = await npcParser.parseOne(row[cnd_succ])
                                break

                            case TaskType.CompleteQuest:
                                const questParser = await getParser(getQuestTableName(row[cnd_succ]), this.language)
                                result[cnd_succ] = await questParser.parseOne(row[cnd_succ])
                        }

                    } else {
                        result[cnd_succ] = null
                    }
                }
            }
        }


        // menu_text
        {
            const number = /\d+/.exec(this.table)
            const mapid = number && number[0]
            const menuParser = await getParser(`bdat_qt${mapid}.MNU_qt${mapid}`, this.language)
            result.menu = await menuParser.parseOne(row_id)
        }

        this.overrideDataX(result)
        return result

    }

}


function getQuestTableName(row_id: number): string {
    switch (true) {
        case 1 <= row_id && row_id <= 85:
            return 'bdat_common.JNL_quest0101'

        case 86 <= row_id && row_id <= 105:
            return 'bdat_common.JNL_quest0201'

        case 116 <= row_id && row_id <= 171:
            return 'bdat_common.JNL_quest0301'

        case 174 <= row_id && row_id <= 260:
            return 'bdat_common.JNL_quest0401'

        case 261 <= row_id && row_id <= 270:
            return 'bdat_common.JNL_quest0402'

        case 276 <= row_id && row_id <= 310:
            return 'bdat_common.JNL_quest0501'

        case 311 <= row_id && row_id <= 350:
            return 'bdat_common.JNL_quest0601'

        case 351 <= row_id && row_id <= 464:
            return 'bdat_common.JNL_quest0701'

        case 465 <= row_id && row_id <= 465:
            return 'bdat_common.JNL_quest0801'

        case 466 <= row_id && row_id <= 475:
            return 'bdat_common.JNL_quest0901'

        case 496 <= row_id && row_id <= 530:
            return 'bdat_common.JNL_quest1001'

        case 536 <= row_id && row_id <= 603:
            return 'bdat_common.JNL_quest1101'

        case 611 <= row_id && row_id <= 620:
            return 'bdat_common.JNL_quest1201'

        case 626 <= row_id && row_id <= 640:
            return 'bdat_common.JNL_quest1202'

        case 641 <= row_id && row_id <= 680:
            return 'bdat_common.JNL_quest1301'

        case 681 <= row_id && row_id <= 720:
            return 'bdat_common.JNL_quest1401'

        case 721 <= row_id && row_id <= 750:
            return 'bdat_common.JNL_quest1501'

        case 751 <= row_id && row_id <= 810:
            return 'bdat_common.JNL_quest1601'

        case 811 <= row_id && row_id <= 849:
            return 'bdat_common.JNL_quest1701'

        case 850 <= row_id && row_id <= 850:
            return 'bdat_common.JNL_quest1801'

        case 851 <= row_id && row_id <= 890 :
            return 'bdat_common.JNL_quest1901'

        case 891 <= row_id && row_id <= 920:
            return 'bdat_common.JNL_quest2001'

        case 921 <= row_id && row_id <= 930:
            return 'bdat_common.JNL_quest2101'

        case 961 <= row_id && row_id <= 970:
            return 'bdat_common.JNL_quest2201'

        case 1001 <= row_id && row_id <= 1058:
            return 'bdat_common.JNL_quest2501'

        case 1201 <= row_id && row_id <= 1204:
            return 'bdat_common.JNL_quest2601'

        default:
            throw new Error('No match quest ID ' + row_id)
    }

}
