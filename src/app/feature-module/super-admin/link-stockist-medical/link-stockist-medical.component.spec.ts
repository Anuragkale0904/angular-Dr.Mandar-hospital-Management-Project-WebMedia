import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkStockistMedicalComponent } from './link-stockist-medical.component';




describe('LinkStockistMedicalComponentComponent', () => {
  let component: LinkStockistMedicalComponent;
  let fixture: ComponentFixture<LinkStockistMedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkStockistMedicalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkStockistMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
