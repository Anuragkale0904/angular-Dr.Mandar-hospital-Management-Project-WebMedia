import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromotorSalesComponent } from './promotor-sales.component';


describe('DomainRequestComponent', () => {
  let component: PromotorSalesComponent;
  let fixture: ComponentFixture<PromotorSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotorSalesComponent]
    });
    fixture = TestBed.createComponent(PromotorSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
