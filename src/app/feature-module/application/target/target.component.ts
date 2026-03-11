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
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent {

  // 🔥 Custom Branch Dropdown
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranches: any[] = [];
  selectedBranchName: string = '';


  public routes = routes;
  branches: any[] = [];
  selectedBranchId: number | null = null;
  medicine_sale_id: number = 0;

  selectedTab: string = 'employee'; // default
  public productlist: Array<productlist> = [];
  billNo: string = '';

  saleData: any = null;
  saleItems: any[] = [];

  subTotal: number = 0;
  gstTotal: number = 0;
  grandTotal: number = 0;

  summary = {
    sub_total: 0,
    gst_total: 0,
    grand_total: 0
  };

  isEditMode: boolean = false;
  editReturnId: number | null = null;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit(): void {

    this.loadBranches();

    this.router.routerState.root.queryParams.subscribe(params => {

      if (params['editId']) {
        this.isEditMode = true;
        this.editReturnId = +params['editId'];
        setTimeout(() => {
          this.loadReturnForEdit(this.editReturnId!);
        }, 300);
      }
    });
  }

  // 🔥 This fixes the dropdown not closing and double-click issues
  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {
    const target = event.target as HTMLElement;
    // If the user clicks inside the dropdown, don't close it
    if (target.closest('.dropdown')) return;
    // If they click anywhere else on the screen, close it
    this.isBranchDropdownOpen = false;
  }


  loadBranches(): void {
    // Retrieve the user-specific branches saved during login
    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      this.branches = JSON.parse(storedBranches);
      this.filteredBranches = [...this.branches]; // 🔥 important
      this.selectedBranchId = null;
      console.log('Loaded user specific branches:', this.branches);
    } else {
      this.branches = [];
      this.filteredBranches = [];
      this.toast.typeError('No assigned branches found.');
    }
  }

  openBranchDropdown(): void {
    this.isBranchDropdownOpen = true;
    this.branchSearch = '';
    this.filteredBranches = [...this.branches];
  }

  filterBranches(): void {

    const search = this.branchSearch?.toLowerCase().trim();

    if (!search) {
      this.filteredBranches = [...this.branches];
      return;
    }

    this.filteredBranches = this.branches.filter(b =>
      b.branch_name.toLowerCase().includes(search)
    );
  }

  selectBranch(branch: any): void {

    this.selectedBranchId = branch.id;
    this.selectedBranchName = branch.branch_name;
    this.isBranchDropdownOpen = false;
  }


  loadReturnForEdit(id: number): void {

    this.url.getSaleReturnById(id).subscribe({

      next: (res: any) => {

        console.log('Edit Return Data:', res);

        // 🔹 Set Branch
        this.selectedBranchId = +res.branch_id;
        this.selectedBranchName = res.branch?.branch_name || '';

        // 🔹 Set Bill No
        this.billNo = res.sale?.bill_no || '';

        // 🔹 Store medicine_sale_id
        this.medicine_sale_id = +res.medicine_sale_id;

        // 🔹 Patch items
        this.saleItems = [];

        res.items.forEach((item: any) => {

          this.saleItems.push({
            id: item.medicine_sale_item_id,
            medicine_name: item.medicine_name,
            batch_no: item.batch_no,
            available_qty: item.sold_qty,
            quantity: +item.return_qty,
            expiry_date: item.expiry_date,
            mrp: +item.mrp,
            gst: +item.gst,
            total: +item.return_total
          });

        });

        // 🔹 Set totals
        this.subTotal = +res.sub_total;
        this.gstTotal = +res.gst_total;
        this.grandTotal = +res.grand_total;

      },

      error: (err) => {
        console.error('Error loading return', err);
        this.toast.typeError('Failed to load return data');
      }

    });

  }

  searchSale(): void {

    if (!this.selectedBranchId || !this.billNo) {
      this.toast.typeError('Please select branch and enter bill no');
      return;
    }

    const payload = {
      bill_no: this.billNo,
      branch_id: this.selectedBranchId
    };

    this.url.getSaleByBill(payload).subscribe({
      next: (res) => {

        this.saleData = res;

        console.log('Sale Data:', this.saleData);

        // ✅🔥 THIS LINE IS MISSING (VERY IMPORTANT)
        this.medicine_sale_id = res.id;
        // If backend returns medicine_sale_id instead of id:
        // this.medicine_sale_id = res.medicine_sale_id;

        console.log('Stored Medicine Sale ID:', this.medicine_sale_id);

        this.saleItems = [...res.items];

        this.calculateTotals();
      },
      error: () => {
        this.toast.typeError('Sale not found');
      }
    });
  }


  deleteRow(index: number): void {

    this.saleItems.splice(index, 1);

    this.calculateTotals();
  }

  calculateTotals(): void {

    this.subTotal = 0;
    this.gstTotal = 0;

    this.saleItems.forEach(item => {

      const base = item.mrp * item.quantity;
      const gstAmount = base * item.gst / 100;

      this.subTotal += base;
      this.gstTotal += gstAmount;
    });

    this.grandTotal = this.subTotal + this.gstTotal;

    // optional rounding
    this.subTotal = +this.subTotal.toFixed(2);
    this.gstTotal = +this.gstTotal.toFixed(2);
    this.grandTotal = +this.grandTotal.toFixed(2);
  }

  submitReturn(): void {

    if (this.saleItems.length === 0) {
      this.toast.typeError('No medicines selected for return');
      return;
    }

    if (!this.selectedBranchId || !this.medicine_sale_id) {
      this.toast.typeError('Branch or Sale reference missing');
      return;
    }

    // Prepare items array
    const items = this.saleItems.map(item => {
      return {
        medicine_sale_item_id: item.id,
        return_qty: item.quantity
      };
    });

    // 🔥 Prepare payload
    const payload = {
      branch_id: this.selectedBranchId,
      medicine_sale_id: this.medicine_sale_id,
      return_date: new Date().toISOString().split('T')[0],
      sub_total: this.subTotal,
      gst_total: this.gstTotal,
      grand_total: this.grandTotal,
      items: items
    };

    console.log('Final Return Payload:', payload);

    // ✅ ALWAYS CALL SUBMIT API (NO UPDATE)
    this.url.salesReturn(payload).subscribe({

      next: (res: any) => {

        console.log('Return Success:', res);
        this.toast.typeSuccess('Medicine return processed successfully');

        this.router.navigate(['/application/media-gallery']);

      },

      error: (err: any) => {
        console.error('Return Error:', err);
        this.toast.typeError('Failed to process return');
      }

    });

  }



}
