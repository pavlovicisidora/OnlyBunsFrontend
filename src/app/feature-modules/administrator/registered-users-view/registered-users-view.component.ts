import { Component, OnInit  } from '@angular/core';
import { RegisteredUser } from '../models/registered-user';
import { AdministratorService } from '../administrator.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-registered-users-view',
  templateUrl: './registered-users-view.component.html',
  styleUrls: ['./registered-users-view.component.css']
})
export class RegisteredUsersViewComponent implements OnInit{
  users: RegisteredUser[] = [];
  searchForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    minPostCount: new FormControl(''),
    maxPostCount: new FormControl(''),
    sortBy: new FormControl(''),
    sortDirection: new FormControl(''),
  });

  constructor(private service: AdministratorService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  searchUsers() {
    this.service.searchUsers(this.searchForm.value).subscribe({
      next: (users: RegisteredUser[]) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error occurred while searching users:', err);
        alert('An error occurred while searching for users. Please try again later.');
      }
    });
  }

  loadUsers() {
    this.service.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  resetSearch() {
    this.searchForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      minPostCount: '',
      maxPostCount: '',
      sortBy: '', 
      sortDirection: '', 
    });
  
    this.loadUsers();
  }

}
