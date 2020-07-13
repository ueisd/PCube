import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";

export class CustomDiaglogConfig {

    config:MatDialogConfig;

    constructor() {
        this.config = new MatDialogConfig();
    }

    public getDefaultConfig(): MatDialogConfig{
        this.config.minWidth = 600;
        this.config.panelClass = "custom-default-config";
        return this.config;
    }

}