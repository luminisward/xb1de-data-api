import _ from 'lodash'
import {BaseParser, BaseFields, getParser} from './index'

export interface TableType extends BaseFields {
    wpn1: number,
    wpn2: number,
    wpn3: number,
    wpn4: number,
    wpn5: number,
    wpn6: number,
    wpn7: number,
    wpn8: number,
    wpn9: number,
    wpn10: number,
    wpn11: number,
    wpn12: number,
    head1: number,
    head2: number,
    head3: number,
    head4: number,
    head5: number,
    head6: number,
    head7: number,
    head8: number,
    head9: number,
    head10: number,
    head11: number,
    head12: number,
    body1: number,
    body2: number,
    body3: number,
    body4: number,
    body5: number,
    body6: number,
    body7: number,
    body8: number,
    body9: number,
    body10: number,
    body11: number,
    body12: number,
    arm1: number,
    arm2: number,
    arm3: number,
    arm4: number,
    arm5: number,
    arm6: number,
    arm7: number,
    arm8: number,
    arm9: number,
    arm10: number,
    arm11: number,
    arm12: number,
    waist1: number,
    waist2: number,
    waist3: number,
    waist4: number,
    waist5: number,
    waist6: number,
    waist7: number,
    waist8: number,
    waist9: number,
    waist10: number,
    waist11: number,
    waist12: number,
    legg1: number,
    legg2: number,
    legg3: number,
    legg4: number,
    legg5: number,
    legg6: number,
    legg7: number,
    legg8: number,
    legg9: number,
    legg10: number,
    legg11: number,
    legg12: number,
    arts1: number,
    arts2: number,
    arts3: number,
    arts4: number,
    arts5: number,
    arts6: number,
    arts7: number,
    arts8: number,
    arts9: number,
    arts10: number,
    arts11: number,
    arts12: number,
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

        const itemParser = await getParser('bdat_common.ITM_itemlist', this.language)
        for (const key of this.fieldsWithoutRowID(result)) {
            result[key] = row[key] > 0 ? await itemParser.parseOne(row[key]) : null
        }

        return result

    }
}
