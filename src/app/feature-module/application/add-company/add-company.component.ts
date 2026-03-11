import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ✅ added
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, productlist, editcreditnotes } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent {

  public selectedValue!: string | number;
  public editcreditnotes: Array<editcreditnotes> = [];

  editName: string = '';
  selectedEditType: any = null;

  medicineTypes: any[] = [];
  name: string = '';
  medicineType: string = '';
  selectedType: any = null;
  searchText: string = '';

  filteredTypes: any[] = [];
  paginatedTypes: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 5;

  dataSource!: MatTableDataSource<editcreditnotes>;

  // bsConfig: Partial<BsDatepickerConfig> | undefined;
  editMode: any;

  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }

  ngOnInit(): void {
    //this.getTableData();
    this.getMedicineTypes();
  }

  getMedicineTypes() {
    this.url.getMedicineTypes().subscribe((res: any[]) => {

      this.medicineTypes = res;

      this.filteredTypes = [...this.medicineTypes];
      this.pageIndex = 0;

      this.updatePaginatedData();
    });
  }

  addMedicineType() {
    // Basic validation
    if (
      !this.name.trim()) {
      this.toast.typeError('All fields are required', 'Error');
      return;
    }

    const payload = {
      name: this.name
    };

    this.url.addMedicineType(payload).subscribe({
      next: (res: any) => {
        this.toast.typeSuccess('Type Added Successfully!', 'Success');

        // Clear form
        this.name = '';
        // Reload table
        this.getMedicineTypes();
      },
      error: () => {
        this.toast.typeError('Something went wrong', 'Error');
      }
    });
  }

  openEditModal(item: any) {
    this.selectedEditType = { ...item };
    this.editName = item.name;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('edit_modal')
    );
    modal.show();
  }

  updateMedicineType() {

    if (!this.editName.trim()) {
      this.toast.typeError('Medicine Type is required', 'Error');
      return;
    }

    const payload = {
      name: this.editName
    };

    this.url.updateMedicineType(this.selectedEditType.id, payload)
      .subscribe({
        next: (res: any) => {

          if (res.status) {
            this.toast.typeSuccess(res.message, 'Success');
            this.getMedicineTypes();

            (window as any).bootstrap.Modal
              .getInstance(document.getElementById('edit_modal'))
              ?.hide();
          } else {
            this.toast.typeError('Update failed!', 'Error');
          }

        },
        error: () => {
          this.toast.typeError('Server Error!', 'Error');
        }
      });
  }

  openDeleteModal(medicineTypes?: any) {

    this.selectedType = { ...medicineTypes };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('delete_modal'));
    modal.show();
  }

  confirmDelete() {

    if (!this.selectedType?.id) return;

    this.url.deleteMedicineType(this.selectedType.id).subscribe({
      next: () => {
        this.toast.typeSuccess('Medicine Type deleted successfully!', 'Deleted');
        this.getMedicineTypes();
        (window as any).bootstrap.Modal
          .getInstance(document.getElementById('delete_modal'))
          ?.hide();
      },
      error: (err) => {
        console.error(err);
        this.toast.typeError('Delete failed!', 'Error');
      }
    });
  }

  //SEARCHING METHODS
  applySearch() {

    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredTypes = [...this.medicineTypes];
    } else {
      this.filteredTypes = this.medicineTypes.filter(type =>
        type.name.toLowerCase().includes(search)
      );
    }

    this.pageIndex = 0; // reset to first page
    this.updatePaginatedData();
  }

  //PAGINATION METHODS
  updatePaginatedData(): void {

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTypes = this.filteredTypes.slice(start, end);
  }

  onPageChange(event: any): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePaginatedData();
  }
}

