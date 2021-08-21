import { FormGroup, ValidatorFn } from "@angular/forms";
import { formatDate } from "@angular/common";

const format = 'yyyy-MM-dd';
const locale = 'en-US';

export class DateManip {
    static chaineToDate(str : string) {
        var year = + str.substring(0, 4);
        var mount = + str.substring(5, 7);
        mount = mount - 1;
        var day = + str.substring(8, 10);
        return new Date(year, mount, day);
    }

    static ensureIsInterval: ValidatorFn = (fg: FormGroup) => {
        const start = fg.get('dateDebut').value;
        const end = fg.get('dateFin').value;
        
        if(!DateManip.isDatesAreIntevals(start, end))
            return { dateFinAvantDebut: true };
        return null;
    };

    static formatDate(dateDeb) {
        return formatDate(dateDeb, format, locale);
    }

    static isDatesAreIntevals(start, end) {
        let formattedDebut = formatDate(start, format, locale);
        let formattedEnd = formatDate(end, format, locale);
        return formattedEnd >= formattedDebut
    }
    
}