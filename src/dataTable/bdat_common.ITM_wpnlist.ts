import _ from 'lodash'
import {BaseParser, BaseFields} from './index'
import {getParser} from './index'
import {TableWithText as PcArtsType} from './bdat_common.pc_arts'


export interface TableType extends BaseFields {
    'name': number
    'resource': string,
    'def_mount': number
    'bat_mount': number
    'flag': number
    'uni_flag': number
    'money': number
    'dmg_low': number
    'dmg_hi': number
    'elem': number
    'att_lev': number
    'speed': number
    'grd_rate': number
    'arm_phy': number
    'arm_eth': number
    'jwl_slot': number
    'jwl_skill1': number
    'jwl_skill2': number
    'jwl_skill3': number
    'hit_range_near': number
    'hit_range_far': number
    'style': number
    'equip_pc1': number
    'equip_pc2': number
    'equip_pc3': number
    'equip_pc4': number
    'equip_pc5': number
    'equip_pc6': number
    'equip_pc7': number
    'equip_pc8': number
    'equip_pc9': number
    'equip_pc10': number
    'equip_pc14': number
    'equip_pc15': number
    'equip_pc16': number
    'wpn_type': number
    'atk1': number
    'atk2': number
    'atk3': number
    'arts11': number
    'arts12': number
    'arts13': number
    'arts14': number
    'arts15': number
    'arts16': number
    'arts17': number
    'arts18': number
    'arts21': number
    'arts22': number
    'arts23': number
    'arts24': number
    'arts25': number
    'arts26': number
    'arts27': number
    'arts28': number
    'arts31': number
    'arts32': number
    'arts33': number
    'arts34': number
    'arts35': number
    'arts36': number
    'arts37': number
    'arts38': number

    [key: string]: any
}


export interface TableWithText extends TableType {
    name: any
    style: any

    [key: string]: any

}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<any> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.name = await this.db.getMsSingle({table: this.msTable, row_id: row.name, language: this.language})

        // {
        //     // arts11 ~ arts38
        //     const pc_arts = await getParser('bdat_common.pc_arts', this.language)
        //     for (let i = 1; i <= 3; i++) {
        //         for (let j = 1; j <= 8; j++) {
        //             const key = `arts${i}${j}`
        //             if (row[key] > 0) {
        //                 const arts: PcArtsType = await pc_arts.parseOne(row[key])
        //                 result[key] = arts
        //             } else {
        //                 result[key] = null
        //             }
        //         }
        //     }
        // }

        {
            let charaId = 0
            for (let i = 1; i <= 16; i++) {
                if (row[`equip_pc${i}`] === 1){
                    charaId = i
                    break
                }
            }

            if (charaId > 0 && row.style > 0) {
                const MNU_StyleArmorPc = await getParser(`bdat_common.MNU_StyleWeaponPc${charaId.toString().padStart(2, '0')}`, this.language)
                result.style = await MNU_StyleArmorPc.parseOne(row.style)
            } else {
                result.style = null
            }

            if (charaId > 0) {
                const BTL_pclist = await getParser('bdat_common.BTL_pclist', this.language)
                result.pcid = await BTL_pclist.parseOne(charaId)
            } else {
                result.pcid = null
            }
        }

        if (row.uni_flag > 0) {
            const itmParser = await getParser('bdat_common.ITM_itemlist', this.language)
            result.jwl_skill1 = row.jwl_skill1 > 0 ? await itmParser.parseOne(row.jwl_skill1) : null
            result.jwl_skill2 = row.jwl_skill2 > 0 ? await itmParser.parseOne(row.jwl_skill2) : null
            result.jwl_skill3 = row.jwl_skill3 > 0 ? await itmParser.parseOne(row.jwl_skill3) : null
        }

        this.overrideDataX(result)

        return result

    }
}
