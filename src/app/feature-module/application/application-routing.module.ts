import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'addcompany',
        loadChildren: () =>
          import('./add-company/add-company.module').then((m) => m.AddCompanyModule),
      },
      {
        path: 'doctor-visit',
        loadChildren: () =>
          import('./doctor-visit/doctor-visit.module').then((m) => m.DoctorVisitModule),
      },
      {
        path: 'add-headquater',
        loadChildren: () =>
          import('./add-headquater/add-headquater.module').then((m) => m.AddHeadquaterModule),
      },
      {
        path: 'adduser',
        loadChildren: () =>
          import('./add-user/add-user.module').then((m) => m.AddUserModule),
      },

      {
        path: 'addproduct',
        loadChildren: () =>
          import('./add-product/add-product.module').then((m) => m.AddProductModule),
      },
      {
        path: 'add-city',
        loadChildren: () =>
          import('./add-city/add-city.module').then((m) => m.AddCityModule),
      },
      {
        path: 'AddStockist',
        loadChildren: () =>
          import('./add-stockist/add-stockist.module').then((m) => m.AddStockistModule),
      },

      {
        path: 'add-zone',
        loadChildren: () =>
          import('./add-zone/add-zone.module').then((m) => m.AddZoneModule),
      },
      {
        path: 'calender-holiday',
        loadChildren: () =>
          import('./calender-holiday/calender-holiday.module').then((m) => m.CalenderHolidayModule),
      },
      {
        path: 'leave-calender',
        loadChildren: () =>
          import('./leave-calender/leave-calender.module').then((m) => m.LeaveCalenderModule),
      },

      {
        path: 'presentation',
        loadChildren: () =>
          import('./presentation/presentation.module').then((m) => m.PresentationModule),
      },

      {
        path: 'add-medical',
        loadChildren: () =>
          import('./add-medical/add-medical.module').then((m) => m.AddMedicalModule),
      },
      {
        path: 'add-marketing',
        loadChildren: () =>
          import('./add-marketing/add-marketing.module').then((m) => m.AddMarketingModule),
      },
      {
        path: 'add-doctor',
        loadChildren: () =>
          import('./add-doctor/add-doctor.module').then((m) => m.AddDoctorModule),
      },
      {
        path: 'secondary-sales',
        loadChildren: () =>
          import('./secondary-sales/secondary-sales.module').then((m) => m.SecondarySalesModule),
      },
      {
        path: 'doctor-list',
        loadChildren: () =>
          import('./doctor-list/doctor-list.module').then((m) => m.DoctorListModule),
      },
      {
        path: 'target',
        loadChildren: () =>
          import('./target/target.module').then((m) => m.TargetModule),
      },
      {
        path: 'target-hq',
        loadChildren: () =>
          import('./target-hq/target-hq.module').then((m) => m.TargetHqModule),
      },
      {
        path: 'target-doctor',
        loadChildren: () =>
          import('./target-doctor/target-doctor.module').then((m) => m.TargetDoctorModule),
      },
      {
        path: 'target-product',
        loadChildren: () =>
          import('./target-product/target-product.module').then((m) => m.TargetProductModule),
      },
      {
        path: 'firms-visit',
        loadChildren: () =>
          import('./firms-visit/firms-visit.module').then((m) => m.FirmsVisitModule),
      },

      {
        path: 'add-manager',
        loadChildren: () =>
          import('./add-manager/add-manager.module').then((m) => m.AddManagerModule),
      },

      {
        path: 'user-role',
        loadChildren: () =>
          import('./user-role/user-role.module').then((m) => m.UserRoleModule),
      },

      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
      },
      {
        path: 'user-logs',
        loadChildren: () =>
          import('./user-logs/user-logs.module').then((m) => m.UserLogsModule),
      },

      {
        path: 'add-mr',
        loadChildren: () =>
          import('./add-mr/add-mr.module').then((m) => m.AddMrModule),
      },
      {
        path: 'allowance',
        loadChildren: () =>
          import('./allowance/allowance.module').then((m) => m.AllowanceModule),
      },
      {
        path: 'expense-head',
        loadChildren: () =>
          import('./expense-head/expense-head.module').then((m) => m.ExpenseHeadModule),
      },
      {
        path: 'media-gallery',
        loadChildren: () =>
          import('./media-gallery/media-gallery.module').then((m) => m.MediaGalleryModule),
      },
      {
        path: 'employee-list',
        loadChildren: () =>
          import('./employee-list/employee-list.module').then((m) => m.EmployeeListModule),
      },

      {
        path: 'year',
        loadChildren: () =>
          import('./year/year.module').then((m) => m.YearModule),
      },
      {
        path: 'tds',
        loadChildren: () =>
          import('./tds/tds.module').then((m) => m.TdsModule),
      },
      {
        path: 'default-otp',
        loadChildren: () =>
          import('./default-otp/default-otp.module').then((m) => m.DefaultOTPModule),
      },
      
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
