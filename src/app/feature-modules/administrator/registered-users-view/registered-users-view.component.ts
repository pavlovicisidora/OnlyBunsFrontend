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
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
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
    this.service.searchUsers(this.searchForm.value, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.users = response.content; 
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Error occurred while searching users:', err);
        alert('An error occurred while searching for users. Please try again later.');
      }
    });
  }

  loadUsers() {
    this.service.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.users = response.content;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert('An error occurred while fetching users. Please try again later.');
      }
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

  changePage(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

}
