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
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent {

  branchSearchText: string = '';
  showBranchDropdown: boolean = false;
  filteredBranches: any[] = [];
  selectedBranchName: string = 'All Branches';


  public selectedValue!: string | number;
  public editcreditnotes: Array<editcreditnotes> = [];
  branches: any[] = [];
  selectedBranchId: any = ''
  reportList: any[] = [];

  // 🔥 Search + Pagination
  filteredReportList: any[] = [];
  paginatedReportList: any[] = [];
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
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.position-relative')) {
      this.showBranchDropdown = false;
    }
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

  filterBranches() {
    if (!this.branchSearchText) {
      this.filteredBranches = [...this.branches];
      return;
    }

    const search = this.branchSearchText.toLowerCase().trim();

    this.filteredBranches = this.branches.filter((branch: any) =>
      branch.branch_name?.toLowerCase().includes(search)
    );
  }

  toggleBranchDropdown() {
    this.showBranchDropdown = !this.showBranchDropdown;

    if (this.showBranchDropdown) {
      this.filteredBranches = [...this.branches];
      this.branchSearchText = '';
    }
  }


  selectBranch(id: number | null, name: string) {
    this.selectedBranchId = id;
    this.selectedBranchName = name;
    this.showBranchDropdown = false;
  }


  searchReport() {

    const payload: any = {};

    // Add branch if selected
    if (this.selectedBranchId) {
      payload.branch_id = Number(this.selectedBranchId);
    }

    // Add from date if selected
    if (this.fromDate) {
      payload.from_date = this.fromDate;
    }

    // Add to date if selected
    if (this.toDate) {
      payload.to_date = this.toDate;
    }

    // If nothing selected
    if (!payload.branch_id && !payload.from_date && !payload.to_date) {
      this.toast.typeError('Please select at least one filter');
      return;
    }

    console.log("Final Payload:", payload);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id;

    this.url.searchHospitalBranchWiseReport(payload, userId).subscribe({
      next: (res: any) => {

        if (res && res.length > 0) {
          // this.reportList = res || [];
          // this.filteredReportList = [...this.reportList];
          const allowedBranchIds = this.branches.map((b: any) => Number(b.id));

          const allReports = res || [];

          this.reportList = allReports.filter((item: any) => {
            const branchId = Number(item.branch_id || item.id); // ✅ FIX
            return allowedBranchIds.includes(branchId);
          });

          this.filteredReportList = [...this.reportList];
          this.pageIndex = 0;
          this.updatePaginatedReport();

          if (this.reportList.length === 0) {
            this.toast.typeWarning('No records found for your assigned branches');
          }
          this.pageIndex = 0;
          this.updatePaginatedReport();
        } else {
          this.reportList = [];
          this.filteredReportList = [];
          this.paginatedReportList = [];
        }
      },
      error: (err) => {
        console.error('Error loading report', err);
        this.reportList = [];
      }
    });
  }

  //PAGINATION METHODS

  updatePaginatedReport(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReportList = this.filteredReportList.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedReport();
  }

  //SEARCHING METHOD

  applySearch(): void {

    const value = this.searchText.toLowerCase().trim();

    if (!value) {
      this.filteredReportList = [...this.reportList];
    } else {
      this.filteredReportList = this.reportList.filter(item =>
        item.branch_name?.toLowerCase().includes(value) ||
        item.address?.toLowerCase().includes(value) ||
        item.contact_person_name?.toLowerCase().includes(value) ||
        item.mobile_no?.toString().includes(value)
      );
    }

    this.pageIndex = 0;
    this.updatePaginatedReport();
  }

  exportAsPDF() {

    if (!this.filteredReportList || this.filteredReportList.length === 0) {
      this.toast.typeError('No data available to export');
      return;
    }

    const doc = new jsPDF();

    // Table column headers
    const headers = [
      ['Sr.No', 'Branch/Hospital', 'Address', 'Contact Person', 'Mobile']
    ];

    // Table rows
    const data = this.filteredReportList.map((item, index) => [
      index + 1,
      item.branch_name || '',
      item.address || '',
      item.contact_person_name || '',
      item.mobile_no || ''
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [41, 128, 185]
      }
    });

    // Title
    doc.text('Hospital / Branch Wise Report', 14, 15);

    // Save file
    doc.save('Hospital_Branch_Wise_Report.pdf');
  }

  exportAsExcel() {

    if (!this.filteredReportList || this.filteredReportList.length === 0) {
      this.toast.typeError('No data available to export');
      return;
    }

    // Prepare data for Excel
    const excelData = this.filteredReportList.map((item, index) => ({
      'Sr.No': index + 1,
      'Branch/Hospital': item.branch_name || '',
      'Address': item.address || '',
      'Contact Person': item.contact_person_name || '',
      'Mobile': item.mobile_no || ''
    }));

    // Convert JSON to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Hospital Report': worksheet },
      SheetNames: ['Hospital Report']
    };

    // Generate Excel file buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    // Save file
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    FileSaver.saveAs(data, 'Hospital_Branch_Wise_Report.xlsx');
  }

}
