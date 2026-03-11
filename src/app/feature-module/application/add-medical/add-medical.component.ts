
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService, routes } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, productlist } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-add-medical',
  templateUrl: './add-medical.component.html',
  styleUrls: ['./add-medical.component.scss'],
})
export class AddMedicalComponent {
  public selectedValue!: string | number;
  public productlist: Array<productlist> = [];
  editMode = false;
  isLoading = false;
  selectedMedicineId: number | null = null;
  deleteId: number | null = null;

  edit_id: number | null = null;
  edit_name: string = '';
  edit_medicine_type_id: number | null = null;


  bsConfig: Partial<BsDatepickerConfig> | undefined;



  medicine: any[] = [];
  addmedicine: any[] = [];
  type: string = '';
  medicine_name: string = '';
  medicine_type_id: number | null = null;
  name = '';
  medicineTypes: any[] = [];
  medicines: any[] = [];
  searchText: string = '';

  filteredMedicines: any[] = [];
  paginatedMedicines: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 5;


  dataSource!: MatTableDataSource<productlist>;


  constructor(private data: DataService, private toast: ToasterService, public url: DataservicesService, private pagination: PaginationService, private router: Router) { }


  ngOnInit(): void {
    // this.getTableData();

    this.getMedicineTypes();
    this.getMedicine();
  }

  getMedicine() {
    this.url.getMedicine().subscribe((res: any[]) => {
      this.medicines = res;

      this.filteredMedicines = [...this.medicines];
      this.pageIndex = 0;

      this.updatePaginatedData();
    });
  }

  getMedicineTypes() {
    this.url.getMedicineTypes().subscribe({
      next: (res: any[]) => {
        this.medicineTypes = res;
        console.log('Medicine Types:', this.medicineTypes);
      },
      error: (err) => {
        console.error('Error loading medicine types', err);
      }
    });
  }


  addMedicine() {
    if (!this.medicine_type_id || !this.name.trim()) {
      this.toast.typeError('All fields are required', 'Error');
      return;
    }

    this.isLoading = true;

    const payload = {
      medicine_type_id: this.medicine_type_id,
      name: this.name.trim()
    };

    this.url.addMedicine(payload).subscribe({
      next: (res: any) => {
        this.toast.typeSuccess(res.message || 'Medicine Added Successfully!', 'Success');

        this.medicine_type_id = null;
        this.name = '';
        this.getMedicine();

        this.isLoading = false;
      },
      error: () => {
        this.toast.typeError('Something went wrong', 'Error');
        this.isLoading = false;
      }
    });
  }

  openEditModal(medicine: any) {

    this.edit_id = medicine.id;
    this.edit_name = medicine.name;
    this.edit_medicine_type_id = medicine.medicine_type_id;

    const modalEl = document.getElementById('edit_modal');

    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  updateMedicine() {

    if (!this.edit_id) {
      this.toast.typeError('Invalid medicine ID', 'Error');
      return;
    }

    if (!this.edit_name?.trim() || !this.edit_medicine_type_id) {
      this.toast.typeError('All fields are required', 'Error');
      return;
    }

    this.isLoading = true;

    const payload = {
      name: this.edit_name.trim(),
      medicine_type_id: this.edit_medicine_type_id
    };

    this.url.updateMedicine(this.edit_id, payload)
      .subscribe({
        next: (res: any) => {

          if (res.status) {

            this.toast.typeSuccess(res.message || 'Medicine updated successfully', 'Success');

            // ✅ refresh table
            this.getMedicine();

            // ✅ close modal
            const modal = (window as any).bootstrap.Modal
              .getInstance(document.getElementById('edit_modal'));

            modal?.hide();

            // ✅ reset edit fields
            this.edit_id = null;
            this.edit_name = '';
            this.edit_medicine_type_id = null;
          }

          this.isLoading = false;
        },
        error: () => {
          this.toast.typeError('Update failed', 'Error');
          this.isLoading = false;
        }
      });
  }

  openDeleteModal(id: number) {
    this.deleteId = id;
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.url.deleteMedicine(this.deleteId).subscribe(() => {
      this.getMedicine();
      this.deleteId = null;

      const modalEl = document.getElementById('delete_modal');
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl!);
      modal?.hide();
    });
  }

  applyFilter() {

    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredMedicines = [...this.medicines];
    } else {
      this.filteredMedicines = this.medicines.filter(m =>
        m.name.toLowerCase().includes(search) ||
        m.type?.name?.toLowerCase().includes(search)
      );
    }

    this.pageIndex = 0; // reset to first page
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedMedicines = this.filteredMedicines.slice(start, end);
  }

  onPageChange(event: any): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePaginatedData();
  }

}
