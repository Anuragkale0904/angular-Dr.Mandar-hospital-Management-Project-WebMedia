import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, ToasterService } from 'src/app/core/core.index';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { MatTableDataSource } from '@angular/material/table';
import { apiResultFormat, pageSelection, productlist, editcreditnotes } from 'src/app/core/models/models';
import { HostListener } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-medicine-master',
  templateUrl: './medicine-master.component.html',
  styleUrls: ['./medicine-master.component.scss'],
})
export class MedicineMasterComponent implements OnInit {

  public editcreditnotes: Array<editcreditnotes> = [];
  dataSource!: MatTableDataSource<editcreditnotes>;

  // 🔹 BRANCH DROPDOWN
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranchList: any[] = [];
  selectedBranchName: string = '';

  // 🔹 TYPE DROPDOWN
  isTypeDropdownOpen: boolean = false;
  typeSearch: string = '';
  filteredTypeList: any[] = [];
  selectedTypeName: string = '';

  // 🔹 MEDICINE DROPDOWN
  isMedicineDropdownOpen: boolean = false;
  medicineSearch: string = '';
  filteredMedicineList: any[] = [];
  selectedMedicineName: string = '';

  editId: number | null = null;

  edit_inward_date = '';
  edit_branch_id: number | null = null;
  edit_medicine_type_id: number | null = null;
  edit_medicine_id: number | null = null;

  edit_batch_no = '';
  edit_expiry_date = '';
  edit_quantity: any;
  edit_mrp: any;
  edit_gst: any;

  editSelectedBranchName = '';
  editSelectedTypeName = '';
  editSelectedMedicineName = '';

  isEditBranchDropdownOpen = false;
  editBranchSearch = '';
  filteredEditBranchList: any[] = [];

  isEditTypeDropdownOpen = false;
  editTypeSearch = '';
  filteredEditTypeList: any[] = [];

  isEditMedicineDropdownOpen = false;
  editMedicineSearch = '';
  filteredEditMedicineList: any[] = [];


  medicineTypes: any[] = [];
  allMedicines: any[] = [];//full list
  medicineInwards: any[] = [];
  filteredData: any[] = [];
  medicines: any[] = [];//filtered list 
  branch: any[] = [];
  inward_date: string = '';
  medicine_type_id: number | null = null;
  medicine_id: string = '';
  quantity: string = '';
  mrp: string = '';
  gst: string = '';
  batch_no: string = '';
  expiry_date: string = '';
  // holds selected id
  deleteId: number | null = null;
  branch_id: number | null = null;
  searchFacilityTerm: string = '';
  facilityPageIndex = 0;
  facilityPageSize = 5;
  paginatedFacilities: any[] = [];


  constructor(
    private data: DataService,
    private toast: ToasterService,
    public url: DataservicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.inward_date = today.toISOString().split('T')[0];
    this.expiry_date = today.toISOString().split('T')[0];

    this.getBranch();           // user branches from login
    this.getMedicineTypes();
    this.getMedicine();
    this.getMedicineInward();  // now safe
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isBranchDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isMedicineDropdownOpen = false;

    // 🔥 ADD THESE
    this.isEditBranchDropdownOpen = false;
    this.isEditTypeDropdownOpen = false;
    this.isEditMedicineDropdownOpen = false;
  }

  openBranchDropdown() {
    this.isBranchDropdownOpen = true;
    this.branchSearch = '';
    this.filteredBranchList = [...this.branch];
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

  selectBranch(branch: any) {
    this.branch_id = branch.id;
    this.selectedBranchName = branch.branch_name;
    this.isBranchDropdownOpen = false;
  }
  getBranch() {
    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      this.branch = JSON.parse(storedBranches);
      this.filteredBranchList = [...this.branch];

      console.log('User Branches:', this.branch);

      // ✅ Auto-select if only one branch
      if (this.branch.length === 1) {
        this.selectBranch(this.branch[0]);
      }

    } else {
      this.branch = [];
      this.filteredBranchList = [];
      this.toast.typeError('No assigned branches found');
    }
  }

  openTypeDropdown() {
    this.isTypeDropdownOpen = true;
    this.typeSearch = '';
    this.filteredTypeList = [...this.medicineTypes];
  }

  filterTypes() {
    const search = this.typeSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredTypeList = [...this.medicineTypes];
      return;
    }

    this.filteredTypeList = this.medicineTypes.filter((t: any) =>
      t.name.toLowerCase().includes(search)
    );
  }

  selectType(type: any) {
    this.medicine_type_id = type.id;
    this.selectedTypeName = type.name;
    this.isTypeDropdownOpen = false;

    this.onTypeChange(); // 🔥 VERY IMPORTANT (keep your medicine filter working)
  }


  getMedicineTypes() {
    this.url.getMedicineTypes().subscribe((res: any[]) => {
      this.medicineTypes = res;
    });
  }

  openMedicineDropdown() {
    if (!this.medicine_type_id) return; // 🔥 Prevent open if no type selected

    this.isMedicineDropdownOpen = true;
    this.medicineSearch = '';
    this.filteredMedicineList = [...this.medicines]; // medicines already filtered by type
  }

  filterMedicines() {
    const search = this.medicineSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredMedicineList = [...this.medicines];
      return;
    }

    this.filteredMedicineList = this.medicines.filter((m: any) =>
      m.name.toLowerCase().includes(search)
    );
  }

  selectMedicine(medicine: any) {
    this.medicine_id = medicine.id;
    this.selectedMedicineName = medicine.name;
    this.isMedicineDropdownOpen = false;
  }


  getMedicine() {
    this.url.getMedicine().subscribe((res: any[]) => {
      this.allMedicines = res;   // store full list
      console.log('All Medicines:', this.allMedicines);
    });
  }

  onTypeChange() {
    this.medicine_id = '';
    this.selectedMedicineName = '';   // 🔥 ADD THIS

    if (!this.medicine_type_id) {
      this.medicines = [];
      return;
    }

    this.medicines = this.allMedicines.filter(
      med => med.medicine_type_id === this.medicine_type_id
    );
  }





  // ✅ API CALL  to get data in the datatable
  getMedicineInward() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = user?.id;

    if (!userId) {
      this.toast.typeError('User not found. Please login again.');
      return;
    }

    this.url.getMedicineInward(userId).subscribe({
      next: (res: any[]) => {

        // ✅ Backend already filtered by user branches
        this.medicineInwards = res || [];
        this.filteredData = [...this.medicineInwards];

        this.facilityPageIndex = 0;
        this.updatePaginatedFacilities();

        console.log('Medicine Inward Loaded:', this.medicineInwards);
      },
      error: (err) => {
        console.error('API Error', err);
        this.toast.typeError('Failed to load medicine inward data');
      }
    });
  }

  // ✅ SEARCH (FIXED)
  searchMedicine(event: any) {
    const value = event.target.value.toLowerCase().trim();

    this.filteredData = this.medicineInwards.filter(item =>
      item.medicine?.name?.toLowerCase().includes(value)
    );
  }

  calculateExcludingGST(mrp: any, gst: any): number {
    if (!mrp || !gst) return 0;

    let mrpNum = Number(mrp);
    const gstNum = Number(gst);

    // 🔥 HARD FIX: backend sending paise
    if (mrpNum < 1) {
      mrpNum = mrpNum * 100;
    }

    const basePrice = (mrpNum * 100) / (100 + gstNum);
    return Number(basePrice.toFixed(2));
  }


  addMedicineInward() {
    // Basic validation
    if (
      !this.branch_id ||   // ✅ ADD THIS
      !this.inward_date ||
      !this.medicine_type_id ||
      !this.medicine_id ||
      !this.batch_no.trim() ||
      !this.expiry_date ||
      !this.quantity ||
      !this.mrp ||
      !this.gst
    ) {
      this.toast.typeError('All fields are required', 'Error');
      return;
    }


    const payload = {
      branch_id: Number(this.branch_id), // ✅ ADD THIS
      inward_date: this.inward_date,
      medicine_type_id: this.medicine_type_id,
      medicine_id: this.medicine_id,
      batch_no: this.batch_no,
      expiry_date: this.expiry_date,
      quantity: this.quantity,
      mrp: this.mrp,
      gst: this.gst,
    };


    this.url.addMedicineInward(payload).subscribe({
      next: (res: any) => {
        this.toast.typeSuccess('Medicine inward added successfully!', 'Success');


        // Clear form
        this.inward_date = '';
        this.medicine_type_id = null;
        this.medicine_id = '';
        this.batch_no = '';
        this.expiry_date = '';
        this.quantity = '';
        this.mrp = '';
        this.gst = '';

        // Reload table
        this.getMedicineInward();
      },
      error: () => {
        this.toast.typeError('Something went wrong', 'Error');
      }
    });
  }


  // called when trash icon is clicked
  openDeleteModal(id: number) {
    this.deleteId = id;
  }

  // called when Delete button in modal is clicked
  confirmDelete() {
    if (!this.deleteId) {
      this.toast.typeError('Invalid medicine selected', 'Error');
      return;
    }

    this.url.deleteMedicineInward(this.deleteId).subscribe({
      next: () => {
        this.toast.typeSuccess('Medicine deleted successfully', 'Success');

        this.getMedicineInward(); // reload table
        this.deleteId = null;

        // close modal programmatically
        const modal = document.getElementById('delete_modal');
        if (modal) {
          (window as any).bootstrap.Modal.getInstance(modal)?.hide();
        }
      },
      error: () => {
        this.toast.typeError('Delete failed', 'Error');
      }
    });
  }

  getFormattedDate(): string {
    if (!this.inward_date) return '';
    const [year, month, day] = this.inward_date.split('-');
    return `${day}/${month}/${year}`;
  }

  allowAlphaNumericOnly(event: KeyboardEvent) {
    const charCode = event.key;

    const regex = /^[a-zA-Z0-9]$/;

    if (!regex.test(charCode)) {
      event.preventDefault();
    }
  }

  // onQuantityInput(event: any) {
  //   const value = event.target.value.replace(/[^0-9]/g, '');
  //   this.quantity = value;
  // }

  allowNumbersOnly(event: KeyboardEvent) {
    const charCode = event.key;

    // Allow only digits (0-9)
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  allowDecimalOnly(event: KeyboardEvent) {
    const char = event.key;

    // Allow numbers and dot
    if (!/^[0-9.]$/.test(char)) {
      event.preventDefault();
    }

    // Prevent multiple dots
    if (char === '.' && this.mrp.includes('.')) {
      event.preventDefault();
    }
  }

  cleanMRP(event: any) {
    let value = event.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }
    // Limit to 2 decimal places
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);
      value = parts[0] + '.' + parts[1];
    }
    this.mrp = value;
  }

  allowGstInput(event: KeyboardEvent) {
    const char = event.key;

    // Allow numbers and dot only
    if (!/^[0-9.]$/.test(char)) {
      event.preventDefault();
    }

    // Prevent multiple dots
    if (char === '.' && this.gst.includes('.')) {
      event.preventDefault();
    }
  }

  validateGst(event: any) {
    let value = event.target.value;
    // Remove invalid characters
    value = value.replace(/[^0-9.]/g, '');
    // Allow only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }
    // Limit to 2 decimal places
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);
      value = parts[0] + '.' + parts[1];
    }
    // Prevent GST above 100
    if (Number(value) > 100) {
      value = '100';
    }
    this.gst = value;
  }

  openEditModal(id: number) {

    this.editId = id;

    this.url.getMedicineInwardById(id).subscribe({
      next: (res: any) => {

        this.edit_inward_date = res.inward_date;
        this.edit_branch_id = +res.branch_id;
        this.edit_medicine_type_id = res.medicine_type_id;
        this.edit_medicine_id = res.medicine_id;

        this.edit_batch_no = res.batch_no;
        this.edit_expiry_date = res.expiry_date;
        this.edit_quantity = res.quantity;
        this.edit_mrp = res.mrp;
        this.edit_gst = res.gst;

        this.editSelectedBranchName = res.branch?.branch_name;
        this.editSelectedTypeName = res.type?.name;
        this.editSelectedMedicineName = res.medicine?.name;

        // load dropdown lists
        this.filteredEditBranchList = this.branch;

        this.url.getMedicineTypesByBranch(this.edit_branch_id!).subscribe({
          next: (types: any[]) => {
            this.filteredEditTypeList = types;
          }
        });

        this.url.getMedicineByBranchAndType(
          this.edit_branch_id!,
          this.edit_medicine_type_id!
        ).subscribe({
          next: (med: any[]) => {
            this.filteredEditMedicineList = med;
          }
        });

      }
    });
  }

  updateMedicineInward() {

    if (!this.editId) return;

    // Basic validation (recommended)
    if (
      !this.edit_branch_id ||
      !this.edit_inward_date ||
      !this.edit_medicine_type_id ||
      !this.edit_medicine_id ||
      !this.edit_batch_no ||
      !this.edit_expiry_date ||
      !this.edit_quantity ||
      !this.edit_mrp ||
      !this.edit_gst
    ) {
      this.toast.typeError('All fields are required');
      return;
    }

    const payload = {
      inward_date: this.edit_inward_date,
      branch_id: Number(this.edit_branch_id),
      medicine_type_id: Number(this.edit_medicine_type_id),
      medicine_id: Number(this.edit_medicine_id),
      batch_no: this.edit_batch_no,
      expiry_date: this.edit_expiry_date,
      quantity: Number(this.edit_quantity),
      mrp: Number(this.edit_mrp),
      gst: Number(this.edit_gst)
    };

    this.url.updateMedicineInward(this.editId, payload).subscribe({
      next: (res: any) => {

        if (res.status) {

          this.toast.typeSuccess(res.message);

          const modal = document.getElementById('edit_inward_modal');
          if (modal) {
            (window as any).bootstrap.Modal.getInstance(modal)?.hide();
          }

          this.getMedicineInward(); // reload table

        } else {
          this.toast.typeError(res.message);
        }
      },
      error: () => {
        this.toast.typeError('Update failed');
      }
    });
  }

  // 🔹 OPEN EDIT BRANCH
  openEditBranchDropdown() {
    this.isEditBranchDropdownOpen = true;
    this.editBranchSearch = '';
    this.filteredEditBranchList = [...this.branch];
  }

  // 🔹 FILTER EDIT BRANCH
  filterEditBranches() {
    const search = this.editBranchSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredEditBranchList = [...this.branch];
      return;
    }

    this.filteredEditBranchList = this.branch.filter((b: any) =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  // 🔹 SELECT EDIT BRANCH
  selectEditBranch(branch: any) {
    this.edit_branch_id = branch.id;
    this.editSelectedBranchName = branch.branch_name;
    this.isEditBranchDropdownOpen = false;
  }

  openEditTypeDropdown() {
    this.isEditTypeDropdownOpen = true;
    this.editTypeSearch = '';
    this.filteredEditTypeList = [...this.medicineTypes];
  }

  filterEditTypes() {
    const search = this.editTypeSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredEditTypeList = [...this.medicineTypes];
      return;
    }

    this.filteredEditTypeList = this.medicineTypes.filter((t: any) =>
      t.name.toLowerCase().includes(search)
    );
  }

  selectEditType(type: any) {
    this.edit_medicine_type_id = type.id;
    this.editSelectedTypeName = type.name;
    this.isEditTypeDropdownOpen = false;

    // Filter medicines for selected type
    this.filteredEditMedicineList = this.allMedicines.filter(
      med => med.medicine_type_id === this.edit_medicine_type_id
    );
  }

  openEditMedicineDropdown() {
    if (!this.edit_medicine_type_id) return;

    this.isEditMedicineDropdownOpen = true;
    this.editMedicineSearch = '';
    this.filteredEditMedicineList = this.allMedicines.filter(
      med => med.medicine_type_id === this.edit_medicine_type_id
    );
  }

  filterEditMedicines() {
    const search = this.editMedicineSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredEditMedicineList = this.allMedicines.filter(
        med => med.medicine_type_id === this.edit_medicine_type_id
      );
      return;
    }

    this.filteredEditMedicineList = this.allMedicines.filter(
      med =>
        med.medicine_type_id === this.edit_medicine_type_id &&
        med.name.toLowerCase().includes(search)
    );
  }

  selectEditMedicine(medicine: any) {
    this.edit_medicine_id = medicine.id;
    this.editSelectedMedicineName = medicine.name;
    this.isEditMedicineDropdownOpen = false;
  }

  // -------- SEARCH ----------
  onFacilitySearchChange(): void {
    const term = this.searchFacilityTerm.toLowerCase().trim();

    if (!term) {
      this.filteredData = [...this.medicineInwards];
    } else {
      this.filteredData = this.medicineInwards.filter((item: any) => {

        return (
          item.branch?.branch_name?.toLowerCase().includes(term) ||
          item.type?.name?.toLowerCase().includes(term) ||
          item.medicine?.name?.toLowerCase().includes(term) ||
          item.batch_no?.toLowerCase().includes(term) ||
          item.quantity?.toString().includes(term) ||
          item.mrp?.toString().includes(term) ||
          item.gst?.toString().includes(term) ||
          item.inward_date?.toLowerCase().includes(term)
        );

      });
    }

    this.facilityPageIndex = 0;
    this.updatePaginatedFacilities();
  }

  // -------- PAGINATION ----------
  updatePaginatedFacilities(): void {
    const start = this.facilityPageIndex * this.facilityPageSize;
    const end = start + this.facilityPageSize;
    this.paginatedFacilities = this.filteredData.slice(start, end);
  }

  onFacilityPageChange(event: PageEvent): void {
    this.facilityPageSize = event.pageSize;
    this.facilityPageIndex = event.pageIndex;
    this.updatePaginatedFacilities();
  }

  // -------- SORT ----------
  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.filteredData = [...this.medicineInwards];
    } else {

      this.filteredData = [...this.filteredData].sort((a: any, b: any) => {

        let aValue;
        let bValue;

        switch (sort.active) {
          case 'branch':
            aValue = a.branch?.branch_name;
            bValue = b.branch?.branch_name;
            break;
          case 'medicine':
            aValue = a.medicine?.name;
            bValue = b.medicine?.name;
            break;
          default:
            aValue = a[sort.active];
            bValue = b[sort.active];
        }

        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }

    this.updatePaginatedFacilities();
  }

}
