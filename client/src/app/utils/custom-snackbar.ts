import { MatSnackBar } from '@angular/material/snack-bar';

export class CustomSnackBar {

    constructor(private snackBar : MatSnackBar) {}

    public openSnackBar(message, panelClass) {
        this.snackBar.open(message, 'Fermer', {
          duration: 6000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: [panelClass]
        });
      }
}