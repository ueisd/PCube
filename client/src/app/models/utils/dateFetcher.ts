import * as moment from 'moment-timezone';

export class DateFetcher{
    static fetchUnixNbr(yyyymmdd :string, hhMM : string, timezone: string) : number {
        let date = moment.tz(yyyymmdd + " " + hhMM, timezone);
        return date.unix();
    }
    
    static fetchDayString(timestamp: moment.Moment) : string {
        let t = timestamp;
        let m = t.month()+1;
        let month = (m < 10) ? "0" + m : m;
        let day = (t.date() < 10) ? "0" + t.date() : t.date();
        return t.year() + "-" + month + "-" + day;
      }
    
    static fetchHHMMStr(timestamp: moment.Moment) : string {
        let t = timestamp;
        let hour = (t.hour() < 10) ? "0" + t.hour() : t.hour();
        let min = (t.minute() < 10) ? '0' + t.minute() : t.minute();
        return hour + ":" + min;
    }
    
    static fetchMomentFromTimestampStr(timestampStr : string, timezone) : moment.Moment {
        let time = parseInt(timestampStr);
        let timestampMom = moment.unix(time);
        return  timestampMom.tz(timezone);
    }
}