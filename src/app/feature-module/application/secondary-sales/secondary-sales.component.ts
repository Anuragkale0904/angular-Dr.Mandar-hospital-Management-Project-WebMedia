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
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-secondary-sales',
  templateUrl: './secondary-sales.component.html',
  styleUrls: ['./secondary-sales.component.scss'],
})
export class SecondarySalesComponent {

  @ViewChild('printSection') printSection!: ElementRef;

  // 🔹 Branch Dropdown Search
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranches: any[] = [];
  selectedBranchName: string = '';
  saleIdToDelete: number | null = null;

  selectedSaleForPrint: any = null;
  selectedSaleItems: any[] = [];



  public editcreditnotes: Array<editcreditnotes> = [];

  branches: any[] = [];
  saleHistoryList: any[] = [];
  selectedSale: any = null;
  selectedItems: any[] = [];
  saleItems: any[] = [];
  fromDate: string | null = null;
  toDate: string | null = null;

  // items:any[]=[];
  selectedBranchId: number | null = null;
  bsConfig: Partial<BsDatepickerConfig> | undefined;

  // 🔥 TABLE SEARCH + PAGINATION
  filteredSaleHistoryList: any[] = [];
  paginatedSaleHistoryList: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 5;


  dataSource!: MatTableDataSource<editcreditnotes>;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    const today = new Date();
    this.fromDate = today.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

    this.selectedBranchId = null;   // 🔥 force reset
    this.loadBranches();
    this.loadSaleHistory();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {

    const target = event.target as HTMLElement;

    if (target.closest('.dropdown')) return;

    this.isBranchDropdownOpen = false;
  }

  loadBranches(): void {
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

  loadSaleHistory() {

    // ✅ Get logged in user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;

    // ✅ Get user allowed branches
    const storedBranches = localStorage.getItem('userBranches');
    const userBranches = storedBranches ? JSON.parse(storedBranches) : [];
    const allowedBranchIds = userBranches.map((b: any) => b.id);

    // ✅ Call API with userId
    this.url.getSaleHistory(userId).subscribe({
      next: (res: any[]) => {

        // ✅ Branch filter
        this.saleHistoryList = res.filter((item: any) => {
          const branchId =
            item.branch?.id ||
            item.branch_id;

          return allowedBranchIds.includes(branchId);
        });

        // ✅ For table
        this.filteredSaleHistoryList = [...this.saleHistoryList];

        // ✅ Pagination reset
        this.pageIndex = 0;
        this.updatePaginatedSaleHistory();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  viewInfo(sale: any): void {

    this.selectedSale = null;
    this.saleItems = [];

    this.url.getItemsBySaleId(sale.id).subscribe({
      next: (res) => {
        this.selectedSale = res;        // full sale object
        this.saleItems = res.items || []; // items array
        console.log('Sale Details:', res);
      },
      error: (err) => {
        console.error('Error loading sale details', err);
      }
    });
  }

  editSale(id: number): void {
    this.router.navigate(
      ['super-admin/promotor-sales'],  // 🔥 your sale page route
      { queryParams: { editId: id } }
    );
  }

  deleteSale(id: number): void {

    this.saleIdToDelete = id;

    // Open Bootstrap modal manually
    const modalElement = document.getElementById('delete_modal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }

  }

  confirmDelete(): void {

    if (!this.saleIdToDelete) return;

    this.url.deleteSale(this.saleIdToDelete).subscribe({

      next: (res: any) => {

        this.toast.typeSuccess('Sale deleted successfully');

        // Close modal
        const modalElement = document.getElementById('delete_modal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }

        // Refresh list
        this.loadSaleHistory();

        this.saleIdToDelete = null;

      },

      error: (err: any) => {
        console.error('Delete Error:', err);
        this.toast.typeError('Failed to delete sale');
      }

    });

  }

  searchSaleHistory(): void {

    if (!this.selectedBranchId && !this.fromDate && !this.toDate) {
      this.toast.typeError('Please select Branch or Date range');
      return;
    }

    if ((this.fromDate && !this.toDate) || (!this.fromDate && this.toDate)) {
      this.toast.typeError('Please select both From Date and To Date');
      return;
    }

    const payload: any = {};

    if (this.selectedBranchId) payload.branch_id = this.selectedBranchId;
    if (this.fromDate && this.toDate) {
      payload.from_date = this.fromDate;
      payload.to_date = this.toDate;
    }

    console.log('Search Payload:', payload);

    this.url.searchHospitalBranchWise(payload).subscribe({
      next: (res: any[]) => {

        // ✅ Secure branch filtering
        const allowedBranchIds = this.branches.map((b: any) => b.id);

        this.saleHistoryList = res.filter((sale: any) => {
          const branchId = sale.branch?.id || sale.branch_id;
          return allowedBranchIds.includes(branchId);
        });

        this.filteredSaleHistoryList = [...this.saleHistoryList];

        this.pageIndex = 0;
        this.updatePaginatedSaleHistory();

        if (this.saleHistoryList.length === 0) {
          this.toast.typeWarning('No records found for your assigned branches');
        }
      },
      error: (err) => {
        console.error('Search error', err);
        this.toast.typeError('Failed to fetch sale history');
      }
    });
  }
  
  updatePaginatedSaleHistory(): void {

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedSaleHistoryList =
      this.filteredSaleHistoryList.slice(start, end);
  }

  onSalePageChange(event: any): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePaginatedSaleHistory();
  }

  searchTable(event: any): void {

    const searchValue = event.target.value.toLowerCase();

    this.filteredSaleHistoryList = this.saleHistoryList.filter(row =>
      row.bill_no?.toLowerCase().includes(searchValue) ||
      row.uhid?.toLowerCase().includes(searchValue) ||
      row.patient_name?.toLowerCase().includes(searchValue) ||
      row.grand_total?.toString().includes(searchValue)
    );

    this.pageIndex = 0;
    this.updatePaginatedSaleHistory();
  }
  printSale(sale: any) {

    this.url.getItemsBySaleId(sale.id).subscribe((res: any) => {

      this.selectedSale = res;
      this.selectedItems = res.items || [];

      this.cd.detectChanges();

      setTimeout(() => {

        const printContents = document.getElementById('printSection')?.innerHTML;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';

        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;

        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
          .map(style => style.outerHTML)
          .join('');

        const baseUrl = window.location.origin;

        iframeDoc?.open();
        iframeDoc?.write(`
    <html>
      <head>
        <base href="${baseUrl}/">
        <title>Print Bill</title>
        ${styles}
        <style>
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
        iframeDoc?.close();

        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);

      }, 500);

    });
  }
}
