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
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss'],
})
export class MediaGalleryComponent {

  // 🔥 Custom Branch Dropdown
  isBranchDropdownOpen: boolean = false;
  branchSearch: string = '';
  filteredBranches: any[] = [];
  selectedBranchName: string = '';
  branches: any[] = [];
  selectedBranchId: any = '';
  fromDate: string | null = null;
  toDate: string | null = null;
  saleReturnList: any[] = [];
  // 🔥 TABLE SEARCH + PAGINATION
  filteredSaleReturnList: any[] = [];
  paginatedSaleReturnList: any[] = [];
  pageIndex: number = 0;
  pageSize: number = 5;
  selectedSaleItems: any[] = [];
  returnIdToDelete: number | null = null;
  public editcreditnotes: Array<editcreditnotes> = [];
  bsConfig: Partial<BsDatepickerConfig> | undefined;
  dataSource!: MatTableDataSource<editcreditnotes>;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    this.fromDate = today.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
    this.loadBranches();
    this.loadSaleReturnHistory();
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

  getBranchName(branchId: any): string {
    const branch = this.branches.find(b => b.id == branchId);
    return branch ? branch.branch_name : 'N/A';
  }

 searchSalesReturn(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;

    if (!userId) {
      this.toast.typeError('User context not found. Please log in again.');
      return;
    }

    if (!this.selectedBranchId && !this.fromDate && !this.toDate) {
      this.toast.typeError('Please select Branch or Date range');
      return;
    }

    if ((this.fromDate && !this.toDate) || (!this.fromDate && this.toDate)) {
      this.toast.typeError('Please select both From Date and To Date');
      return;
    }

    const payload: any = {};

    if (this.selectedBranchId) {
      payload.branch_id = this.selectedBranchId;
    }

    if (this.fromDate && this.toDate) {
      payload.from_date = this.fromDate;
      payload.to_date = this.toDate;
    }

    this.url.searchSalesReturnHistory(userId, payload).subscribe({
      next: (res: any[]) => {
        const searchResults = res || [];

        // 🔥 FIX: Extract allowed branch names from your loaded branches
        const allowedBranchNames = this.branches.map((b: any) => b.branch_name);

        this.saleReturnList = searchResults.filter((item: any) => {
          return allowedBranchNames.includes(item.branch_name);
        });

        this.filteredSaleReturnList = [...this.saleReturnList];
        this.pageIndex = 0;
        this.updatePaginatedSaleReturn();

        if (!this.saleReturnList || this.saleReturnList.length === 0) {
          this.toast.typeWarning('No records found for your assigned branches');
        }
      },
      error: (err) => {
        console.error('Search error', err);
        this.toast.typeError('Failed to fetch sales return history');
      }
    });
  }

  //this is the get method for the loading the data in datatable 
  loadSaleReturnHistory(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;

    const storedBranches = localStorage.getItem('userBranches');
    const userBranches = storedBranches ? JSON.parse(storedBranches) : [];

    // 🔥 FIX: Map by branch_name instead of id
    const allowedBranchNames = userBranches.map((b: any) => b.branch_name);

    this.url.getSaleReturnHistory(userId).subscribe({
      next: (res: any[]) => {
        const allReturns = res || [];

        // 🔐 Filter using branch_name
        this.saleReturnList = allReturns.filter((item: any) => {
          // If the backend already secures the data, you might not even need this filter,
          // but if you do, check against the name!
          return allowedBranchNames.includes(item.branch_name);
        });

        this.filteredSaleReturnList = [...this.saleReturnList];
        this.pageIndex = 0;
        this.updatePaginatedSaleReturn();

        console.log('Sales Return History (secured):', this.saleReturnList);
      },
      error: (err: any) => {
        console.error('Error loading sale return history', err);
        this.toast.typeError('Failed to load sales return history');
      }
    });
  }

  openInfoModal(item: any) {
    this.selectedSaleItems = [];  // clear old data first
    const returnId = item.return_id;
    this.url.getSaleReturnItems(returnId).subscribe({
      next: (res: any) => {
        console.log('Return Full Response:', res);
        // ✅ Bind items array
        this.selectedSaleItems = res?.items || [];
      },
      error: (err) => {
        console.error('Error loading return items', err);
        this.toast.typeError('Failed to load return details');
      }
    });
  }

  // searchSalesReturnHistory(): void {
  //   const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  //   const userId = currentUser.id;
  //   const payload: any = {};
  //   // ✅ Branch only
  //   if (this.selectedBranchId) {
  //     payload.branch_id = this.selectedBranchId;
  //   }
  //   // ✅ Date only OR Branch + Date
  //   if (this.fromDate && this.toDate) {
  //     payload.from_date = this.fromDate;
  //     payload.to_date = this.toDate;
  //   }
  //   // ❌ Nothing selected
  //   if (!payload.branch_id && !payload.from_date) {
  //     this.toast.typeError('Please select Branch or Date range');
  //     return;
  //   }
  //   console.log('Search Payload:', payload);
  //   this.url.searchSalesReturnHistory(userId, payload)
  //     .subscribe({
  //       next: (res: any[]) => {
  //         this.saleReturnList = res || [];
  //         if (this.saleReturnList.length === 0) {
  //           this.toast.typeWarning('No records found');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Search error', err);
  //         this.toast.typeError('Failed to fetch sales return history');
  //       }
  //     });
  // }


  editReturn(id: number) {
    console.log('Edit return:', id);
    this.router.navigate(
      ['/application/target'],   // your Sales Return route
      { queryParams: { editId: id } }
    );
  }

  deleteReturn(id: number): void {
    this.returnIdToDelete = id;
    const modalElement = document.getElementById('delete_modal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmDelete(): void {
    if (!this.returnIdToDelete) return;
    this.url.deleteSalesReturn(this.returnIdToDelete).subscribe({
      next: (res: any) => {
        this.toast.typeSuccess('Sales return deleted successfully');
        // Close modal
        const modalElement = document.getElementById('delete_modal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
        // Refresh list
        this.loadSaleReturnHistory();
        this.returnIdToDelete = null;
      },
      error: (err: any) => {
        console.error('Delete Error:', err);
        this.toast.typeError('Failed to delete sales return');
      }
    });
  }

  //PAGINATION METHOD
  updatePaginatedSaleReturn(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedSaleReturnList =
      this.filteredSaleReturnList.slice(start, end);
  }

  onSaleReturnPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedSaleReturn();
  }

  //TABLE SEARCHING METHOD

  searchTable(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredSaleReturnList = this.saleReturnList.filter(row =>
      row.branch_name?.toLowerCase().includes(searchValue) ||
      row.bill_no?.toLowerCase().includes(searchValue) ||
      row.sub_total?.toString().includes(searchValue) ||
      row.grand_total?.toString().includes(searchValue)
    );
    this.pageIndex = 0;
    this.updatePaginatedSaleReturn();
  }

}
