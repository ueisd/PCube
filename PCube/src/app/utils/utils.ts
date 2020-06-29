import { MatSnackBar } from '@angular/material/snack-bar';

export class Utils {
    constructor() {}

    static openSnackBar(message, panelClass) {
        let snackBar : MatSnackBar;
        snackBar.open(message, 'Fermer', {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: [panelClass]
        });
      }
}