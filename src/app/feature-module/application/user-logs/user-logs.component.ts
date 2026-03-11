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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss'],
})
export class UserLogsComponent {

  // 🔹 Branch Dropdown Search
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranches: any[] = [];
  selectedBranchName: string = '';

  public selectedValue!: string | number;
  public editcreditnotes: Array<editcreditnotes> = [];
  branches: any[] = [];
  selectedBranchId: any = ''

  inventoryList: any[] = [];
  // 🔥 Search + Pagination
  filteredInventoryList: any[] = [];
  paginatedInventoryList: any[] = [];
  searchText: string = '';

  pageSize: number = 5;
  pageIndex: number = 0;

  fromDate: string = '';
  toDate: string = '';
  name = "branchSearch"


  dataSource!: MatTableDataSource<editcreditnotes>;


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

    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      this.branches = JSON.parse(storedBranches);
      this.filteredBranches = [...this.branches];

      console.log('User Assigned Branches:', this.branches);

    } else {
      this.branches = [];
      this.filteredBranches = [];
      this.toast.typeError('No assigned branches found. Please login again.');
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

  searchInventory() {

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id;

    // Validation
    if (!this.selectedBranchId && !this.fromDate && !this.toDate) {
      this.toast.typeWarning('Please select at least one filter');
      return;
    }

    const payload: any = {};

    if (this.selectedBranchId) {
      payload.branch_id = this.selectedBranchId;
    }

    if (this.fromDate) {
      payload.from_date = this.fromDate;
    }

    if (this.toDate) {
      payload.to_date = this.toDate;
    }

    console.log('Search Payload:', payload);

    this.url.searchInventoryReport(payload, userId).subscribe({
      next: (res: any) => {
        // this.inventoryList = res || [];
        // this.filteredInventoryList = [...this.inventoryList];
        const allowedBranchIds = this.branches.map((b: any) => b.id);

        const allInventory = res || [];

        this.inventoryList = allInventory.filter((item: any) => {
          const branchId = item.branch?.id || item.branch_id;
          return allowedBranchIds.includes(branchId);
        });

        this.filteredInventoryList = [...this.inventoryList];
        this.pageIndex = 0;
        this.updatePaginatedInventory();

        if (this.inventoryList.length === 0) {
          this.toast.typeWarning('No records found for your assigned branches');
        }
        this.pageIndex = 0;
        this.updatePaginatedInventory();
        console.log('Inventory Data:', res);
      },
      error: (err) => {
        this.inventoryList = [];
        this.filteredInventoryList = [];
        this.paginatedInventoryList = [];
        console.error('Search error:', err);
        this.toast.typeError('Something went wrong');
      }
    });
  }

  //PAGINATION PAGES
  updatePaginatedInventory(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedInventoryList =
      this.filteredInventoryList.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedInventory();
  }

  //SEARCHING METHOD
  applySearch(): void {
    const value = this.searchText.toLowerCase().trim();
    if (!value) {
      this.filteredInventoryList = [...this.inventoryList];
    } else {
      this.filteredInventoryList = this.inventoryList.filter(item =>
        item.medicine?.name?.toLowerCase().includes(value) ||
        item.type?.name?.toLowerCase().includes(value) ||
        item.batch_no?.toLowerCase().includes(value) ||
        item.expiry_date?.toString().includes(value) ||
        item.quantity?.toString().includes(value) ||
        item.mrp?.toString().includes(value) ||
        item.gst?.toString().includes(value)
      );
    }
    this.pageIndex = 0;
    this.updatePaginatedInventory();
  }

  exportInventoryPDF() {

    if (!this.filteredInventoryList || this.filteredInventoryList.length === 0) {
      this.toast.typeWarning('No data available to export');
      return;
    }

    const doc = new jsPDF('landscape'); // landscape is better for many columns

    // Title
    doc.setFontSize(14);
    doc.text('Inventory Report', 14, 15);

    // Filters Info
    doc.setFontSize(10);
    doc.text(`Branch: ${this.selectedBranchName || 'All'}`, 14, 22);
    doc.text(`From: ${this.fromDate}  To: ${this.toDate}`, 14, 28);

    // Table Headers
    const headers = [[
      'Sr.No',
      'Medicine',
      'Type',
      'Batch No',
      'Expiry Date',
      'Quantity',
      'MRP',
      'GST %'
    ]];

    // Table Data
    const data = this.filteredInventoryList.map((item, index) => [
      index + 1,
      item.medicine?.name || '',
      item.type?.name || '',
      item.batch_no || '',
      item.expiry_date
        ? new Date(item.expiry_date).toLocaleDateString('en-GB')
        : '',
      item.quantity || '',
      item.mrp || '',
      item.gst ? item.gst + '%' : ''
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 35,
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [41, 128, 185]
      }
    });

    doc.save('Inventory_Report.pdf');
  }

  exportInventoryExcel() {

    if (!this.filteredInventoryList || this.filteredInventoryList.length === 0) {
      this.toast.typeWarning('No data available to export');
      return;
    }

    // Prepare data
    const excelData = this.filteredInventoryList.map((item, index) => ({
      'Sr.No': index + 1,
      'Medicine': item.medicine?.name || '',
      'Type': item.type?.name || '',
      'Batch No': item.batch_no || '',
      'Expiry Date': item.expiry_date
        ? new Date(item.expiry_date).toLocaleDateString('en-GB')
        : '',
      'Quantity': item.quantity || '',
      'MRP': item.mrp || '',
      'GST %': item.gst ? item.gst + '%' : ''
    }));

    // Convert to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Inventory Report': worksheet },
      SheetNames: ['Inventory Report']
    };

    // Generate Excel buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    // Create Blob
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    // Save file
    FileSaver.saveAs(data, 'Inventory_Report.xlsx');
  }

}
