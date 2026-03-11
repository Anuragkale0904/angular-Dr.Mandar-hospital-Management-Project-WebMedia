import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, productlist } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';



@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})


export class AddUserComponent {


  public selectedValue!: string | number;
  public productlist: Array<productlist> = [];

  branch: any[] = [];
  public branchList: any[] = [];
  bsConfig: Partial<BsDatepickerConfig> | undefined;
  editMode = false;
  branch_name: string = '';
  address: string = '';
  contact_person_name: string = '';
  mobile_no: string = '';
  username: string = '';
  password: string = '';
  selectedBranch: any = null;

  selectedBranchId: number | null = null;
  dataSource!: MatTableDataSource<productlist>;

  searchText: string = '';

  filteredBranches: any[] = [];
  paginatedBranches: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 5;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit(): void {
    // this.getTableData();
    this.getBranch();

  }


  getBranch() {
    this.url.getBranch().subscribe((res: any[]) => {

      this.branch = res;

      this.filteredBranches = [...this.branch];
      this.pageIndex = 0;

      this.updatePaginatedData();
    });
  }



  addBranch() {
    // Basic validation
    if (
      !this.branch_name.trim() ||
      !this.address.trim() ||
      !this.contact_person_name.trim() ||
      !this.mobile_no.trim()
      // !this.username.trim() ||
      // !this.password.trim()
    ) {
      this.toast.typeError('All fields are required', 'Error');
      return;
    }

    const payload = {
      branch_name: this.branch_name,
      address: this.address,
      contact_person_name: this.contact_person_name,
      mobile_no: this.mobile_no,
      // username: this.username,
      // password: this.password
    };

    this.url.addBranch(payload).subscribe({
      next: (res: any) => {
        this.toast.typeSuccess('Branch Added Successfully!', 'Success');

        // Clear form
        this.branch_name = '';
        this.address = '';
        this.contact_person_name = '';
        this.mobile_no = '';
        // this.username = '';
        // this.password = '';

        // Reload table
        this.getBranch();
      },
      error: () => {
        this.toast.typeError('Something went wrong', 'Error');
      }
    });
  }

  openDeleteModal(branch?: any) {

    this.selectedBranch = { ...branch };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('delete_modal'));
    modal.show();
  }

  confirmDelete() {

    if (!this.selectedBranch?.id) return;

    this.url.deleteBranch(this.selectedBranch.id).subscribe({
      next: () => {
        this.toast.typeSuccess('Branch deleted successfully!', 'Deleted');
        this.getBranch();
        (window as any).bootstrap.Modal
          .getInstance(document.getElementById('delete_modal'))
          ?.hide();
      },
      error: (err) => {
        console.error(err);
        this.toast.typeError('Delete failed!', 'Error');
      }
    });
  }

  capitalize() {
    if (this.branch_name && this.branch_name.length > 0) {
      this.branch_name =
        this.branch_name.charAt(0).toUpperCase() +
        this.branch_name.slice(1);
    }
  }


  numbersOnly(event: KeyboardEvent): boolean {
    const charCode = event.key;

    // Allow only digits (0-9)
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  // validatePassword() {
  //   // Remove non-digits
  //   this.password = this.password.replace(/[^0-9]/g, '');

  //   // Limit to 4 digits
  //   if (this.password.length > 4) {
  //     this.password = this.password.substring(0, 4);
  //   }
  // }

  sanitizeName(event: any) {
    let value = event.target.value;

    // Remove invalid characters
    value = value.replace(/[^A-Za-z .-]/g, '');

    // Prevent multiple spaces/dots/hyphens together
    value = value.replace(/[ .-]{2,}/g, ' ');

    this.contact_person_name = value;
  }

  sanitizeUsername(event: any) {
    let value = event.target.value;

    // Convert to lowercase
    value = value.toLowerCase();

    // Remove invalid characters
    value = value.replace(/[^a-z0-9._]/g, '');

    // Prevent multiple dots or underscores together
    value = value.replace(/[._]{2,}/g, '.');

    this.username = value;
  }

  allowDigitsOnly(event: KeyboardEvent) {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  sanitizePassword(event: any) {
    let value = event.target.value;

    // Remove non-digits
    value = value.replace(/[^0-9]/g, '');

    // Restrict to 4 digits
    this.password = value.substring(0, 4);
  }

  openEditModal(branch: any) {

    if (!branch?.id) return;

    this.url.getBranchById(branch.id).subscribe({
      next: (res: any) => {

        // Fill form fields with old data
        this.selectedBranchId = res.id;
        this.branch_name = res.branch_name;
        this.address = res.address;
        this.contact_person_name = res.contact_person_name;
        this.mobile_no = res.mobile_no;
        this.username = res.username;
        this.password = res.plain_password;

        this.editMode = true;

        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('edit_modal')
        );
        modal.show();
      },
      error: () => {
        this.toast.typeError('Failed to fetch branch details', 'Error');
      }
    });
  }

  updateBranch() {

    if (!this.selectedBranchId) return;

    const payload = {
      branch_name: this.branch_name,
      address: this.address,
      contact_person_name: this.contact_person_name,
      mobile_no: this.mobile_no,
      username: this.username,
      password: this.password
    };

    this.url.updateBranch(this.selectedBranchId, payload).subscribe({
      next: () => {

        this.toast.typeSuccess('Branch Updated Successfully!', 'Success');

        this.getBranch();
        this.resetForm();

        (window as any).bootstrap.Modal
          .getInstance(document.getElementById('edit_modal'))
          ?.hide();

      },
      error: () => {
        this.toast.typeError('Update failed!', 'Error');
      }
    });
  }

  resetForm() {
    this.branch_name = '';
    this.address = '';
    this.contact_person_name = '';
    this.mobile_no = '';
    this.username = '';
    this.password = '';
    this.selectedBranchId = null;
    this.editMode = false;
  }

  //SEARCHING METHOD
  applySearch() {

    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredBranches = [...this.branch];
    } else {
      this.filteredBranches = this.branch.filter(b =>
        b.branch_name?.toLowerCase().includes(search) ||
        b.address?.toLowerCase().includes(search) ||
        b.contact_person_name?.toLowerCase().includes(search) ||
        b.mobile_no?.toString().includes(search) ||
        b.username?.toLowerCase().includes(search)
      );
    }

    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  //PAGINATION METHODS

  updatePaginatedData(): void {

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedBranches = this.filteredBranches.slice(start, end);
  }

  onPageChange(event: any): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePaginatedData();
  }

  
}
