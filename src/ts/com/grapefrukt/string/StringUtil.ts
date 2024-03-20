export class StringUtil {
    public static padStart(string: string, len: number, padding: string): string {
        while(string.length < len) {
            string = padding + string
        }
        return string;
    }
    public static zeroPad(string: string, len: number): string {
        while(string.length < len) {
            string = '0' + string
        }
        return string;
    }
    public static secondsToTime(seconds: number, separator: string = ":"): string {
        let minutes: number = seconds / 60;
        seconds -= minutes * 60;
        return StringUtil.zeroPad(minutes.toString(), 2) + separator + StringUtil.zeroPad(seconds.toString(), 2);
    }
}