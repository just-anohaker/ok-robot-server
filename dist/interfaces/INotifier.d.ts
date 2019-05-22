interface INotifier {
    sendNotification(name: string, body?: any, type?: string): void;
}
export default INotifier;
