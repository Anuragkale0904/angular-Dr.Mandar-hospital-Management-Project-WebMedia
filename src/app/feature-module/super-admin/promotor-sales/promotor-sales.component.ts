import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { editcreditnotes } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


interface Batch {
  batch_no: string;
  available_qty?: number;
  expiry_date?: string;
  mrp?: number;
  gst?: number;
}

@Component({
  selector: 'app-promotor-sales',
  templateUrl: './promotor-sales.component.html',
  styleUrls: ['./promotor-sales.component.scss'],
})
export class PromotorSalesComponent implements OnInit {

  // 🔹 BRANCH DROPDOWN VARIABLES
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranches: any[] = [];
  selectedBranchName: string = '';

  branches: any[] = [];
  //medicineInwards: any[] = [];
  medicines: any[] = [];
  filteredMedicines: any[] = [];
  showDropdown: boolean = false;
  items: any[] = [];
  searchMedicine = '';
  discount_percent: number = 0;
  discount_amount: number = 0;
  billCounter = 1;
  lastBillMonthYear = '';
  bill_date: string = '';


  medicineSale: any = {
    bill_no: '',
    branch_id: null,
    bill_date: '',
    uhid: '',
    patient_name: '',
    gender_age: '',
    mobile_no: '',
    city: '',
    sub_total: 0,
    discount_type: 'percent',
    discount_value: 0,
    gst_total: 0,
    grand_total: 0,
    payment_mode: 'ONLINE',
    cash_received: 0,
    remaining: 0,
    items: []
  };

  isEditMode: boolean = false;
  editSaleId: number | null = null;

  availableBatches: any[] = [];
  selectedRow: any;
  createEmptyRow() {
    return {
      medicine_id: null as number | null,
      medicine_name: '',
      batch_no: '',
      available_qty: 0,
      quantity: 0,
      expiry_date: '',
      mrp: 0,
      gst: 0,
      base_price: 0,
      total: 0,

      availableBatches: [] as Batch[],
      filteredBatches: [] as Batch[],

      // 🔹 Medicine Dropdown
      medicineSearch: '',
      searchMedicine: '',
      filteredMedicines: [],
      isMedicineDropdownOpen: false,

      // 🔹 Batch Dropdown
      batchSearch: '',
      searchBatch: '',
      isBatchDropdownOpen: false
    };
  }




  addItem(row: any) {
    this.items.push({
      medicine_name: row.medicine_name,
      batch_no: row.batch_no,
      expiry_date: row.expiry_date,
      available_qty: row.available_qty,
      quantity: row.quantity,
      mrp: row.mrp,
      gst: row.gst,
      total: row.total
    });

    this.calculateTotals();
  }



  public selectedValue!: string | number;
  public editcreditnotes: Array<editcreditnotes> = [];

  bsConfig?: Partial<BsDatepickerConfig>;

  public routes = routes;
  public Toggledata = false;
  dataSource!: MatTableDataSource<editcreditnotes>;
  public searchDataValue = '';

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.loadBranches();

    this.route.queryParams.subscribe(params => {

      if (params['editId']) {
        this.isEditMode = true;
        this.editSaleId = +params['editId'];

        // Wait little to ensure branches loaded
        setTimeout(() => {
          this.loadSaleForEdit(this.editSaleId!);
        }, 300);

      } else {

        const today = new Date();
        this.medicineSale.bill_date = today.toISOString().split('T')[0];

        this.generateBillNo();
        this.items.push(this.createEmptyRow());
      }

    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {

    const target = event.target as HTMLElement;

    if (target.closest('.dropdown')) return;

    this.isBranchDropdownOpen = false;

    this.items.forEach(r => {
      r.isMedicineDropdownOpen = false;
      r.isBatchDropdownOpen = false;
    });
  }

  loadSaleForEdit(id: number): void {

    this.url.getItemsBySaleId(id).subscribe({

      next: (res: any) => {

        console.log('Edit Sale Data:', res);

        // 🔹 Assign header fields first
        this.medicineSale = {
          ...this.medicineSale,
          bill_no: res.bill_no,
          branch_id: +res.branch_id,
          bill_date: res.bill_date,
          uhid: res.uhid,
          patient_name: res.patient_name,
          gender_age: res.gender_age,
          mobile_no: res.mobile_no,
          city: res.city,
          sub_total: +res.sub_total,
          discount_type: res.discount_type,
          discount_value: +res.discount_value,
          gst_total: +res.gst_total,
          grand_total: +res.grand_total,
          payment_mode: res.payment_mode,
          cash_received: +res.cash_received,
          remaining: +res.remaining
        };

        // 🔹 Set branch name manually
        const selectedBranch = this.branches.find(
          b => b.id == res.branch_id
        );

        if (selectedBranch) {
          this.selectedBranchName = selectedBranch.branch_name;
        }

        // 🔥 VERY IMPORTANT
        // Load branch medicines first
        const payload = { branch_id: res.branch_id };

        this.url.getBranchMedicines(payload).subscribe({

          next: (medRes: any[]) => {

            this.medicines = medRes;

            // Now patch items AFTER medicines loaded
            this.items = [];

            res.items.forEach((item: any) => {

              const row = this.createEmptyRow();

              row.medicine_id = item.medicine_id;
              row.medicine_name = item.medicine_name;
              row.searchMedicine = item.medicine_name;

              row.batch_no = item.batch_no;
              row.searchBatch = item.batch_no;

              row.available_qty = item.available_qty;
              row.quantity = +item.quantity;
              row.expiry_date = item.expiry_date;
              row.mrp = +item.mrp;
              row.gst = +item.gst;
              row.base_price = +item.mrp;
              row.total = +item.total;

              this.items.push(row);
            });

            // Add empty input row at top
            this.items.unshift(this.createEmptyRow());

          },

          error: (err) => {
            console.error('Error loading branch medicines', err);
          }

        });

        // 🔹 Discount handling
        if (res.discount_type === 'percent') {
          this.discount_percent = +res.discount_value;
          this.discount_amount = 0;
        } else {
          this.discount_amount = +res.discount_value;
          this.discount_percent = 0;
        }

      },

      error: (err) => {
        console.error('Error loading sale', err);
        this.toast.typeError('Failed to load sale data');
      }

    });
  }
  openBranchDropdown() {
    this.isBranchDropdownOpen = true;
    this.branchSearch = '';
    this.filteredBranches = [...this.branches];
  }

  filterBranches() {
    const search = this.branchSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredBranches = [...this.branches];
      return;
    }

    this.filteredBranches = this.branches.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectBranch(branch: any) {
    this.medicineSale.branch_id = branch.id;
    this.selectedBranchName = branch.branch_name;
    this.isBranchDropdownOpen = false;

    this.onBranchChange(); // 🔥 load branch-specific medicines
  }

  generateBillNo(): void {

    const prefix = 'MS';
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    const monthYear = `${month}${year}`;

    this.url.getNextBillNumber().subscribe({
      next: (res: any) => {

        if (res.status) {

          const counter = String(res.bill_no).padStart(3, '0');

          this.medicineSale.bill_no = `${prefix}/${monthYear}/${counter}`;
        }

      },
      error: (err: any) => {
        console.error('Failed to fetch bill number', err);
        this.toast.typeError('Unable to generate bill number');
      }
    });
  }


  loadBranches(): void {
    // Retrieve the user-specific branches saved during login
    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      this.branches = JSON.parse(storedBranches);
      console.log('Loaded user specific branches:', this.branches);
    } else {
      this.branches = [];
      this.toast.typeError('No assigned branches found.');
    }
  }

  onBranchChange(): void {

    const branchId = this.medicineSale.branch_id;

    if (!branchId) {
      this.medicines = [];
      return;
    }

    const payload = {
      branch_id: branchId
    };

    console.log('Calling Branch Medicines API:', payload);

    this.url.getBranchMedicines(payload).subscribe({
      next: (res: any[]) => {

        console.log('Branch Medicines:', res);

        this.medicines = res;

        // Reset table rows
        this.items = [];
        this.items.push(this.createEmptyRow());

      },
      error: (err) => {
        console.error('Branch Medicines Error:', err);
        this.medicines = [];
      }
    });
  }

  onDiscountTypeChange(): void {

    if (this.medicineSale.discount_type === 'percent') {
      this.discount_amount = 0;
    } else {
      this.discount_percent = 0;
    }

    this.calculateTotals();
  }
  openMedicineDropdown(row: any) {

    if (!this.medicines.length) return;

    // Close all rows first
    this.items.forEach(r => r.isMedicineDropdownOpen = false);

    row.isMedicineDropdownOpen = true;
    row.medicineSearch = '';
    row.filteredMedicines = [...this.medicines];
  }

  filterMedicines(row: any) {

    const search = row.medicineSearch?.toLowerCase().trim();

    if (!search) {
      row.filteredMedicines = [...this.medicines];
      return;
    }

    row.filteredMedicines = this.medicines.filter(m =>
      m.name.toLowerCase().includes(search)
    );
  }



  selectMedicine(med: any, row: any) {
    row.searchMedicine = med.name;
    row.medicine_id = med.id;
    row.medicine_name = med.name;
    row.isMedicineDropdownOpen = false;

    // Clear previously selected batch & fields so old data doesn't linger
    row.batch_no = '';
    row.searchBatch = '';
    row.available_qty = 0;
    row.quantity = 0;
    row.expiry_date = '';
    row.mrp = 0;
    row.gst = 0;
    row.base_price = 0;
    row.total = 0;

    const payload = {
      branch_id: this.medicineSale.branch_id,
      medicine_id: med.id
    };

    this.url.getMedicineDetails(payload).subscribe((res: any) => {
      // ✅ FIX: Safely extract the 'batches' array from the response object
      const batches = res.batches && Array.isArray(res.batches) ? res.batches : [];

      row.availableBatches = batches;
      row.filteredBatches = [...row.availableBatches];

      // Optional UX improvement: If there is only 1 batch available, auto-select it
      if (row.availableBatches.length === 1) {
        this.selectBatch(row.availableBatches[0], row);
      }
    });
  }

  openBatchDropdown(row: any) {

    if (!row.availableBatches?.length) return;

    // Close other dropdowns
    this.items.forEach(r => r.isBatchDropdownOpen = false);

    row.isBatchDropdownOpen = true;
    row.batchSearch = '';
    row.filteredBatches = [...row.availableBatches];
  }

  filterBatches(row: any) {

    const search = row.batchSearch?.toLowerCase().trim();

    if (!search) {
      row.filteredBatches = [...row.availableBatches];
      return;
    }

    row.filteredBatches = row.availableBatches.filter((b: Batch) =>
      b.batch_no.toLowerCase().includes(search)
    );
  }


  selectBatch(batch: any, row: any) {
    // Set the selected batch details
    row.batch_no = batch.batch_no;
    row.searchBatch = batch.batch_no;
    row.isBatchDropdownOpen = false;

    // ✅ FIX: Use batch.quantity to get the stock limit for this specific batch, 
    // and map it to row.available_qty.
    row.available_qty = batch.quantity || batch.available_qty || 0;
    row.expiry_date = batch.expiry_date || '';
    row.mrp = +(batch.mrp || 0);
    row.gst = +(batch.gst || 0);
    row.base_price = +(batch.mrp || 0);

    // Note: We are intentionally NOT touching row.quantity here, 
    // so the user still has to input the sale quantity manually.

    // Recalculate the row total just in case
    this.calculateRowTotal(row);
  }


  calculateRowTotal(row: any): void {

    // Reset if empty
    if (!row.quantity || !row.mrp) {
      row.total = 0;
      return;
    }

    // 🔒 Prevent negative values
    if (row.quantity < 0) {
      row.quantity = 0;
      row.total = 0;
      return;
    }

    // 🔒 Stock validation
    if (row.available_qty && row.quantity > row.available_qty) {
      this.toast.typeError('Quantity exceeds available stock');
      row.quantity = row.available_qty;   // auto-adjust to max stock
    }

    // Ensure numeric values
    row.quantity = +row.quantity;
    row.mrp = +row.mrp;
    row.gst = +row.gst || 0;

    // ✅ Base price (important for submit payload)
    row.base_price = row.mrp;

    // ✅ Row Total (WITHOUT GST – GST calculated separately)
    row.total = +(row.quantity * row.mrp).toFixed(2);

    // Recalculate overall totals
    this.calculateTotals();
  }


  calculateTotals(): void {

    let taxableTotal = 0;
    let discountAmount = 0;
    let gstTotal = 0;

    // 1️⃣ TAXABLE TOTAL
    this.items.forEach(r => {
      if (!r.quantity || !r.mrp) return;
      taxableTotal += (+r.quantity * +r.mrp);
    });

    // 🔒 Convert to number safely
    const percent = +this.discount_percent || 0;
    const amount = +this.discount_amount || 0;

    // 2️⃣ DISCOUNT CALCULATION
    if (this.medicineSale.discount_type === 'percent') {

      discountAmount = (taxableTotal * percent) / 100;

      // ✅ AUTO CALCULATE ₹
      this.discount_amount = +discountAmount.toFixed(2);

    } else {

      discountAmount = amount;

      // 🔒 Prevent discount > subtotal
      if (discountAmount > taxableTotal) {
        discountAmount = taxableTotal;
        this.discount_amount = taxableTotal;
        this.toast.typeError('Discount cannot exceed Sub Total');
      }

      // ✅ AUTO CALCULATE %
      if (taxableTotal > 0) {
        this.discount_percent = +((discountAmount / taxableTotal) * 100).toFixed(2);
      } else {
        this.discount_percent = 0;
      }
    }
    const netTaxable = taxableTotal - discountAmount;

    // 3️⃣ GST CALCULATION (AFTER DISCOUNT)
    if (taxableTotal > 0) {

      this.items.forEach(r => {

        if (!r.quantity || !r.mrp || !r.gst) return;

        const rowBase = +r.quantity * +r.mrp;

        const rowDiscount = (rowBase / taxableTotal) * discountAmount;
        const discountedBase = rowBase - rowDiscount;

        const rowGST = (discountedBase * +r.gst) / 100;
        gstTotal += rowGST;

      });

    }

    // 4️⃣ GRAND TOTAL
    const grandTotal = netTaxable + gstTotal;

    // 5️⃣ ASSIGN VALUES
    this.medicineSale.sub_total = +taxableTotal.toFixed(2);
    this.medicineSale.discount_value = +discountAmount.toFixed(2);
    this.medicineSale.gst_total = +gstTotal.toFixed(2);
    this.medicineSale.grand_total = +grandTotal.toFixed(2);

    // 🔥 DO NOT RESET CASH RECEIVED HERE
    this.onCashReceivedChange();
  }

  onCashReceivedChange(): void {

    const grandTotal = this.medicineSale.grand_total || 0;
    let cash = this.medicineSale.cash_received || 0;

    if (cash > grandTotal) {
      this.toast.typeError('Cash received cannot be greater than Grand Total');
      cash = grandTotal;
    }

    this.medicineSale.cash_received = cash;
    this.medicineSale.remaining = +(grandTotal - cash).toFixed(2);
  }


  /* KEY FIX: delay close so click works */
  closeDropdown(row: any): void {
    setTimeout(() => row.showDropdown = false, 200);
  }

  submitSale(): void {

    console.log('Submitting sale...', this.medicineSale);

    if (!this.medicineSale.branch_id) {
      this.toast.typeError('Please select branch');
      return;
    }

    // 🐛 FIX: Slice the array to ignore the input row at index 0
    const actualAddedItems = this.items.slice(1);

    // 🐛 FIX: Show toast if the user hasn't clicked the Add (+) button
    if (actualAddedItems.length === 0) {
      this.toast.typeError('Please add at least one medicine item to the bill');
      return;
    }

    const saleItems = actualAddedItems
      .filter(i => i.medicine_id && i.quantity)
      .map(i => {

        const baseTotal = i.base_price * i.quantity;
        const gstAmount = +(baseTotal * i.gst / 100).toFixed(2);

        return {
          medicine_id: i.medicine_id,
          medicine_name: i.medicine_name,
          batch_no: i.batch_no,
          expiry_date: i.expiry_date,
          available_qty: i.available_qty,
          quantity: i.quantity,
          mrp: i.mrp,
          base_price: i.base_price,
          gst: i.gst,
          gst_amount: gstAmount,
          total: +(baseTotal + gstAmount).toFixed(2)
        };
      });

    // Final safety check just in case added items had invalid quantities
    if (saleItems.length === 0) {
      this.toast.typeError('Please ensure added medicines have a valid quantity');
      return;
    }

    const payload = {
      ...this.medicineSale,
      items: saleItems
    };

    // 🔥 IMPORTANT PART
    if (this.isEditMode && this.editSaleId) {

      payload['id'] = this.editSaleId;

      this.url.addMedicineSale(payload).subscribe({
        next: (res) => {
          this.toast.typeSuccess('Sale updated successfully');
          this.router.navigate(['application/secondary-sales']);
        },
        error: (err) => {
          console.error(err);
          this.toast.typeError('Failed to update sale');
        }
      });

    } else {

      this.url.addMedicineSale(payload).subscribe({
        next: (res) => {
          this.toast.typeSuccess('Medicine sale saved successfully');
          this.resetForm();
          this.router.navigate(['application/secondary-sales']);
          this.generateBillNo();
        },
        error: (err) => {
          console.error(err);
          this.toast.typeError('Failed to save medicine sale');
        }
      });

    }
  }

  resetForm(): void {

    this.medicineSale = {
      bill_no: '',  // keep empty, will regenerate
      branch_id: null,
      bill_date: '',
      uhid: '',
      patient_name: '',
      gender_age: '',
      mobile_no: '',
      city: '',
      sub_total: 0,
      discount_type: 'percent',
      discount_value: 0,
      gst_total: 0,
      grand_total: 0,
      payment_mode: 'ONLINE',
      cash_received: 0,
      remaining: 0,
      items: []
    };

    this.items = [];
    this.items.push(this.createEmptyRow());
  }

  addRowFromInput(): void {
    const inputRow = this.items[0];

    // basic validation
    if (!inputRow.medicine_id || !inputRow.quantity) {
      this.toast.typeError('Please complete the row before adding');
      return;
    }

    // push filled row DOWN (clone)
    this.items.push({ ...inputRow });

    // reset input row (keep it at top)
    this.items[0] = this.createEmptyRow();

    this.calculateTotals();
  }

  removeRow(index: number): void {
    if (index === 0) return; // never delete input row
    this.items.splice(index, 1);
    this.calculateTotals();
  }




}
