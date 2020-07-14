export class DateManip {
    static chaineToDate(str : string) {
        var year = + str.substring(0, 4);
        var mount = + str.substring(5, 7);
        mount = mount - 1;
        var day = + str.substring(8, 10);
        return new Date(year, mount, day);
    }
}