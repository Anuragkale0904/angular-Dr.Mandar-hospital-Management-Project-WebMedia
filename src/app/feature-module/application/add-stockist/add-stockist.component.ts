import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, editcreditnotes } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-add-stockist',
  templateUrl: './add-stockist.component.html',
  styleUrls: ['./add-stockist.component.scss'],
})
export class AddStockistComponent {

  // 🔥 Custom Branch Dropdown
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranches: any[] = [];
  selectedBranchName: string = '';
  public selectedValue!: string | number;
  public editcreditnotes: Array<editcreditnotes> = [];
  branches: any[] = [];
  selectedBranchId: any = '';
  fromDate: string = '';
  toDate: string = '';
  summary: any = {
    total: 0,
    cash: 0,
    credit: 0,
    online: 0,
    discount: 0
  };

  salesData: any[] = [];
  // 🔥 Pagination + Search
  filteredSalesData: any[] = [];
  paginatedSalesData: any[] = [];
  searchText: string = '';
  pageSize: number = 5;
  pageIndex: number = 0;
  bsConfig: Partial<BsDatepickerConfig> | undefined;
  dataSource!: MatTableDataSource<editcreditnotes>;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    this.fromDate = today.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

    this.loadBranches();

    // ⏳ Small delay ensures branches loaded first
    setTimeout(() => {
      this.loadTotalCollection();
    }, 100);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.dropdown')) return;
    this.isBranchDropdownOpen = false;
  }


  loadBranches() {
    // Retrieve the user-specific branches saved during login
    const storedBranches = localStorage.getItem('userBranches');
    if (storedBranches) {
      this.branches = JSON.parse(storedBranches);
      this.filteredBranches = [...this.branches]; // 🔥 important
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

  searchCollection() {

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id;

    if (!userId) {
      this.toast.typeError('User not found. Please login again.');
      return;
    }

    if (!this.selectedBranchId && !this.fromDate && !this.toDate) {
      this.toast.typeError('Please select at least one filter');
      return;
    }

    if ((this.fromDate && !this.toDate) || (!this.fromDate && this.toDate)) {
      this.toast.typeError('Please select both From and To date');
      return;
    }

    const payload: any = {};

    if (this.selectedBranchId) payload.branch_id = this.selectedBranchId;
    if (this.fromDate && this.toDate) {
      payload.from_date = this.fromDate;
      payload.to_date = this.toDate;
    }

    // ✅ FIXED: Pass userId
    this.url.searchTotalCollection(userId, payload).subscribe({
      next: (res: any) => {
        if (res.status) {

          // 🔐 Branch security filter
          const allowedBranchIds = this.branches.map((b: any) => Number(b.id));
          const allData = res?.data || [];

          this.salesData = allData.filter((sale: any) => {
            const branchId = Number(sale.branch?.id || sale.branch_id);
            return allowedBranchIds.includes(branchId);
          });

          this.summary = res.summary || {};
          this.filteredSalesData = [...this.salesData];
          this.pageIndex = 0;
          this.updatePaginatedSales();

          if (this.salesData.length === 0) {
            this.toast.typeWarning('No records found for your assigned branches');
          }

        } else {
          this.summary = null;
          this.salesData = [];
          this.filteredSalesData = [];
          this.paginatedSalesData = [];
        }
      },
      error: () => {
        this.toast.typeError('Failed to fetch data');
      }
    });
  }

  loadTotalCollection(): void {

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id;

    if (!userId) {
      this.toast.typeError('User not found. Please login again.');
      return;
    }

    this.url.getTotalCollection(userId).subscribe({
      next: (res: any) => {
        if (res.status) {

          // 🔐 Get user's allowed branches
          const allowedBranchIds = this.branches.map((b: any) => Number(b.id));

          const allData = res.data || [];

          // 🔒 Branch-wise security filter
          this.salesData = allData.filter((sale: any) => {
            const branchId = Number(sale.branch?.id || sale.branch_id);
            return allowedBranchIds.includes(branchId);
          });

          // ✅ Bind summary + table
          this.summary = res.summary || {};
          this.filteredSalesData = [...this.salesData];
          this.pageIndex = 0;
          this.updatePaginatedSales();

          console.log('Filtered Total Collection:', this.salesData);

          if (this.salesData.length === 0) {
            this.toast.typeWarning('No records found for your assigned branches');
          }

        } else {
          this.salesData = [];
          this.filteredSalesData = [];
          this.summary = null;
        }
      },
      error: (err) => {
        console.error('Error loading total collection', err);
        this.toast.typeError('Failed to load total collection');
      }
    });
  }

  updatePaginatedSales(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSalesData = this.filteredSalesData.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedSales();
  }

  applySearch(): void {
    const value = this.searchText.toLowerCase().trim();
    if (!value) {
      this.filteredSalesData = [...this.salesData];
    } else {
      this.filteredSalesData = this.salesData.filter(sale =>
        sale.bill_no?.toString().toLowerCase().includes(value) ||
        sale.patient_name?.toLowerCase().includes(value) ||
        sale.grand_total?.toString().includes(value)
      );
    }
    this.pageIndex = 0;
    this.updatePaginatedSales();
  }



}
