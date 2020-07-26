import _ from 'lodash'
import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    height: number,
    file: string,
    mapimg: number,
    floorname: number,
    sflag: number,
    qflag1: number,
    val1: number,
    mapimg1: number,
    mapimg2: number
}

export interface TableWithText extends TableType {
    floorname: any
}

export default class extends BaseParser {

    async parse (): Promise<any[]> {
        const rows = await this.db.getDataTable<TableType>({table: this.table})
        return await Promise.all(
            rows.map(async row => {
                const result: TableWithText = _.clone(row)
                result.floorname = await this.db.getMsSingle({table: this.msTable, row_id: row.floorname, language: this.language})

                // fix Valak Mountain
                if (result.file === 'ma1301_f01') {
                    result.file = 'ma1301_f02'
                } else if (result.file === 'ma1301_f02') {
                    result.file = 'ma1301_f01'
                }

                // fix Mechonis Field
                if (this.table === 'bdat_common.minimaplist1701') {
                    result.file = `ma1701_f0${row.row_id}`
                }

                // fix Agniratha
                if (this.table === 'bdat_common.minimaplist1901') {
                    result.file = `ma1901_f0${row.row_id}`
                }

                // fix Central Factory
                if (this.table === 'bdat_common.minimaplist2001') {
                    result.file = `ma2001_f0${row.row_id}`
                }

                // fix Bionis' Interior
                if (this.table === 'bdat_common.minimaplist2101') {
                    result.file = `ma2101_f0${row.row_id}`
                }

                return result
            })
        )
    }

    async parseOne (row_id: number): Promise<null> {
        return null
    }
}
