import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitalCallRecordComponent } from './hospital-call-record.component';



describe('HospitalCallRecordComponent', () => {
  let component: HospitalCallRecordComponent;
  let fixture: ComponentFixture<HospitalCallRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalCallRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalCallRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
