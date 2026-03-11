import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, productlist, editcreditnotes, customers } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-calender-holiday',
  templateUrl: './calender-holiday.component.html',
  styleUrls: ['./calender-holiday.component.scss'],
})
export class CalenderHolidayComponent {


  receivedList: any[] = [];
  receivedItems: any[] = [];
  selectedIssueId!: number;
  // 🔥 Pagination Variables
  filteredReceivedList: any[] = [];
  paginatedReceivedList: any[] = [];

  branch: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 5;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }


  ngOnInit(): void {

    const storedBranches = localStorage.getItem('userBranches');

    if (storedBranches) {
      this.branch = JSON.parse(storedBranches);
    } else {
      this.branch = [];
      this.toast.typeError('No assigned branches found.');
    }

    // ✅ Delay API call slightly
    setTimeout(() => this.loadReceivedList(), 200);
  }

  loadReceivedList() {

    // ✅ Get logged-in user
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      this.toast.typeError('User not found');
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    console.log('User ID:', userId);

    this.url.getAllMedicineReceived(userId).subscribe({
      next: (res: any) => {

        console.log('Raw Received API:', res);

        // ✅ Handle both response formats
        const received = Array.isArray(res) ? res : res.data;

        if (!received) {
          console.warn('No received data');
          return;
        }

        // ✅ User allowed branches
        const allowedBranchIds = this.branch.map((b: any) => b.id);
        console.log('Allowed Branches:', allowedBranchIds);

        // ✅ Filter branch-wise
        this.receivedList = received.filter((item: any) => {

          const fromId = item.from_branch?.id || item.from_branch_id;
          const toId = item.to_branch?.id || item.to_branch_id;

          return (
            allowedBranchIds.includes(fromId) ||
            allowedBranchIds.includes(toId)
          );
        });

        console.log('Filtered Received:', this.receivedList);

        this.filteredReceivedList = [...this.receivedList];

        this.pageIndex = 0;
        this.updatePaginatedList();
      },

      error: (err) => {
        console.error('Received List Load Error:', err);
        this.toast.typeError('Failed to load received list');
      }
    });
  }

  updatePaginatedList(): void {

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedReceivedList =
      this.filteredReceivedList.slice(start, end);
  }

  onPageChange(event: any): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePaginatedList();
  }

  searchReceived(event: any): void {

    const searchValue = event.target.value.toLowerCase();

    this.filteredReceivedList = this.receivedList.filter(row =>
      row.from_branch?.branch_name?.toLowerCase().includes(searchValue) ||
      row.to_branch?.branch_name?.toLowerCase().includes(searchValue)
    );

    this.pageIndex = 0; // reset page
    this.updatePaginatedList();
  }

  viewReceivedItems(issueId: number) {

    this.selectedIssueId = issueId;
    this.receivedItems = []; // Clear old data

    this.url.getReceivedItemsByIssueId(issueId).subscribe({
      next: (res: any[]) => {

        this.receivedItems = res.map(item => ({
          ...item,
          issue_qty: Number(item.issue_qty),
          received_qty: Number(item.received_qty),
          status: Number(item.status)
        }));

      },
      error: (err) => {
        console.error(err);
        this.toast.typeError('Failed to load received items');
      }
    });
  }

  approveRow(row: any) {

    if (!row.received_qty || row.received_qty <= 0) {
      Swal.fire('Invalid Quantity', 'Please enter received quantity', 'warning');
      return;
    }

    if (row.received_qty > row.issue_qty) {
      Swal.fire('Invalid Quantity',
        'Received quantity cannot be greater than issued quantity',
        'error');
      return;
    }

    this.url.approveTransfer({
      id: row.id,
      received_qty: row.received_qty
    }).subscribe({
      next: (res: any) => {

        if (res.status) {

          Swal.fire('Saved!', res.message, 'success');

          // 🔥 Reload updated data immediately
          this.viewReceivedItems(this.selectedIssueId);

          // 🔥 DO NOT force status blindly
          // Instead use backend response

          row.status = res.data.status;

          // this.getItemsByIssuId();

        } else {
          Swal.fire('Error', res.message, 'error');
        }

      },
      error: () => {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    });
  }



  limitQty(item: any) {
    if (item.received_qty > item.issue_qty) {
      Swal.fire('Invalid Quantity', 'Received qty cannot exceed issued qty', 'error');
      item.received_qty = item.issue_qty;
    }
  }


  getRemainingQty(item: any): number {

    const issue = Number(item.issue_qty) || 0;
    const received = Number(item.received_qty) || 0;

    const remaining = issue - received;

    return remaining >= 0 ? remaining : 0;
  }


}
