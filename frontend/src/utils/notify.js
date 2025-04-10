export const notify = (title, body) => {
    if("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {body});
    }
};

export const askNotificationPermission = () => {
    if("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}