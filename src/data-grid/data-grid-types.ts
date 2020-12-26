import { proveType } from "../common/support";
import { HeaderIcon } from "./data-grid-sprites";

export interface GridSelection {
    readonly cell: readonly [number, number];
    readonly range?: Readonly<Rectangle>;
}

export type GridMouseEventArgs = GridMouseCellEventArgs | GridMouseHeaderEventArgs | GridMouseOutOfBoundsEventArgs;

interface BaseGridMouseEventArgs {
    shiftKey: boolean;
}

interface GridMouseCellEventArgs extends BaseGridMouseEventArgs {
    readonly kind: "cell";
    readonly location: readonly [number, number];
    readonly bounds: Rectangle;
    readonly isEdge: boolean;
}

interface GridMouseHeaderEventArgs extends BaseGridMouseEventArgs {
    readonly kind: "header";
    readonly location: readonly [number, undefined];
    readonly bounds: Rectangle;
    readonly isEdge: boolean;
}

interface GridMouseOutOfBoundsEventArgs extends BaseGridMouseEventArgs {
    readonly kind: "out-of-bounds";
    readonly location: readonly [number, number];
    readonly direction: readonly [-1 | 0 | 1, -1 | 0 | 1];
}

export interface GridKeyEventArgs {
    readonly bounds: Rectangle | undefined;
    readonly key: string;
    readonly keyCode: number;
    readonly shiftKey: boolean;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly cancel: () => void;
}

interface DragHandler {
    readonly setData: (mime: string, payload: string) => void;
}

export type GridDragEventArgs = GridMouseEventArgs & DragHandler;

export enum GridCellKind {
    Uri = "uri",
    Text = "text",
    Image = "image",
    RowID = "row-id",
    Number = "number",
    Bubble = "bubble",
    Boolean = "boolean",
    Loading = "loading",
    Markdown = "markdown",
    Protected = "protected",
}

export interface GridColumn {
    readonly width: number;
    readonly title: string;
    readonly icon?: HeaderIcon;
    readonly overlayIcon?: HeaderIcon;
    readonly hasMenu?: boolean;
    readonly style?: "normal" | "highlight";
}

export type EditableGridCell = TextCell | ImageCell | BooleanCell | MarkdownCell | UriCell | NumberCell;

export type EditableGridCellKind = EditableGridCell["kind"];

export function isEditableGridCell(cell: GridCell): cell is EditableGridCell {
    if (
        cell.kind === GridCellKind.Loading ||
        cell.kind === GridCellKind.Bubble ||
        cell.kind === GridCellKind.RowID ||
        cell.kind === GridCellKind.Protected
    ) {
        return false;
    }

    proveType<EditableGridCell>(cell);
    return true;
}

export type GridCell = EditableGridCell | BubbleCell | RowIDCell | LoadingCell | ProtectedCell;

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BaseGridCell {
    readonly allowOverlay: boolean;
    readonly style?: "normal" | "faded";
}

interface LoadingCell extends BaseGridCell {
    readonly kind: GridCellKind.Loading;
}

interface ProtectedCell extends BaseGridCell {
    readonly kind: GridCellKind.Protected;
}

interface TextCell extends BaseGridCell {
    readonly kind: GridCellKind.Text;
    readonly displayData: string;
    readonly editData: string;
}

interface NumberCell extends BaseGridCell {
    readonly kind: GridCellKind.Number;
    readonly displayData: string;
    readonly editData: number | undefined;
}

interface ImageCell extends BaseGridCell {
    readonly kind: GridCellKind.Image;
    readonly displayData: string[];
    readonly allowAdd: boolean;
}

interface BubbleCell extends BaseGridCell {
    readonly kind: GridCellKind.Bubble;
    readonly displayData: string[];
}

interface BooleanCell extends BaseGridCell {
    readonly kind: GridCellKind.Boolean;
    readonly checked: boolean;
    readonly showUnchecked: boolean;
    readonly allowEdit: boolean;
}

interface RowIDCell extends BaseGridCell {
    readonly kind: GridCellKind.RowID;
    readonly displayData: string;
}

interface MarkdownCell extends BaseGridCell {
    readonly kind: GridCellKind.Markdown;
    readonly displayData: string;
}

interface UriCell extends BaseGridCell {
    readonly kind: GridCellKind.Uri;
    readonly displayData: string;
}
