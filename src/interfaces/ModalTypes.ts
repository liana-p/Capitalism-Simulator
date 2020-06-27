/** A modal as it gets stored in the state */
export interface IModal extends IModalPayload {
    // The uuid is used to be able to refer to which modal we want to close
    uuid: string;
    // Not used yet, but would be used to change z-index based on what modal was added last
    addedAt: number;
}

/** Parameters the code must pass when adding a new modal */
export interface IModalPayload {
    // Name of the vue component to display in the modal
    name: string;
    // Title of the modal screen (hardcoded at the moment)
    title: string;
    // Arbitrary options to pass to the component. They will be passed as props
    options: { [key: string]: any };
}
