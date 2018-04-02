export class Message {
    value: string;
    type: MessageType;
}

enum MessageType {
    'info',
    'error',
    'warning'
}
