/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, ToasterService } from 'src/app/core/core.index';
import { apiResultFormat, pageSelection, productlist } from 'src/app/core/models/models';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Sort } from '@angular/material/sort';
import { OnInit } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexResponsive,
} from 'ng-apexcharts';
import { routes, SideBarService } from 'src/app/core/core.index';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  grid: ApexGrid | any;
  stroke: ApexStroke | any;
  title: ApexTitleSubtitle | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  legend: ApexLegend | any;
  tooltip: ApexTooltip | any;
  responsive: ApexResponsive[] | any;
  fill: ApexFill | any;
  labels: string[] | any;
  marker: string[] | any;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public layoutPosition = '1';
  public totalMedicines: number = 0;
  public totalInwardEntries: number = 0;
  public routes = routes;



  constructor(private sideBar: SideBarService, private dataService: DataService, public url: DataservicesService) {
    this.chartOptions = {

      series: [],   // ✅ ADD THIS

      chart: {
        type: 'bar',
        height: 350,
        width: '100%',
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        toolbar: { show: false }
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 5,
          endingShape: 'rounded',
        },
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: true,
        markers: {
          fillColors: ['#7638ff', '#fda600'],
        },
      },

      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },

      xaxis: {           // ✅ ADD THIS
        categories: [],
      },

      yaxis: {
        title: {
          text: 'Sales / Returns Count',   // better label
        },
      },

      fill: {
        opacity: 1,
        colors: ['#7638ff', '#fda600'],
      },

      tooltip: {
        y: {
          formatter: function (val: number) {   // change type
            return val + ' Records';
          },
        },
      },
    };
    this.chartOptions2 = {
      colors: ['#7638ff', '#ff737b', 'rgb(118, 56, 255)', '#1ec1b0'],
      series: [55, 40, 20, 10],
      chart: {
        type: 'donut',
        fontFamily: 'Poppins, sans-serif',
        height: 320,
        width: '100%',
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
      },

      labels: ['Paid', 'Unpaid', 'Overdue', 'Draft'],
      legend: { show: false },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
              height: 200,
            },
            legend: { position: 'bottom' },
          },
        },
      ],
    };



    // <* to check layout position *>
    this.sideBar.layoutPosition.subscribe((res) => {
      this.layoutPosition = res;

      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    });

    // <* to check layout position *>
  }

  ngOnInit(): void {
    this.loadMonthlySalesReturns();
    this.loadMedicineCount();
    this.loadMedicineInwardCount();
  }

  loadMonthlySalesReturns() {
    this.url.getMonthlySalesReturns().subscribe({
      next: (res: any) => {
        if (res.status && res.data) {

          const months = res.data.map((item: any) => item.month);
          const sales = res.data.map((item: any) => item.sales_count);
          const returns = res.data.map((item: any) => item.returns_count);

          this.chartOptions = {
            ...this.chartOptions,
            series: [
              { name: 'Sales', data: sales },
              { name: 'Returns', data: returns }
            ],
            xaxis: {
              categories: months
            }
          };
        }
      },
      error: (err) => {
        console.error('Monthly Sales API Error:', err);
      },
    });
  }

  //METHOD FOR LOADING MEDICINE COUNT
  loadMedicineCount() {
    this.url.getMedicineCount().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.totalMedicines = res.total_medicines;
        }
      },
      error: (err) => {
        console.error('Medicine Count API Error:', err);
      },
    });
  }

  // METHOD FOR LOADING MEDICINE INWARD COUNT
  loadMedicineInwardCount() {
    this.url.getMedicineInwardCount().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.totalInwardEntries = res.total_inward_entries;
        }
      },
      error: (err) => {
        console.error('Medicine Inward Count API Error:', err);
      },
    });
  }

}
