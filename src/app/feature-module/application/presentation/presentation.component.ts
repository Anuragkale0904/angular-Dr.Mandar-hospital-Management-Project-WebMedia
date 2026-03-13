import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, productlist, editcreditnotes } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
//import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';



@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss'],

})
export class PresentationComponent {

  // 🔹 TRANSFER FROM DROPDOWN
  isTransferFromDropdownOpen: boolean = false;
  transferFromSearch: string = '';
  filteredTransferFromBranches: any[] = [];
  selectedTransferFromName: string = '';

  // 🔹 TRANSFER TO DROPDOWN
  isTransferToDropdownOpen: boolean = false;
  transferToSearch: string = '';
  filteredTransferToBranches: any[] = [];
  selectedTransferToName: string = '';

  // 🔹 MEDICINE TYPE DROPDOWN
  isTypeDropdownOpen: boolean = false;
  typeSearch: string = '';
  filteredMedicineTypes: any[] = [];
  selectedTypeName: string = '';

  // 🔹 MEDICINE DROPDOWN
  isMedicineDropdownOpen: boolean = false;
  medicineSearch: string = '';
  filteredMedicines: any[] = [];
  selectedMedicineName: string = '';

  editTransferId: number | null = null;
  editTransferDate: string = '';

  editTransferItems: any[] = [];

  editSelectedTransferFromName = '';
  editSelectedTransferToName = '';

  editTransferFromBranchId: number | null = null;
  editTransferToBranchId: number | null = null;

  isEditTransferFromDropdownOpen = false;
  isEditTransferToDropdownOpen = false;

  editTransferFromSearch = '';
  editTransferToSearch = '';

  editFilteredTransferFromBranches: any[] = [];
  editFilteredTransferToBranches: any[] = [];



  medicineTypes: any[] = [];
  medicines: any[] = [];

  public selectedValue!: string | number;
  selectedMedicineId: number | null = null;

  public editcreditnotes: Array<editcreditnotes> = [];

  transferFrom!: number;
  transferTo!: number;

  transferRows: any[] = [
    { type: '', medicine: '', availableQty: 200, transferQty: 0 }
  ];

  availableQty: number | null = null;
  medicine: any[] = [];
  medicine_type_id: number | null = null;
  name: string = '';
  addmedicine: any[] = [];
  branch: any[] = [];
  allBranches: any[] = [];
  branch_name: string = '';
  selectedTypeId!: number;
  transferFromBranchId: number | null = null;
  transferToBranchId: number | null = null;
  transferDate: string = '';
  stockTransfers: any[] = [];
  selectedTransfer: any = null;
  transferQty: number | null = null;
  stockTransferItems: any[] = [];
  selectedTransferId!: number;
  deleteTransferId: number | null = null;
  transferItems: any[] = [];
  isSubmitting = false;

  // 🔹 NEW EDIT ENTRY ROW VARIABLES
  editNewMedicineTypeId: number | null = null;
  editNewTypeName: string = '';
  editNewTypeSearch: string = '';
  isEditNewTypeDropdownOpen = false;

  editNewMedicineId: number | null = null;
  editNewMedicineName: string = '';
  editNewMedicineSearch: string = '';
  isEditNewMedicineDropdownOpen = false;

  editNewFilteredMedicines: any[] = [];
  editNewAvailableQty: number | null = null;
  editNewTransferQty: number | null = null;

  // 🔹 BATCH DROPDOWN (MAIN)
  isBatchDropdownOpen: boolean = false;
  batchSearch: string = '';
  batches: any[] = [];
  filteredBatches: any[] = [];
  selectedBatchNo: string = '';
  selectedExpiryDate: string = '';

  // 🔹 BATCH DROPDOWN (EDIT NEW ROW)
  isEditNewBatchDropdownOpen: boolean = false;
  editNewBatchSearch: string = '';
  editNewBatches: any[] = [];
  editNewFilteredBatches: any[] = [];
  editNewSelectedBatchNo: string = '';
  editNewSelectedExpiryDate: string = '';

  // 🔥 PAGINATION + SEARCH
  filteredStockTransfers: any[] = [];
  paginatedStockTransfers: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 5;

  bsConfig: Partial<BsDatepickerConfig> | undefined;

  public routes = routes;
  public Toggledata = false;
  dataSource!: MatTableDataSource<editcreditnotes>;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit(): void {

    const today = new Date();
    this.transferDate = today.toISOString().split('T')[0];

    this.getMedicineByType();

    this.getBranch();        // user branches
    this.getAllBranches();   // all branches

    // ✅ Delay to ensure branches loaded
    setTimeout(() => this.loadStockTransfers(), 200);
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.isTransferFromDropdownOpen = false;
    this.isTransferToDropdownOpen = false;
    this.isTypeDropdownOpen = false;
    this.isMedicineDropdownOpen = false;
    this.isBatchDropdownOpen = false;         // 👈 ADD THIS

    this.isEditTransferFromDropdownOpen = false;
    this.isEditTransferToDropdownOpen = false;
    this.isEditNewTypeDropdownOpen = false;
    this.isEditNewMedicineDropdownOpen = false;
    this.isEditNewBatchDropdownOpen = false;  // 👈 ADD THIS
  }

  openTransferFromDropdown() {
    this.isTransferFromDropdownOpen = true;
    this.transferFromSearch = '';

    // Exclude selected Transfer To branch
    this.filteredTransferFromBranches = this.branch.filter(
      b => b.id !== this.transferToBranchId
    );
  }

  filterTransferFromBranches() {
    const search = this.transferFromSearch?.toLowerCase().trim();

    const baseList = this.branch.filter(
      b => b.id !== this.transferToBranchId
    );

    if (!search) {
      this.filteredTransferFromBranches = [...baseList];
      return;
    }

    this.filteredTransferFromBranches = baseList.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectTransferFromBranch(branch: any) {
    this.transferFromBranchId = branch.id;
    this.selectedTransferFromName = branch.branch_name;
    this.isTransferFromDropdownOpen = false;

    this.onBranchChange(); // 🔥 Important to load types

    // Reset Transfer To if same selected
    if (this.transferToBranchId === branch.id) {
      this.transferToBranchId = null;
    }
  }

  openTransferToDropdown() {
    this.isTransferToDropdownOpen = true;
    this.transferToSearch = '';

    // 🔥 Change this.branch to this.allBranches
    this.filteredTransferToBranches = this.allBranches.filter(
      b => b.id !== this.transferFromBranchId
    );
  }

  filterTransferToBranches() {
    const search = this.transferToSearch?.toLowerCase().trim();

    // 🔥 Change this.branch to this.allBranches
    const baseList = this.allBranches.filter(
      b => b.id !== this.transferFromBranchId
    );

    if (!search) {
      this.filteredTransferToBranches = [...baseList];
      return;
    }

    this.filteredTransferToBranches = baseList.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectTransferToBranch(branch: any) {
    this.transferToBranchId = branch.id;
    this.selectedTransferToName = branch.branch_name;
    this.isTransferToDropdownOpen = false;

    // Reset if same selected
    if (this.transferFromBranchId === branch.id) {
      this.transferFromBranchId = null;
      this.selectedTransferFromName = '';
    }
  }


  getBranch() {
    // Retrieve the user-specific branches saved during login
    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      this.branch = JSON.parse(storedBranches);
      console.log('Loaded user specific branches:', this.branch);
    } else {
      this.branch = [];
      this.toast.typeError('No assigned branches found.');
    }
  }

  getAllBranches() {
    // Retrieve all branches from the backend for the "Transfer To" dropdown
    this.url.getAllBranch().subscribe((res: any[]) => {
      this.allBranches = res;
      console.log('All Branches for Transfer To:', this.allBranches);
    });
  }


  // getMedicineType() {
  //   this.url.getMedicineType().subscribe((res: any[]) => {
  //     this.medicineTypes = res;
  //     console.log('Types:', this.medicineTypes);
  //   });
  // }

  onBranchChange() {

    console.log("Branch Changed:", this.transferFromBranchId);

    if (!this.transferFromBranchId) {
      this.medicineTypes = [];
      this.filteredMedicineTypes = [];
      return;
    }

    const payload = {
      branch_id: this.transferFromBranchId
    };

    this.url.getMedicineTypesByBranchTransfer(payload).subscribe({
      next: (res: any) => {

        console.log("API Response:", res);

        if (Array.isArray(res)) {
          this.medicineTypes = res;
          this.filteredMedicineTypes = [...res];   // ✅ IMPORTANT
        } else {
          this.medicineTypes = [];
          this.filteredMedicineTypes = [];
        }

        console.log("Final Types Array:", this.filteredMedicineTypes);

      },
      error: (err) => {
        console.error("Type API Error:", err);
        this.medicineTypes = [];
        this.filteredMedicineTypes = [];
      }
    });
  }


  getMedicineByType() {
    if (!this.selectedTypeId) {
      this.addmedicine = [];
      return;
    }

    this.url.getMedicinesByTypeId(this.selectedTypeId)
      .subscribe((res: any[]) => {
        this.addmedicine = res;
      });
  }

  checkSameBranch() {
    if (this.transferFrom && this.transferTo && this.transferFrom === this.transferTo) {
      alert('Transfer From and Transfer To cannot be same');
      this.transferTo = undefined!;
    }
  }

  openTypeDropdown() {
    if (!this.transferFromBranchId) return;  // Disable behavior

    this.isTypeDropdownOpen = true;
    this.typeSearch = '';
    this.filteredMedicineTypes = [...this.medicineTypes];
  }

  filterMedicineTypes() {
    if (!this.typeSearch) {
      this.filteredMedicineTypes = [...this.medicineTypes];
    } else {
      const search = this.typeSearch.toLowerCase();
      this.filteredMedicineTypes = this.medicineTypes.filter(type =>
        type.name.toLowerCase().includes(search)
      );
    }
  }

  selectMedicineType(type: any) {
    this.medicine_type_id = type.id;
    this.selectedTypeName = type.name;

    this.isTypeDropdownOpen = false;

    // Load medicines
    this.onTypeChange();
  }

  openMedicineDropdown() {
    if (!this.medicine_type_id) return; // disabled behavior

    this.isMedicineDropdownOpen = true;
    this.medicineSearch = '';
    this.filteredMedicines = [...this.medicines];
  }

  filterMedicines() {
    const search = this.medicineSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredMedicines = [...this.medicines];
      return;
    }

    this.filteredMedicines = this.medicines.filter(m =>
      m.name.toLowerCase().includes(search)
    );
  }

  selectMedicine(medicine: any) {
    this.selectedMedicineId = medicine.id;
    this.selectedMedicineName = medicine.name;
    this.isMedicineDropdownOpen = false;

    this.onMedicineChange(); // 🔥 Important
  }

  addRow() {
    this.transferRows.push({
      type: '',
      medicine: '',
      availableQty: 0,
      transferQty: 0
    });
  }

  // getMedicine() {
  //   this.url.getMedicine().subscribe((res: any[]) => {
  //     this.allMedicines = res;
  //     console.log('All medicines:', this.allMedicines);
  //   });
  // }

  onTypeChange() {

    this.selectedMedicineId = null;
    this.availableQty = null;
    this.medicines = [];
    this.selectedMedicineName = '';
    this.isMedicineDropdownOpen = false;


    if (!this.medicine_type_id || !this.transferFromBranchId) {
      return;
    }

    const payload = {
      medicine_type_id: this.medicine_type_id,
      branch_id: this.transferFromBranchId
    };

    console.log('Calling Medicine API with:', payload);

    this.url.getMedicinesByBranchAndType(payload).subscribe({
      next: (res: any[]) => {

        console.log('Medicines By Branch & Type:', res);

        this.medicines = res;

      },
      error: (err) => {
        console.error('Medicine Load Error:', err);
        this.medicines = [];
      }
    });
  }


  // getMedicineInward() {
  //   this.url.getMedicineInward().subscribe((res: any[]) => {
  //     this.medicineInwards = res;
  //     console.log('Medicine Inwards:', this.medicineInwards);
  //   });
  // }

  onMedicineChange() {
    this.availableQty = null;
    this.batches = [];
    this.selectedBatchNo = '';
    this.selectedExpiryDate = '';

    if (!this.selectedMedicineId || !this.transferFromBranchId) {
      return;
    }

    const payload = {
      medicine_id: this.selectedMedicineId,
      branch_id: this.transferFromBranchId
    };

    this.url.getAvailableStockTransfer(payload).subscribe({
      next: (res: any) => {
        // Load the batches from the API response
        this.batches = res.batches || [];
        this.filteredBatches = [...this.batches];
        this.availableQty = 0; // Wait for user to select a batch
      },
      error: (err) => {
        this.batches = [];
        this.availableQty = 0;
      }
    });
  }

  addItem() {
    if (!this.medicine_type_id || !this.selectedMedicineId || !this.selectedBatchNo || !this.transferQty) {
      alert('Please select type, medicine, batch and quantity');
      return;
    }

    if (this.availableQty === null || this.transferQty > this.availableQty) {
      alert('Transfer quantity exceeds available stock');
      return;
    }

    const selectedType = this.medicineTypes.find(
      t => t.id === this.medicine_type_id
    );

    const selectedMedicine = this.medicines.find(
      m => m.id === this.selectedMedicineId
    );

    this.transferItems.push({
      medicine_type_id: this.medicine_type_id,
      medicine_id: this.selectedMedicineId,
      batch_no: this.selectedBatchNo,         // 👈 ADD
      expiry_date: this.selectedExpiryDate,   // 👈 ADD
      transfer_qty: this.transferQty,
      typeName: selectedType?.name,
      medicineName: selectedMedicine?.name,
      availableQty: this.availableQty
    });

    // RESET ENTRY ROW
    this.medicine_type_id = null;
    this.selectedMedicineId = null;
    this.selectedBatchNo = '';                // 👈 ADD
    this.selectedExpiryDate = '';             // 👈 ADD
    this.transferQty = null;
    this.availableQty = 0;
  }

  removeItem(index: number) {
    this.transferItems.splice(index, 1);
  }


  submitTransfer() {
    if (
      !this.transferDate ||
      !this.transferFromBranchId ||
      !this.transferToBranchId ||
      this.transferItems.length === 0
    ) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      transfer_date: this.transferDate,
      from_branch_id: this.transferFromBranchId,
      to_branch_id: this.transferToBranchId,
      items: this.transferItems
    };

    console.log('FINAL PAYLOAD 👉', payload);

    this.url.addStockTransfer(payload).subscribe({
      next: (res) => {
        alert('Stock transfer saved successfully');

        this.resetForm();

        // ✅ VERY IMPORTANT
        this.loadStockTransfers();
      },

      error: (err) => {
        console.error(err);
        alert('Something went wrong');
      }
    });
  }

  resetForm() {
    this.transferDate = '';
    this.transferFromBranchId = null;
    this.transferToBranchId = null;
    this.transferItems = [];
    this.medicine_type_id = null;
    this.selectedMedicineId = null;
    this.transferQty = null;
    this.availableQty = 0;
    this.selectedTransferFromName = '';
    this.isTransferFromDropdownOpen = false;
    this.selectedTransferToName = '';
    this.isTransferToDropdownOpen = false;
    this.selectedTypeName = '';
    this.isTypeDropdownOpen = false;
    this.selectedMedicineName = '';
    this.isMedicineDropdownOpen = false;


  }

  loadStockTransfers() {

    // ✅ Get logged-in user
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      this.toast.typeError('User not found');
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    console.log('User ID:', userId);

    this.url.getStockTransfers(userId).subscribe({
      next: (res: any) => {

        console.log('Raw Stock Transfer API:', res);

        // ✅ Handle both API response formats
        const transfers = Array.isArray(res) ? res : res.data;

        if (!transfers) {
          console.warn('No transfer data');
          return;
        }

        // ✅ Branches user is allowed to see
        const allowedBranchIds = this.branch.map((b: any) => b.id);
        console.log('Allowed Branches:', allowedBranchIds);

        // ✅ Filter branch-wise
        this.stockTransfers = transfers.filter((item: any) => {

          const fromId = item.from_branch?.id || item.from_branch_id;
          const toId = item.to_branch?.id || item.to_branch_id;

          return (
            allowedBranchIds.includes(fromId) ||
            allowedBranchIds.includes(toId)
          );
        });

        console.log('Filtered Transfers:', this.stockTransfers);

        // ✅ Init table
        this.filteredStockTransfers = [...this.stockTransfers];

        this.pageIndex = 0;
        this.updatePaginatedStockTransfers();
      },

      error: (err) => {
        console.error('Stock Transfer Load Error:', err);
        this.toast.typeError('Failed to load transfers');
      }
    });
  }

  openInfo(row: any) {
    this.selectedTransfer = row;
    console.log('Selected row:', row);
  }

  openInfoModal(transferId: number): void {
    this.selectedTransferId = transferId;
    this.stockTransferItems = [];

    this.url.getStockMedicineTransfers(transferId).subscribe({
      next: (res: any) => {
        // ✅ VERY IMPORTANT LINE
        this.stockTransferItems = res.items ?? [];
      },
      error: (err: any) => {
        console.error('Error loading transfer medicines', err);
      }
    });
  }

  openDeleteModal(id: number): void {
    this.deleteTransferId = id;
  }

  confirmDelete(): void {
    if (!this.deleteTransferId) return;

    this.url.deleteStockMedicineTransfers(this.deleteTransferId).subscribe({
      next: () => {
        // ✅ Success message
        alert('Stock transfer deleted successfully');

        // ✅ Refresh table
        this.loadStockTransfers();

        // ✅ Close modal manually
        const modalEl = document.getElementById('delete_modal');
        if (modalEl) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }

        // ✅ Reset ID
        this.deleteTransferId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete stock transfer');
      }
    });
  }

  onTransferQtyInput(event: any): void {
    let value = event.target.value;

    // Remove anything that is not a digit
    value = value.replace(/[^0-9]/g, '');

    // Remove leading zeros (optional professional touch)
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    this.transferQty = value ? Number(value) : null;
  }

  allowNumbersOnly(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  openEditTransferModal(row: any) {

    this.editTransferId = row.id;
    this.editTransferDate = row.transfer_date;

    this.editTransferFromBranchId = row.from_branch?.id;
    this.editTransferToBranchId = row.to_branch?.id;

    this.editSelectedTransferFromName = row.from_branch?.branch_name;
    this.editSelectedTransferToName = row.to_branch?.branch_name;

    // ✅ LOAD TYPES FOR EDIT MODAL
    this.loadEditMedicineTypes();

    this.url.getStockMedicineTransfers(row.id).subscribe((res: any) => {
      this.editTransferItems = res.items.map((item: any) => ({
        id: item.id,
        stock_transfer_id: item.stock_transfer_id,
        medicine_type_id: item.medicine_type_id,
        medicine_id: item.medicine_id,
        transfer_qty: item.transfer_qty,
        typeName: item.type?.name ?? '',
        medicineName: item.medicine?.name ?? '',
        availableQty: 0,
        batch_no: item.batch_no,                  // 👈 ADD
  expiry_date: item.expiry_date,
        old_transfer_qty: item.transfer_qty, // 🔥 VERY IMPORTANT
        filteredMedicines: [],
      }));

      // 🔥 NOW LOAD AVAILABLE STOCK FOR EACH ITEM
      this.editTransferItems.forEach((editItem) => {

        const payload = {
          medicine_id: editItem.medicine_id,
          branch_id: this.editTransferFromBranchId
        };

        this.url.getAvailableStockTransfer(payload).subscribe({
          next: (stockRes: any) => {

            const currentStock = stockRes?.available_stock ?? 0;

            // 🔥 ADD BACK OLD TRANSFER QTY
            editItem.availableQty = currentStock + editItem.old_transfer_qty;

          },
          error: () => {
            editItem.availableQty = editItem.old_transfer_qty;
          }
        });

      });
      const modalEl = document.getElementById('editTransferModal');
      if (modalEl) {
        const modal = new (window as any).bootstrap.Modal(modalEl);
        modal.show();
      }

    });
  }

  updateTransfer() {

    if (!this.editTransferId) return;

    // Validation
    for (let item of this.editTransferItems) {

      if (!item.transfer_qty || item.transfer_qty <= 0) {
        alert('Invalid transfer quantity');
        return;
      }

      if (item.transfer_qty > item.availableQty) {
        alert(`Transfer quantity exceeds available stock for ${item.medicineName}`);
        return;
      }
    }

    const payload = {
      transfer_date: this.editTransferDate,
      from_branch_id: this.editTransferFromBranchId,
      to_branch_id: this.editTransferToBranchId,
      items: this.editTransferItems.map(item => ({

        // ✅ If existing item, send id
        ...(item.id && { id: item.id }),

        stock_transfer_id: this.editTransferId,
        medicine_type_id: item.medicine_type_id,
        medicine_id: item.medicine_id,
        transfer_qty: item.transfer_qty,
        batch_no: item.batch_no,
        expiry_date: item.expiry_date

      }))
    };

    console.log('UPDATE PAYLOAD 👉', payload);

    this.url.updateStockTransfer(this.editTransferId, payload)
      .subscribe({
        next: (res: any) => {

          alert(res?.message || 'Transfer updated successfully');

          this.loadStockTransfers();

          const modalEl = document.getElementById('editTransferModal');
          if (modalEl) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
          }

        },
        error: (err) => {
          console.error(err);
          alert('Update failed');
        }
      });
  }
  /* ===============================
  EDIT TRANSFER DROPDOWNS
================================= */

  openEditTransferFromDropdown() {
    this.isEditTransferFromDropdownOpen = true;
    this.editTransferFromSearch = '';

    this.editFilteredTransferFromBranches = this.branch.filter(
      b => b.id !== this.editTransferToBranchId
    );
  }

  filterEditTransferFromBranches() {
    const search = this.editTransferFromSearch?.toLowerCase().trim();

    const baseList = this.branch.filter(
      b => b.id !== this.editTransferToBranchId
    );

    if (!search) {
      this.editFilteredTransferFromBranches = [...baseList];
      return;
    }

    this.editFilteredTransferFromBranches = baseList.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectEditTransferFromBranch(branch: any) {
    this.editTransferFromBranchId = branch.id;
    this.editSelectedTransferFromName = branch.branch_name;
    this.isEditTransferFromDropdownOpen = false;
  }


  /* ===============================
    EDIT TRANSFER TO
  ================================= */

  openEditTransferToDropdown() {
    this.isEditTransferToDropdownOpen = true;
    this.editTransferToSearch = '';

    // 🔥 Change this.branch to this.allBranches
    this.editFilteredTransferToBranches = this.allBranches.filter(
      b => b.id !== this.editTransferFromBranchId
    );
  }

  filterEditTransferToBranches() {
    const search = this.editTransferToSearch?.toLowerCase().trim();

    // 🔥 Change this.branch to this.allBranches
    const baseList = this.allBranches.filter(
      b => b.id !== this.editTransferFromBranchId
    );

    if (!search) {
      this.editFilteredTransferToBranches = [...baseList];
      return;
    }

    this.editFilteredTransferToBranches = baseList.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectEditTransferToBranch(branch: any) {
    this.editTransferToBranchId = branch.id;
    this.editSelectedTransferToName = branch.branch_name;
    this.isEditTransferToDropdownOpen = false;
  }


  /* ===============================
    REMOVE EDIT ITEM
  ================================= */

  removeEditItem(index: number) {
    this.editTransferItems.splice(index, 1);
  }

  addEditRow() {
    this.editTransferItems.push({
      medicine_type_id: null,
      medicine_id: null,
      typeName: '',
      medicineName: '',
      availableQty: 0,
      transfer_qty: 0,

      isTypeDropdownOpen: false,
      isMedicineDropdownOpen: false,

      typeSearch: '',
      medicineSearch: '',

      filteredTypes: [...this.medicineTypes],
      filteredMedicines: []
    });
  }

  openEditTypeDropdown(index: number) {
    this.editTransferItems[index].isTypeDropdownOpen = true;
    this.editTransferItems[index].filteredTypes = [...this.medicineTypes];
  }

  filterEditTypes(index: number) {
    const search = this.editTransferItems[index].typeSearch?.toLowerCase();

    this.editTransferItems[index].filteredTypes =
      this.medicineTypes.filter(t =>
        t.name.toLowerCase().includes(search)
      );
  }

  selectEditType(type: any, index: number) {

    const item = this.editTransferItems[index];

    item.medicine_type_id = type.id;
    item.typeName = type.name;
    item.isTypeDropdownOpen = false;

    // Reset medicine
    item.medicine_id = null;
    item.medicineName = '';
    item.availableQty = 0;

    if (!this.editTransferFromBranchId) return;

    const payload = {
      branch_id: this.editTransferFromBranchId,
      medicine_type_id: type.id
    };

    this.url.getMedicinesByBranchAndType(payload).subscribe({
      next: (res: any[]) => {
        item.filteredMedicines = res ?? [];
      },
      error: () => {
        item.filteredMedicines = [];
      }
    });
  }

  openEditMedicineDropdown(index: number) {
    const item = this.editTransferItems[index];

    item.isMedicineDropdownOpen = true;

    item.filteredMedicines =
      this.medicines.filter(m =>
        m.medicine_type_id === item.medicine_type_id
      );
  }

  filterEditMedicines(index: number) {
    const item = this.editTransferItems[index];
    const search = item.medicineSearch?.toLowerCase();

    item.filteredMedicines =
      this.medicines
        .filter(m => m.medicine_type_id === item.medicine_type_id)
        .filter(m =>
          m.name.toLowerCase().includes(search)
        );
  }

  selectEditMedicine(medicine: any, index: number) {

    const item = this.editTransferItems[index];

    item.medicine_id = medicine.id;
    item.medicineName = medicine.name;
    item.isMedicineDropdownOpen = false;

    if (!this.editTransferFromBranchId) return;

    const payload = {
      medicine_id: medicine.id,
      branch_id: this.editTransferFromBranchId
    };

    this.url.getAvailableStockTransfer(payload).subscribe({
      next: (res: any) => {
        item.availableQty = res?.available_stock ?? 0;
      },
      error: () => {
        item.availableQty = 0;
      }
    });
  }

  openEditNewTypeDropdown() {
    this.isEditNewTypeDropdownOpen = true;
    this.editNewTypeSearch = '';
  }

  filterEditNewTypes() {
    const search = this.editNewTypeSearch?.toLowerCase() || '';
    this.filteredMedicineTypes =
      this.medicineTypes.filter(t =>
        t.name.toLowerCase().includes(search)
      );
  }

  selectEditNewType(type: any) {
    this.editNewMedicineTypeId = type.id;
    this.editNewTypeName = type.name;
    this.isEditNewTypeDropdownOpen = false;

    // reset medicine
    this.editNewMedicineId = null;
    this.editNewMedicineName = '';
    this.editNewAvailableQty = null;

    // 🔥 LOAD MEDICINES FOR THIS TYPE
    this.onEditTypeChange(type.id);
  }

 openEditNewMedicineDropdown() {
    if (!this.editNewMedicineTypeId) return;

    this.isEditNewMedicineDropdownOpen = true;
    this.editNewMedicineSearch = ''; // Reset search text

    // 🐛 FIX: Do not filter by medicine_type_id here. 
    // The API already filtered it in onEditTypeChange()!
    this.editNewFilteredMedicines = [...this.medicines];
  }

  filterEditNewMedicines() {
    const search = this.editNewMedicineSearch?.toLowerCase() || '';

    // 🐛 FIX: Only filter by the medicine name
    this.editNewFilteredMedicines = this.medicines.filter(m => 
      m.name.toLowerCase().includes(search)
    );
  }

  selectEditNewMedicine(med: any) {
    this.editNewMedicineId = med.id;
    this.editNewMedicineName = med.name;
    this.isEditNewMedicineDropdownOpen = false;

    // 🔥 LOAD STOCK JUST LIKE MAIN PAGE
    this.onEditNewMedicineChange();
  }

  addNewEditItem() {

    if (!this.editNewMedicineTypeId || !this.editNewMedicineId || !this.editNewSelectedBatchNo || !this.editNewTransferQty) {
      alert('Please fill all fields, including batch');
      return;
    }

    if (this.editNewTransferQty > (this.editNewAvailableQty ?? 0)) {
      alert('Transfer qty exceeds available stock');
      return;
    }

    this.editTransferItems.push({
      medicine_type_id: this.editNewMedicineTypeId,
      medicine_id: this.editNewMedicineId,
      batch_no: this.editNewSelectedBatchNo,        // 👈 ADD
    expiry_date: this.editNewSelectedExpiryDate,  // 👈 ADD
      typeName: this.editNewTypeName,
      medicineName: this.editNewMedicineName,
      availableQty: this.editNewAvailableQty,
      transfer_qty: this.editNewTransferQty
    });

    // RESET NEW ROW
    this.editNewMedicineTypeId = null;
    this.editNewTypeName = '';
    this.editNewMedicineId = null;
    this.editNewMedicineName = '';
    this.editNewSelectedBatchNo = '';               // 👈 ADD
  this.editNewSelectedExpiryDate = '';            // 👈 ADD
    this.editNewAvailableQty = null;
    this.editNewTransferQty = null;
  }

  loadEditMedicineTypes() {

    if (!this.editTransferFromBranchId) {
      this.medicineTypes = [];
      return;
    }

    const payload = {
      branch_id: this.editTransferFromBranchId
    };

    this.url.getMedicineTypesByBranchTransfer(payload).subscribe({
      next: (res: any[]) => {
        this.medicineTypes = res ?? [];
        this.filteredMedicineTypes = [...this.medicineTypes]; // VERY IMPORTANT
      },
      error: () => {
        this.medicineTypes = [];
      }
    });
  }

  onEditTypeChange(selectedTypeId: number) {

    if (!this.editTransferFromBranchId || !selectedTypeId) {
      this.medicines = [];
      return;
    }

    const payload = {
      branch_id: this.editTransferFromBranchId,
      medicine_type_id: selectedTypeId
    };

    this.url.getMedicinesByBranchAndType(payload).subscribe({
      next: (res: any[]) => {
        this.medicines = res ?? [];
        this.editNewFilteredMedicines = [...this.medicines];
      },
      error: () => {
        this.medicines = [];
        this.editNewFilteredMedicines = [];
      }
    });
  }

  onEditNewMedicineChange() {
    if (!this.editNewMedicineId || !this.editTransferFromBranchId) {
      this.editNewAvailableQty = null;
      this.editNewBatches = [];
      this.editNewSelectedBatchNo = '';
      this.editNewSelectedExpiryDate = '';
      return;
    }

    const payload = {
      medicine_id: this.editNewMedicineId,
      branch_id: this.editTransferFromBranchId
    };

    this.url.getAvailableStockTransfer(payload).subscribe({
      next: (res: any) => {
        // Load batches for the edit modal
        this.editNewBatches = res.batches || [];
        this.editNewFilteredBatches = [...this.editNewBatches];
        this.editNewAvailableQty = 0;
      },
      error: () => {
        this.editNewAvailableQty = 0;
        this.editNewBatches = [];
      }
    });
  }

  updatePaginatedStockTransfers(): void {

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedStockTransfers =
      this.filteredStockTransfers.slice(start, end);
  }

  onStockPageChange(event: any): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePaginatedStockTransfers();
  }

  searchStockTransfers(event: any): void {

    const searchValue = event.target.value.toLowerCase();

    this.filteredStockTransfers = this.stockTransfers.filter(row =>
      row.from_branch?.branch_name?.toLowerCase().includes(searchValue) ||
      row.to_branch?.branch_name?.toLowerCase().includes(searchValue) ||
      row.transfer_date?.toLowerCase().includes(searchValue)
    );

    this.pageIndex = 0; // reset page
    this.updatePaginatedStockTransfers();
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
    let apiStock = batch.available_qty || 0;

    // Calculate already added quantity for this exact medicine AND batch
    const alreadyAddedQty = this.transferItems
      .filter(item => item.medicine_id === this.selectedMedicineId && item.batch_no === this.selectedBatchNo)
      .reduce((sum, item) => sum + item.transfer_qty, 0);

    // Final remaining stock
    this.availableQty = Math.max(0, apiStock - alreadyAddedQty);
  }

  // ================= BATCH DROPDOWN (EDIT NEW ROW) =================
  openEditNewBatchDropdown() {
    if (!this.editNewMedicineId) return;
    this.isEditNewBatchDropdownOpen = true;
    this.editNewBatchSearch = '';
    this.editNewFilteredBatches = [...this.editNewBatches];
  }

  filterEditNewBatches() {
    const search = this.editNewBatchSearch?.toLowerCase().trim();
    if (!search) {
      this.editNewFilteredBatches = [...this.editNewBatches];
      return;
    }
    this.editNewFilteredBatches = this.editNewBatches.filter(b =>
      b.batch_no.toLowerCase().includes(search)
    );
  }

  selectEditNewBatch(batch: any) {
    this.editNewSelectedBatchNo = batch.batch_no;
    this.editNewSelectedExpiryDate = batch.expiry_date;
    this.isEditNewBatchDropdownOpen = false;

    this.editNewAvailableQty = batch.available_qty || 0;
  }


}
