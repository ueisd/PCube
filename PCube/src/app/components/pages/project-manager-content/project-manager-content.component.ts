import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserListComponent } from 'src/app/components/domain/user/user-list/user-list.component';
import { MatDialog } from "@angular/material/dialog";
import * as $ from 'jquery/dist/jquery.min.js';

const SHOW_MENU_CLASS = "showMenu";

function addShowMenuClass(id){
  console.log('addShowMenuClass');
  $("#"+id).addClass(SHOW_MENU_CLASS);
}

function removeShowMenuClass(id){
  console.log('removeShowMenuClass');
  $("#"+id).removeClass(SHOW_MENU_CLASS);
}

function hasShowClass(id){
  console.log('hasShowClass');
  return $("#"+id).hasClass(SHOW_MENU_CLASS);
}

function toggleSideMenu(){
  $(document).ready(function() {
    $("#activityToggle").click(function() {
      var id = $(this).attr("id") + "Menu";
      if(hasShowClass(id))
        removeShowMenuClass(id);
      else
        addShowMenuClass(id);
    });
  });
}

@Component({
  selector: 'app-project-manager-content',
  templateUrl: './project-manager-content.component.html',
  styleUrls: ['./project-manager-content.component.css']
})
export class ProjectManagerContentComponent implements OnInit {

  constructor(private http: HttpClient, 
    private dialog: MatDialog) { }

  ngOnInit() {
    toggleSideMenu();
  }

  // Ouvre un boîte dialogue pour afficher une liste d'utilisateurs
  openDialog() {
    this.dialog.open(UserListComponent,{height:'80%',width:'80%'});
  }
}
