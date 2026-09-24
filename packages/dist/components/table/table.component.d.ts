import { LitElement } from 'lit';
import '../icon/icon.js';
export interface AsmTableHeader {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    headline?: string;
}
export interface AsmTableRowData {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    leadingIcon?: string;
}
/**
 * @tag asm-table
 *
 * @csspart table - The table element.
 * @csspart header - The header row.
 * @csspart row - A body row.
 */
export default class AsmTable extends LitElement {
    static styles: import("lit").CSSResult;
    /** Table header configuration (JSON string or object). */
    header: AsmTableHeader | null;
    /** Table rows (JSON string or array). */
    rows: AsmTableRowData[];
    /** When true, cell values are rendered as HTML (supports web components in cells). */
    htmlCells: boolean;
    private _renderCell;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=table.component.d.ts.map