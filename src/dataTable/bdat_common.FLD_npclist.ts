import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    'name': number
    'mob_name': number
    'resource': number
    'rlt_meet': number
    'remove': number
    'shop_list': number
    'icon_type': number
    'rlt_face': string,
    'rlt_posX': number
    'rlt_posY': number
    'rlt_texture': number
    'rlt_lnd': number
    'rlt_sex': number
    'rlt_age': number
    'range_s': number
    'range_e': number
    'rlt_job': number
    'size': number
    'scale': number
    'family': number
    'move_speed': number
    'autotalk1': number
    'autotalk2': number
    'autotalk3': number
    'autotalk4': number
    'autotalk5': number
    'autotalk6': number
    'exc_talk_id': number
    'exc_id1': number
    'exc_id2': number
    'exc_id3': number
    'exc_id4': number
    'exc_id5': number
    'present': number
    'exc_map_id': number
    'npc_unique_id': number
    [key: string]: any
}


export interface TableWithText extends TableType {
    name: any
    mob_name: any
    rlt_job: any
    exc_talk_id: any
}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse(): Promise<any[]> {
        return []
    }

    async parseOne(row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})
        result.rlt_job = await this.db.getMsSingle({table: this.msTable, row_id: row.rlt_job, language: this.language})

        result.mob_name = await this.db.getMsSingle({table: 'bdat_common_ms.MNU_name_ms', row_id: row.mob_name, language: this.language})

        const lndParser = await getParser('bdat_common.landmarklist', this.language)
        result.rlt_lnd = row.rlt_lnd > 0 ? await lndParser.parseOne(row.rlt_lnd) : null

        const itemParser = await getParser('bdat_common.ITM_itemlist', this.language)
        result.present = row.present > 0 ? await itemParser.parseOne(row.present) : null


        const mapIdParser = await getParser('bdat_common.FLD_maplist', this.language)
        const {id_name: exchangeMapId} = await mapIdParser.parseOne(row.exc_map_id)

        const MapId: any = /\d{4}/.exec(exchangeMapId)
        const mapTable = `bdat_${exchangeMapId}.exchangelist${MapId[0]}`
        const exchangeParser = await getParser(mapTable, this.language)

        for (let i = 1; i <= 5; i++) {
            const k = `exc_id${i}`
            result[k] = row[k] > 0 ? await exchangeParser.parseOne(row[k]) : null
        }

        const extalkParser = await getParser(`bdat_${exchangeMapId}.extalklist${MapId[0]}`, this.language)
        result.exc_talk_id = row.exc_talk_id > 0 ? await extalkParser.parseOne(row.exc_talk_id) : null

        return result

    }
}
