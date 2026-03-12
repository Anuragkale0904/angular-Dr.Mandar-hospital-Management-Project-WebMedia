import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataservicesService {

  serverUrl = 'https://webmediaindia.in/dr_mandar/Dr_mandar_Api/public/api/';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  //DASHBOARD
  // Monthly Sales vs Returns
  getMonthlySalesReturns() {
    return this.http.get(
      this.serverUrl + 'dashboard/monthly-sales-returns'
    );
  }

  //MEDICINES COUNT
  getMedicineCount() {
    return this.http.get(
      this.serverUrl + 'medicine/count'
    );
  }

  //MEDICINE INWARDS COUNT
  getMedicineInwardCount() {
    return this.http.get(
      this.serverUrl + 'medicine-inward/count'
    );
  }


  //Add Branch/Hospital Page
  getBranch(): Observable<any[]> {
    return this.http.get<any[]>(this.serverUrl + 'branch/get');
  }

  addBranch(branch: any): Observable<any> {
    return this.http.post(this.serverUrl + 'branch/store', branch);
  }

  deleteBranch(id: number) {
    return this.http.delete(
      `${this.serverUrl.replace(/\/$/, '')}/branch/delete/${id}`
    );
  }

  getBranchById(id: number) {
    return this.http.get(this.serverUrl + `branch/getById/${id}`);
  }

  updateBranch(id: number, payload: any) {
    return this.http.put(`${this.serverUrl}branch/update/${id}`, payload);
  }

  //Add Medicine Type Page
  getMedicineTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.serverUrl + 'medicine-types/get');
  }

  addMedicineType(medicineType: any): Observable<any> {
    return this.http.post(this.serverUrl + 'medicine-types/store', medicineType);
  }

  updateMedicineType(id: number, payload: any) {
    return this.http.put<any>(
      `${this.serverUrl}medicine-types/update/${id}`,
      payload
    );
  }

  deleteMedicineType(id: number) {
    return this.http.delete(
      `${this.serverUrl.replace(/\/$/, '')}/medicine-types/delete/${id}`
    )
  }


  //Add Medicine Page 
  getMedicine(): Observable<any> {
    return this.http.get<any[]>(this.serverUrl + 'medicines/get');
  }

  addMedicine(medicine: any): Observable<any> {
    return this.http.post(this.serverUrl + 'medicines/store', medicine);
  }

  updateMedicine(id: number, payload: any) {
    return this.http.put<any>(
      `${this.serverUrl}medicines/update/${id}`,
      payload
    );
  }

  deleteMedicine(id: number) {
    return this.http.delete(
      `${this.serverUrl.replace(/\/$/, '')}/medicines/delete/${id}`
    )
  }

  //Medicine Inward Page 
  getMedicineInward(userId: number) {
    return this.http.get<any[]>(
      `${this.serverUrl}medicine-inward/getAll/${userId}`
    );
  }

  addMedicineInward(inward: any): Observable<any> {
    return this.http.post(this.serverUrl + 'medicine-inwards/store', inward)
  }

  getMedicineInwardById(id: number) {
    return this.http.get(`${this.serverUrl}medicine-inwards/getById/${id}`);
  }

  updateMedicineInward(id: number, payload: any) {
    return this.http.put(
      `${this.serverUrl}medicine-inwards/update/${id}`,
      payload
    );
  }

  deleteMedicineInward(id: number) {
    return this.http.delete(
      `${this.serverUrl.replace(/\/$/, '')}/medicine-inwards/${id}`
    );
  }

  //Issue Medicine Page

  getMedicineTypesByBranch(branchId: number) {
    return this.http.post<any[]>(
      this.serverUrl + 'medicine-issue/medicine-types-by-branch',
      { branch_id: branchId }
    );
  }

  getMedicineByBranchAndType(branchId: number, typeId: number) {
    return this.http.post<any[]>(
      this.serverUrl + 'medicine-issue/medicine-by-branch-and-type',
      {
        branch_id: branchId,
        medicine_type_id: typeId
      }
    );
  }


  getAvailableStock(branchId: number, medicineId: number) {
    return this.http.post<any>(
      this.serverUrl + 'medicine-issue/available-stock',
      {
        branch_id: branchId,
        medicine_id: medicineId
      }
    );
  }

  issueMedicine(payload: any) {
    return this.http.post<any>(
      `${this.serverUrl}medicine-issue/store`,
      payload
    );
  }

  getAllMedicineIssues(userId: number) {
    return this.http.get<any[]>(
      `${this.serverUrl}medicine-issues/getAll/${userId}`
    );
  }

  // Get items by Issue ID
  getIssueItemsById(issueId: number) {
    return this.http.get<any[]>(
      `${this.serverUrl}medicine-issues/getItemsByIssuId/${issueId}`
    );
  }

  deleteMedicineIssue(id: number) {
    return this.http.delete(
      `${this.serverUrl}medicine-issue/delete/${id}`
    );
  }

  updateMedicineIssue(id: number, payload: any) {
    return this.http.put(
      `${this.serverUrl}medicine-issues/update/${id}`,
      payload
    );
  }
  //Received Medicine Page

  // Get All Medicine Received
  getAllMedicineReceived(userId: number) {
    return this.http.get<any>(
      `${this.serverUrl}medicine-received/getAll/${userId}`
    );
  }
  // Get Items By Issue ID
  getReceivedItemsByIssueId(issueId: number) {
    return this.http.get<any[]>(
      `${this.serverUrl}medicine-received/getItemsByIssuId/${issueId}`
    );
  }

  approveTransfer(data: any) {
    return this.http.post<any>(
      this.serverUrl + 'medicine-received/update-received-items',
      data
    );
  }


  //stock transfer Page

  getMedicineTypesByBranchTransfer(payload: any): Observable<any> {
    console.log('Calling API 👉', this.serverUrl + 'medicine-stack-tranfer/getMedicineTypes');
    console.log('Payload 👉', payload);

    return this.http.post(
      this.serverUrl + 'medicine-stack-tranfer/getMedicineTypes',
      payload
    );
  }

  getMedicinesByBranchAndType(payload: any): Observable<any> {
    return this.http.post(
      this.serverUrl + 'medicine-stack-tranfer/getMedicines',
      payload
    );
  }

  getAvailableStockTransfer(payload: any) {
    return this.http.post<any>(
      this.serverUrl + 'medicine-stack-tranfer/get-available-stock',
      payload
    );
  }

  getMedicineType(): Observable<any> {
    return this.http.get<any[]>(this.serverUrl + 'medicine-stack-tranfer/getMedicineTypes');
  }

  getMedicinesByTypeId(typeId: number) {
    return this.http.get<any[]>(
      `${this.serverUrl}/medicine-stack-tranfer/medicines-by-typeId/${typeId}`
    );
  }

  getAllBranch(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}branch/get`);
  }

  addStockTransfer(stock: any): Observable<any> {
    return this.http.post(this.serverUrl + 'medicine-stack-tranfer/store', stock)
  }

  getStockTransfers(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.serverUrl}medicine-stack-tranfer/get/${userId}`
    );
  }

  getStockMedicineTransfers(transferId: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.serverUrl + 'medicine-stack-tranfer/getStackTransferItemsById/' + transferId
    );
  }

  updateStockTransfer(id: number, payload: any) {
    return this.http.put(
      this.serverUrl + 'medicine-stack-tranfer/update/' + id,
      payload
    );
  }

  deleteStockMedicineTransfers(id: number) {
    return this.http.delete(
      `${this.serverUrl.replace(/\/$/, '')}/medicine-stack-tranfer/delete/${id}`
    );
  }

  //Medicine Sale page 
  getAllBranches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}medicine-sale/getAllBranch`);
  }

  getBranchMedicines(payload: any) {
    return this.http.post<any[]>(
      this.serverUrl + 'medicine-sale/get-branch-medicines',
      payload
    );
  }

  getMedicineDetails(payload: any) {
    return this.http.post<any>(
      this.serverUrl + 'medicine-sale/get-medicine-details',
      payload
    );
  }

  addMedicineSale(sale: any): Observable<any> {
    return this.http.post(this.serverUrl + 'medicine-sale/store', sale)
  }

  getNextBillNumber() {
    return this.http.get<any>(this.serverUrl + 'medicine-sales/next-bill-no');
  }


  //Sale history
  getSaleHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.serverUrl}medicine-sale-history/get/${userId}`
    );
  }

  getItemsBySaleId(saleId: number) {
    return this.http.get<any>(
      `${this.serverUrl}medicine-sale-history/getItemsBySaleId/${saleId}`
    );
  }

  searchHospitalBranchWise(payload: any): Observable<any[]> {

    let params: any = {};

    if (payload.branch_id) {
      params.branch_id = payload.branch_id;
    }

    if (payload.from_date && payload.to_date) {
      params.from_date = payload.from_date;
      params.to_date = payload.to_date;
    }

    return this.http.get<any[]>(
      `${this.serverUrl}medicine-sale-history/get`,
      { params }
    );
  }

  deleteSale(id: number) {
    return this.http.delete(
      this.serverUrl + 'medicine-sale/delete/' + id
    );
  }
  //Sales return page
  searchSalesReturn(payload: any) {
    return this.http.post<any>(
      this.serverUrl + 'sales-return-search',   // 👈 use your correct endpoint
      payload
    );
  }

  getSaleByBill(payload: any) {
    return this.http.post<any>(
      `${this.serverUrl}sales-return-search`,
      payload
    );
  }

  salesReturn(payload: any) {
    return this.http.post<any>(
      `${this.serverUrl}sales-return`,
      payload
    );
  }

  //sales return history page
  getSaleReturnHistory(userId: number) {
    return this.http.get<any[]>(
      `${this.serverUrl}medicine-sales-return-history/get/${userId}`
    );
  }
  
  getSaleReturnItems(returnId: number) {
    return this.http.get<any>(
      `${this.serverUrl}medicine-sales-return-history/getItems/${returnId}`
    );
  }


  searchSalesReturnHistory(userId: number, payload: any) {
    return this.http.post<any[]>(
      `${this.serverUrl}medicine-sales-return-history/search/${userId}`,
      payload // 🔥 CRUCIAL: You must pass the payload here so the backend gets the dates/branch!
    );
  }

  //edit api
  getSaleReturnById(id: number) {
    return this.http.get(
      this.serverUrl + 'medicine-sales-return-history/getById/' + id
    );
  }
  //delete
  deleteSalesReturn(id: number) {
    return this.http.delete(
      this.serverUrl + 'medicine-sales-return-history/delete/' + id
    );
  }

  //Total collection page


  // Total Collection - Get All
  getTotalCollection(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.serverUrl}medicine-sales/total-collection/getAll/${userId}`
    );
  }


  searchTotalCollection(userId: number, payload: any) {
    return this.http.post<any>(
      `${this.serverUrl}medicine-sales/total-collection/search/${userId}`,
      payload
    );
  }


  //Reports

  //Hospital/BranchWise Report

  getBranchWiseReport(payload: any) {
    return this.http.get<any>(this.serverUrl + 'branch-wise-report/get', payload);
  }

  searchHospitalBranchWiseReport(payload: any, userId: number) {
    return this.http.post(
      `${this.serverUrl}reports/hospital-branch-wise/${userId}`,
      payload
    );
  }


  //Inventory Report

  searchInventoryReport(payload: any, userId: number) {
    return this.http.post(
      `${this.serverUrl}inventory-report/search/${userId}`,
      payload
    );
  }

  //Available Stock Report 

  searchAvailableStock(userId: number, payload: any) {
    return this.http.post<any>(
      `${this.serverUrl}available-stock-report/search/${userId}`,
      payload
    );
  }

  // ===============================
  // User Management Page
  // ===============================

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(
      this.serverUrl + 'user-management/get'
    );
  }

  addUser(user: any): Observable<any> {
    return this.http.post(
      this.serverUrl + 'user-management/store',
      user
    );
  }

  getUserById(id: number) {
    return this.http.get<any>(
      this.serverUrl + `user-management/getById/${id}`
    );
  }

  updateUser(id: number, payload: any) {
    return this.http.put(this.serverUrl + `user-management/update/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete(this.serverUrl + `user-management/delete/${id}`);
  }


  //login Page

  login(data: any) {
    return this.http.post(this.serverUrl + 'auth/login', data);
  }

}

