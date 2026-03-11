import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataservicesService } from 'src/app/services/dataservices.service';
import { CommonModule } from '@angular/common';




@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.scss']
})
export class PrintBillComponent implements OnInit {

  @Input() sale: any;
  @Input() items: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private url: DataservicesService
  ) { }

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {

      const id = Number(idParam);  // ✅ convert string → number

      this.url.getItemsBySaleId(id).subscribe((res: any) => {
        this.sale = res;
        this.items = res.items || [];

        setTimeout(() => {
          window.print();
        }, 500);
      });

    }
  }
}