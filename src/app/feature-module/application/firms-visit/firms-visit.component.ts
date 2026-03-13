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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-firms-visit',
  templateUrl: './firms-visit.component.html',
  styleUrls: ['./firms-visit.component.scss'],
})
export class FirmsVisitComponent {

  // 🔹 Branch Dropdown Search
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranches: any[] = [];
  selectedBranchName: string = '';
  selectedBranchId: number | null = null;

  public routes = routes;
  public productlist: Array<productlist> = [];
  branches: any[] = [];
  // selectedBranchId: any = ''

  stockList: any[] = [];
  // 🔥 Search + Pagination
  filteredStockList: any[] = [];
  paginatedStockList: any[] = [];
  searchText: string = '';

  pageSize: number = 5;
  pageIndex: number = 0;
  fromDate: any = '';
  toDate: any = '';


  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    this.fromDate = today.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

    this.loadBranches();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.dropdown')) return;
    this.isBranchDropdownOpen = false;
  }

  loadBranches() {
    // ✅ Same as other pages
    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      this.branches = JSON.parse(storedBranches);
      this.filteredBranches = [...this.branches];

      console.log('Loaded user branches:', this.branches);

      // ✅ Auto-select if only one branch
      if (this.branches.length === 1) {
        this.selectBranch(this.branches[0]);
      }

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


  searchStock() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id;

    if (!userId) {
      this.toast.typeError('User not found. Please login again.');
      return;
    }

    let payload: any = {
      user_id: userId
    };

    if (this.selectedBranchId) payload.branch_id = this.selectedBranchId;
    if (this.fromDate) payload.from_date = this.fromDate;
    if (this.toDate) payload.to_date = this.toDate;

    if (!payload.branch_id && !payload.from_date && !payload.to_date) {
      this.toast.typeError('Please select at least one filter');
      return;
    }

    // ✅ FIXED ORDER
    this.url.searchAvailableStock(userId, payload).subscribe({
      next: (res) => {
        this.stockList = res?.data || [];
        this.filteredStockList = [...this.stockList];
        this.pageIndex = 0;
        this.updatePaginatedStock();
      },
      error: (err) => {
        this.stockList = [];
        this.filteredStockList = [];
        this.paginatedStockList = [];
        console.error('Search Error', err);
        this.toast.typeError('Something went wrong');
      }
    });
  }

  //PAGINATION METHODS
  updatePaginatedStock(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStockList =
      this.filteredStockList.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedStock();
  }

  //SEARCHING METHOD
  applySearch(): void {
    const value = this.searchText.toLowerCase().trim();
    if (!value) {
      this.filteredStockList = [...this.stockList];
    } else {
      this.filteredStockList = this.stockList.filter(item =>
        item.medicine_name?.toLowerCase().includes(value) ||
        item.batch_no?.toLowerCase().includes(value) ||      // 👈 ADD THIS LINE
        item.inward_qty?.toString().includes(value) ||
        item.available_qty?.toString().includes(value) ||
        item.amount?.toString().includes(value)
      );
    }
    this.pageIndex = 0;
    this.updatePaginatedStock();
  }

  exportStockPDF() {
    if (!this.filteredStockList || this.filteredStockList.length === 0) {
      this.toast.typeWarning('No data available to export');
      return;
    }

    const doc = new jsPDF('landscape');

    // Title & Filter Details...
    doc.setFontSize(14);
    doc.text('Available Stock Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Branch: ${this.selectedBranchName || 'All'}`, 14, 22);
    doc.text(`From: ${this.fromDate}  To: ${this.toDate}`, 14, 28);

    // 👈 UPDATE HEADERS
    const headers = [[
      'Sr.No',
      'Medicine',
      'Batch No',
      'Available Qty',
      'Amount'
    ]];

    // 👈 UPDATE DATA MAPPING
    const data = this.filteredStockList.map((item, index) => [
      index + 1,
      item.medicine_name || '',
      item.batch_no || '',
      item.available_qty || '',
      item.amount || ''
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 35,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('Available_Stock_Report.pdf');
  }

  exportStockExcel() {
    if (!this.filteredStockList || this.filteredStockList.length === 0) {
      this.toast.typeWarning('No data available to export');
      return;
    }

    // 👈 UPDATE EXCEL DATA MAPPING
    const excelData = this.filteredStockList.map((item, index) => ({
      'Sr.No': index + 1,
      'Medicine': item.medicine_name || '',
      'Batch No': item.batch_no || '',
      'Available Qty': item.available_qty || '',
      'Amount': item.amount || ''
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Available Stock Report': worksheet },
      SheetNames: ['Available Stock Report']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    FileSaver.saveAs(data, 'Available_Stock_Report.xlsx');
  }

}
