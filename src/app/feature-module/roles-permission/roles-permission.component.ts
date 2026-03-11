import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, productlist } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HostListener } from '@angular/core';



@Component({
  selector: 'app-roles-permission',
  templateUrl: './roles-permission.component.html',
  styleUrls: ['./roles-permission.component.scss'],
})
export class RolesPermissionComponent {

  username: string = '';
  password: string = '';
  selectedRights: string[] = [];
  userList: any[] = [];

  isEditMode: boolean = false;
  editUserId: number | null = null;
  deleteUserId: number | null = null;

  // 🔹 BRANCH DROPDOWN
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranchList: any[] = [];

  // NEW: Store multiple IDs and dynamic display name
  selectedBranchIds: number[] = [];
  selectedBranchNames: string = '';

  selectedBranchName: string = '';
  isEditMedicineDropdownOpen = false;

  branch: any[] = [];
  branch_id: number | null = null;
  branch_name: string = '';

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit() {

    this.getBranch();
    //this.loadUsers();
  }

  getBranch() {
    this.url.getAllBranch().subscribe((res: any[]) => {
      this.branch = res;
      // 2. Call loadUsers() here so we have branch names ready to display in the table
      this.loadUsers();
    });
  }
  @HostListener('document:click')
  closeDropdown() {
    this.isBranchDropdownOpen = false;

  }

  filterBranches() {
    const search = this.branchSearch?.toLowerCase().trim();

    if (!search) {
      // 🔥 If search empty → show all
      this.filteredBranchList = [...this.branch];
      return;
    }

    this.filteredBranchList = this.branch.filter((b: any) =>
      b.branch_name.toLowerCase().includes(search)
    );
  }


  openBranchDropdown() {
    this.isBranchDropdownOpen = true;
    this.branchSearch = '';
    this.filteredBranchList = [...this.branch];
  }


  selectBranch(branch: any) {
    this.branch_id = branch.id;
    this.selectedBranchName = branch.branch_name;
    this.isBranchDropdownOpen = false;
  }

  // NEW: Toggle branch selection
  toggleBranch(event: Event, branch: any) {
    event.stopPropagation(); // Keep dropdown open

    const index = this.selectedBranchIds.indexOf(branch.id);
    if (index > -1) {
      // If already selected, remove it
      this.selectedBranchIds.splice(index, 1);
    } else {
      // If not selected, add it
      this.selectedBranchIds.push(branch.id);
    }

    this.updateBranchDisplay();
  }

  // NEW: Update the text shown in the input box
  updateBranchDisplay() {
    if (this.selectedBranchIds.length === 0) {
      this.selectedBranchNames = '';
    } else if (this.selectedBranchIds.length === 1) {
      const selected = this.branch.find(b => b.id === this.selectedBranchIds[0]);
      this.selectedBranchNames = selected ? selected.branch_name : '';
    } else {
      this.selectedBranchNames = `${this.selectedBranchIds.length} Branches Selected`;
    }
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

  onRightChange(event: any) {
    const value = event.target.value;

    if (event.target.checked) {
      this.selectedRights.push(value);
    } else {
      this.selectedRights = this.selectedRights.filter(r => r !== value);
    }
  }

  loadUsers() {
    this.url.getUsers().subscribe({
      next: (res: any[]) => {

        this.userList = res.map(user => {
          // 1. Get a clean array of IDs using our helper
          const parsedIds = this.parseBranchIds(user.branch_id);

          // 2. Map those IDs to their actual names
          const names = parsedIds.map(id => {
            const foundBranch = this.branch.find(b => Number(b.id) === id);
            return foundBranch ? foundBranch.branch_name : null;
          }).filter(name => name !== null);

          return {
            id: user.id,
            username: user.user_name,
            plain_password: user.plane_password,
            rights: user.rides?.join(', '),
            // 3. Join the names with a comma (e.g., "AMT, PECSC")
            branch_name: names.length > 0 ? names.join(', ') : 'No Branch'
          };
        });

      },
      error: () => {
        this.toast.typeError('Failed to load users');
      }
    });
  }

  saveUser() {

    // Check array length instead of single id
    if (this.selectedBranchIds.length === 0) {
      this.toast.typeError('Please select at least one Hospital/Branch');
      return;
    }

    // ===========================
    // Form Validation
    // ===========================
    // if (!this.branch_id) {
    //   this.toast.typeError('Please select a Hospital/Branch');
    //   return;
    // }

    if (!this.username || !this.password) {
      this.toast.typeError('Please fill all required fields');
      return;
    }

    if (this.selectedRights.length === 0) {
      this.toast.typeError('Please select at least one right');
      return;
    }

    const payload = {
      branch_id: this.selectedBranchIds, // Now sending an array [14, 15] instead of single ID 14
      user_name: this.username,
      password: this.password,
      rides: this.selectedRights
    };

    // ===========================
    // EDIT MODE
    // ===========================
    if (this.isEditMode && this.editUserId) {

      this.url.updateUser(this.editUserId, payload).subscribe({

        next: (res: any) => {

          if (res.status === true) {

            this.toast.typeSuccess(res.message || 'User Updated Successfully');

            this.loadUsers();
            this.resetForm();
            this.closeModal();
          }
          else {
            this.toast.typeError(res.message);
          }
        },

        error: (err) => {

          if (err.error && err.error.message) {
            this.toast.typeError(err.error.message);
          }
          else {
            this.toast.typeError('Something went wrong');
          }
        }

      });

    }

    // ===========================
    // ADD MODE
    // ===========================
    else {

      this.url.addUser(payload).subscribe({

        next: (res: any) => {

          if (res.status === true) {

            this.toast.typeSuccess(res.message || 'User Added Successfully');

            this.loadUsers();
            this.resetForm();

            // Clear selections visually from the top form as well
            this.selectedBranchName = '';

            // If you happen to trigger this from the modal, this closes it safely
            this.closeModal();
          }
          else {
            // When backend returns 200 but status:false
            this.toast.typeError(res.message);
          }
        },

        error: (err) => {

          // When backend returns 422 or validation error
          if (err.error && err.error.message) {
            this.toast.typeError(err.error.message);
          }
          else {
            this.toast.typeError('Something went wrong');
          }
        }

      });

    }
  }

  resetForm() {
    this.selectedBranchIds = [];      // ✅ Clear array
    this.selectedBranchNames = '';    // ✅ Clear text
    this.username = '';
    this.password = '';
    this.selectedRights = [];
    this.isEditMode = false;
    this.editUserId = null;
  }

  openEditModal(id: number) {
    this.isEditMode = true;
    this.editUserId = id;

    this.url.getUserById(id).subscribe({
      next: (res: any) => {
        // ✅ Extract the nested data object based on your API response
        const userData = res.data ? res.data : res;

        this.username = userData.user_name;
        this.password = userData.plane_password;
        this.selectedRights = userData.rides || [];

        // 1. Use the helper to populate the selected branch IDs array
        this.selectedBranchIds = this.parseBranchIds(userData.branch_id);

        // 2. Update the visual input text in the modal
        this.updateBranchDisplay();

        // Open Bootstrap Modal
        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('userModal')
        );
        modal.show();
      },
      error: () => {
        this.toast.typeError('Failed to fetch user details');
      }
    });
  }
  
  // NEW HELPER: Safely extracts an array of IDs regardless of backend format
  parseBranchIds(branchData: any): number[] {
    if (!branchData) return [];

    // If it's already an array: [12, 13, 14]
    if (Array.isArray(branchData)) {
      return branchData.map(Number);
    }

    if (typeof branchData === 'string') {
      // If it's a JSON array string: "[12, 13, 14]"
      if (branchData.startsWith('[')) {
        try {
          return JSON.parse(branchData).map(Number);
        } catch (e) {
          return [];
        }
      }
      // If it's a comma-separated string: "12, 13, 14"
      if (branchData.includes(',')) {
        return branchData.split(',').map((id: string) => Number(id.trim()));
      }
    }

    // Fallback for a single ID number or string: "14" or 14
    return [Number(branchData)];
  }

  closeModal() {

    const modalElement = document.getElementById('userModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    this.username = '';
    this.password = '';
    this.selectedRights = [];
    this.isEditMode = false;
    this.editUserId = null;
  }

  openDeleteModal(id: number) {
    this.deleteUserId = id;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('delete_modal')
    );
    modal.show();
  }

  confirmDelete() {

    if (!this.deleteUserId) return;

    this.url.deleteUser(this.deleteUserId).subscribe({

      next: (res: any) => {

        if (res.status === true) {

          this.toast.typeSuccess(res.message || 'User deleted successfully');

          this.loadUsers();

          this.closeDeleteModal();
        }
        else {
          this.toast.typeError(res.message);
        }

      },

      error: () => {
        this.toast.typeError('Something went wrong');
      }

    });

  }

  closeDeleteModal() {

    const modalElement = document.getElementById('delete_modal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }

    this.deleteUserId = null;
  }
}
