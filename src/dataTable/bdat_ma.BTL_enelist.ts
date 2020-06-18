import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    drop_nml_per: number,
    drop_rar_per: number,
    drop_spr_per: number,
    drop_nml: number,
    drop_rar: number,
    drop_spr: number,
    drop_vlb: number,
    limit: number,
    move_speed: number,
    run_speed: number,
    flag: number,
    named: number,
    frame: number,
    size: number,
    scale: number,
    family: number,
    lv: number,
    hp: number,
    str: number,
    agi: number,
    eth: number,
    elem_phx: number,
    elem_eth: number,
    Lv_up_hp: number,
    Lv_up_str: number,
    Lv_up_agi: number,
    Lv_up_eth: number,
    exp: number,
    anti_state: number,
    resi_state: number,
    elem_tol: number,
    elem_tol_dir: number,
    down_grd: number,
    faint_grd: number,
    front_angle: number,
    avoid: number,
    delay: number,
    hit_range_near: number,
    hit_range_far: number,
    dbl_atk: number,
    cnt_atk: number,
    detects: number,
    assist: number,
    search_range: number,
    search_angle: number,
    chest_height: number,
    spike_elem: number,
    spike_type: number,
    spike_range: number,
    spike_dmg: number,
    spike_state: number,
    spike_state_val: number,
    atk1: number,
    atk2: number,
    atk3: number,
    arts1: number,
    arts2: number,
    arts3: number,
    arts4: number,
    arts5: number,
    arts6: number,
    arts7: number,
    arts8: number
    [key: string]: number
}

export interface TableWithText extends TableType {
    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        return []
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const table = getEnemyTable(row_id)
        this.setTable(table)

        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        const number = /\d+/.exec(this.table)
        const mapid = number && number[0]
        const drop_nmllist = await getParser(`bdat_ma${mapid}.drop_nmllist${mapid}`, this.language)
        result.drop_nml = row.drop_nml > 0 ? await drop_nmllist.parseOne(row.drop_nml) : null
        const drop_rarlist = await getParser(`bdat_ma${mapid}.drop_rarlist${mapid}`, this.language)
        result.drop_rar = row.drop_rar > 0 ? await drop_rarlist.parseOne(row.drop_rar) : null
        const drop_sprlist = await getParser(`bdat_ma${mapid}.drop_sprlist${mapid}`, this.language)
        result.drop_spr = row.drop_spr > 0 ? await drop_sprlist.parseOne(row.drop_spr) : null

        const ene_arts = await getParser('bdat_common.ene_arts', this.language)
        for (let i = 1; i <= 8; i++) {
            const arts = `arts${i}`
            result[arts] = row[arts] > 0 ? await ene_arts.parseOne(row[arts]) : null
        }

        return result

    }
}

function getEnemyTable(id: number): string {
    const suffix = getTableSuffix(id)
    return `bdat_ma${suffix}.BTL_enelist${suffix}`
}

function getTableSuffix(id: number): string {
    if (id > 3500) return '6001'
    if (id > 3450) return '5901'
    if (id > 3400) return '5801'
    if (id > 3350) return '5701'
    if (id > 3300) return '5601'
    if (id > 3250) return '5501'
    if (id > 3200) return '5401'
    if (id > 3150) return '5301'
    if (id > 3100) return '5201'
    if (id > 3050) return '5101'
    if (id > 2900) return '2601'
    if (id > 2700) return '2501'
    if (id > 2600) return '2401'
    if (id > 2500) return '2301'
    if (id > 2400) return '2201'
    if (id > 2300) return '2101'
    if (id > 2200) return '2001'
    if (id > 2100) return '1901'
    if (id > 1900) return '1701'
    if (id > 1700) return '1601'
    if (id > 1600) return '1501'
    if (id > 1500) return '1401'
    if (id > 1400) return '1301'
    if (id > 1300) return '1202'
    if (id > 1200) return '1201'
    if (id > 1100) return '1101'
    if (id > 1000) return '1001'
    if (id > 900) return '0901'
    if (id > 700) return '0701'
    if (id > 600) return '0601'
    if (id > 500) return '0501'
    if (id > 400) return '0402'
    if (id > 300) return '0401'
    if (id > 200) return '0301'
    if (id > 100) return '0201'
    return '0101'
}
