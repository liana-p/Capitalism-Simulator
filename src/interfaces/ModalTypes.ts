export interface IModal extends IModalPayload {
    uuid: string;
    addedAt: number;
}

export interface IModalPayload {
    name: string;
    title: string;
    options: { [key: string]: any };
}
