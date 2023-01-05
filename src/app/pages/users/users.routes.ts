import { Routes } from "@angular/router";
import {UserListComponent} from "./user-list/user-list.component";
import {UserAddComponent} from "./user-add/user-add.component";
import {UserEditComponent} from "./user-edit/user-edit.component";

export const userRoutes: Routes = [
  {
    path: '',
    title: 'User List',
    component: UserListComponent
  },
  {
    path: 'add',
    title: 'Add New User',
    component: UserAddComponent
  },
  {
    path: 'edit',
    title: 'Edit User',
    component: UserEditComponent
  }
]
