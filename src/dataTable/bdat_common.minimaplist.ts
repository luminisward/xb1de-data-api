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

export type TableWithText = TableType

export default class extends BaseParser {

    async parse (): Promise<any[]> {
        return await this.db.getDataTable<TableType>({table: this.table})
    }

    async parseOne (row_id: number): Promise<null> {
        return null
    }
}
