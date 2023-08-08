export interface SlackMessageSectionField {
    type: string,
    text: string,
}

export interface SlackMessageSection {
    type: string,
    fields: SlackMessageSectionField[]
}