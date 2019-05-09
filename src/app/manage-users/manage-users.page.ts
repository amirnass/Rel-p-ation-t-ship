import { Component, OnInit } from '@angular/core';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { User } from '../auth/user.model';
import { UsersPageModule } from '../users/users.module';
import { IonItemSliding } from '@ionic/angular';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss']
})
export class ManageUsersPage implements OnInit {
  usersList: Users[];
  editState: Boolean = false;
  userToEdit: Users;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe(users => {
      this.usersList = users;
    });
    // this.addPatientService.getUsers().subscribe(data => {
    //   this.addedUsers = data.map(e => {
    //     return {
    //       id: e.payload.doc.id,
    //       ...e.payload.doc.data()
    //     } as Users;
    //   });
    // });
  }

  create(user: Users) {
    this.usersService.add(user);
  }

  update(user: Users) {
    this.usersService.updateAddedUser(user);
    this.clearState();
  }

  delete(user: Users) {
    this.clearState();
    this.usersService.deleteUser(user);
  }

  editUser(event, user: Users, itemSliding: IonItemSliding) {
    itemSliding.close();
    this.editState = true;
    this.userToEdit = user;
  }

  clearState() {
    this.editState = false;
    this.userToEdit = null;
  }
}
