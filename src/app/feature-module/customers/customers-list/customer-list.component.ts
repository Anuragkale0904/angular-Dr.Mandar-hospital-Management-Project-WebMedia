import { Component } from '@angular/core';
//import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
// import { apiResultFormat, pageSelection, productlist, editcreditnotes, customers } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
// import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {

  // 🔹 ISSUE FROM DROPDOWN
  isIssueFromDropdownOpen: boolean = false;
  issueFromSearch: string = '';
  filteredIssueFromBranches: any[] = [];
  selectedIssueFromName: string = '';

  // 🔹 ISSUE TO DROPDOWN
  isIssueToDropdownOpen: boolean = false;
  issueToSearch: string = '';
  filteredIssueToBranches: any[] = [];
  selectedIssueToName: string = '';

  // 🔹 MEDICINE TYPE DROPDOWN
  isTypeDropdownOpen: boolean = false;
  typeSearch: string = '';
  filteredMedicineTypes: any[] = [];
  selectedTypeName: string = '';

  // 🔹 MEDICINE DROPDOWN
  isMedicineDropdownOpen: boolean = false;
  medicineSearch: string = '';
  filteredMedicineSearchList: any[] = [];
  selectedMedicineName: string = '';

  deleteIssueId: number | null = null;
  branch: any[] = [];
  allBranches: any[] = [];
  medicineTypes: any[] = [];
  medicine_type_id: number | null = null;
  issueItems: any[] = [];
  issueFromBranchId: number | null = null;
  issueToBranchId: number | null = null;
  issueQty: number | null = null;
  availableQty: number = 0;

  selectedMedicineId: number | null = null;
  medicines: any[] = [];
  addmedicine: any[] = [];
  allMedicines: any[] = [];
  filteredMedicines: any[] = [];
  issueRows: any[] = [];
  issueDate: string = '';
  issueList: any[] = [];
  // 🔎 SEARCH + PAGINATION
  searchTerm: string = '';

  filteredIssueList: any[] = [];
  paginatedIssueList: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 5;

  selectedIssueItems: any[] = [];
  selectedIssueId: number | null = null;

  //edit modal 
  editIssueDate: any;
  editIssueFromName: string = '';
  editIssueToName: string = '';
  editIssueItems: any[] = [];

  editSelectedTypeName = '';
  editSelectedMedicineName = '';
  editAvailableQty = 0;
  editIssueQty: any;

  // 🔹 EDIT TYPE DROPDOWN
  isEditTypeDropdownOpen: boolean = false;
  editTypeSearch: string = '';
  filteredEditMedicineTypes: any[] = [];
  editMedicineTypeId: number | null = null;

  // 🔹 EDIT MEDICINE DROPDOWN
  isEditMedicineDropdownOpen: boolean = false;
  editMedicineSearch: string = '';
  filteredEditMedicines: any[] = [];
  editSelectedMedicineId: number | null = null;

  // 🔹 BATCH DROPDOWN (MAIN)
  isBatchDropdownOpen: boolean = false;
  batchSearch: string = '';
  batches: any[] = []; // Populate this from your API when a medicine is selected
  filteredBatches: any[] = [];
  selectedBatchNo: string = '';
  selectedExpiryDate: string = '';

  // 🔹 EDIT BATCH DROPDOWN (EDIT MODAL)
  isEditBatchDropdownOpen: boolean = false;
  editBatchSearch: string = '';
  editBatches: any[] = []; // Populate this from your API
  filteredEditBatches: any[] = [];
  editSelectedBatchNo: string = '';
  editSelectedExpiryDate: string = '';

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }


  ngOnInit(): void {
    const today = new Date();
    this.issueDate = today.toISOString().split('T')[0];

    this.getBranch();
    this.getAllBranches();

    setTimeout(() => this.loadIssueList(), 200);
  }

  getAllBranches() {
    this.url.getAllBranch().subscribe({
      next: (res: any[]) => {
        this.allBranches = res;
        console.log('Loaded all branches for Issue To:', this.allBranches);
      },
      error: (err) => {
        console.error('Error fetching all branches:', err);
      }
    });
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.isIssueFromDropdownOpen = false;
    this.isIssueToDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isMedicineDropdownOpen = false;
    this.isBatchDropdownOpen = false;      // Add this
    this.isEditBatchDropdownOpen = false;  // Add this
  }

  openIssueFromDropdown() {
    this.isIssueFromDropdownOpen = true;
    this.issueFromSearch = '';

    // Exclude "Issue To" branch dynamically
    this.filteredIssueFromBranches = this.branch.filter(
      b => b.id !== this.issueToBranchId
    );
  }

  filterIssueFromBranches() {
    const search = this.issueFromSearch?.toLowerCase().trim();

    const baseList = this.branch.filter(
      b => b.id !== this.issueToBranchId
    );

    if (!search) {
      this.filteredIssueFromBranches = [...baseList];
      return;
    }

    this.filteredIssueFromBranches = baseList.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectIssueFromBranch(branch: any) {
    this.issueFromBranchId = branch.id;
    this.selectedIssueFromName = branch.branch_name;
    this.isIssueFromDropdownOpen = false;

    this.onFromBranchChange(); // 🔥 IMPORTANT

    // Reset Issue To if same branch selected
    if (this.issueToBranchId === branch.id) {
      this.issueToBranchId = null;
      this.selectedIssueToName = '';
    }

  }


  getBranch() {
    // Retrieve the branches saved during login
    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      // Parse the JSON string and assign it to the branch array
      this.branch = JSON.parse(storedBranches);
      console.log('Loaded user specific branches:', this.branch);
    } else {
      // Fallback if no branches exist
      this.branch = [];
      this.toast.typeError('No assigned branches found.');
    }
  }

  onFromBranchChange() {

    if (!this.issueFromBranchId) {
      this.medicineTypes = [];
      return;
    }

    this.url.getMedicineTypesByBranch(this.issueFromBranchId).subscribe({
      next: (res: any[]) => {
        console.log('Branch wise types:', res);
        this.medicineTypes = res;

        // Reset selections
        this.medicine_type_id = null;
        this.selectedMedicineId = null;
        this.filteredMedicines = [];
        this.availableQty = 0;
        this.selectedTypeName = '';
        this.isTypeDropdownOpen = false;

      },
      error: (err) => {
        console.error('Type fetch error:', err);
        this.toast.typeError('Failed to load medicine types');
      }
    });
  }

  openIssueToDropdown() {
    this.isIssueToDropdownOpen = true;
    this.issueToSearch = '';

    // 🔥 Change this.branch to this.allBranches
    // Exclude selected "Issue From" branch
    this.filteredIssueToBranches = this.allBranches.filter(
      b => b.id !== this.issueFromBranchId
    );
  }

  filterIssueToBranches() {
    const search = this.issueToSearch?.toLowerCase().trim();

    // 🔥 Change this.branch to this.allBranches
    const baseList = this.allBranches.filter(
      b => b.id !== this.issueFromBranchId
    );

    if (!search) {
      this.filteredIssueToBranches = [...baseList];
      return;
    }

    this.filteredIssueToBranches = baseList.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectIssueToBranch(branch: any) {
    this.issueToBranchId = branch.id;
    this.selectedIssueToName = branch.branch_name;
    this.isIssueToDropdownOpen = false;
  }

  onTypeChange() {

    this.selectedMedicineId = null;
    this.filteredMedicines = [];
    this.availableQty = 0;
    this.selectedMedicineName = '';
    this.isMedicineDropdownOpen = false;

    if (!this.issueFromBranchId || !this.medicine_type_id) {
      return;
    }

    this.url.getMedicineByBranchAndType(
      this.issueFromBranchId,
      this.medicine_type_id
    ).subscribe({
      next: (res: any[]) => {
        this.filteredMedicines = res;
      },
      error: (err) => {
        this.toast.typeError('Failed to load medicines');
      }
    });
  }


  openTypeDropdown() {
    if (!this.issueFromBranchId) return; // prevent open if no branch selected

    this.isTypeDropdownOpen = true;
    this.typeSearch = '';
    this.filteredMedicineTypes = [...this.medicineTypes];
  }

  filterTypes() {
    const search = this.typeSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredMedicineTypes = [...this.medicineTypes];
      return;
    }

    this.filteredMedicineTypes = this.medicineTypes.filter(type =>
      type.name.toLowerCase().includes(search)
    );
  }

  selectType(type: any) {
    this.medicine_type_id = type.id;
    this.selectedTypeName = type.name;
    this.isTypeDropdownOpen = false;

    this.onTypeChange(); // 🔥 keep your existing logic
  }


  onMedicineChange() {
    if (!this.issueFromBranchId || !this.selectedMedicineId) {
      this.availableQty = 0;
      this.batches = [];
      this.selectedBatchNo = '';
      this.selectedExpiryDate = '';
      return;
    }

    this.url.getAvailableStock(
      this.issueFromBranchId,
      this.selectedMedicineId
    ).subscribe({
      next: (res: any) => {
        if (res.status) {
          // Load the batches from the API response
          this.batches = res.batches || [];
          this.filteredBatches = [...this.batches];
        } else {
          this.batches = [];
          this.filteredBatches = [];
        }

        // Reset batch selection and quantity until a user selects a specific batch
        this.selectedBatchNo = '';
        this.selectedExpiryDate = '';
        this.availableQty = 0;
      },
      error: (err) => {
        console.error('Stock Fetch Error:', err);
        this.batches = [];
        this.availableQty = 0;
        this.toast.typeError('Failed to fetch available stock');
      }
    });
  }

  openMedicineDropdown() {
    if (!this.medicine_type_id || !this.issueFromBranchId) return;

    this.isMedicineDropdownOpen = true;
    this.medicineSearch = '';
    this.filteredMedicineSearchList = [...this.filteredMedicines];
  }

  filterMedicinesSearch() {
    const search = this.medicineSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredMedicineSearchList = [...this.filteredMedicines];
      return;
    }

    this.filteredMedicineSearchList = this.filteredMedicines.filter(m =>
      m.name.toLowerCase().includes(search)
    );
  }

  selectMedicine(medicine: any) {
    this.selectedMedicineId = medicine.id;
    this.selectedMedicineName = medicine.name;
    this.isMedicineDropdownOpen = false;

    this.onMedicineChange(); // 🔥 keep your stock logic
  }

  // ================= BATCH DROPDOWN (MAIN) =================
  openBatchDropdown() {
    if (!this.selectedMedicineId) return;
    this.isBatchDropdownOpen = true;
    this.batchSearch = '';
    this.filteredBatches = [...this.batches];
  }

  filterBatches() {
    const search = this.batchSearch?.toLowerCase().trim();
    if (!search) {
      this.filteredBatches = [...this.batches];
      return;
    }
    this.filteredBatches = this.batches.filter(b =>
      b.batch_no.toLowerCase().includes(search)
    );
  }

  selectBatch(batch: any) {
    this.selectedBatchNo = batch.batch_no;
    this.selectedExpiryDate = batch.expiry_date;
    this.isBatchDropdownOpen = false;

    // Get stock for this specific batch
    let apiStock = batch.available_qty;

    // Calculate already added quantity for this exact medicine AND batch
    const alreadyAddedQty = this.issueItems
      .filter(item => item.medicine_id === this.selectedMedicineId && item.batch_no === this.selectedBatchNo)
      .reduce((sum, item) => sum + item.transfer_qty, 0);

    // Final remaining stock
    this.availableQty = apiStock - alreadyAddedQty;

    if (this.availableQty < 0) {
      this.availableQty = 0;
    }
  }

  // ================= BATCH DROPDOWN (EDIT) =================
  openEditBatchDropdown() {
    if (!this.editSelectedMedicineId) return;
    this.isEditBatchDropdownOpen = true;
    this.editBatchSearch = '';
    this.filteredEditBatches = [...this.editBatches];
  }

  filterEditBatches() {
    const search = this.editBatchSearch?.toLowerCase().trim();
    if (!search) {
      this.filteredEditBatches = [...this.editBatches];
      return;
    }
    this.filteredEditBatches = this.editBatches.filter(b =>
      b.batch_no.toLowerCase().includes(search)
    );
  }

  selectEditBatch(batch: any) {
    this.editSelectedBatchNo = batch.batch_no;
    this.editSelectedExpiryDate = batch.expiry_date;
    this.isEditBatchDropdownOpen = false;

    // Set available quantity based on the selected batch
    this.editAvailableQty = batch.available_qty;
  }


  addRow() {
    this.issueRows.push({
      type: '',
      medicine: '',
      availableQty: 0,
      transferQty: 0
    });
  }

  addItem() {

    if (!this.medicine_type_id || !this.selectedMedicineId || !this.issueQty) {
      alert('Please select type, medicine and quantity');
      return;
    }

    if ((this.issueQty ?? 0) > this.availableQty) {
      alert('Issue quantity exceeds available stock');
      return;
    }

    // Inside addItem():
    if (!this.medicine_type_id || !this.selectedMedicineId || !this.selectedBatchNo || !this.issueQty) {
      alert('Please select type, medicine, batch and quantity');
      return;
    }

    const selectedType = this.medicineTypes.find(
      t => t.id === this.medicine_type_id
    );

    const selectedMedicine = this.filteredMedicines.find(
      m => m.id === this.selectedMedicineId
    );


    this.issueItems.push({
      medicine_type_id: this.medicine_type_id,
      medicine_id: this.selectedMedicineId,
      batch_no: this.selectedBatchNo, // Add this
      expiry_date: this.selectedExpiryDate,
      transfer_qty: this.issueQty,
      typeName: selectedType?.name,
      medicineName: selectedMedicine?.name,
      availableQty: this.availableQty
    });

    console.log('Issue Items:', this.issueItems);

    // RESET
    this.medicine_type_id = null;
    this.selectedMedicineId = null;
    this.selectedBatchNo = '';
    this.selectedExpiryDate = '';
    this.issueQty = null;
    this.availableQty = 0;

  }


  removeItem(index: number) {
    this.issueItems.splice(index, 1);
  }


  submitIssue() {

    console.log('Submit Clicked');

    if (!this.issueDate || !this.issueFromBranchId || !this.issueToBranchId) {
      this.toast.typeError('Please fill all required fields');
      return;
    }

    if (this.issueItems.length === 0) {
      this.toast.typeError('Please add at least one medicine');
      return;
    }

    const payload = {
      issue_date: this.issueDate,
      from_branch_id: this.issueFromBranchId,
      to_branch_id: this.issueToBranchId,
      items: this.issueItems.map(item => ({
        medicine_id: item.medicine_id,
        medicine_type: item.typeName,
        medicine_type_id: item.medicine_type_id,
        batch_no: item.batch_no,
        expiry_date: item.expiry_date,
        available_qty: item.availableQty,
        issue_qty: item.transfer_qty
      }))
    };

    console.log('Payload:', payload);

    this.url.issueMedicine(payload).subscribe({
      next: (res: any) => {

        if (res.status) {

          this.toast.typeSuccess(res.message);

          // RESET FORM
          const today = new Date();
          this.issueDate = today.toISOString().split('T')[0];
          this.issueDate = '';
          this.issueFromBranchId = null;
          this.issueToBranchId = null;
          this.issueItems = [];

          // 🔥 Refresh List After Success
          this.loadIssueList();

        } else {
          this.toast.typeError(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.typeError('Something went wrong');
      }
    });

  }

  loadIssueList() {

    // ✅ Get logged-in user (CORRECT KEY)
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      this.toast.typeError('User not found');
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    console.log('User ID:', userId);

    // ✅ Call API with userId
    this.url.getAllMedicineIssues(userId).subscribe({
      next: (res: any[]) => {
        console.log('Issues API Response:', res);

        // ✅ Branch IDs user is allowed to see
        const branchStr = localStorage.getItem('userBranches');
        const userBranches = branchStr ? JSON.parse(branchStr) : [];
        const allowedBranchIds = userBranches.map((b: any) => b.id);

        console.log('Allowed Branches:', allowedBranchIds);

        // ✅ Filter records
        this.issueList = res.filter((item: any) => {
          const fromId = item.from_branch?.id || item.from_branch_id;
          const toId = item.to_branch?.id || item.to_branch_id;

          return (
            allowedBranchIds.includes(fromId) ||
            allowedBranchIds.includes(toId)
          );
        });

        this.filteredIssueList = [...this.issueList];
        this.pageIndex = 0;
        this.updatePaginatedIssueList();
      },

      error: (err) => {
        console.error('Issue List Load Error:', err);
        this.toast.typeError('Failed to load issues');
      }
    });
  }

  //for searching 
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredIssueList = [...this.issueList];
    } else {
      this.filteredIssueList = this.issueList.filter((item: any) => {
        return (
          item.issue_date?.toLowerCase().includes(term) ||
          item.from_branch?.branch_name?.toLowerCase().includes(term) ||
          item.to_branch?.branch_name?.toLowerCase().includes(term)
        );
      });
    }
    this.pageIndex = 0;
    this.updatePaginatedIssueList();
  }

  //for pagination 
  updatePaginatedIssueList(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedIssueList =
      this.filteredIssueList.slice(start, end);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedIssueList();
  }

  viewIssueItems(issueId: number) {
    this.selectedIssueId = issueId;
    this.url.getIssueItemsById(issueId).subscribe({
      next: (res: any[]) => {
        console.log('Issue Items Response:', res);
        this.selectedIssueItems = res;
      },
      error: (err) => {
        console.error('Error loading issue items:', err);
        this.toast.typeError('Failed to load issue items');
      }
    });
  }

  onQtyInput(event: any) {
    let value = event.target.value;
    // Remove non-digits
    value = value.replace(/[^0-9]/g, '');
    // Prevent leading zero like 000
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }
    this.issueQty = value ? Number(value) : null;
  }


  openDeleteModal(issueId: number) {
    this.deleteIssueId = issueId;
  }

  confirmDelete() {
    if (!this.deleteIssueId) {
      return;
    }
    this.url.deleteMedicineIssue(this.deleteIssueId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.typeSuccess(res.message);
          // Close modal manually
          const modalElement = document.getElementById('delete_modal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
            modal?.hide();
          }
          // Refresh list
          this.loadIssueList();
          // Reset
          this.deleteIssueId = null;
        } else {
          this.toast.typeError(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.typeError('Delete failed');
      }
    });
  }

  openEditModal(row: any) {

    this.selectedIssueId = row.id;
    this.editIssueDate = row.issue_date;
    this.editIssueFromName = row.from_branch?.branch_name;
    this.editIssueToName = row.to_branch?.branch_name;
    // 👇 store branch id for API usage
    this.issueFromBranchId = row.from_branch?.id;
    this.issueToBranchId = row.to_branch?.id;
    if (!this.issueFromBranchId) return;
    this.url.getMedicineTypesByBranch(this.issueFromBranchId).subscribe({
      next: (res: any[]) => {
        this.filteredEditMedicineTypes = res;
      }
    });
    // Load existing items
    this.url.getIssueItemsById(row.id).subscribe({
      next: (res: any[]) => {
        this.editIssueItems = res.map(item => ({
          medicine_id: item.medicine_id,
          medicine_type_id: item.medicine_type_id,
          typeName: item.medicine_type,
          medicineName: item.medicine_name,
          batch_no: item.batch_no, 
          expiry_date: item.expiry_date, 
          transfer_qty: item.issue_qty,
          availableQty: item.available_qty
        }));
      }
    });
  }

  addEditItem() {

    if (!this.editMedicineTypeId ||
      !this.editSelectedMedicineId ||
      !this.editIssueQty) {

      this.toast.typeError('Please select type, medicine and quantity');
      return;
    }

    if ((this.editIssueQty ?? 0) > this.editAvailableQty) {
      this.toast.typeError('Issue quantity exceeds available stock');
      return;
    }

    if (!this.editMedicineTypeId || !this.editSelectedMedicineId || !this.editSelectedBatchNo || !this.editIssueQty) {
      this.toast.typeError('Please select type, medicine, batch and quantity');
      return;
    }

    this.editIssueItems.push({
      medicine_type_id: this.editMedicineTypeId,
      medicine_id: this.editSelectedMedicineId,
      batch_no: this.editSelectedBatchNo, // Add this
      expiry_date: this.editSelectedExpiryDate,
      transfer_qty: this.editIssueQty,
      typeName: this.editSelectedTypeName,
      medicineName: this.editSelectedMedicineName,
      availableQty: this.editAvailableQty
    });

    // reset
    this.editSelectedTypeName = '';
    this.editSelectedMedicineName = '';
    this.editSelectedBatchNo = '';
    this.editSelectedExpiryDate = '';
    this.editIssueQty = null;
    this.editAvailableQty = 0;
  }

  updateIssue() {

    if (!this.selectedIssueId) return;

    if (!this.editIssueDate) {
      this.toast.typeError('Issue date is required');
      return;
    }

    if (this.editIssueItems.length === 0) {
      this.toast.typeError('Add at least one medicine');
      return;
    }

    const payload = {
      issue_date: this.editIssueDate,
      from_branch_id: this.issueFromBranchId,   // ✅ REQUIRED
      to_branch_id: this.issueToBranchId,       // ✅ REQUIRED
      items: this.editIssueItems.map(item => ({
        medicine_id: item.medicine_id,
        medicine_type: item.typeName,
        medicine_type_id: item.medicine_type_id,
        batch_no: item.batch_no,
        expiry_date: item.expiry_date,
        available_qty: item.availableQty,
        issue_qty: item.transfer_qty
      }))
    };

    this.url.updateMedicineIssue(this.selectedIssueId, payload)
      .subscribe({
        next: (res: any) => {

          if (res.status) {

            this.toast.typeSuccess(res.message);

            const modalElement = document.getElementById('editModal');
            if (modalElement) {
              const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
              modal?.hide();
            }

            this.loadIssueList();

          } else {
            this.toast.typeError(res.message);
          }
        },
        error: (err) => {
          console.error(err);
          this.toast.typeError('Update failed');
        }
      });
  }
  removeEditItem(index: number) {
    this.editIssueItems.splice(index, 1);
  }

  openEditTypeDropdown() {
    this.isEditTypeDropdownOpen = true;
    this.editTypeSearch = '';
    this.filteredEditMedicineTypes = [...this.filteredEditMedicineTypes];
  }

  filterEditTypes() {
    const search = this.editTypeSearch?.toLowerCase().trim();

    if (!search) {
      return;
    }

    this.filteredEditMedicineTypes =
      this.filteredEditMedicineTypes.filter(type =>
        type.name.toLowerCase().includes(search)
      );
  }

  selectEditType(type: any) {

    this.editMedicineTypeId = type.id;
    this.editSelectedTypeName = type.name;
    this.isEditTypeDropdownOpen = false;

    // ✅ NULL SAFETY CHECK
    if (!this.issueFromBranchId || !this.editMedicineTypeId) {
      return;
    }

    this.url.getMedicineByBranchAndType(
      this.issueFromBranchId,
      this.editMedicineTypeId
    ).subscribe({
      next: (res: any[]) => {
        this.filteredEditMedicines = res;
      },
      error: () => {
        this.toast.typeError('Failed to load medicines');
      }
    });
  }

  openEditMedicineDropdown() {

    if (!this.editMedicineTypeId) return;

    this.isEditMedicineDropdownOpen = true;
    this.editMedicineSearch = '';
  }

  filterEditMedicines() {

    const search = this.editMedicineSearch?.toLowerCase().trim();

    if (!search) return;

    this.filteredEditMedicines =
      this.filteredEditMedicines.filter(m =>
        m.name.toLowerCase().includes(search)
      );
  }

  selectEditMedicine(medicine: any) {
    this.editSelectedMedicineId = medicine.id;
    this.editSelectedMedicineName = medicine.name;
    this.isEditMedicineDropdownOpen = false;

    // Reset batch and qty
    this.editSelectedBatchNo = '';
    this.editSelectedExpiryDate = '';
    this.editAvailableQty = 0;
    this.editBatches = [];

    // ✅ NULL SAFETY CHECK
    if (!this.issueFromBranchId || !this.editSelectedMedicineId) {
      return;
    }

    this.url.getAvailableStock(
      this.issueFromBranchId,
      this.editSelectedMedicineId
    ).subscribe({
      next: (res: any) => {
        if (res.status) {
          // Load the batches for the edit modal
          this.editBatches = res.batches || [];
          this.filteredEditBatches = [...this.editBatches];
        }
      },
      error: () => {
        this.toast.typeError('Failed to fetch available stock');
        this.editAvailableQty = 0;
        this.editBatches = [];
      }
    });
  }

}
